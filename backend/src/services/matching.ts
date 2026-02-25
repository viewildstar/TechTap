import pool from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import * as stripeService from './stripe';

interface MatchCandidate {
  listingId?: string;
  requestId?: string;
  hostId: string;
  guestId: string;
  hostReliability: number;
  guestReliability: number;
  price: number;
  score: number;
}

/**
 * Matching algorithm v1
 * Matches guests to hosts based on dining hall, time, price, and reliability
 */
export async function findMatches(): Promise<void> {
  try {
    // Get all active listings
    const listingsResult = await pool.query(
      `SELECT l.*, u.reliability_score as host_reliability
       FROM listings l
       JOIN users u ON l.host_id = u.id
       WHERE l.status = 'active' AND l.expires_at > NOW()`
    );

    // Get all active requests
    const requestsResult = await pool.query(
      `SELECT r.*, u.reliability_score as guest_reliability
       FROM requests r
       JOIN users u ON r.guest_id = u.id
       WHERE r.status = 'active' AND r.expires_at > NOW()`
    );

    const listings = listingsResult.rows;
    const requests = requestsResult.rows;

    // Try to match each request with listings
    for (const request of requests) {
      const candidates: MatchCandidate[] = [];

      for (const listing of listings) {
        // Check compatibility
        if (isCompatible(listing, request)) {
          const score = calculateMatchScore(listing, request);
          candidates.push({
            listingId: listing.id,
            requestId: request.id,
            hostId: listing.host_id,
            guestId: request.guest_id,
            hostReliability: listing.host_reliability,
            guestReliability: request.guest_reliability,
            price: listing.price,
            score,
          });
        }
      }

      // Sort by score (highest first)
      candidates.sort((a, b) => b.score - a.score);

      // Match with highest scoring candidate
      if (candidates.length > 0) {
        const bestMatch = candidates[0];
        await createMatch(bestMatch);
      }
    }
  } catch (error) {
    console.error('Error in matching algorithm:', error);
    throw error;
  }
}

/**
 * Check if listing and request are compatible
 */
function isCompatible(listing: any, request: any): boolean {
  // Dining hall must match
  if (listing.dining_hall !== request.dining_hall) {
    return false;
  }

  // Price compatibility: host price <= guest max price
  if (parseFloat(listing.price) > parseFloat(request.max_price)) {
    return false;
  }

  // Time compatibility
  if (!isTimeCompatible(listing, request)) {
    return false;
  }

  // Check if already matched
  if (listing.status !== 'active' || request.status !== 'active') {
    return false;
  }

  return true;
}

/**
 * Check time compatibility
 */
function isTimeCompatible(listing: any, request: any): boolean {
  const now = new Date();

  // Both "now" - always compatible
  if (listing.time_window_type === 'now' && request.time_window_type === 'now') {
    return true;
  }

  // Listing is "now", request is scheduled
  if (listing.time_window_type === 'now' && request.time_window_type === 'scheduled') {
    const requestTime = new Date(request.scheduled_time);
    const diffMinutes = (requestTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= 0 && diffMinutes <= 15; // Within 15 minutes
  }

  // Listing is scheduled, request is "now"
  if (listing.time_window_type === 'scheduled' && request.time_window_type === 'now') {
    const listingTime = new Date(listing.scheduled_time);
    const diffMinutes = (listingTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= 0 && diffMinutes <= 15;
  }

  // Both scheduled
  if (listing.time_window_type === 'scheduled' && request.time_window_type === 'scheduled') {
    const listingTime = new Date(listing.scheduled_time);
    const requestTime = new Date(request.scheduled_time);
    const diffMinutes = Math.abs((listingTime.getTime() - requestTime.getTime()) / (1000 * 60));
    return diffMinutes <= 15; // Within 15 minutes of each other
  }

  return false;
}

/**
 * Calculate match score
 * Score = (Host Reliability × 0.4) + (Guest Reliability × 0.3) + (Price Score × 0.3)
 */
function calculateMatchScore(listing: any, request: any): number {
  const hostReliability = listing.host_reliability || 100;
  const guestReliability = request.guest_reliability || 100;
  const hostPrice = parseFloat(listing.price);
  const guestMaxPrice = parseFloat(request.max_price);

  // Price score: 100 if exact match, decreases with difference
  const priceDifference = Math.abs(hostPrice - guestMaxPrice);
  let priceScore = 100 - priceDifference * 10;
  if (priceScore < 50) priceScore = 50; // Minimum 50

  const score = hostReliability * 0.4 + guestReliability * 0.3 + priceScore * 0.3;
  return Math.round(score * 100) / 100;
}

/**
 * Create a match
 */
async function createMatch(candidate: MatchCandidate): Promise<void> {
  const matchId = uuidv4();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get listing and request details
    const listingResult = candidate.listingId
      ? await client.query('SELECT * FROM listings WHERE id = $1', [candidate.listingId])
      : { rows: [] };
    const requestResult = candidate.requestId
      ? await client.query('SELECT * FROM requests WHERE id = $1', [candidate.requestId])
      : { rows: [] };

    const listing = listingResult.rows[0];
    const request = requestResult.rows[0];

    // Determine meeting time
    let meetingTime: Date;
    if (listing && listing.time_window_type === 'scheduled') {
      meetingTime = new Date(listing.scheduled_time);
    } else if (request && request.time_window_type === 'scheduled') {
      meetingTime = new Date(request.scheduled_time);
    } else {
      meetingTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    }

    // Get user details for Stripe
    const guestResult = await client.query(
      'SELECT email, payment_method_id FROM users WHERE id = $1',
      [candidate.guestId]
    );
    const hostResult = await client.query(
      'SELECT email, host_stripe_account_id FROM users WHERE id = $1',
      [candidate.hostId]
    );

    const guest = guestResult.rows[0];
    const host = hostResult.rows[0];

    // Create Stripe customer for guest if needed
    let guestCustomerId: string;
    try {
      guestCustomerId = await stripeService.getOrCreateCustomer(
        candidate.guestId,
        guest.email,
        guest.payment_method_id || undefined
      );
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }

    // Create Payment Intent (held in escrow)
    let paymentIntentId: string;
    try {
      const paymentIntent = await stripeService.createPaymentIntent(
        matchId,
        candidate.guestId,
        candidate.hostId,
        candidate.price,
        guestCustomerId,
        host.host_stripe_account_id || undefined
      );
      paymentIntentId = paymentIntent.id;
    } catch (error) {
      console.error('Error creating Payment Intent:', error);
      throw error;
    }

    // Create match
    await client.query(
      `INSERT INTO matches (
        id, listing_id, request_id, host_id, guest_id, dining_hall, 
        meeting_time, price, status, payment_intent_id, payment_status, payment_amount,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
      [
        matchId,
        candidate.listingId || null,
        candidate.requestId || null,
        candidate.hostId,
        candidate.guestId,
        listing?.dining_hall || request?.dining_hall,
        meetingTime,
        candidate.price,
        'pending',
        paymentIntentId,
        'held',
        Math.round(candidate.price * 100), // Convert to cents
      ]
    );

    // Create payment record
    await client.query(
      `INSERT INTO payments (
        id, match_id, host_id, guest_id, amount, host_amount, 
        payment_intent_id, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        uuidv4(),
        matchId,
        candidate.hostId,
        candidate.guestId,
        Math.round(candidate.price * 100),
        Math.round(candidate.price * 100), // Full amount to host (no platform fee in MVP)
        paymentIntentId,
        'held',
      ]
    );

    // Update listing status
    if (candidate.listingId) {
      await client.query(
        'UPDATE listings SET status = $1, matched_guest_id = $2, updated_at = NOW() WHERE id = $3',
        ['matched', candidate.guestId, candidate.listingId]
      );
    }

    // Update request status
    if (candidate.requestId) {
      await client.query(
        'UPDATE requests SET status = $1, matched_host_id = $2, updated_at = NOW() WHERE id = $3',
        ['matched', candidate.hostId, candidate.requestId]
      );
    }

    await client.query('COMMIT');

    // TODO: Send push notifications to both parties

    console.log(`✅ Match created: ${matchId} (Host: ${candidate.hostId}, Guest: ${candidate.guestId})`);
    console.log(`💰 Payment Intent created: ${paymentIntentId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating match:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run matching algorithm periodically
 */
export function startMatchingService(intervalMs: number = 10000): void {
  console.log('🔄 Starting matching service...');
  
  // Run immediately
  findMatches().catch(console.error);

  // Then run every interval
  setInterval(() => {
    findMatches().catch(console.error);
  }, intervalMs);
}


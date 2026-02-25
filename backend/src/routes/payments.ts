import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';
import * as stripeService from '../services/stripe';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/payments/setup
 * Set up payment method (Stripe)
 */
router.post('/setup', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.userId!;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'paymentMethodId is required' });
    }

    // Get user email
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const email = userResult.rows[0].email;

    // Create or get Stripe customer
    const customerId = await stripeService.getOrCreateCustomer(
      userId,
      email,
      paymentMethodId
    );

    // Store payment method ID in database
    await pool.query(
      'UPDATE users SET payment_method_id = $1, updated_at = NOW() WHERE id = $2',
      [paymentMethodId, userId]
    );

    res.json({
      setup: true,
      customerId,
    });
  } catch (error) {
    console.error('Error setting up payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/payments/connect/setup
 * Set up Stripe Connect account for host
 */
router.post('/connect/setup', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get user email
    const userResult = await pool.query(
      'SELECT email, host_stripe_account_id FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // If account already exists, return account link
    if (user.host_stripe_account_id) {
      const accountLink = await stripeService.createAccountLink(
        user.host_stripe_account_id,
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/connect/return`,
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/connect/refresh`
      );

      return res.json({
        accountId: user.host_stripe_account_id,
        accountLinkUrl: accountLink.url,
      });
    }

    // Create new Connect account
    const account = await stripeService.createConnectAccount(userId, user.email);

    // Create account link for onboarding
    const accountLink = await stripeService.createAccountLink(
      account.id,
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/connect/return`,
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/connect/refresh`
    );

    res.json({
      accountId: account.id,
      accountLinkUrl: accountLink.url,
    });
  } catch (error) {
    console.error('Error setting up Connect account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/payments/release
 * Release payment to host (called when match is completed)
 */
router.post('/release', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.body;
    const userId = req.userId!;

    if (!matchId) {
      return res.status(400).json({ error: 'matchId is required' });
    }

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (host_id = $2 OR guest_id = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    // Only release if both parties confirmed
    if (!match.host_confirmed_at || !match.guest_confirmed_at) {
      return res.status(400).json({
        error: 'Both parties must confirm before payment can be released',
      });
    }

    // Capture payment intent
    await stripeService.capturePayment(match.payment_intent_id);

    // Update match and payment status
    await pool.query(
      `UPDATE matches 
       SET payment_status = 'released', updated_at = NOW()
       WHERE id = $1`,
      [matchId]
    );

    await pool.query(
      `UPDATE payments 
       SET status = 'released', released_at = NOW(), updated_at = NOW()
       WHERE match_id = $1`,
      [matchId]
    );

    res.json({
      released: true,
      matchId,
    });
  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/payments/refund
 * Refund payment (full or partial)
 */
router.post('/refund', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { matchId, amount } = req.body; // amount in dollars, optional for partial refund
    const userId = req.userId!;

    if (!matchId) {
      return res.status(400).json({ error: 'matchId is required' });
    }

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (host_id = $2 OR guest_id = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];
    const refundAmount = amount ? Math.round(amount * 100) : undefined; // Convert to cents

    // Create refund
    const refund = await stripeService.refundPayment(
      match.payment_intent_id,
      refundAmount
    );

    // Update payment status
    const paymentStatus = refundAmount && refundAmount < match.payment_amount
      ? 'partially_refunded'
      : 'refunded';

    await pool.query(
      `UPDATE payments 
       SET status = $1, refund_amount = $2, refunded_at = NOW(), updated_at = NOW()
       WHERE match_id = $3`,
      [paymentStatus, refund.amount, matchId]
    );

    await pool.query(
      `UPDATE matches 
       SET payment_status = $1, updated_at = NOW()
       WHERE id = $2`,
      [paymentStatus, matchId]
    );

    res.json({
      refunded: true,
      refundId: refund.id,
      amount: refund.amount / 100, // Convert back to dollars
      matchId,
    });
  } catch (error) {
    console.error('Error refunding payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/payments/history
 * Get payment history
 */
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const result = await pool.query(
      `SELECT p.*, m.dining_hall, m.meeting_time
       FROM payments p
       JOIN matches m ON p.match_id = m.id
       WHERE p.host_id = $1 OR p.guest_id = $1
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json({
      payments: result.rows.map((row) => ({
        id: row.id,
        matchId: row.match_id,
        amount: row.amount / 100, // Convert from cents
        status: row.status,
        type: row.host_id === userId ? 'received' : 'sent',
        diningHall: row.dining_hall,
        meetingTime: row.meeting_time,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

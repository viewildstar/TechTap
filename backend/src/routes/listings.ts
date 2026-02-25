import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/listings
 * Create a listing (host)
 */
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { diningHall, timeWindow, price } = req.body;
    const userId = req.userId!;

    if (!diningHall || !timeWindow || !price) {
      return res.status(400).json({
        error: 'diningHall, timeWindow, and price are required',
      });
    }

    if (price < 5 || price > 22) {
      return res.status(400).json({
        error: 'price must be between $5 and $22',
      });
    }

    // Check for existing active listing
    const existing = await pool.query(
      'SELECT id FROM listings WHERE host_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: 'You already have an active listing. Cancel it first.',
      });
    }

    const listingId = uuidv4();
    let expiresAt: Date;

    if (timeWindow.type === 'now') {
      expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    } else if (timeWindow.scheduledTime) {
      expiresAt = new Date(timeWindow.scheduledTime);
    } else {
      return res.status(400).json({ error: 'Invalid timeWindow' });
    }

    const result = await pool.query(
      `INSERT INTO listings (id, host_id, dining_hall, time_window_type, scheduled_time, expires_at, price, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        listingId,
        userId,
        diningHall,
        timeWindow.type,
        timeWindow.scheduledTime || null,
        expiresAt,
        price,
        'active',
      ]
    );

    const listing = result.rows[0];

    res.status(201).json({
      id: listing.id,
      hostId: listing.host_id,
      diningHall: listing.dining_hall,
      timeWindow: {
        type: listing.time_window_type,
        scheduledTime: listing.scheduled_time,
        expiresAt: listing.expires_at,
      },
      price: listing.price,
      status: listing.status,
      createdAt: listing.created_at,
    });

    // TODO: Trigger matching algorithm
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/listings
 * Get all active listings
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { diningHall, status } = req.query;

    let query = `
      SELECT l.*, u.name as host_name, u.reliability_score, u.average_rating
      FROM listings l
      JOIN users u ON l.host_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (diningHall) {
      query += ` AND l.dining_hall = $${paramCount++}`;
      params.push(diningHall);
    }

    if (status) {
      query += ` AND l.status = $${paramCount++}`;
      params.push(status);
    } else {
      query += ` AND l.status = 'active'`;
    }

    query += ' ORDER BY l.created_at DESC LIMIT 20';

    const result = await pool.query(query, params);

    res.json({
      listings: result.rows.map((row) => ({
        id: row.id,
        host: {
          id: row.host_id,
          name: row.host_name,
          reliabilityScore: row.reliability_score,
          averageRating: row.average_rating,
        },
        diningHall: row.dining_hall,
        timeWindow: {
          type: row.time_window_type,
          scheduledTime: row.scheduled_time,
          expiresAt: row.expires_at,
        },
        price: row.price,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/listings/:id
 * Cancel a listing
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await pool.query(
      `UPDATE listings 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND host_id = $2 AND status = 'active'
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or already cancelled' });
    }

    res.json({
      cancelled: true,
      listingId: id,
    });
  } catch (error) {
    console.error('Error cancelling listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


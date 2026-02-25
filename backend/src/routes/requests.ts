import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';
import { findNearestDiningHall } from '../utils/diningHalls';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/requests/quick
 * Location-based quick request (Find Host Now)
 */
router.post('/quick', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.userId!;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'latitude and longitude are required',
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude',
      });
    }

    // Find nearest dining hall
    const nearest = findNearestDiningHall(lat, lon);

    if (!nearest) {
      return res.status(404).json({
        error: 'No dining hall found within 500m. Please select one manually.',
      });
    }

    // Create request with auto-set values
    const requestId = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const result = await pool.query(
      `INSERT INTO requests (id, guest_id, dining_hall, time_window_type, expires_at, max_price, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [requestId, userId, nearest.hall.id, 'now', expiresAt, 22, 'active']
    );

    const request = result.rows[0];

    res.status(201).json({
      id: request.id,
      guestId: request.guest_id,
      diningHall: request.dining_hall,
      timeWindow: {
        type: request.time_window_type,
        expiresAt: request.expires_at,
      },
      maxPrice: request.max_price,
      status: request.status,
      detectedHall: {
        name: nearest.hall.name,
        distance: Math.round((nearest.distance / 1609.34) * 100) / 100, // miles
        address: nearest.hall.address,
      },
      createdAt: request.created_at,
    });

    // TODO: Trigger matching algorithm
  } catch (error) {
    console.error('Error creating quick request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/requests
 * Create a manual request
 */
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { diningHall, timeWindow, maxPrice } = req.body;
    const userId = req.userId!;

    if (!diningHall || !timeWindow || !maxPrice) {
      return res.status(400).json({
        error: 'diningHall, timeWindow, and maxPrice are required',
      });
    }

    if (maxPrice < 5 || maxPrice > 22) {
      return res.status(400).json({
        error: 'maxPrice must be between $5 and $22',
      });
    }

    const requestId = uuidv4();
    let expiresAt: Date;

    if (timeWindow.type === 'now') {
      expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    } else if (timeWindow.scheduledTime) {
      expiresAt = new Date(timeWindow.scheduledTime);
    } else {
      return res.status(400).json({ error: 'Invalid timeWindow' });
    }

    const result = await pool.query(
      `INSERT INTO requests (id, guest_id, dining_hall, time_window_type, scheduled_time, expires_at, max_price, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        requestId,
        userId,
        diningHall,
        timeWindow.type,
        timeWindow.scheduledTime || null,
        expiresAt,
        maxPrice,
        'active',
      ]
    );

    const request = result.rows[0];

    res.status(201).json({
      id: request.id,
      guestId: request.guest_id,
      diningHall: request.dining_hall,
      timeWindow: {
        type: request.time_window_type,
        scheduledTime: request.scheduled_time,
        expiresAt: request.expires_at,
      },
      maxPrice: request.max_price,
      status: request.status,
      createdAt: request.created_at,
    });

    // TODO: Trigger matching algorithm
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/requests
 * Get all active requests
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { diningHall, status } = req.query;

    let query = 'SELECT * FROM requests WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (diningHall) {
      query += ` AND dining_hall = $${paramCount++}`;
      params.push(diningHall);
    }

    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';

    const result = await pool.query(query, params);

    res.json({
      requests: result.rows.map((row) => ({
        id: row.id,
        guestId: row.guest_id,
        diningHall: row.dining_hall,
        timeWindow: {
          type: row.time_window_type,
          scheduledTime: row.scheduled_time,
          expiresAt: row.expires_at,
        },
        maxPrice: row.max_price,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/requests/:id
 * Cancel a request
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await pool.query(
      `UPDATE requests 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND guest_id = $2 AND status = 'active'
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already cancelled' });
    }

    res.json({
      cancelled: true,
      requestId: id,
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';

const router = express.Router();

/**
 * GET /api/matches
 * Get user's matches
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { status } = req.query;

    let query = `
      SELECT m.*, 
             h.id as host_id, h.name as host_name, h.photo_url as host_photo, h.reliability_score as host_reliability,
             g.id as guest_id, g.name as guest_name, g.photo_url as guest_photo, g.reliability_score as guest_reliability
      FROM matches m
      JOIN users h ON m.host_id = h.id
      JOIN users g ON m.guest_id = g.id
      WHERE (m.host_id = $1 OR m.guest_id = $1)
    `;
    const params: any[] = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND m.status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY m.created_at DESC LIMIT 20';

    const result = await pool.query(query, params);

    res.json({
      matches: result.rows.map((row) => ({
        id: row.id,
        host: {
          id: row.host_id,
          name: row.host_name,
          photoUrl: row.host_photo,
          reliabilityScore: row.host_reliability,
        },
        guest: {
          id: row.guest_id,
          name: row.guest_name,
          photoUrl: row.guest_photo,
          reliabilityScore: row.guest_reliability,
        },
        diningHall: row.dining_hall,
        meetingTime: row.meeting_time,
        price: row.price,
        status: row.status,
        paymentStatus: row.payment_status,
        hostArrivedAt: row.host_arrived_at,
        guestArrivedAt: row.guest_arrived_at,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/matches/:id
 * Get match details
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await pool.query(
      `SELECT m.*, 
              h.id as host_id, h.name as host_name, h.photo_url as host_photo, h.reliability_score as host_reliability,
              g.id as guest_id, g.name as guest_name, g.photo_url as guest_photo, g.reliability_score as guest_reliability
       FROM matches m
       JOIN users h ON m.host_id = h.id
       JOIN users g ON m.guest_id = g.id
       WHERE m.id = $1 AND (m.host_id = $2 OR m.guest_id = $2)`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const row = result.rows[0];

    res.json({
      id: row.id,
      host: {
        id: row.host_id,
        name: row.host_name,
        photoUrl: row.host_photo,
        reliabilityScore: row.host_reliability,
      },
      guest: {
        id: row.guest_id,
        name: row.guest_name,
        photoUrl: row.guest_photo,
        reliabilityScore: row.guest_reliability,
      },
      diningHall: row.dining_hall,
      meetingTime: row.meeting_time,
      price: row.price,
      status: row.status,
      paymentStatus: row.payment_status,
      hostArrivedAt: row.host_arrived_at,
      guestArrivedAt: row.guest_arrived_at,
      hostConfirmedAt: row.host_confirmed_at,
      guestConfirmedAt: row.guest_confirmed_at,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/matches/:id/arrive
 * Mark user as arrived
 */
router.post('/:id/arrive', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { role } = req.body; // 'host' or 'guest'

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (host_id = $2 OR guest_id = $2)',
      [id, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];
    const isHost = match.host_id === userId;

    if ((role === 'host' && !isHost) || (role === 'guest' && isHost)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const field = isHost ? 'host_arrived_at' : 'guest_arrived_at';
    const otherField = isHost ? 'guest_arrived_at' : 'host_arrived_at';

    await pool.query(
      `UPDATE matches 
       SET ${field} = NOW(), 
           status = CASE WHEN ${otherField} IS NOT NULL THEN 'in_progress' ELSE 'coordinating' END,
           updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    // Check if both arrived
    const updatedMatch = await pool.query(
      'SELECT host_arrived_at, guest_arrived_at FROM matches WHERE id = $1',
      [id]
    );

    const bothArrived =
      updatedMatch.rows[0].host_arrived_at && updatedMatch.rows[0].guest_arrived_at;

    res.json({
      arrived: true,
      arrivedAt: new Date().toISOString(),
      otherPartyArrived: bothArrived,
    });
  } catch (error) {
    console.error('Error marking arrival:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/matches/:id/confirm-swipe
 * Host confirms they swiped guest in
 */
router.post('/:id/confirm-swipe', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND host_id = $2',
      [id, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found or you are not the host' });
    }

    await pool.query(
      `UPDATE matches 
       SET host_confirmed_at = NOW(), 
           status = CASE WHEN guest_confirmed_at IS NOT NULL THEN 'completed' ELSE 'in_progress' END,
           updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    // Check if both confirmed
    const updatedMatch = await pool.query(
      'SELECT host_confirmed_at, guest_confirmed_at FROM matches WHERE id = $1',
      [id]
    );

    const bothConfirmed =
      updatedMatch.rows[0].host_confirmed_at && updatedMatch.rows[0].guest_confirmed_at;

    if (bothConfirmed) {
      // Release payment
      try {
        const stripeService = await import('../services/stripe');
        await stripeService.capturePayment(match.payment_intent_id);
        
        await pool.query(
          `UPDATE matches SET payment_status = 'released', updated_at = NOW() WHERE id = $1`,
          [id]
        );
        
        await pool.query(
          `UPDATE payments SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE match_id = $1`,
          [id]
        );
      } catch (error) {
        console.error('Error releasing payment:', error);
        // Don't fail the request, payment can be released manually later
      }
    }

    res.json({
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      waitingForGuest: !bothConfirmed,
    });
  } catch (error) {
    console.error('Error confirming swipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/matches/:id/confirm-completion
 * Guest confirms they're in
 */
router.post('/:id/confirm-completion', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND guest_id = $2',
      [id, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found or you are not the guest' });
    }

    await pool.query(
      `UPDATE matches 
       SET guest_confirmed_at = NOW(), 
           status = CASE WHEN host_confirmed_at IS NOT NULL THEN 'completed' ELSE 'in_progress' END,
           completed_at = CASE WHEN host_confirmed_at IS NOT NULL THEN NOW() ELSE NULL END,
           updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    // Check if both confirmed
    const updatedMatch = await pool.query(
      'SELECT host_confirmed_at, guest_confirmed_at FROM matches WHERE id = $1',
      [id]
    );

    const bothConfirmed =
      updatedMatch.rows[0].host_confirmed_at && updatedMatch.rows[0].guest_confirmed_at;

    if (bothConfirmed) {
      // Release payment
      try {
        const stripeService = await import('../services/stripe');
        await stripeService.capturePayment(match.payment_intent_id);
        
        await pool.query(
          `UPDATE matches SET payment_status = 'released', updated_at = NOW() WHERE id = $1`,
          [id]
        );
        
        await pool.query(
          `UPDATE payments SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE match_id = $1`,
          [id]
        );
      } catch (error) {
        console.error('Error releasing payment:', error);
        // Don't fail the request, payment can be released manually later
      }
    }

    res.json({
      completed: true,
      completedAt: new Date().toISOString(),
      paymentReleased: bothConfirmed,
    });
  } catch (error) {
    console.error('Error confirming completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


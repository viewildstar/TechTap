import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const result = await pool.query(
      `SELECT id, email, phone, name, photo_url, reliability_score, average_rating, 
              total_transactions, is_verified, is_suspended, suspended_until, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: maskEmail(user.email),
      name: user.name,
      photoUrl: user.photo_url,
      reliabilityScore: user.reliability_score,
      averageRating: user.average_rating,
      totalTransactions: user.total_transactions,
      isVerified: user.is_verified,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/users/:id
 * Get public user profile
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name, photo_url, reliability_score, average_rating, total_transactions
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      name: user.name,
      photoUrl: user.photo_url,
      reliabilityScore: user.reliability_score,
      averageRating: user.average_rating,
      totalTransactions: user.total_transactions,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/users/block
 * Block a user
 */
router.post('/block', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { userId: blockUserId } = req.body;

    if (!blockUserId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Add to blocked list (stored as JSON array in PostgreSQL)
    await pool.query(
      `UPDATE users 
       SET blocked_user_ids = array_append(COALESCE(blocked_user_ids, ARRAY[]::text[]), $1),
           updated_at = NOW()
       WHERE id = $2 AND NOT ($1 = ANY(COALESCE(blocked_user_ids, ARRAY[]::text[])))`,
      [blockUserId, userId]
    );

    res.json({
      blocked: true,
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 1) return email;
  return `${local[0]}***@${domain}`;
}

export default router;


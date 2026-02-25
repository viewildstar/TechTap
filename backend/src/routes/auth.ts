import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../utils/db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, phone, name } = req.body;

    if (!email || !phone || !name) {
      return res.status(400).json({
        error: 'email, phone, and name are required',
      });
    }

    // Verify MIT email
    if (!email.endsWith('@mit.edu')) {
      return res.status(400).json({
        error: 'Must use MIT email address (@mit.edu)',
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User already exists. Please sign in.',
      });
    }

    // Create user
    const userId = uuidv4();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO users (id, email, phone, name, verification_code, reliability_score, average_rating, total_transactions, is_verified, is_suspended, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 100, 0, 0, false, false, NOW(), NOW())`,
      [userId, email, phone, name, verificationCode]
    );

    // TODO: Send verification email

    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      userId,
      token,
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with code
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        error: 'email and code are required',
      });
    }

    const result = await pool.query(
      'SELECT id, verification_code FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Mark as verified
    await pool.query(
      'UPDATE users SET is_verified = true, verification_code = NULL, updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      verified: true,
      token,
    });
  } catch (error) {
    console.error('Error in verify-email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Login with email (for now, simple - in production would use password or SSO)
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const result = await pool.query(
      'SELECT id, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      userId: user.id,
      token,
      isVerified: user.is_verified,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
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

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 1) return email;
  return `${local[0]}***@${domain}`;
}

export default router;


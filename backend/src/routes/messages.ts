import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * GET /api/matches/:matchId/messages
 * Get messages for a match
 */
router.get('/:matchId/messages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId!;

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (host_id = $2 OR guest_id = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE match_id = $1 
       ORDER BY created_at ASC`,
      [matchId]
    );

    res.json({
      messages: result.rows.map((row) => ({
        id: row.id,
        senderId: row.sender_id,
        recipientId: row.recipient_id,
        content: row.content,
        isRead: row.is_read,
        createdAt: row.created_at,
        readAt: row.read_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/matches/:matchId/messages
 * Send a message
 */
router.post('/:matchId/messages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId!;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'content must be 1000 characters or less' });
    }

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT host_id, guest_id FROM matches WHERE id = $1 AND (host_id = $2 OR guest_id = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];
    const recipientId = match.host_id === userId ? match.guest_id : match.host_id;

    const messageId = uuidv4();

    const result = await pool.query(
      `INSERT INTO messages (id, match_id, sender_id, recipient_id, content, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, false, NOW())
       RETURNING *`,
      [messageId, matchId, userId, recipientId, content.trim()]
    );

    const message = result.rows[0];

    res.status(201).json({
      id: message.id,
      senderId: message.sender_id,
      recipientId: message.recipient_id,
      content: message.content,
      isRead: message.is_read,
      createdAt: message.created_at,
    });

    // TODO: Send WebSocket notification to recipient
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


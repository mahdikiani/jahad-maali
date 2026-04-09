import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAuth } from '../middleware/auth';

export function donationsRouter(db: Database) {
  const router = Router();

  router.get('/mine', requireAuth(db), (req, res) => {
    const user = (req as any).user;
    const donations = db.query(`
      SELECT d.*, c.title as campaign_title, m.text as message_text, m.vote_count
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      LEFT JOIN messages m ON m.donation_id = d.id
      WHERE d.user_id = ? AND d.status = 'paid'
      ORDER BY d.created_at DESC
    `).all(user.id);
    res.json(donations);
  });

  return router;
}

import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAuth, requireAdmin } from '../middleware/auth';

export function messagesRouter(db: Database) {
  const router = Router();

  // Get approved messages for a campaign (with top/today logic)
  router.get('/campaign/:campaignId', (req, res) => {
    const { campaignId } = req.params;
    const { mode } = req.query; // 'top' | 'today' | 'all'

    let query = `
      SELECT m.*, u.phone as user_phone, u.name as user_name,
             d.amount as donation_amount
      FROM messages m
      JOIN users u ON m.user_id = u.id
      JOIN donations d ON m.donation_id = d.id
      WHERE m.campaign_id = ? AND m.status = 'approved'
    `;

    if (mode === 'today') {
      query += ` AND m.created_at >= datetime('now', '-24 hours') ORDER BY m.score DESC LIMIT 1`;
    } else if (mode === 'top') {
      query += ` ORDER BY m.score DESC LIMIT 4`;
    } else {
      query += ` ORDER BY m.score DESC`;
    }

    const messages = db.query(query).all(campaignId);
    res.json(messages);
  });

  // All messages across campaigns (for landing)
  router.get('/featured', (_req, res) => {
    const today = db.query(`
      SELECT m.*, u.name as user_name, d.amount as donation_amount, c.title as campaign_title
      FROM messages m JOIN users u ON m.user_id=u.id JOIN donations d ON m.donation_id=d.id
      JOIN campaigns c ON m.campaign_id=c.id
      WHERE m.status='approved' AND m.created_at >= datetime('now','-24 hours')
      ORDER BY m.score DESC LIMIT 1
    `).get();

    const top = db.query(`
      SELECT m.*, u.name as user_name, d.amount as donation_amount, c.title as campaign_title
      FROM messages m JOIN users u ON m.user_id=u.id JOIN donations d ON m.donation_id=d.id
      JOIN campaigns c ON m.campaign_id=c.id
      WHERE m.status='approved'
      ORDER BY m.score DESC LIMIT 4
    `).all();

    res.json({ today, top });
  });

  // Submit message (only after paid donation)
  router.post('/', requireAuth(db), (req, res) => {
    const user = (req as any).user;
    const { donation_id, text } = req.body;

    if (!text || text.length > 140) return res.status(400).json({ error: 'پیام باید حداکثر ۱۴۰ کاراکتر باشد' });

    const donation = db.query(`
      SELECT * FROM donations WHERE id = ? AND user_id = ? AND status = 'paid'
    `).get(donation_id, user.id) as any;

    if (!donation) return res.status(403).json({ error: 'فقط کمک‌کنندگان می‌توانند پیام ثبت کنند' });

    const existing = db.query('SELECT id FROM messages WHERE donation_id = ?').get(donation_id);
    if (existing) return res.status(400).json({ error: 'برای این کمک قبلاً پیام ثبت شده است' });

    db.prepare(`
      INSERT INTO messages (donation_id, campaign_id, user_id, text, score)
      VALUES (?, ?, ?, ?, ?)
    `).run(donation_id, donation.campaign_id, user.id, text, donation.amount);

    res.json({ success: true });
  });

  // Vote
  router.post('/:id/vote', requireAuth(db), (req, res) => {
    const user = (req as any).user;
    const messageId = req.params.id;

    try {
      db.prepare('INSERT INTO votes (message_id, user_id) VALUES (?, ?)').run(messageId, user.id);
      db.prepare('UPDATE messages SET vote_count = vote_count + 1, score = score + 1 WHERE id = ?').run(messageId);
      res.json({ success: true });
    } catch {
      res.status(400).json({ error: 'قبلاً رأی داده‌اید' });
    }
  });

  // Get user's votes (to show voted state)
  router.get('/my-votes', requireAuth(db), (req, res) => {
    const user = (req as any).user;
    const votes = db.query('SELECT message_id FROM votes WHERE user_id = ?').all(user.id);
    res.json(votes.map((v: any) => v.message_id));
  });

  // Admin: list pending
  router.get('/admin/pending', requireAdmin(db), (_req, res) => {
    const msgs = db.query(`
      SELECT m.*, u.phone, d.amount FROM messages m
      JOIN users u ON m.user_id=u.id JOIN donations d ON m.donation_id=d.id
      WHERE m.status='pending' ORDER BY m.created_at DESC
    `).all();
    res.json(msgs);
  });

  // Admin: moderate
  router.put('/:id/moderate', requireAdmin(db), (req, res) => {
    const { status } = req.body; // 'approved' | 'hidden'
    db.prepare('UPDATE messages SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  return router;
}

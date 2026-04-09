import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';

export function volunteersRouter(db: Database) {
  const router = Router();

  router.get('/', requireAdmin(db), (_req, res) => {
    const volunteers = db.query(`
      SELECT v.*, c.title as campaign_title
      FROM volunteers v
      LEFT JOIN campaigns c ON v.campaign_id = c.id
      ORDER BY v.created_at DESC
    `).all();
    res.json(volunteers);
  });

  router.post('/', (req, res) => {
    const { project_id, name, phone, message, type } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'اطلاعات ناقص است' });
    }
    db.prepare(`
      INSERT INTO volunteers (campaign_id, name, phone, message, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(project_id || null, name, phone, message, type || 'physical');
    res.json({ success: true });
  });

  router.put('/:id', requireAdmin(db), (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE volunteers SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  return router;
}

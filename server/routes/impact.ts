import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';

export function impactRouter(db: Database) {
  const router = Router();

  router.get('/', (_req, res) => {
    const reports = db.query(`
      SELECT ir.*, c.title as campaign_title
      FROM impact_reports ir
      JOIN campaigns c ON ir.campaign_id = c.id
      ORDER BY ir.created_at DESC
    `).all();
    res.json(reports);
  });

  router.post('/', requireAdmin(db), (req, res) => {
    const { campaign_id, title, body, amount_spent, image_url, video_url } = req.body;
    db.prepare(`
      INSERT INTO impact_reports (campaign_id, title, body, amount_spent, image_url, video_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(campaign_id, title, body, amount_spent || 0, image_url || null, video_url || null);
    res.json({ success: true });
  });

  return router;
}

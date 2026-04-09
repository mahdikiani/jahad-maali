import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';

function toSlug(title: string) {
  return title.trim().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '').toLowerCase();
}

export function campaignsRouter(db: Database) {
  const router = Router();

  router.get('/', (_req, res) => {
    const campaigns = db.query('SELECT * FROM campaigns ORDER BY created_at DESC').all();
    res.json(campaigns);
  });

  router.get('/:slug', (req, res) => {
    const campaign = db.query('SELECT * FROM campaigns WHERE slug = ? OR id = ?').get(req.params.slug, req.params.slug) as any;
    if (!campaign) return res.status(404).json({ error: 'کمپین یافت نشد' });
    const media = db.query('SELECT * FROM campaign_media WHERE campaign_id = ? ORDER BY sort_order').all(campaign.id);
    const reports = db.query('SELECT * FROM impact_reports WHERE campaign_id = ? ORDER BY created_at DESC').all(campaign.id);
    res.json({ ...campaign, media, reports });
  });

  router.post('/', requireAdmin(db), (req, res) => {
    const { title, description, target_amount, cover_image, cover_video, category, deadline } = req.body;
    const slug = toSlug(title) + '-' + Date.now();
    try {
      const r = db.prepare(`
        INSERT INTO campaigns (title, slug, description, target_amount, cover_image, cover_video, category, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, slug, description, target_amount, cover_image || null, cover_video || null, category || 'other', deadline || null);
      res.json({ success: true, id: r.lastInsertRowid, slug });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  router.put('/:id', requireAdmin(db), (req, res) => {
    const { title, description, target_amount, cover_image, cover_video, category, status, deadline } = req.body;
    db.prepare(`
      UPDATE campaigns SET title=?, description=?, target_amount=?, cover_image=?, cover_video=?,
      category=?, status=?, deadline=?, updated_at=datetime('now') WHERE id=?
    `).run(title, description, target_amount, cover_image, cover_video, category, status, deadline, req.params.id);
    res.json({ success: true });
  });

  router.delete('/:id', requireAdmin(db), (req, res) => {
    db.prepare('DELETE FROM campaigns WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Media
  router.post('/:id/media', requireAdmin(db), (req, res) => {
    const { url, type, caption } = req.body;
    db.prepare('INSERT INTO campaign_media (campaign_id, url, type, caption) VALUES (?, ?, ?, ?)').run(req.params.id, url, type || 'image', caption || null);
    res.json({ success: true });
  });

  router.delete('/:id/media/:mediaId', requireAdmin(db), (req, res) => {
    db.prepare('DELETE FROM campaign_media WHERE id = ? AND campaign_id = ?').run(req.params.mediaId, req.params.id);
    res.json({ success: true });
  });

  return router;
}

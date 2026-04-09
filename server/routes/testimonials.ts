import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';

export function testimonialsRouter(db: Database) {
  const router = Router();

  router.get('/', (_req, res) => {
    const items = db.query('SELECT * FROM testimonials WHERE is_visible=1 ORDER BY sort_order').all();
    res.json(items);
  });

  router.post('/', requireAdmin(db), (req, res) => {
    const { name, text, avatar } = req.body;
    db.prepare('INSERT INTO testimonials (name, text, avatar) VALUES (?, ?, ?)').run(name || null, text, avatar || null);
    res.json({ success: true });
  });

  router.put('/:id', requireAdmin(db), (req, res) => {
    const { name, text, avatar, is_visible, sort_order } = req.body;
    db.prepare('UPDATE testimonials SET name=?, text=?, avatar=?, is_visible=?, sort_order=? WHERE id=?')
      .run(name, text, avatar, is_visible ? 1 : 0, sort_order || 0, req.params.id);
    res.json({ success: true });
  });

  router.delete('/:id', requireAdmin(db), (req, res) => {
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  return router;
}

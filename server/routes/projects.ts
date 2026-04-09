import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';

export function projectsRouter(db: Database) {
  const router = Router();

  router.get('/', (_req, res) => {
    const projects = db.query('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json(projects);
  });

  router.post('/', requireAdmin(db), (req, res) => {
    const { title, description, target_amount, image_url, category } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO projects (title, description, target_amount, image_url, category)
        VALUES (?, ?, ?, ?, ?)
      `).run(title, description, target_amount, image_url || `https://picsum.photos/seed/${Date.now()}/800/600`, category || 'other');
      res.json({ success: true, id: result.lastInsertRowid });
    } catch {
      res.status(500).json({ error: 'خطا در ایجاد پروژه' });
    }
  });

  router.put('/:id', requireAdmin(db), (req, res) => {
    const { title, description, target_amount, image_url, category, status } = req.body;
    db.prepare(`
      UPDATE projects SET title=?, description=?, target_amount=?, image_url=?, category=?, status=?
      WHERE id=?
    `).run(title, description, target_amount, image_url, category, status, req.params.id);
    res.json({ success: true });
  });

  router.delete('/:id', requireAdmin(db), (req, res) => {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  return router;
}

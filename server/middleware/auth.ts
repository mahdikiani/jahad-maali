import type { Request, Response, NextFunction } from 'express';
import { Database } from 'bun:sqlite';

export function requireAuth(db: Database) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'احراز هویت لازم است' });

    const session = db.query('SELECT * FROM users WHERE id = (SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now"))').get(token) as any;
    if (!session) return res.status(401).json({ error: 'توکن نامعتبر است' });

    (req as any).user = session;
    next();
  };
}

export function requireAdmin(db: Database) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'احراز هویت لازم است' });

    const user = db.query(`
      SELECT u.* FROM users u
      JOIN sessions s ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token) as any;

    if (!user) return res.status(401).json({ error: 'توکن نامعتبر است' });
    if (user.role !== 'admin' && user.role !== 'superadmin') return res.status(403).json({ error: 'دسترسی ندارید' });

    (req as any).user = user;
    next();
  };
}

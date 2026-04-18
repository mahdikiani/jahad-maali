import { Router, type Request, type Response } from 'express';
import { Database } from 'bun:sqlite';
import { requireAdmin } from '../middleware/auth';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export function uploadsRouter(db: Database) {
  const router = Router();

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // POST /api/uploads/image — multipart form upload (admin only)
  // Accepts raw base64 JSON body: { data: "data:image/...", filename: "..." }
  router.post('/image', requireAdmin(db), async (req: Request, res: Response) => {
    try {
      const { data, filename } = req.body as { data: string; filename?: string };

      if (!data) return res.status(400).json({ error: 'No image data provided' });

      // Parse base64 data URL
      const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches) return res.status(400).json({ error: 'Invalid image format' });

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Validate size (max 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image too large (max 5MB)' });
      }

      // Determine extension
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };
      const ext = extMap[mimeType] || 'jpg';

      // Generate unique filename
      const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/${uniqueName}`;
      res.json({ url, success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE /api/uploads/image — delete an uploaded file (admin only)
  router.delete('/image', requireAdmin(db), (req: Request, res: Response) => {
    try {
      const { url } = req.body as { url: string };
      if (!url || !url.startsWith('/uploads/')) {
        return res.status(400).json({ error: 'Invalid URL' });
      }
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}

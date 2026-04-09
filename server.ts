import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { Database } from 'bun:sqlite';
import { config } from 'dotenv';
import { initDb } from './server/db/schema';
import { seedData } from './server/db/seed';
import { authRouter } from './server/routes/auth';
import { campaignsRouter } from './server/routes/campaigns';
import { donationsRouter } from './server/routes/donations';
import { paymentsRouter } from './server/routes/payments';
import { messagesRouter } from './server/routes/messages';
import { testimonialsRouter } from './server/routes/testimonials';
import { volunteersRouter } from './server/routes/volunteers';
import { impactRouter } from './server/routes/impact';

config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(cors());
  app.use(express.json());

  const dbPath = process.env.DB_PATH || 'charity.db';
  const db = new Database(dbPath);
  initDb(db);
  seedData(db);

  app.use('/api/auth', authRouter(db));
  app.use('/api/campaigns', campaignsRouter(db));
  app.use('/api/donations', donationsRouter(db));
  app.use('/api/payments', paymentsRouter(db));
  app.use('/api/messages', messagesRouter(db));
  app.use('/api/testimonials', testimonialsRouter(db));
  app.use('/api/volunteers', volunteersRouter(db));
  app.use('/api/impact-reports', impactRouter(db));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`✅ http://localhost:${PORT}`));
}

startServer();

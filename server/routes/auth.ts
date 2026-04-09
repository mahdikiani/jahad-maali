import { Router } from 'express';
import { Database } from 'bun:sqlite';
import { requireAuth } from '../middleware/auth';

function generateToken() {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendKavenegarOtp(phone: string, code: string) {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
    return;
  }
  // ارسال SMS ساده — بدون نیاز به template
  const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      receptor: phone,
      message: `کد تأیید شما: ${code}\nجهاد با مال`,
      sender: '10008663',
    }),
  });
  const data = await res.json() as any;
  if (data.return?.status !== 200) {
    console.error('[Kavenegar]', data.return?.message);
    throw new Error('خطا در ارسال پیامک');
  }
}

export function authRouter(db: Database) {
  const router = Router();

  // Ensure sessions and admin_passwords tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS admin_passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      password TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Send OTP
  router.post('/otp/send', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'شماره موبایل الزامی است' });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare('DELETE FROM otp_codes WHERE phone = ?').run(phone);
    db.prepare('INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)').run(phone, code, expiresAt);

    const isDev = process.env.NODE_ENV !== 'production';
    try {
      await sendKavenegarOtp(phone, code);
      const response: any = { success: true };
      if (isDev) response.dev_code = code; // همیشه در dev نشون بده
      res.json(response);
    } catch (err) {
      if (isDev) {
        // در dev حتی اگه کاوه‌نگار خطا داد، کد رو برگردون
        console.log(`[DEV fallback] OTP for ${phone}: ${code}`);
        res.json({ success: true, dev_code: code });
      } else {
        res.status(500).json({ error: 'خطا در ارسال پیامک' });
      }
    }
  });

  // Verify OTP
  router.post('/otp/verify', (req, res) => {
    const { phone, code } = req.body;
    const otp = db.query(`
      SELECT * FROM otp_codes
      WHERE phone = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
    `).get(phone, code) as any;

    if (!otp) return res.status(400).json({ error: 'کد نامعتبر یا منقضی شده است' });

    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otp.id);

    // Upsert user
    db.prepare('INSERT OR IGNORE INTO users (phone) VALUES (?)').run(phone);
    const user = db.query('SELECT * FROM users WHERE phone = ?').get(phone) as any;

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expiresAt);

    res.json({ token, user });
  });

  // Admin login
  router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (username === adminUser && password === adminPass) {
      // Upsert superadmin user
      db.prepare('INSERT OR IGNORE INTO users (phone, name, role) VALUES (?, ?, ?)').run('admin', adminUser, 'superadmin');
      db.prepare("UPDATE users SET role = 'superadmin' WHERE phone = 'admin'").run();
      const user = db.query("SELECT * FROM users WHERE phone = 'admin'").get() as any;

      const token = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expiresAt);
      return res.json({ token, user });
    }

    // Check DB admins
    const user = db.query("SELECT * FROM users WHERE name = ? AND role IN ('admin','superadmin')").get(username) as any;
    if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });

    // For DB admins, password stored as plain (in production use bcrypt)
    const adminRecord = db.query('SELECT * FROM admin_passwords WHERE user_id = ?').get(user.id) as any;
    if (!adminRecord || adminRecord.password !== password) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expiresAt);
    res.json({ token, user });
  });

  // Get current user
  router.get('/me', requireAuth(db), (req, res) => {
    res.json((req as any).user);
  });

  return router;
}

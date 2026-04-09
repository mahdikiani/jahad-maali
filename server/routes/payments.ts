import { Router } from 'express';
import { Database } from 'bun:sqlite';

const MERCHANT = process.env.ZARINPAL_MERCHANT_ID || 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
const SANDBOX = process.env.NODE_ENV !== 'production';
const ZP_REQUEST = SANDBOX ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json' : 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZP_VERIFY = SANDBOX ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json' : 'https://api.zarinpal.com/pg/v4/payment/verify.json';
const ZP_STARTPAY = SANDBOX ? 'https://sandbox.zarinpal.com/pg/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/';

export function paymentsRouter(db: Database) {
  const router = Router();

  // Step 1: init — requires phone (OTP already verified at this point)
  router.post('/init', async (req, res) => {
    const { campaign_id, amount, donor_name, phone, message } = req.body;
    const user = (req as any).user;

    if (!campaign_id || !amount || amount < 10000 || !phone) {
      return res.status(400).json({ error: 'اطلاعات پرداخت ناقص است' });
    }

    const campaign = db.query('SELECT * FROM campaigns WHERE id = ? AND status = ?').get(campaign_id, 'active') as any;
    if (!campaign) return res.status(404).json({ error: 'کمپین یافت نشد یا غیرفعال است' });

    const callbackUrl = process.env.CALLBACK_URL || `http://localhost:3001/api/payments/verify`;

    try {
      const zpRes = await fetch(ZP_REQUEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          merchant_id: MERCHANT,
          amount: amount * 10,
          description: `کمک به: ${campaign.title} — ${donor_name || 'ناشناس'}`,
          callback_url: callbackUrl,
          metadata: { mobile: phone },
        }),
      });

      const data = await zpRes.json() as any;

      if (data.data?.code === 100) {
        const authority = data.data.authority;
        const r = db.prepare(`
          INSERT INTO donations (campaign_id, user_id, amount, donor_name, phone, authority, status)
          VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `).run(campaign_id, user?.id || null, amount, donor_name || 'ناشناس', phone, authority);

        // Save pending message if provided
        if (message && user?.id) {
          (req as any)._pendingMessage = { donation_id: r.lastInsertRowid, text: message };
        }

        return res.json({ payment_url: ZP_STARTPAY + authority, authority });
      }

      res.status(500).json({ error: 'خطا در اتصال به زرین‌پال: ' + (data.errors?.message || '') });
    } catch (e: any) {
      res.status(500).json({ error: 'خطا در اتصال به درگاه پرداخت' });
    }
  });

  // Step 2: verify (GET callback from Zarinpal)
  router.get('/verify', async (req, res) => {
    const { Authority, Status } = req.query as any;

    if (Status !== 'OK') {
      return res.redirect('/?payment=failed');
    }

    const donation = db.query("SELECT * FROM donations WHERE authority = ? AND status = 'pending'").get(Authority) as any;
    if (!donation) return res.redirect('/?payment=notfound');

    try {
      const zpRes = await fetch(ZP_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ merchant_id: MERCHANT, amount: donation.amount * 10, authority: Authority }),
      });

      const data = await zpRes.json() as any;

      if (data.data?.code === 100 || data.data?.code === 101) {
        const ref = data.data.ref_id;
        db.prepare("UPDATE donations SET status='paid', payment_ref=? WHERE authority=?").run(ref, Authority);
        db.prepare('UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?').run(donation.amount, donation.campaign_id);
        return res.redirect(`/?payment=success&ref=${ref}&campaign=${donation.campaign_id}`);
      }

      res.redirect('/?payment=failed');
    } catch {
      res.redirect('/?payment=error');
    }
  });

  return router;
}

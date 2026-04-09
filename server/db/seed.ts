import { Database } from 'bun:sqlite';

export function seedData(db: Database) {
  const count = db.query('SELECT COUNT(*) as c FROM campaigns').get() as { c: number };
  if (count.c > 0) return;

  const ins = db.prepare(`
    INSERT INTO campaigns (title, slug, description, target_amount, current_amount, cover_image, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  ins.run(
    'تأمین سرپناه برای خانواده‌های آسیب‌دیده جنگ',
    'sarpanahh-jang',
    `## هدف کمپین\nبازسازی منازل تخریب‌شده در مناطق جنگ‌زده و تهیه کانکس برای خانواده‌هایی که سرپناه خود را از دست داده‌اند.\n\n## چرا مهم است؟\nصدها خانواده در سرما و گرما بدون سقف مانده‌اند. هر کمک شما یک سقف است بر سر یک خانواده.\n\n## نحوه هزینه‌کرد\n- خرید مصالح ساختمانی\n- اجرت کارگران محلی\n- تهیه کانکس اضطراری`,
    500000000, 125000000,
    'https://picsum.photos/seed/war-shelter/800/500',
    'shelter'
  );

  ins.run(
    'آموزش مهارت فنی برای جوانان مناطق محروم',
    'amoozesh-maharat',
    `## هدف کمپین\nآموزش مهارت‌های فنی و حرفه‌ای به جوانان مناطق جنگ‌زده تا بتوانند آینده‌ای مستقل بسازند.\n\n## برنامه آموزشی\n- جوشکاری و فلزکاری\n- تعمیرات برق و الکترونیک\n- کشاورزی مدرن\n\n## مدرس\nاستاد حاج محمد رضایی — ۲۰ سال سابقه تدریس`,
    200000000, 48000000,
    'https://picsum.photos/seed/education-war/800/500',
    'education'
  );

  ins.run(
    'تجهیزات پزشکی برای درمانگاه مناطق جنگی',
    'tajhizat-pezeshki',
    `## هدف کمپین\nتأمین تجهیزات پزشکی اورژانسی برای درمانگاه‌های خط مقدم که با کمبود شدید مواجه‌اند.\n\n## تجهیزات مورد نیاز\n- دستگاه اکسیژن‌ساز\n- تخت‌های بیمارستانی\n- داروهای اورژانسی\n- وسایل جراحی`,
    350000000, 210000000,
    'https://picsum.photos/seed/medical-war/800/500',
    'medical'
  );

  ins.run(
    'بسته‌های غذایی برای خانواده‌های مجاهدان',
    'basteh-ghazayi',
    `## هدف کمپین\nتهیه و توزیع بسته‌های غذایی ماهانه برای خانواده‌هایی که سرپرست آن‌ها در خط مقدم است.\n\n## محتوای بسته\n- برنج ۱۰ کیلو\n- روغن ۳ لیتر\n- حبوبات متنوع\n- کنسرو و مواد پروتئینی`,
    150000000, 67000000,
    'https://picsum.photos/seed/food-war/800/500',
    'food'
  );

  // Media
  const insMedia = db.prepare(`INSERT INTO campaign_media (campaign_id, url, type, sort_order) VALUES (?, ?, ?, ?)`);
  insMedia.run(1, 'https://picsum.photos/seed/s1/800/500', 'image', 0);
  insMedia.run(1, 'https://picsum.photos/seed/s2/800/500', 'image', 1);
  insMedia.run(2, 'https://picsum.photos/seed/e1/800/500', 'image', 0);
  insMedia.run(3, 'https://picsum.photos/seed/m1/800/500', 'image', 0);
  insMedia.run(4, 'https://picsum.photos/seed/f1/800/500', 'image', 0);

  // Impact reports
  const insImpact = db.prepare(`INSERT INTO impact_reports (campaign_id, title, body, image_url, amount_spent) VALUES (?, ?, ?, ?, ?)`);
  insImpact.run(1, 'خرید اولین محموله مصالح', 'با کمک شما ۵ تن سیمان و مصالح لازم برای ۳ واحد مسکونی خریداری شد.', 'https://picsum.photos/seed/imp1/800/500', 40000000);
  insImpact.run(2, 'برگزاری اولین دوره آموزشی', '۲۰ جوان در اولین دوره جوشکاری شرکت کردند.', 'https://picsum.photos/seed/imp2/800/500', 15000000);
  insImpact.run(3, 'تحویل دستگاه اکسیژن‌ساز', 'یک دستگاه اکسیژن‌ساز به درمانگاه خط مقدم تحویل داده شد.', 'https://picsum.photos/seed/imp3/800/500', 80000000);

  // Testimonials
  const insTes = db.prepare(`INSERT INTO testimonials (name, text, sort_order) VALUES (?, ?, ?)`);
  insTes.run('حاج احمد رضایی', 'این کار فقط کمک نیست، یک وظیفه دینی است. با دیدن گزارش‌ها اطمینان پیدا کردم.', 0);
  insTes.run('خواهر فاطمه م.', 'حس مشارکت واقعی داشتم. می‌دانستم پولم کجا رفت.', 1);
  insTes.run('محمد ک.', 'سادگی و شفافیت این پلتفرم مرا متقاعد کرد. هر ماه کمک می‌کنم.', 2);
  insTes.run('استاد حسینی', 'جهاد با مال در این زمانه همین است. خدا قبول کند.', 3);

  // Sample users for demo messages
  const insUser = db.prepare(`INSERT OR IGNORE INTO users (phone, name, role) VALUES (?, ?, 'user')`);
  insUser.run('09100000001', 'حاج علی');
  insUser.run('09100000002', 'خواهر زینب');
  insUser.run('09100000003', 'برادر محمد');
  insUser.run('09100000004', 'ناشناس');

  const u1 = db.query("SELECT id FROM users WHERE phone='09100000001'").get() as any;
  const u2 = db.query("SELECT id FROM users WHERE phone='09100000002'").get() as any;
  const u3 = db.query("SELECT id FROM users WHERE phone='09100000003'").get() as any;
  const u4 = db.query("SELECT id FROM users WHERE phone='09100000004'").get() as any;

  // Sample paid donations
  const insDon = db.prepare(`
    INSERT INTO donations (campaign_id, user_id, amount, donor_name, phone, status, payment_ref)
    VALUES (?, ?, ?, ?, ?, 'paid', ?)
  `);
  const d1 = insDon.run(1, u1.id, 500000, 'حاج علی', '09100000001', 'REF001');
  const d2 = insDon.run(1, u2.id, 200000, 'خواهر زینب', '09100000002', 'REF002');
  const d3 = insDon.run(2, u3.id, 1000000, 'برادر محمد', '09100000003', 'REF003');
  const d4 = insDon.run(2, u4.id, 100000, 'ناشناس', '09100000004', 'REF004');
  const d5 = insDon.run(1, u3.id, 300000, 'برادر محمد', '09100000003', 'REF005');

  // Sample approved messages
  const insMsg = db.prepare(`
    INSERT INTO messages (donation_id, campaign_id, user_id, text, vote_count, score, status)
    VALUES (?, ?, ?, ?, ?, ?, 'approved')
  `);
  insMsg.run(d1.lastInsertRowid, 1, u1.id, 'خدایا این را قبول بفرما. برای سلامتی رزمندگان نذر کردم.', 12, 512000);
  insMsg.run(d2.lastInsertRowid, 1, u2.id, 'امیدوارم این کمک کوچک سنگری باشد در برابر دشمن.', 8, 208000);
  insMsg.run(d3.lastInsertRowid, 2, u3.id, 'جهاد با مال واجب است. این وظیفه ماست نه لطف ما.', 21, 1021000);
  insMsg.run(d4.lastInsertRowid, 2, u4.id, 'اللهم تقبل منا. به نیت شهدا.', 5, 105000);
  insMsg.run(d5.lastInsertRowid, 1, u3.id, 'هر ریال ما یک آجر است در بنای مقاومت.', 15, 315000);
}

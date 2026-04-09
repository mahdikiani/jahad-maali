import { Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-stone-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8B7355] fill-current" />
              <span className="font-black text-lg">جهاد با مال</span>
            </div>
            <p
              className="text-xl text-[#D2B48C] leading-loose"
              dir="rtl"
              style={{ fontFamily: '"me_quran", serif' }}
            >
              «وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ»
            </p>
            <p className="text-white/30 text-xs">هر آنچه از خیر برای خود پیش فرستید، نزد خدا خواهید یافت.</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white/60 uppercase tracking-widest">دسترسی سریع</h3>
            <ul className="space-y-2">
              {[
                { label: 'کمپین‌های فعال', path: '/campaigns' },
                { label: 'گزارش‌های پیشرفت', path: '/reports' },
                { label: 'مشارکت غیرمالی', path: '/#volunteer' },
              ].map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => onNavigate?.(l.path)}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white/60 uppercase tracking-widest">ارتباط با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-[#8B7355] shrink-0" />
                <a href="mailto:info@jihadbilmal.ir" className="hover:text-white transition-colors">
                  info@jihadbilmal.ir
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-[#8B7355] shrink-0" />
                <a href="tel:+982100000000" className="hover:text-white transition-colors" dir="ltr">
                  ۰۲۱-۰۰۰۰۰۰۰۰
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-[#8B7355] shrink-0 mt-0.5" />
                <span>تهران — آدرس دفتر مرکزی</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-white/25 text-xs">
          © ۱۴۰۴ — مرکز امداد و خیریه جهاد با مال
        </div>
      </div>
    </footer>
  );
}

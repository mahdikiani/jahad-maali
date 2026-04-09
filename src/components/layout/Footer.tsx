import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-5">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-[#C2A56B] fill-current" />
          <span className="font-black text-lg">جهاد با مال</span>
        </div>
        <p className="font-quran text-2xl text-[#D2B48C]" dir="rtl">
          «وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ»
        </p>
        <p className="text-white/40 text-xs">هر آنچه از خیر برای خود پیش فرستید، نزد خدا خواهید یافت.</p>
        <div className="pt-4 border-t border-white/10 text-white/30 text-xs">
          © ۱۴۰۴ — مرکز امداد و خیریه
        </div>
      </div>
    </footer>
  );
}

import { motion } from 'motion/react';
import { History } from 'lucide-react';
import type { Donation } from '../../types';

interface DonationFeedProps {
  donations: Donation[];
}

export function DonationFeed({ donations }: DonationFeedProps) {
  if (donations.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12 border-r-4 border-[#8B7355] pr-6">
          <History className="w-7 h-7 text-[#8B7355]" />
          <div>
            <h2 className="text-3xl font-bold">سوابق مشارکت‌ها</h2>
            <p className="text-stone-500 text-sm mt-1">پیام‌های همدلی مجاهدان مالی</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {donations.slice(0, 12).map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-white rounded-3xl border border-[#E5DED0] shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-stone-400">{new Date(d.created_at).toLocaleDateString('fa-IR')}</span>
                <span className="text-[#8B7355] font-bold text-sm">{d.amount.toLocaleString('fa-IR')} ت</span>
              </div>
              <p className="text-stone-700 text-sm italic mb-3 line-clamp-3">«{d.message}»</p>
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-400 truncate">{d.project_title}</p>
                <p className="text-xs font-bold text-[#8B7355] mt-1">— {d.donor_name || 'ناشناس'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

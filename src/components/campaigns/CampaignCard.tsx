import { motion } from 'motion/react';
import { ChevronLeft, Clock } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import type { Campaign } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
  onOpen: (campaign: Campaign) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  shelter: 'سرپناه', food: 'غذا و معیشت', medical: 'درمان',
  education: 'آموزش', defense: 'دفاع', other: 'سایر',
};

export function CampaignCard({ campaign, onDonate, onOpen }: CampaignCardProps) {
  const progress = Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
  const remaining = Math.max(campaign.target_amount - campaign.current_amount, 0);
  const daysLeft = campaign.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-3xl overflow-hidden border border-[#6B5E3B]/10 shadow-sm flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={campaign.cover_image || `https://picsum.photos/seed/${campaign.id}/800/500`}
          alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F3D2B] text-[#C2A56B]">
            {CATEGORY_LABELS[campaign.category] || 'سایر'}
          </span>
          {campaign.status === 'completed' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-600 text-white">تکمیل شده</span>
          )}
        </div>
        {daysLeft !== null && daysLeft <= 7 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-red-600/90 rounded-full text-white text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            {daysLeft === 0 ? 'آخرین روز' : `${daysLeft} روز مانده`}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-[#1F3D2B] mb-2 leading-snug">{campaign.title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
          {campaign.description.replace(/#+\s/g, '').split('\n')[0]}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xl font-black text-[#1F3D2B]">{campaign.current_amount.toLocaleString('fa-IR')}</span>
                <span className="text-stone-400 text-xs mr-1">از {campaign.target_amount.toLocaleString('fa-IR')} تومان</span>
              </div>
              <span className="text-sm font-bold text-[#6B5E3B]">{Math.round(progress)}٪</span>
            </div>
            <ProgressBar value={progress} />
            {remaining > 0 && (
              <p className="text-xs text-stone-400">
                <span className="text-[#6B5E3B] font-bold">{remaining.toLocaleString('fa-IR')} تومان</span> تا تکمیل
              </p>
            )}
          </div>

          {campaign.status === 'active' && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onOpen(campaign)}
                className="py-3 border border-stone-200 text-stone-600 rounded-2xl font-bold hover:bg-stone-50 transition-all text-sm">
                بیشتر بخوانید
              </button>
              <button onClick={() => onDonate(campaign)}
                className="py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-1 group text-sm">
                مشارکت
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

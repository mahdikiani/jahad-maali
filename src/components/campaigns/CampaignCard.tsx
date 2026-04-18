import { motion } from 'motion/react';
import { ChevronLeft, Clock } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import type { Campaign } from '../../types';
import { useLang } from '../../lib/LangContext';
import { t, formatNumber, formatPercent } from '../../lib/i18n';

interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
  onOpen: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onDonate, onOpen }: CampaignCardProps) {
  const { lang } = useLang();
  const progress = Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);
  const remaining = Math.max(campaign.target_amount - campaign.current_amount, 0);
  const daysLeft = campaign.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / 86400000))
    : null;

  const categoryKey = campaign.category as any;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col h-full cursor-pointer group"
      onClick={() => onOpen(campaign)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={campaign.cover_image || `https://picsum.photos/seed/${campaign.id}/800/500`}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-[#D2B48C] backdrop-blur-sm">
            {t(lang, categoryKey) || t(lang, 'other')}
          </span>
          {campaign.status === 'completed' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-600 text-white">{t(lang, 'completed')}</span>
          )}
        </div>
        {daysLeft !== null && daysLeft <= 7 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-red-600/90 rounded-full text-white text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            {daysLeft === 0 ? t(lang, 'lastDay') : `${formatNumber(daysLeft, lang)} ${t(lang, 'daysLeft')}`}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-stone-900 mb-2 leading-snug group-hover:text-[#8B7355] transition-colors">
          {campaign.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
          {campaign.description.replace(/#+\s/g, '').split('\n')[0]}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xl font-black text-stone-900">{formatNumber(campaign.current_amount, lang)}</span>
                <span className="text-stone-400 text-xs mr-1">{lang === 'en' ? 'of' : 'از'} {formatNumber(campaign.target_amount, lang)} {t(lang, 'toman')}</span>
              </div>
              <span className="text-sm font-bold text-[#8B7355]">{formatPercent(progress, lang)}</span>
            </div>
            <ProgressBar value={progress} />
            {remaining > 0 && (
              <p className="text-xs text-stone-400">
                <span className="text-[#8B7355] font-bold">{formatNumber(remaining, lang)} {t(lang, 'toman')}</span> {t(lang, 'remaining')}
              </p>
            )}
          </div>

          {campaign.status === 'active' && (
            <button
              onClick={(e) => { e.stopPropagation(); onDonate(campaign); }}
              className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-[#8B7355] transition-all flex items-center justify-center gap-2 group/btn"
            >
              {t(lang, 'donate')}
              <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

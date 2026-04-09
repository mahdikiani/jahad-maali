import { Plus } from 'lucide-react';
import { CampaignCard } from './CampaignCard';
import type { Campaign } from '../../types';

interface CampaignGridProps {
  campaigns: Campaign[];
  isAdmin: boolean;
  onDonate: (campaign: Campaign) => void;
  onAdd: () => void;
  onOpenCampaign: (campaign: Campaign) => void;
}

export function CampaignGrid({ campaigns, isAdmin, onDonate, onAdd, onOpenCampaign }: CampaignGridProps) {
  const active = campaigns.filter(c => c.status === 'active').slice(0, 3);

  return (
    <section id="campaigns" className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="border-r-4 border-[#8B7355] pr-5">
            <h2 className="text-3xl font-black text-stone-900 mb-1">کمپین‌های فعال</h2>
            <p className="text-stone-500">محل جهاد خود را انتخاب کنید.</p>
          </div>
          {isAdmin && (
            <button onClick={onAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all text-sm">
              <Plus className="w-4 h-4" />
              کمپین جدید
            </button>
          )}
        </div>

        {active.length === 0 ? (
          <div className="text-center py-20 text-[#6B5E3B]/60">هنوز کمپینی ثبت نشده است.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {active.map(c => <CampaignCard key={c.id} campaign={c} onDonate={onDonate} onOpen={onOpenCampaign} />)}
          </div>
        )}

        {campaigns.filter(c => c.status === 'active').length > 3 && (
          <div className="text-center mt-10">
            <button className="px-8 py-3 border-2 border-stone-900 text-stone-900 rounded-2xl font-bold hover:bg-stone-900 hover:text-white transition-all">
              مشاهده همه کمپین‌ها
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

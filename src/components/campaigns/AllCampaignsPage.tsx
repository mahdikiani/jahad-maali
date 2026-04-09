import { ArrowRight, Plus, Loader2 } from 'lucide-react';
import { CampaignCard } from './CampaignCard';
import type { Campaign } from '../../types';

interface AllCampaignsPageProps {
  campaigns: Campaign[];
  loading: boolean;
  onDonate: (c: Campaign) => void;
  onOpen: (c: Campaign) => void;
  onBack: () => void;
  isAdmin: boolean;
  onAdd: () => void;
}

export function AllCampaignsPage({ campaigns, loading, onDonate, onOpen, onBack, isAdmin, onAdd }: AllCampaignsPageProps) {
  const active = campaigns.filter(c => c.status === 'active');
  const ended = campaigns.filter(c => c.status !== 'active');

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold">
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </button>
            <div className="border-r-4 border-[#8B7355] pr-5">
              <h1 className="text-3xl font-black text-stone-900">همه کمپین‌ها</h1>
            </div>
          </div>
          {isAdmin && (
            <button onClick={onAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all text-sm">
              <Plus className="w-4 h-4" /> کمپین جدید
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
          </div>
        ) : (
          <>
            {/* Active */}
            <div className="mb-14">
              <h2 className="text-xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                کمپین‌های فعال
                <span className="text-sm font-normal text-stone-400">({active.length})</span>
              </h2>
              {active.length === 0 ? (
                <p className="text-stone-400 py-8 text-center">کمپین فعالی وجود ندارد.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {active.map(c => <CampaignCard key={c.id} campaign={c} onDonate={onDonate} onOpen={onOpen} />)}
                </div>
              )}
            </div>

            {/* Ended */}
            {ended.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-stone-500 mb-6 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" />
                  کمپین‌های پایان‌یافته
                  <span className="text-sm font-normal text-stone-400">({ended.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
                  {ended.map(c => <CampaignCard key={c.id} campaign={c} onDonate={onDonate} onOpen={onOpen} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

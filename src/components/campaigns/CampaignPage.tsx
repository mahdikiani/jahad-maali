import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Target, ChevronLeft } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import { api } from '../../lib/api';
import type { Campaign, ImpactReport, CampaignMedia } from '../../types';

interface CampaignPageProps {
  campaignId: number;
  onBack: () => void;
  onDonate: (campaign: Campaign) => void;
}

export function CampaignPage({ campaignId, onBack, onDonate }: CampaignPageProps) {
  const [campaign, setCampaign] = useState<Campaign & { media: CampaignMedia[]; reports: ImpactReport[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCampaign(String(campaignId))
      .then(setCampaign as any)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-stone-400">
      کمپین یافت نشد.
    </div>
  );

  const progress = Math.min((campaign.current_amount / campaign.target_amount) * 100, 100);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold">
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Cover */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden h-72 md:h-96">
          <img
            src={campaign.cover_image || `https://picsum.photos/seed/${campaign.id}/1200/600`}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-black text-stone-900 mb-3">{campaign.title}</h1>
              {campaign.deadline && (
                <div className="flex items-center gap-2 text-stone-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>مهلت: {new Date(campaign.deadline).toLocaleDateString('fa-IR')}</span>
                </div>
              )}
              {/* Markdown-like rendering */}
              <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-3">
                {campaign.description.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black text-stone-900 mt-6 mb-2">{line.slice(3)}</h2>;
                  if (line.startsWith('- ')) return <li key={i} className="mr-4 text-stone-600">{line.slice(2)}</li>;
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-stone-600">{line}</p>;
                })}
              </div>
            </div>

            {/* Media gallery */}
            {campaign.media && campaign.media.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-stone-900 mb-4">گالری تصاویر</h3>
                <div className="grid grid-cols-2 gap-3">
                  {campaign.media.map(m => (
                    <div key={m.id} className="rounded-2xl overflow-hidden aspect-video bg-stone-100">
                      <img src={m.url} alt={m.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact reports */}
            {campaign.reports && campaign.reports.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-stone-900 mb-4">گزارش‌های پیشرفت</h3>
                <div className="space-y-4">
                  {campaign.reports.map(r => (
                    <div key={r.id} className="p-5 bg-white rounded-2xl border border-stone-200">
                      {r.image_url && (
                        <img src={r.image_url} alt={r.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                      )}
                      <h4 className="font-bold text-stone-900 mb-1">{r.title}</h4>
                      <p className="text-stone-500 text-sm">{r.body}</p>
                      <p className="text-[#8B7355] font-bold text-sm mt-2">{r.amount_spent.toLocaleString('fa-IR')} تومان هزینه شد</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sticky top-20">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-black text-stone-900">{campaign.current_amount.toLocaleString('fa-IR')}</span>
                    <span className="text-stone-400 text-xs mr-1">تومان</span>
                  </div>
                  <span className="text-sm font-bold text-[#8B7355]">{Math.round(progress)}٪</span>
                </div>
                <ProgressBar value={progress} />
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <Target className="w-3.5 h-3.5" />
                  هدف: {campaign.target_amount.toLocaleString('fa-IR')} تومان
                </div>
              </div>

              {campaign.status === 'active' && (
                <button onClick={() => onDonate(campaign)}
                  className="w-full py-3.5 bg-stone-900 text-white rounded-2xl font-black hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group">
                  مشارکت در این کمپین
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { ImpactReport } from '../../types';

interface AllReportsPageProps {
  onOpen: (id: number) => void;
}

export function AllReportsPage({ onOpen }: AllReportsPageProps) {
  const [reports, setReports] = useState<ImpactReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getImpactReports().then(setReports).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold">
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </button>
          <div className="border-r-4 border-[#8B7355] pr-5">
            <h1 className="text-3xl font-black text-stone-900">همه گزارش‌ها</h1>
            <p className="text-stone-500 text-sm mt-0.5">شفافیت کامل در هزینه‌کرد کمک‌های شما</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-center text-stone-400 py-20">هنوز گزارشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-6">
            {reports.map(r => (
              <button key={r.id} onClick={() => onOpen(r.id)}
                className="w-full flex gap-6 items-start p-6 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-right group">
                {r.image_url && (
                  <div className="w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#8B7355] font-bold mb-1">{(r as any).campaign_title}</p>
                  <h3 className="font-black text-stone-900 text-lg mb-2 group-hover:text-[#8B7355] transition-colors">{r.title}</h3>
                  <p className="text-stone-500 text-sm line-clamp-2">{r.body}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString('fa-IR')}</span>
                    <span className="text-[#8B7355] font-bold text-sm">{r.amount_spent.toLocaleString('fa-IR')} تومان هزینه شد</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

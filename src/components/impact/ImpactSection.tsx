import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api';
import type { ImpactReport } from '../../types';

interface ImpactSectionProps {
  onOpenReport: (id: number) => void;
  onViewAll: () => void;
}

export function ImpactSection({ onOpenReport, onViewAll }: ImpactSectionProps) {
  const [reports, setReports] = useState<ImpactReport[]>([]);

  useEffect(() => { api.getImpactReports().then(setReports).catch(() => {}); }, []);

  if (reports.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="border-r-4 border-[#8B7355] pr-5">
            <h2 className="text-3xl font-black text-stone-900 mb-1">گزارش‌های پیشرفت</h2>
            <p className="text-stone-500">شفافیت در هزینه‌کرد — کمک شما کجا رفت</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.slice(0, 3).map(r => (
            <button key={r.id} onClick={() => onOpenReport(r.id)}
              className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-white text-right hover:shadow-md hover:-translate-y-1 transition-all group">
              {r.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-black text-stone-900 text-lg mb-2 group-hover:text-[#8B7355] transition-colors">{r.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">{r.body}</p>
                <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString('fa-IR')}</span>
                  <span className="text-[#8B7355] font-bold text-sm">{r.amount_spent.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={onViewAll}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#8B7355] text-[#8B7355] rounded-2xl font-bold hover:bg-[#8B7355] hover:text-white transition-all group">
            مشاهده همه گزارش‌ها
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

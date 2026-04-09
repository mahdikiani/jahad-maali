import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { api } from '../../lib/api';
import type { ImpactReport } from '../../types';

export function ImpactSection() {
  const [reports, setReports] = useState<ImpactReport[]>([]);

  useEffect(() => { api.getImpactReports().then(setReports).catch(() => {}); }, []);

  if (reports.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#C2A56B] pr-5 mb-12">
          <h2 className="text-3xl font-black text-[#1F3D2B] mb-1">گزارش‌های پیشرفت</h2>
          <p className="text-[#6B5E3B]">شفافیت در هزینه‌کرد — کمک شما کجا رفت</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map(r => (
            <div key={r.id} className="rounded-3xl overflow-hidden border border-[#6B5E3B]/10 shadow-sm bg-white">
              {r.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-black text-[#1F3D2B] text-lg mb-2">{r.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{r.body}</p>
                <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString('fa-IR')}</span>
                  <span className="text-[#6B5E3B] font-bold text-sm">{r.amount_spent.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

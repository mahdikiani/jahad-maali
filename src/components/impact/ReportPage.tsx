import { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { ImpactReport } from '../../types';

interface ReportPageProps {
  reportId: number;
}

export function ReportPage({ reportId }: ReportPageProps) {
  const [report, setReport] = useState<ImpactReport & { campaign_title?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getImpactReports()
      .then(reports => {
        const found = reports.find((r: any) => r.id === reportId);
        setReport(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
    </div>
  );

  if (!report) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-stone-400">
      گزارش یافت نشد.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold mb-8">
          <ArrowRight className="w-4 h-4" />
          بازگشت به گزارش‌ها
        </button>

        {/* Cover image */}
        {report.image_url && (
          <div className="rounded-3xl overflow-hidden h-64 md:h-80 mb-8">
            <img src={report.image_url} alt={report.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Video */}
        {report.video_url && (
          <div className="rounded-3xl overflow-hidden mb-8 aspect-video bg-stone-900">
            <video src={report.video_url} controls className="w-full h-full" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          {report.campaign_title && (
            <span className="px-3 py-1 bg-[#F5F2ED] text-[#8B7355] rounded-full text-xs font-bold">
              {report.campaign_title}
            </span>
          )}
          <span className="text-stone-400 text-xs">{new Date(report.created_at).toLocaleDateString('fa-IR')}</span>
        </div>

        <h1 className="text-3xl font-black text-stone-900 mb-4">{report.title}</h1>

        <div className="p-4 bg-[#F5F2ED] rounded-2xl border border-[#E5DED0] mb-8 inline-flex items-center gap-2">
          <span className="text-[#8B7355] font-black text-lg">{report.amount_spent.toLocaleString('fa-IR')} تومان</span>
          <span className="text-stone-500 text-sm">هزینه شده</span>
        </div>

        {/* Body */}
        <div className="prose max-w-none text-stone-600 leading-relaxed space-y-3">
          {report.body.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black text-stone-900 mt-6 mb-2">{line.slice(3)}</h2>;
            if (line.startsWith('- ')) return <li key={i} className="mr-4">{line.slice(2)}</li>;
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return <p key={i}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Users, Package, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Campaign } from '../../types';

interface VolunteerSectionProps {
  campaigns: Campaign[];
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

type VolunteerType = 'physical' | 'inkind';

export function VolunteerSection({ campaigns, onToast }: VolunteerSectionProps) {
  const [type, setType] = useState<VolunteerType>('physical');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError('');
    const fd = new FormData(e.currentTarget);
    try {
      await api.submitVolunteer({
        campaign_id: fd.get('campaign_id') ? Number(fd.get('campaign_id')) : null,
        name: fd.get('name'),
        phone: fd.get('phone'),
        message: fd.get('message'),
        type,
      });
      setDone(true);
      (e.target as HTMLFormElement).reset();
      // Toast با پیام متناسب
      if (type === 'inkind') {
        onToast('درخواست ثبت شد. برای هماهنگی تحویل اقلام با شما تماس گرفته خواهد شد.', 'success');
      } else {
        onToast('اطلاعات داوطلبی شما ثبت شد. در صورت نیاز به کمک حضوری با شما تماس گرفته می‌شود.', 'success');
      }
      setTimeout(() => setDone(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-stone-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#8B7355] pr-6 mb-12">
          <h2 className="text-3xl font-black mb-1">مشارکت غیرمالی</h2>
          <p className="text-stone-400">جهاد فقط با مال نیست — با وقت و توان هم می‌توان سنگر گرفت.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div className="space-y-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#8B7355]/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#D2B48C]" />
                </div>
                <h3 className="font-bold text-lg">اعلام داوطلبی حضوری</h3>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                اطلاعات تماس خود را ثبت کنید. هر زمان نیاز به کمک حضوری باشد — آواربرداری، توزیع بسته، آشپزی و... — پیامک دریافت می‌کنید.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#8B7355]/20 rounded-2xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#D2B48C]" />
                </div>
                <h3 className="font-bold text-lg">اهدای کالا و اقلام</h3>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                مواد غذایی، پوشاک، دارو، مصالح ساختمانی یا هر کالای مورد نیاز. اطلاعات خود را ثبت کنید تا برای هماهنگی تحویل با شما تماس بگیریم.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 rounded-3xl border border-white/10 p-8">
            {done ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#8B7355] mx-auto" />
                <p className="font-bold text-lg">
                  {type === 'inkind' ? 'درخواست اهدای کالا ثبت شد' : 'داوطلبی شما ثبت شد'}
                </p>
                <p className="text-stone-400 text-sm">
                  {type === 'inkind'
                    ? 'برای هماهنگی تحویل اقلام با شما تماس گرفته خواهد شد.'
                    : 'در صورت نیاز به کمک حضوری، پیامک دریافت خواهید کرد.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded-2xl text-red-300 text-sm">{error}</div>}

                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                  <button type="button" onClick={() => setType('physical')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${type === 'physical' ? 'bg-[#8B7355] text-white' : 'text-stone-400 hover:text-white'}`}>
                    <Users className="w-4 h-4" /> داوطلب حضوری
                  </button>
                  <button type="button" onClick={() => setType('inkind')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${type === 'inkind' ? 'bg-[#8B7355] text-white' : 'text-stone-400 hover:text-white'}`}>
                    <Package className="w-4 h-4" /> اهدای کالا
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1.5">نام شما</label>
                    <input required name="name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600"
                      placeholder="نام و نام خانوادگی" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1.5">شماره موبایل</label>
                    <input required name="phone" type="tel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600"
                      placeholder="۰۹۱۲..." dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5">کمپین مرتبط (اختیاری)</label>
                  <select name="campaign_id"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white">
                    <option value="" className="bg-stone-900">— همه کمپین‌ها —</option>
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id} className="bg-stone-900">{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5">
                    {type === 'physical' ? 'توانایی‌ها و زمان‌بندی شما' : 'شرح کالا یا اقلام'}
                  </label>
                  <textarea required name="message" rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600 resize-none"
                    placeholder={type === 'physical'
                      ? 'مثلاً: آخر هفته‌ها آزادم، می‌توانم در آواربرداری یا توزیع بسته کمک کنم.'
                      : 'مثلاً: ۱۰۰ کیلو برنج آماده اهدا دارم.'} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#8B7355] text-white rounded-2xl font-bold hover:bg-[#705D45] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {type === 'physical' ? 'ثبت داوطلبی' : 'ثبت درخواست اهدا'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

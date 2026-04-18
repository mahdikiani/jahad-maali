import { useState } from 'react';
import { Users, Package, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Campaign } from '../../types';
import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';

interface VolunteerSectionProps {
  campaigns: Campaign[];
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

type FormType = 'physical' | 'inkind' | 'support';

export function VolunteerSection({ campaigns, onToast }: VolunteerSectionProps) {
  const { lang } = useLang();
  const [type, setType] = useState<FormType>('physical');
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
        type: type === 'support' ? 'support' : type,
      });
      if (type === 'physical') onToast(t(lang, 'volunteerDonePhysicalDesc'), 'success');
      else if (type === 'inkind') onToast(t(lang, 'volunteerDoneInkindDesc'), 'success');
      else onToast(t(lang, 'volunteerDoneSupportDesc'), 'success');
      setDone(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setDone(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TABS: { key: FormType; label: string; icon: any }[] = [
    { key: 'physical', label: t(lang, 'volunteerPhysical'), icon: Users },
    { key: 'inkind', label: t(lang, 'volunteerInkind'), icon: Package },
    { key: 'support', label: t(lang, 'volunteerSupport'), icon: MessageCircle },
  ];

  const infoCards = [
    { icon: Users, title: t(lang, 'volunteerPhysicalTitle'), desc: t(lang, 'volunteerPhysicalDesc') },
    { icon: Package, title: t(lang, 'volunteerInkindTitle'), desc: t(lang, 'volunteerInkindDesc') },
    { icon: MessageCircle, title: t(lang, 'volunteerSupportTitle'), desc: t(lang, 'volunteerSupportDesc') },
  ];

  return (
    <section className="py-20 bg-stone-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-r-4 border-[#8B7355] pr-6 mb-12">
          <h2 className="text-3xl font-black mb-1">{t(lang, 'volunteerTitle')}</h2>
          <p className="text-stone-400">{t(lang, 'volunteerSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info cards */}
          <div className="space-y-4">
            {infoCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#8B7355]/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#D2B48C]" />
                  </div>
                  <h3 className="font-bold text-lg">{title}</h3>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white/5 rounded-3xl border border-white/10 p-8">
            {done ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#8B7355] mx-auto" />
                <p className="font-bold text-lg">
                  {type === 'inkind' ? t(lang, 'volunteerDoneInkind')
                    : type === 'support' ? t(lang, 'volunteerDoneSupport')
                    : t(lang, 'volunteerDonePhysical')}
                </p>
                <p className="text-stone-400 text-sm">
                  {type === 'inkind' ? t(lang, 'volunteerDoneInkindDesc')
                    : type === 'support' ? t(lang, 'volunteerDoneSupportDesc')
                    : t(lang, 'volunteerDonePhysicalDesc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded-2xl text-red-300 text-sm">{error}</div>}

                <div className="flex gap-1 p-1 bg-white/5 rounded-2xl">
                  {TABS.map(({ key, label, icon: Icon }) => (
                    <button key={key} type="button" onClick={() => setType(key)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${type === key ? 'bg-[#8B7355] text-white' : 'text-stone-400 hover:text-white'}`}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1.5">{t(lang, 'yourName')}</label>
                    <input required name="name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1.5">{t(lang, 'yourPhone')}</label>
                    <input required name="phone" type="tel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600"
                      dir="ltr" />
                  </div>
                </div>

                {type !== 'support' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1.5">{t(lang, 'relatedCampaign')}</label>
                    <select name="campaign_id"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white">
                      <option value="" className="bg-stone-900">{t(lang, 'allCampaigns')}</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id} className="bg-stone-900">{c.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5">
                    {type === 'physical' ? t(lang, 'capabilitiesLabel')
                      : type === 'inkind' ? t(lang, 'goodsLabel')
                      : t(lang, 'messageLabel')}
                  </label>
                  <textarea required name="message" rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm text-white placeholder:text-stone-600 resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#8B7355] text-white rounded-2xl font-bold hover:bg-[#705D45] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {type === 'physical' ? t(lang, 'submitVolunteer')
                    : type === 'inkind' ? t(lang, 'submitInkind')
                    : t(lang, 'submitMessage')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

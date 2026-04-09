import { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { api } from '../../lib/api';
import type { Donation, AuthState } from '../../types';
import { CheckCircle2, Clock, MessageSquare, ThumbsUp, Heart } from 'lucide-react';

interface UserProfileProps {
  auth: AuthState;
  onClose: () => void;
}

type Tab = 'donations' | 'messages';

export function UserProfile({ auth, onClose }: UserProfileProps) {
  const [tab, setTab] = useState<Tab>('donations');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyDonations().then(setDonations).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const total = donations.reduce((s, d) => s + d.amount, 0);
  const withMessages = donations.filter(d => d.message_text);

  return (
    <Modal title="داشبورد من" onClose={onClose} size="md">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5DED0] text-center">
          <Heart className="w-5 h-5 text-[#8B7355] mx-auto mb-1" />
          <p className="text-xl font-black text-stone-900">{donations.length}</p>
          <p className="text-xs text-stone-400 mt-0.5">کمک</p>
        </div>
        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5DED0] text-center">
          <MessageSquare className="w-5 h-5 text-[#8B7355] mx-auto mb-1" />
          <p className="text-xl font-black text-stone-900">{withMessages.length}</p>
          <p className="text-xs text-stone-400 mt-0.5">پیام</p>
        </div>
        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E5DED0] text-center">
          <p className="text-lg font-black text-stone-900">{total.toLocaleString('fa-IR')}</p>
          <p className="text-xs text-stone-400 mt-0.5">تومان</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-2xl mb-5">
        <button onClick={() => setTab('donations')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'donations' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
          سوابق کمک‌ها
        </button>
        <button onClick={() => setTab('messages')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'messages' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
          پیام‌های من
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-stone-400">در حال بارگذاری...</div>
      ) : (
        <>
          {tab === 'donations' && (
            <div className="space-y-3">
              {donations.length === 0 && (
                <p className="text-center py-10 text-stone-400">هنوز کمکی ثبت نشده است.</p>
              )}
              {donations.map(d => (
                <div key={d.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm text-stone-900 flex-1 ml-3">{d.campaign_title}</p>
                    <span className="text-[#8B7355] font-black text-sm shrink-0">{d.amount.toLocaleString('fa-IR')} ت</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400">{new Date(d.created_at).toLocaleDateString('fa-IR')}</span>
                    <span className={`flex items-center gap-1 text-xs font-bold ${d.status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                      {d.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {d.status === 'paid' ? 'موفق' : 'در انتظار'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-3">
              {withMessages.length === 0 && (
                <p className="text-center py-10 text-stone-400">هنوز پیامی ثبت نشده است.</p>
              )}
              {withMessages.map(d => (
                <div key={d.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-xs text-stone-400 mb-2">{d.campaign_title}</p>
                  <p className="text-sm text-stone-700 italic">«{d.message_text}»</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-200">
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <ThumbsUp className="w-3 h-3" />
                      {d.vote_count ?? 0} رأی
                    </span>
                    <span className="text-xs text-stone-400">{new Date(d.created_at).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

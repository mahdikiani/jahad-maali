import { useState, useEffect } from 'react';
import { Plus, X, Check, EyeOff, Loader2, Trash2, Users } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { api } from '../../lib/api';
import type { Campaign, Message } from '../../types';

interface AdminPanelProps {
  onClose: () => void;
  campaigns: Campaign[];
  onRefresh: () => void;
  auth: { isAdmin: boolean; isSuperAdmin: boolean };
}

type Tab = 'campaigns' | 'messages' | 'volunteers' | 'reports' | 'testimonials';

export function AdminPanel({ onClose, campaigns, onRefresh, auth }: AdminPanelProps) {
  if (!auth.isAdmin) return null;
  const [tab, setTab] = useState<Tab>('campaigns');
  const [pendingMsgs, setPendingMsgs] = useState<Message[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'messages') api.getPendingMessages().then(setPendingMsgs).catch(() => {});
    if (tab === 'volunteers') api.getVolunteers().then(setVolunteers).catch(() => {});
  }, [tab]);

  const handleAddCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.createCampaign({
        title: fd.get('title'),
        description: fd.get('description'),
        target_amount: Number(fd.get('target_amount')),
        cover_image: fd.get('cover_image') || null,
        category: fd.get('category'),
        deadline: fd.get('deadline') || null,
      });
      setShowAddCampaign(false);
      onRefresh();
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleModerate = async (id: number, status: 'approved' | 'hidden') => {
    await api.moderateMessage(id, status);
    setPendingMsgs(m => m.filter(x => x.id !== id));
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('آیا مطمئنید؟')) return;
    await api.deleteCampaign(id);
    onRefresh();
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'campaigns', label: 'کمپین‌ها' },
    { key: 'messages', label: `پیام‌ها${pendingMsgs.length ? ` (${pendingMsgs.length})` : ''}` },
    { key: 'volunteers', label: 'داوطلبان' },
    { key: 'reports', label: 'گزارش جدید' },
    { key: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <Modal title="پنل مدیریت" onClose={onClose} size="lg">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-2xl mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-white shadow text-[#1F3D2B]' : 'text-stone-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Campaigns tab */}
      {tab === 'campaigns' && (
        <div className="space-y-3">
          <button onClick={() => setShowAddCampaign(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1F3D2B] text-white rounded-2xl font-bold text-sm hover:bg-[#2d5a3e] transition-all">
            <Plus className="w-4 h-4" /> کمپین جدید
          </button>
          {campaigns.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <p className="font-bold text-sm text-[#1F3D2B]">{c.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {c.current_amount.toLocaleString('fa-IR')} / {c.target_amount.toLocaleString('fa-IR')} تومان
                  <span className={`mr-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}>
                    {c.status === 'active' ? 'فعال' : c.status === 'completed' ? 'تکمیل' : 'متوقف'}
                  </span>
                </p>
              </div>
              <button onClick={() => handleDeleteCampaign(c.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages tab */}
      {tab === 'messages' && (
        <div className="space-y-3">
          {pendingMsgs.length === 0 && <p className="text-center text-stone-400 py-8">پیام در انتظار تأیید وجود ندارد.</p>}
          {pendingMsgs.map(m => (
            <div key={m.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <p className="text-sm text-stone-700 mb-2">«{m.text}»</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400">{(m as any).phone} — {(m as any).amount?.toLocaleString('fa-IR')} تومان</span>
                <div className="flex gap-2">
                  <button onClick={() => handleModerate(m.id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-bold hover:bg-green-200 transition-colors">
                    <Check className="w-3.5 h-3.5" /> تأیید
                  </button>
                  <button onClick={() => handleModerate(m.id, 'hidden')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors">
                    <EyeOff className="w-3.5 h-3.5" /> رد
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteers tab */}
      {tab === 'volunteers' && (
        <div className="space-y-3">
          {volunteers.length === 0 && <p className="text-center text-stone-400 py-8">هنوز داوطلبی ثبت نشده است.</p>}
          {volunteers.map((v: any) => (
            <div key={v.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm text-stone-900">{v.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5" dir="ltr">{v.phone}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  v.type === 'physical' ? 'bg-blue-100 text-blue-700'
                  : v.type === 'inkind' ? 'bg-amber-100 text-amber-700'
                  : 'bg-purple-100 text-purple-700'
                }`}>
                  {v.type === 'physical' ? 'داوطلب حضوری' : v.type === 'inkind' ? 'اهدای کالا' : 'پیام پشتیبانی'}
                </span>
              </div>
              <p className="text-sm text-stone-600 mb-2">«{v.message}»</p>
              {v.campaign_title && <p className="text-xs text-[#8B7355]">کمپین: {v.campaign_title}</p>}
              <p className="text-xs text-stone-400 mt-1">{new Date(v.created_at).toLocaleDateString('fa-IR')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Report tab */}
      {tab === 'reports' && <ReportsAdmin campaigns={campaigns} />}

      {/* Testimonials tab */}
      {tab === 'testimonials' && <TestimonialsAdmin />}

      {/* Add Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#1F3D2B]">کمپین جدید</h3>
              <button onClick={() => setShowAddCampaign(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <Field label="عنوان" name="title" required />
              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1.5">توضیحات (Markdown)</label>
                <textarea name="description" required rows={5}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="هدف مالی (تومان)" name="target_amount" type="number" required />
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1.5">دسته‌بندی</label>
                  <select name="category" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm">
                    <option value="shelter">سرپناه</option>
                    <option value="food">غذا</option>
                    <option value="medical">درمان</option>
                    <option value="education">آموزش</option>
                    <option value="defense">دفاع</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>
              <Field label="آدرس تصویر کاور" name="cover_image" placeholder="https://..." />
              <Field label="ددلاین (اختیاری)" name="deadline" type="date" />
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1F3D2B] text-white rounded-2xl font-bold hover:bg-[#2d5a3e] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                ثبت و انتشار
              </button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Field({ label, name, type = 'text', required = false, placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-stone-400 mb-1.5">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm" />
    </div>
  );
}

function ReportsAdmin({ campaigns }: { campaigns: Campaign[] }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.createImpactReport({
        campaign_id: Number(fd.get('campaign_id')),
        title: fd.get('title'),
        body: fd.get('body'),
        amount_spent: Number(fd.get('amount_spent')) || 0,
        image_url: fd.get('image_url') || null,
        video_url: fd.get('video_url') || null,
      });
      setDone(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setDone(false), 3000);
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="py-10 text-center text-green-600 font-bold">گزارش با موفقیت ثبت شد.</div>
  );

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-stone-400 mb-1.5">کمپین مرتبط</label>
        <select name="campaign_id" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm">
          <option value="">— انتخاب کمپین —</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <Field label="عنوان گزارش" name="title" required />
      <div>
        <label className="block text-xs font-bold text-stone-400 mb-1.5">متن گزارش</label>
        <textarea name="body" required rows={5}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="مبلغ هزینه‌شده (تومان)" name="amount_spent" type="number" />
        <Field label="آدرس تصویر" name="image_url" placeholder="https://..." />
      </div>
      <Field label="آدرس ویدئو (اختیاری)" name="video_url" placeholder="https://..." />
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        ثبت گزارش
      </button>
    </form>
  );
}

function TestimonialsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getTestimonials().then(setItems).catch(() => {}); }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.createTestimonial({ name: fd.get('name'), text: fd.get('text') });
      const updated = await api.getTestimonials();
      setItems(updated);
      (e.target as HTMLFormElement).reset();
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    await api.deleteTestimonial(id);
    setItems(i => i.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="نام" name="name" />
          <div />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-400 mb-1.5">متن</label>
          <textarea name="text" required rows={2}
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="px-4 py-2 bg-[#1F3D2B] text-white rounded-xl text-sm font-bold hover:bg-[#2d5a3e] transition-all flex items-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} افزودن
        </button>
      </form>
      {items.map(t => (
        <div key={t.id} className="flex justify-between items-start p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div>
            <p className="text-sm font-bold text-[#1F3D2B]">{t.name || 'ناشناس'}</p>
            <p className="text-xs text-stone-500 mt-1">«{t.text}»</p>
          </div>
          <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

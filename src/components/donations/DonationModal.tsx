import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Loader2, Phone, KeyRound, MessageSquare } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { api } from '../../lib/api';
import type { Campaign, AuthState } from '../../types';

interface DonationModalProps {
  campaign: Campaign;
  auth: AuthState;
  onClose: () => void;
}

type Step = 'amount' | 'phone' | 'otp' | 'message' | 'paying' | 'success';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export function DonationModal({ campaign, auth, onClose }: DonationModalProps) {
  const [step, setStep] = useState<Step>(auth.user ? 'amount' : 'amount');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(auth.user?.phone || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [donorName, setDonorName] = useState(auth.user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState(auth.user?.phone || '');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return setError('شماره موبایل معتبر وارد کنید');
    setLoading(true); setError('');
    try {
      await api.sendOtp(phone);
      setStep('otp');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return setError('کد ۶ رقمی وارد کنید');
    setLoading(true); setError('');
    try {
      const { token, user } = await api.verifyOtp(phone, otp);
      localStorage.setItem('auth_token', token);
      setVerifiedPhone(user.phone);
      setStep('message');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handlePay = async () => {
    const amt = Number(amount);
    if (!amt || amt < 10000) return setError('حداقل مبلغ ۱۰,۰۰۰ تومان است');
    setLoading(true); setError('');
    try {
      const { payment_url } = await api.initPayment({
        campaign_id: campaign.id,
        amount: amt,
        donor_name: donorName || 'ناشناس',
        phone: verifiedPhone,
        message: message || null,
      });
      window.location.href = payment_url;
    } catch (e: any) { setError(e.message); setLoading(false); }
  };

  const stepTitle: Record<Step, string> = {
    amount: `کمک به: ${campaign.title}`,
    phone: 'تأیید شماره موبایل',
    otp: 'کد تأیید',
    message: 'پیام (اختیاری)',
    paying: 'در حال انتقال...',
    success: 'قبول باشد!',
  };

  return (
    <Modal title={stepTitle[step]} onClose={onClose} size="sm">
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>}

      {/* Step: amount */}
      {step === 'amount' && (
        <div className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className={`py-3 rounded-2xl text-sm font-bold border transition-all ${amount === String(a) ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' : 'bg-[#F5F1E6] text-[#6B5E3B] border-[#6B5E3B]/20 hover:border-[#6B5E3B]'}`}>
                {a.toLocaleString('fa-IR')} تومان
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">یا مبلغ دلخواه (تومان)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="10000"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm"
              placeholder="مثلاً ۲۵۰,۰۰۰" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">نام شما (اختیاری)</label>
            <input value={donorName} onChange={e => setDonorName(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm"
              placeholder="ناشناس" />
          </div>
          <button onClick={() => { if (!Number(amount) || Number(amount) < 10000) return setError('حداقل مبلغ ۱۰,۰۰۰ تومان است'); setError(''); auth.user ? setStep('message') : setStep('phone'); }}
            className="w-full py-3.5 bg-[#1F3D2B] text-white rounded-2xl font-bold hover:bg-[#2d5a3e] transition-all">
            ادامه
          </button>
        </div>
      )}

      {/* Step: phone */}
      {step === 'phone' && (
        <div className="space-y-4 mt-2">
          <div className="p-4 bg-[#F5F1E6] rounded-2xl text-sm text-[#6B5E3B]">
            برای پرداخت، شماره موبایل شما تأیید می‌شود.
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">شماره موبایل</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" />
          </div>
          <button onClick={handleSendOtp} disabled={loading}
            className="w-full py-3.5 bg-[#1F3D2B] text-white rounded-2xl font-bold hover:bg-[#2d5a3e] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
            ارسال کد تأیید
          </button>
          <p className="text-xs text-stone-400 text-center">کد از طریق کاوه‌نگار ارسال می‌شود</p>
        </div>
      )}

      {/* Step: otp */}
      {step === 'otp' && (
        <div className="space-y-4 mt-2">
          <p className="text-sm text-stone-600">کد ۶ رقمی ارسال شده به <span className="font-bold" dir="ltr">{phone}</span> را وارد کنید.</p>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm tracking-widest text-center"
            placeholder="۱۲۳۴۵۶" dir="ltr" />
          <button onClick={handleVerifyOtp} disabled={loading}
            className="w-full py-3.5 bg-[#C2A56B] text-[#1F3D2B] rounded-2xl font-bold hover:bg-[#d4b87a] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            تأیید و ادامه
          </button>
          <button onClick={() => setStep('phone')} className="w-full text-sm text-stone-400 hover:text-stone-600">تغییر شماره</button>
        </div>
      )}

      {/* Step: message */}
      {step === 'message' && (
        <div className="space-y-4 mt-2">
          <div className="p-4 bg-[#F5F1E6] rounded-2xl text-sm text-[#6B5E3B]">
            <span className="font-bold">{Number(amount).toLocaleString('fa-IR')} تومان</span> برای کمپین «{campaign.title}»
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">
              پیام یا نیت خیر <span className="text-stone-300">(اختیاری — حداکثر ۱۴۰ کاراکتر)</span>
            </label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={140} rows={3}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm resize-none"
              placeholder="دعای خیر یا پیامی برای آسیب‌دیدگان..." />
            <p className="text-xs text-stone-400 text-left mt-1">{message.length}/140</p>
          </div>
          <button onClick={handlePay} disabled={loading}
            className="w-full py-3.5 bg-[#C2A56B] text-[#1F3D2B] rounded-2xl font-black hover:bg-[#d4b87a] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-lg">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            پرداخت از طریق زرین‌پال
          </button>
          <p className="text-center text-xs text-stone-400">پرداخت امن — درگاه زرین‌پال</p>
        </div>
      )}

      {/* Step: success */}
      {step === 'success' && (
        <div className="py-10 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-[#1F3D2B] mx-auto" />
          <h3 className="text-2xl font-black text-[#1F3D2B]">انفاق شما ثبت شد</h3>
          <p className="text-stone-500">خداوند از شما به بهترین وجه قبول بفرماید.</p>
        </div>
      )}
    </Modal>
  );
}

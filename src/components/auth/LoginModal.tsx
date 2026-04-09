import { useState } from 'react';
import { Loader2, Phone, KeyRound, Shield } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { api } from '../../lib/api';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (phone: string, code: string) => Promise<void>;
  onAdminLogin: (username: string, password: string) => Promise<void>;
}

type Tab = 'otp' | 'admin';
type OtpStep = 'phone' | 'code';

export function LoginModal({ onClose, onLoginSuccess, onAdminLogin }: LoginModalProps) {
  const [tab, setTab] = useState<Tab>('otp');
  const [otpStep, setOtpStep] = useState<OtpStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.sendOtp(phone);
      setOtpStep('code');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await onLoginSuccess(phone, code);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError('');
    const fd = new FormData(e.currentTarget);
    try {
      await onAdminLogin(fd.get('username') as string, fd.get('password') as string);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="ورود به حساب کاربری" onClose={onClose} size="sm">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-2xl">
        <button onClick={() => setTab('otp')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'otp' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
          <Phone className="w-4 h-4 inline ml-1" />
          ورود با موبایل
        </button>
        <button onClick={() => setTab('admin')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'admin' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}>
          <Shield className="w-4 h-4 inline ml-1" />
          ورود ادمین
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>}

      {tab === 'otp' && (
        <>
          {otpStep === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1.5">شماره موبایل</label>
                <input
                  type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                ارسال کد تأیید
              </button>
              <p className="text-xs text-stone-400 text-center">کد از طریق کاوه‌نگار ارسال می‌شود</p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-stone-600">کد ۶ رقمی ارسال شده به <span className="font-bold" dir="ltr">{phone}</span> را وارد کنید.</p>
              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1.5">کد تأیید</label>
                <input
                  type="text" required value={code} onChange={e => setCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm tracking-widest text-center"
                  placeholder="۱۲۳۴۵۶"
                  dir="ltr"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-[#8B7355] text-white rounded-2xl font-bold hover:bg-[#705D45] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                تأیید و ورود
              </button>
              <button type="button" onClick={() => setOtpStep('phone')} className="w-full text-sm text-stone-400 hover:text-stone-600">
                تغییر شماره
              </button>
            </form>
          )}
        </>
      )}

      {tab === 'admin' && (
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">نام کاربری</label>
            <input name="username" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1.5">رمز عبور</label>
            <input name="password" type="password" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#8B7355] outline-none text-sm" dir="ltr" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            ورود به پنل ادمین
          </button>
        </form>
      )}
    </Modal>
  );
}

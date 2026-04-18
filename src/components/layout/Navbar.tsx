import { Heart, LogOut, User, Shield } from 'lucide-react';
import type { AuthState } from '../../types';
import { LangSwitcher } from '../shared/LangSwitcher';
import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';
import { useSiteConfig } from '../../lib/SiteConfig';

interface NavbarProps {
  auth: AuthState;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export function Navbar({ auth, onLoginClick, onLogout, onAdminClick, onProfileClick, onHomeClick }: NavbarProps) {
  const { lang } = useLang();
  const { siteName } = useSiteConfig();
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5DED0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button onClick={onHomeClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-[#8B7355] rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <span className="text-base font-black text-stone-900 tracking-tight">{siteName}</span>
                <p className="text-[10px] text-stone-400 leading-none">{t(lang, 'siteSubtitle')}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <LangSwitcher />
            {auth.user ? (
              <>
                {auth.isAdmin && (
                  <button onClick={onAdminClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">
                    <Shield className="w-3.5 h-3.5" />
                    {t(lang, 'adminPanel')}
                  </button>
                )}
                <button onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-100 transition-colors border border-stone-200">
                  <User className="w-3.5 h-3.5" />
                  {auth.user.name || auth.user.phone}
                </button>
                <button onClick={onLogout} className="p-2 text-stone-400 hover:text-stone-700 transition-colors" title={t(lang, 'logout')}>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl text-sm font-black hover:bg-stone-800 transition-colors">
                <User className="w-4 h-4" />
                {t(lang, 'login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

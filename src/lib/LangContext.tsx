import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from './i18n';
import { detectLang } from './i18n';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextType>({ lang: 'fa', setLang: () => {}, dir: 'rtl' });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    return saved || detectLang();
  });

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.style.direction = dir;
  }, [lang, dir]);

  return (
    <LangContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

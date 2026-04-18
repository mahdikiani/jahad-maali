import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface SiteConfig {
  siteName: string;
  siteDomain: string;
  showEnamad: boolean;
}

const defaults: SiteConfig = {
  siteName: 'رمیت',
  siteDomain: 'ramayt.ir',
  showEnamad: true,
};

const SiteConfigContext = createContext<SiteConfig>(defaults);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaults);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then((data: SiteConfig) => setConfig(data))
      .catch(() => {
        // keep defaults on error
      });
  }, []);

  useEffect(() => {
    document.title = config.siteName + ' | مرکز امداد و خیریه';
  }, [config.siteName]);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

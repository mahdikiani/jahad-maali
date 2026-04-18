import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LangProvider } from './lib/LangContext';
import { SiteConfigProvider } from './lib/SiteConfig';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteConfigProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </SiteConfigProvider>
  </StrictMode>,
);

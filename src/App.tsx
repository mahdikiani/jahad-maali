import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { Footer } from './components/layout/Footer';
import { MotivationSection } from './components/layout/MotivationSection';
import { FinalCTA } from './components/layout/FinalCTA';
import { CampaignGrid } from './components/campaigns/CampaignGrid';
import { CampaignPage } from './components/campaigns/CampaignPage';
import { AllCampaignsPage } from './components/campaigns/AllCampaignsPage';
import { DonationModal } from './components/donations/DonationModal';
import { MessagesSection } from './components/messages/MessagesSection';
import { ImpactSection } from './components/impact/ImpactSection';
import { TestimonialsSection } from './components/testimonials/TestimonialsSection';
import { LoginModal } from './components/auth/LoginModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { UserProfile } from './components/user/UserProfile';
import { VolunteerSection } from './components/volunteer/VolunteerSection';
import { ToastContainer } from './components/shared/Toast';

import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { api } from './lib/api';
import type { Campaign } from './types';

type Page = 'home' | { type: 'campaign'; id: number } | 'all-campaigns';

export default function App() {
  const { auth, loading: authLoading, loginWithOtp, adminLogin, logout } = useAuth();
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [page, setPage] = useState<Page>('home');

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const campaignsSectionRef = useRef<HTMLDivElement>(null);

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/campaign/')) {
      const id = parseInt(path.replace('/campaign/', ''));
      if (!isNaN(id)) setPage({ type: 'campaign', id });
    } else if (path === '/campaigns') {
      setPage('all-campaigns');
    }

    // Payment result
    const payment = params.get('payment');
    if (payment === 'success') {
      const ref = params.get('ref');
      showToast(`پرداخت موفق بود${ref ? ` — کد پیگیری: ${ref}` : ''}. خداوند قبول بفرماید.`, 'success');
      window.history.replaceState({}, '', '/');
    } else if (payment === 'failed' || payment === 'error') {
      showToast('پرداخت ناموفق بود یا لغو شد.', 'error');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const navigate = (p: Page) => {
    setPage(p);
    if (p === 'home') window.history.pushState({}, '', '/');
    else if (p === 'all-campaigns') window.history.pushState({}, '', '/campaigns');
    else if (typeof p === 'object') window.history.pushState({}, '', `/campaign/${p.id}`);
    window.scrollTo(0, 0);
  };

  const fetchCampaigns = () => {
    api.getCampaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setCampaignsLoading(false));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const scrollToCampaigns = () => {
    campaignsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLogin = () => setShowLogin(true);

  const handleAdminLogin = async (u: string, p: string) => {
    await adminLogin(u, p);
    setShowLogin(false);
    // auto-open admin panel after login
    setTimeout(() => setShowAdmin(true), 100);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
      </div>
    );
  }

  const navbar = (
    <Navbar
      auth={auth}
      onLoginClick={openLogin}
      onLogout={logout}
      onAdminClick={() => setShowAdmin(true)}
      onProfileClick={() => setShowProfile(true)}
      onHomeClick={() => navigate('home')}
    />
  );

  const modals = (
    <AnimatePresence>
      {selectedCampaign && (
        <DonationModal key="donation" campaign={selectedCampaign} auth={auth}
          onClose={() => { setSelectedCampaign(null); fetchCampaigns(); }} />
      )}
      {showLogin && (
        <LoginModal key="login" onClose={() => setShowLogin(false)}
          onLoginSuccess={async (phone, code) => { await loginWithOtp(phone, code); setShowLogin(false); }}
          onAdminLogin={handleAdminLogin} />
      )}
      {showAdmin && (
        <AdminPanel key="admin" onClose={() => setShowAdmin(false)}
          campaigns={campaigns} onRefresh={fetchCampaigns} auth={auth} />
      )}
      {showProfile && auth.user && (
        <UserProfile key="profile" auth={auth} onClose={() => setShowProfile(false)} />
      )}
    </AnimatePresence>
  );

  // ── Campaign detail page ──
  if (typeof page === 'object' && page.type === 'campaign') {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        {navbar}
        <CampaignPage campaignId={page.id} onBack={() => navigate('home')}
          onDonate={setSelectedCampaign} />
        {modals}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // ── All campaigns page ──
  if (page === 'all-campaigns') {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        {navbar}
        <AllCampaignsPage campaigns={campaigns} loading={campaignsLoading}
          onDonate={setSelectedCampaign} onOpen={(c) => navigate({ type: 'campaign', id: c.id })}
          onBack={() => navigate('home')} isAdmin={auth.isAdmin} onAdd={() => setShowAdmin(true)} />
        <Footer />
        {modals}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // ── Home page ──
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900">
      {navbar}
      <Hero onScrollDown={scrollToCampaigns} />

      <div ref={campaignsSectionRef}>
        {campaignsLoading ? (
          <div className="py-20 flex justify-center bg-[#FDFBF7]">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
          </div>
        ) : (
          <CampaignGrid campaigns={campaigns} isAdmin={auth.isAdmin}
            onDonate={setSelectedCampaign} onAdd={() => setShowAdmin(true)}
            onOpenCampaign={(c) => navigate({ type: 'campaign', id: c.id })}
            onViewAll={() => navigate('all-campaigns')} />
        )}
      </div>

      <ImpactSection />
      <MessagesSection auth={auth} onLoginRequired={openLogin} />
      <TestimonialsSection />
      <VolunteerSection campaigns={campaigns} onToast={showToast} />
      <FinalCTA campaigns={campaigns} onDonate={setSelectedCampaign} />
      <MotivationSection />
      <Footer />

      {modals}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

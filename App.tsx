import React, { useState, useEffect } from 'react';
import type { Page } from './types';
import FloatingNav from './components/FloatingNav';
import HomePage from './components/HomePage';
import ClipsPage from './components/ClipsPage';
import InspirationPage from './components/InspirationPage';
import ExplorePage from './components/ExplorePage';
import CreatePage from './components/CreatePage';
import ProfilePage from './components/ProfilePage';
import BattlePage from './components/BattlePage';
import SiloAiPage from './components/SiloAiPage';
import MobileNav from './components/MobileNav';
import AuthModal from './components/AuthModal';
import ProfileOnboarding from './components/ProfileOnboarding';
import { useAuth } from './contexts/AuthContext';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const isMobile = useIsMobile();
  const { session, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [session, loading]);

  const needsOnboarding = session && profile && !profile.username;

  const renderContent = () => {
    if (needsOnboarding) {
        return <ProfileOnboarding />;
    }
    
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'clips':
        return <ClipsPage />;
      case 'battle':
        return <BattlePage />;
      case 'silo-ai':
        return <SiloAiPage />;
      case 'inspiration':
        return <InspirationPage />;
      case 'explore':
        return <ExplorePage />;
      case 'create':
        return <CreatePage setActivePage={setActivePage} />;
      case 'profile':
        // If logged in but needs onboarding, redirect from profile to onboarding
        if (session && !profile?.username) {
            return <ProfileOnboarding />;
        }
        // If not logged in and tries to access profile, show auth modal
        if (!session) {
           return <div className="text-center py-20">Please sign in to view your profile.</div>
        }
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  
  const handleAuthAction = () => {
      setShowAuthModal(true);
      // In case they click sign in/up from a guest session
  };

  const mainPadding = isMobile 
    ? "px-4 pt-8 pb-32"
    : "pl-32 pr-8 pt-12 pb-8";
    
  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <img src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" alt="SiloSphere Logo" className="w-24 h-24 animate-pulse" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {showAuthModal && !needsOnboarding && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {isMobile ? (
        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      ) : (
        <FloatingNav activePage={activePage} setActivePage={setActivePage} />
      )}
      <main className={mainPadding}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const App: React.FC = () => {
    const { session, profile, loading } = useAuth();
    const [activePage, setActivePage] = useState<Page>('home');
    const isMobile = useIsMobile();
  
    // Determine the application's state based on auth context
    const needsAuth = !loading && !session;
    const needsOnboarding = !loading && session && (!profile?.username || !profile?.name);
    const isAppReady = !loading && session && !needsOnboarding;

    const renderPage = () => {
      switch (activePage) {
        case 'home': return <HomePage />;
        case 'clips': return <ClipsPage />;
        case 'inspiration': return <InspirationPage />;
        case 'explore': return <ExplorePage />;
        case 'create': return <CreatePage setActivePage={setActivePage} />;
        case 'profile': return <ProfilePage />;
        case 'battle': return <BattlePage />;
        case 'silo-ai': return <SiloAiPage />;
        default: return <HomePage />;
      }
    };

    // Render based on the state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <img 
                    src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" 
                    alt="SiloSphere Logo" 
                    className="w-24 h-24 animate-pulse" 
                />
            </div>
        );
    }

    if (needsAuth) {
        // AuthModal controls the entire auth flow until the user is signed in.
        // It's not meant to be closed manually via a prop.
        return <AuthModal onClose={() => {}} />;
    }

    if (needsOnboarding) {
        return <ProfileOnboarding />;
    }
  
    if (isAppReady) {
        return (
            <>
                {isMobile ? (
                    <MobileNav activePage={activePage} setActivePage={setActivePage} />
                ) : (
                    <FloatingNav activePage={activePage} setActivePage={setActivePage} />
                )}
                <main className={`transition-all duration-300 ${isMobile ? 'px-4 pt-6 pb-28' : 'pl-32 pr-8 py-8'}`}>
                    {renderPage()}
                </main>
            </>
        );
    }

    // Fallback case, though it should ideally not be reached
    return null;
};

export default App;

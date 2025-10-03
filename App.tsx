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

  const renderContent = () => {
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
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  const mainPadding = isMobile 
    ? "px-4 pt-8 pb-32"
    : "pl-32 pr-8 pt-12 pb-8";

  return (
    <div className="min-h-screen bg-black text-white font-sans">
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
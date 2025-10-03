import React, { useState } from 'react';
import type { Page } from './types';
import FloatingNav from './components/FloatingNav';
import HomePage from './components/HomePage';
import ClipsPage from './components/ClipsPage';
import InspirationPage from './components/InspirationPage';
import ExplorePage from './components/ExplorePage';
import CreatePage from './components/CreatePage';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'clips':
        return <ClipsPage />;
      case 'inspiration':
        return <InspirationPage />;
      case 'explore':
        return <ExplorePage />;
      case 'create':
        return <CreatePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <FloatingNav activePage={activePage} setActivePage={setActivePage} />
      <main className="pl-24 pr-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

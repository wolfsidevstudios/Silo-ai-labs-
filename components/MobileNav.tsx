
import React from 'react';
import type { Page, NavItem } from '../types';
import { MOBILE_NAVIGATION_ITEMS } from '../constants';
import { CreateIcon } from '../constants';

interface MobileNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const MobileNavItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full focus:outline-none" aria-label={item.label}>
    <item.icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400'}`} />
    <span className={`text-xs font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400'}`}>{item.label}</span>
  </button>
);


const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const navItems = MOBILE_NAVIGATION_ITEMS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-transparent z-50" aria-label="Main mobile navigation">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => setActivePage('create')}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 transform transition-all duration-300 ease-in-out focus:outline-none ${activePage === 'create' ? 'bg-white text-black scale-110' : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:scale-110'}`}
          aria-label="Create content"
        >
          <CreateIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl">
        <div className="flex justify-around items-center h-full px-2">
          <div className="flex-1 flex justify-around">
            <MobileNavItem item={navItems[0]} isActive={activePage === navItems[0].id} onClick={() => setActivePage(navItems[0].id)} />
            <MobileNavItem item={navItems[1]} isActive={activePage === navItems[1].id} onClick={() => setActivePage(navItems[1].id)} />
          </div>
          <div className="w-20" aria-hidden="true"></div>
          <div className="flex-1 flex justify-around">
            <MobileNavItem item={navItems[2]} isActive={activePage === navItems[2].id} onClick={() => setActivePage(navItems[2].id)} />
            <MobileNavItem item={navItems[3]} isActive={activePage === navItems[3].id} onClick={() => setActivePage(navItems[3].id)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;

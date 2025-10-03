
import React from 'react';
import type { Page } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface FloatingNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center gap-4 p-2 bg-black/30 backdrop-blur-lg border border-white/20 rounded-full">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 ${
                isActive ? 'bg-white' : 'bg-transparent hover:bg-white/10'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className={`w-6 h-6 transition-colors duration-300 ${
                isActive ? 'text-black' : 'text-white'
              }`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FloatingNav;

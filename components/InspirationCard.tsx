
import React from 'react';
import type { Inspiration } from '../types';

interface InspirationCardProps {
  inspiration: Inspiration;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ inspiration }) => {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden group border border-white/10">
      <img
        src={inspiration.imageUrl}
        alt={inspiration.title}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h3 className="text-4xl font-bold tracking-tight">{inspiration.title}</h3>
        <p className="text-gray-300 mt-2 max-w-xl">{inspiration.description}</p>
      </div>
    </div>
  );
};

export default InspirationCard;

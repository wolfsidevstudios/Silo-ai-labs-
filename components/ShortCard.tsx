import React from 'react';
import type { Video } from '../types';

interface ShortCardProps {
  video: Video;
}

const ShortCard: React.FC<ShortCardProps> = ({ video }) => {
  return (
    <div className="flex-shrink-0 w-48 group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-white/50 transition-all duration-300">
      <img
        src={video.imageUrl}
        alt={video.title}
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h4 className="font-bold text-lg leading-tight">{video.title}</h4>
        <p className="text-sm text-gray-300">{video.creator}</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white/80">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
      </div>
       <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {video.duration}
        </span>
    </div>
  );
};

export default ShortCard;

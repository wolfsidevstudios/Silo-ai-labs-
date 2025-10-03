import React from 'react';
import type { Video } from '../types';
import FollowButton from './FollowButton';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex-shrink-0 w-80 group">
      <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all duration-300">
        <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {video.duration}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white/80">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-lg font-semibold text-gray-100 truncate group-hover:text-white transition-colors">{video.title}</h4>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{video.creator}</p>
            <FollowButton targetUserId={video.creatorId} />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
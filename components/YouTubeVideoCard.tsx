import React from 'react';
import type { Post } from '../types';
import FollowButton from './FollowButton';

interface YouTubeVideoCardProps {
  video: Post;
}

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ video }) => {
  return (
    <div className="flex-shrink-0 w-80 group">
      <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-white/50 transition-all duration-300 bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
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

export default YouTubeVideoCard;
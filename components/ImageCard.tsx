import React from 'react';
import type { Post } from '../types';
import FollowButton from './FollowButton';

interface ImageCardProps {
  post: Post;
}

const ImageCard: React.FC<ImageCardProps> = ({ post }) => {
  return (
    <div className="flex-shrink-0 w-80 group">
      <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all duration-300">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="mt-3">
        <h4 className="text-lg font-semibold text-gray-100 truncate group-hover:text-white transition-colors">{post.title}</h4>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{post.creator}</p>
            <FollowButton targetUserId={post.creatorId} />
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

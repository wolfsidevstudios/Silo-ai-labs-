import React from 'react';
import type { Post } from '../types';
import FollowButton from './FollowButton';

const ActionButton: React.FC<{ icon: React.ReactNode; value: string, label: string }> = ({ icon, value, label }) => (
    <button className="flex flex-col items-center gap-1 group" aria-label={label}>
        <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full group-hover:bg-white/20 transition-colors">
            {icon}
        </div>
        <span className="text-xs font-semibold text-gray-200">{value}</span>
    </button>
);

interface ImageClipCardProps {
    post: Post;
}

const ImageClipCard: React.FC<ImageClipCardProps> = ({ post }) => {
    // These values are placeholders as posts don't have like counts etc yet.
    const likes = "0";
    const comments = "0";
    const shares = "0";

    return (
        <div className="h-full w-full snap-start relative flex-shrink-0">
            <img src={post.imageUrl} alt={post.description || post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                    {/* Placeholder for creator avatar, to be implemented later */}
                    <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white/80"></div>
                    <h3 className="font-bold">{post.creator}</h3>
                    <FollowButton targetUserId={post.creatorId} />
                </div>
                <p className="text-sm text-gray-200">{post.description}</p>
            </div>
            
            <div className="absolute bottom-4 right-2 flex flex-col gap-4 text-white">
                <ActionButton
                    label="Like"
                    value={likes}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                />
                <ActionButton
                    label="Comment"
                    value={comments}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                />
                <ActionButton
                    label="Share"
                    value={shares}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.862 12.938 9 12.482 9 12s-.138-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>}
                />
            </div>
        </div>
    );
};

export default ImageClipCard;

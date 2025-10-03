import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FollowButtonProps {
    targetUserId?: string;
    className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, className = '' }) => {
    const { session } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const currentUserId = session?.user?.id;

    useEffect(() => {
        if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
            setIsLoading(false);
            return;
        };

        const checkFollowStatus = async () => {
            setIsLoading(true);
            const { count, error } = await supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('followerId', currentUserId)
                .eq('followingId', targetUserId);
            
            if (!error) {
                setIsFollowing(!!count && count > 0);
            }
            setIsLoading(false);
        };
        checkFollowStatus();
    }, [currentUserId, targetUserId]);

    const handleFollowToggle = async () => {
        if (!currentUserId || !targetUserId) return;
        
        const rpcName = isFollowing ? 'unfollow_user' : 'follow_user';
        const { error } = await supabase.rpc(rpcName, {
            follower_id: currentUserId,
            following_id: targetUserId
        });

        if (!error) {
            setIsFollowing(!isFollowing);
        } else {
            console.error(`Error ${rpcName}:`, error);
            alert('Something went wrong. Please try again.');
        }
    };
    
    if (isLoading || !currentUserId || !targetUserId || currentUserId === targetUserId) {
        return null;
    }

    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none";
    const followClasses = "bg-white text-black hover:bg-gray-200";
    const followingClasses = "bg-white/10 text-white hover:bg-white/20";
    const buttonClass = `${baseClasses} ${isFollowing ? followingClasses : followClasses} ${className}`;

    return (
        <button onClick={handleFollowToggle} className={buttonClass}>
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
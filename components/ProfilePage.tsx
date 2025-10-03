import React, { useState, useEffect } from 'react';
import { USER_CREATIONS } from '../constants';
import type { Creation, UserProfile } from '../types';
import ProfileOnboarding from './ProfileOnboarding';
import { supabase } from '../lib/supabase';

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? formatNumber(value) : value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const CreationGridItem: React.FC<{ item: Creation }> = ({ item }) => (
    <div className="relative aspect-square group overflow-hidden rounded-lg">
        <img src={item.imageUrl} alt="User creation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {item.type === 'video' && (
            <div className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                </svg>
            </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        </div>
    </div>
);

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activeTab, setActiveTab] = useState('Creations');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const tabs = ['Creations', 'Clips', 'Liked'];

    useEffect(() => {
        const id = localStorage.getItem('siloSphereUserProfileId');
        if (id) {
            setCurrentUserId(parseInt(id, 10));
        }

        const onboardingComplete = localStorage.getItem('siloSphereOnboardingComplete') === 'true';
        if (onboardingComplete) {
            const fetchProfile = async () => {
                const profileId = localStorage.getItem('siloSphereUserProfileId');
                if (profileId) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', parseInt(profileId, 10))
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error);
                        localStorage.removeItem('siloSphereOnboardingComplete');
                        localStorage.removeItem('siloSphereUserProfileId');
                        setShowOnboarding(true);
                    } else {
                        setProfile(data);
                    }
                } else {
                    setShowOnboarding(true);
                }
            };
            fetchProfile();
        } else {
            setShowOnboarding(true);
        }
    }, []);
    
    useEffect(() => {
        if (!currentUserId || !profile || !profile.id || currentUserId === profile.id) {
            return;
        }

        const checkFollowStatus = async () => {
             const { count } = await supabase
                .from('followers')
                .select('*', { count: 'exact', head: true })
                .eq('followerId', currentUserId)
                .eq('followingId', profile.id);
            setIsFollowing(!!count && count > 0);
        };
        checkFollowStatus();
    }, [currentUserId, profile]);

    const handleOnboardingComplete = (newProfile: UserProfile) => {
        if (newProfile.id) {
            localStorage.setItem('siloSphereUserProfileId', newProfile.id.toString());
            setCurrentUserId(newProfile.id);
        }
        localStorage.setItem('siloSphereOnboardingComplete', 'true');
        setProfile(newProfile);
        setShowOnboarding(false);
    };

    const handleFollowToggle = async () => {
        if (!currentUserId || !profile || !profile.id) return;

        const rpcName = isFollowing ? 'unfollow_user' : 'follow_user';
        const { error } = await supabase.rpc(rpcName, {
            follower_id: currentUserId,
            following_id: profile.id
        });

        if (!error) {
            setIsFollowing(!isFollowing);
            setProfile(p => {
                if (!p) return null;
                const newFollowerCount = p.stats.followers + (isFollowing ? -1 : 1);
                return {...p, stats: {...p.stats, followers: newFollowerCount }};
            });
        } else {
            console.error(`Error with ${rpcName}: `, error);
            alert('An error occurred. Please try again.');
        }
    };

    if (showOnboarding) {
        return <ProfileOnboarding onComplete={handleOnboardingComplete} />;
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <div className="text-gray-400">Loading Profile...</div>
            </div>
        );
    }
    
    const isOwnProfile = currentUserId === profile.id;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <img src={profile.avatar} alt={profile.name} className="w-36 h-36 rounded-full border-4 border-white/20 object-cover" />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <h1 className="text-3xl font-bold">{profile.username}</h1>
                        {isOwnProfile ? (
                            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-semibold">Edit Profile</button>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${isFollowing ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:bg-gray-200'}`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                     <div className="flex justify-center md:justify-start gap-8 mb-4">
                        <Stat value={profile.stats.posts} label="posts" />
                        <Stat value={profile.stats.followers} label="followers" />
                        <Stat value={profile.stats.following} label="following" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white">{profile.name}</h2>
                        <p className="text-gray-400 whitespace-pre-line">{profile.bio}</p>
                    </div>
                </div>
            </header>

            <div className="border-b border-white/20 mb-8">
                <div className="flex justify-center gap-12">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-lg font-semibold transition-colors ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {activeTab === 'Creations' && (
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                        {USER_CREATIONS.map(item => (
                            <CreationGridItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
                {activeTab !== 'Creations' && (
                     <div className="text-center py-16 text-gray-500">
                        <h3 className="text-2xl font-bold">Content Coming Soon</h3>
                        <p>This user's {activeTab.toLowerCase()} will appear here.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
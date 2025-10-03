import React, { useState, useEffect } from 'react';
import type { Post, UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from './SettingsModal';

const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? formatNumber(value) : value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const CreationGridItem: React.FC<{ item: Post }> = ({ item }) => (
    <div className="relative aspect-square group overflow-hidden rounded-lg">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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

const GearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39.44 1.022.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.108 1.204l.527.738c.32.427.27 1.06-.12 1.45l-.773.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205.108l-.737.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const { profile: ownProfile, session } = useAuth();
    const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
    const [creations, setCreations] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState('Creations');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const tabs = ['Creations', 'Clips', 'Liked'];

    useEffect(() => {
        if(ownProfile) {
            setViewedProfile(ownProfile);
            fetchCreations(ownProfile.id);
        }
        setIsLoading(false);
    }, [ownProfile]);

    const fetchCreations = async (profileId?: string) => {
        if (!profileId) return;
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('profileId', profileId)
            .order('createdAt', { ascending: false });
        if (error) console.error("Error fetching creations", error);
        else setCreations(data as Post[]);
    };

    useEffect(() => {
        if (!session?.user?.id || !viewedProfile?.id || session.user.id === viewedProfile.id) return;
        const checkFollowStatus = async () => {
             const { count } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('followerId', session.user.id).eq('followingId', viewedProfile.id);
            setIsFollowing(!!count && count > 0);
        };
        checkFollowStatus();
    }, [session, viewedProfile]);

    const handleFollowToggle = async () => {
        if (!session?.user?.id || !viewedProfile?.id) return;
        const rpcName = isFollowing ? 'unfollow_user' : 'follow_user';
        const { error } = await supabase.rpc(rpcName, { follower_id: session.user.id, following_id: viewedProfile.id });

        if (!error) {
            setIsFollowing(!isFollowing);
            setViewedProfile(p => {
                if (!p || !p.stats) return null;
                const newFollowerCount = p.stats.followers + (isFollowing ? -1 : 1);
                return {...p, stats: {...p.stats, followers: newFollowerCount }};
            });
        } else {
            console.error(`Error with ${rpcName}: `, error);
            alert('An error occurred. Please try again.');
        }
    };
    
    if (isLoading) return <div className="flex items-center justify-center h-[calc(100vh-10rem)]"><div className="text-gray-400">Loading Profile...</div></div>
    if (!viewedProfile) return <div className="flex items-center justify-center h-[calc(100vh-10rem)]"><div className="text-gray-400">Could not load profile.</div></div>
    
    const isOwnProfile = session?.user?.id === viewedProfile.id;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
             {isSettingsOpen && viewedProfile && <SettingsModal profile={viewedProfile} onClose={() => setIsSettingsOpen(false)} />}
            <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <img src={viewedProfile.avatar} alt={viewedProfile.name} className="w-36 h-36 rounded-full border-4 border-white/20 object-cover" />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <h1 className="text-3xl font-bold">@{viewedProfile.username}</h1>
                        {isOwnProfile ? (
                            <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-semibold"><GearIcon />Settings</button>
                        ) : (
                            <button onClick={handleFollowToggle} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${isFollowing ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:bg-gray-200'}`}>{isFollowing ? 'Following' : 'Follow'}</button>
                        )}
                    </div>
                     <div className="flex justify-center md:justify-start gap-8 mb-4">
                        <Stat value={viewedProfile.stats?.posts ?? 0} label="posts" />
                        <Stat value={viewedProfile.stats?.followers ?? 0} label="followers" />
                        <Stat value={viewedProfile.stats?.following ?? 0} label="following" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white">{viewedProfile.name}</h2>
                        <p className="text-gray-400 whitespace-pre-line">{viewedProfile.bio}</p>
                    </div>
                </div>
            </header>

            <div className="border-b border-white/20 mb-8">
                <div className="flex justify-center gap-12">
                    {tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-lg font-semibold transition-colors ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>))}
                </div>
            </div>

            <div>
                {activeTab === 'Creations' && (
                    creations.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1 md:gap-4">
                            {creations.map(item => (<CreationGridItem key={item.id} item={item} />))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <h3 className="text-2xl font-bold">No Creations Yet</h3>
                            <p>This user hasn't posted anything.</p>
                        </div>
                    )
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
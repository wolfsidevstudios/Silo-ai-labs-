import React, { useState, useEffect } from 'react';
import { USER_PROFILE_DATA, USER_CREATIONS } from '../constants';
import type { Creation, UserProfile } from '../types';
import ProfileOnboarding from './ProfileOnboarding';

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-white">{value}</p>
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
    const tabs = ['Creations', 'Clips', 'Liked'];

    useEffect(() => {
        const onboardingComplete = localStorage.getItem('siloSphereOnboardingComplete') === 'true';
        if (onboardingComplete) {
            const savedProfile = localStorage.getItem('siloSphereUserProfile');
            setProfile(savedProfile ? JSON.parse(savedProfile) : USER_PROFILE_DATA); // Fallback to default
        } else {
            setShowOnboarding(true);
        }
    }, []);

    const handleOnboardingComplete = (newProfile: UserProfile) => {
        localStorage.setItem('siloSphereUserProfile', JSON.stringify(newProfile));
        localStorage.setItem('siloSphereOnboardingComplete', 'true');
        setProfile(newProfile);
        setShowOnboarding(false);
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

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <img src={profile.avatar} alt={profile.name} className="w-36 h-36 rounded-full border-4 border-white/20 object-cover" />
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <h1 className="text-3xl font-bold">{profile.username}</h1>
                        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-semibold">Edit Profile</button>
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
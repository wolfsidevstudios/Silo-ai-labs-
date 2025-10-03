import React, { useState } from 'react';
import { ONBOARDING_AVATARS } from '../constants';
import type { UserProfile } from '../types';

interface ProfileOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const APP_ICON_URL = 'https://i.ibb.co/QZ0zRxp/IMG-3953.png';

const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'details' | 'avatar' | 'preview'>('details');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('Welcome to my SiloSphere!');

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      name: name,
      username: `@${username}`,
      avatar: avatar,
      bio: bio,
      stats: { posts: 0, followers: '0', following: '0' },
    };
    onComplete(finalProfile);
  };

  const handleSkipAvatar = () => {
    setAvatar(APP_ICON_URL);
    setStep('preview');
  };

  const renderStep = () => {
    switch (step) {
      case 'details':
        return (
          <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
            <h1 className="text-4xl font-bold">Create Your Profile</h1>
            <p className="text-gray-400">First, let's get your name and a unique username.</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Profile Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-full p-4 pl-8 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg"
                />
              </div>
            </div>
            <button
              onClick={() => setStep('avatar')}
              disabled={!name || !username}
              className="w-full px-8 py-4 rounded-full font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </div>
        );
      
      case 'avatar':
        return (
             <div className="w-full max-w-2xl space-y-6 text-center animate-fade-in">
                <h1 className="text-4xl font-bold">Choose Your Avatar</h1>
                <p className="text-gray-400">Custom avatars coming soon! For now, pick one of our AI-generated options.</p>
                <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
                    {ONBOARDING_AVATARS.map(src => (
                        <button key={src} onClick={() => setAvatar(src)} className="flex-shrink-0 focus:outline-none">
                            <img 
                                src={src}
                                alt="AI Avatar"
                                className={`w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 transition-all duration-300 ${avatar === src ? 'border-purple-500 scale-105' : 'border-white/20 hover:border-white/50'}`}
                            />
                        </button>
                    ))}
                </div>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={handleSkipAvatar}
                      className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      Skip For Now
                    </button>
                    <button
                      onClick={() => setStep('preview')}
                      disabled={!avatar}
                      className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      Next
                    </button>
                </div>
            </div>
        );

      case 'preview':
        return (
          <div className="w-full max-w-xl space-y-6 text-center animate-fade-in">
             <h1 className="text-4xl font-bold">Your New Profile</h1>
             <p className="text-gray-400">Here's a preview. Feel free to make any final changes.</p>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                <div className="flex flex-col items-center gap-4">
                    <img src={avatar} alt="Selected Avatar" className="w-24 h-24 rounded-full border-2 border-white/20 object-cover" />
                    <div className="w-full">
                         <input
                            type="text"
                            value={`@${username}`}
                            onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                            className="w-full p-2 bg-transparent border-none rounded-lg focus:outline-none focus:bg-white/10 text-center text-2xl font-bold"
                          />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-1 bg-transparent border-none rounded-lg focus:outline-none focus:bg-white/10 text-center text-lg text-gray-300"
                        />
                    </div>
                </div>
                 <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-300 text-center resize-none"
                />
             </div>
             <button
              onClick={handleFinish}
              className="w-full px-8 py-4 rounded-full font-semibold bg-white text-black hover:opacity-90 transition-opacity"
            >
              Start Using SiloSphere
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default ProfileOnboarding;

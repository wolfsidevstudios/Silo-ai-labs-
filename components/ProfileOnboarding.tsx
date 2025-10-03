import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const APP_ICON_URL = 'https://i.ibb.co/QZ0zRxp/IMG-3953.png';

const ProfileOnboarding: React.FC = () => {
  const { session, refreshProfile } = useAuth();
  const [step, setStep] = useState<'details' | 'avatar' | 'preview'>('details');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('Welcome to my SiloSphere!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (!session?.user) {
      alert("Authentication error. Please sign in again.");
      return;
    }
    if (!name.trim() || !username.trim()) {
      alert("Please make sure your name and username are filled out.");
      return;
    }

    setIsSubmitting(true);
    
    const profileToUpdate = {
      name,
      username: username,
      avatar,
      bio,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileToUpdate)
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }
      
      await refreshProfile();
      // No need to set isSubmitting to false on success, as the component will unmount.
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error?.code === '23505') {
          alert('This username is already taken. Please choose another one.');
      } else {
          alert('Could not update your profile. Please try again.');
      }
      setIsSubmitting(false);
    }
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
              disabled={!name.trim() || !username.trim()}
              className="w-full px-8 py-4 rounded-full font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
        );
      
      case 'avatar':
        return (
             <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
                <h1 className="text-4xl font-bold">Set Your Avatar</h1>
                <p className="text-gray-400">You can upload a custom avatar from your profile page later.</p>
                <div className="flex justify-center items-center h-40">
                    <img src={APP_ICON_URL} alt="Default Avatar" className="w-32 h-32 rounded-full border-4 border-white/20" />
                </div>
                <p className="text-sm text-gray-500">For now, you'll have our default avatar.</p>
                <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                          setAvatar(APP_ICON_URL);
                          setStep('preview');
                      }}
                      className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
                    >
                      Continue
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
              disabled={isSubmitting || !name.trim() || !username.trim()}
              className="w-full px-8 py-4 rounded-full font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
            >
              {isSubmitting ? 'Saving...' : 'Start Using SiloSphere'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-40 flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default ProfileOnboarding;
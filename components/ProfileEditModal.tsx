import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';

interface ProfileEditModalProps {
  profile: UserProfile;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ profile, onClose }) => {
  const { refreshProfile } = useAuth();
  const [name, setName] = useState(profile.name || '');
  const [username, setUsername] = useState(profile.username?.replace('@', '') || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name || !username) {
        setError("Name and username are required.");
        return;
    }
    setLoading(true);
    setError(null);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name,
        username: `@${username.replace(/[^a-zA-Z0-9_]/g, '')}`,
        bio,
        avatar
      })
      .eq('id', profile.id);

    if (updateError) {
      setError("Failed to update profile. The username might be taken.");
      console.error(updateError);
    } else {
      await refreshProfile();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-black/50 border border-white/20 rounded-2xl shadow-2xl p-8 relative space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-3xl font-bold text-white text-center">Edit Your Profile</h2>
        
        <div className="flex items-center gap-4">
            <img src={avatar || 'https://i.ibb.co/QZ0zRxp/IMG-3953.png'} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white/20 object-cover" />
            <div className="flex-grow">
                 <label htmlFor="avatar-url" className="block text-sm font-semibold mb-1 text-gray-300">Avatar URL</label>
                 <input
                    id="avatar-url"
                    type="text"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
            </div>
        </div>

        <div>
            <label htmlFor="profile-name" className="block text-sm font-semibold mb-1 text-gray-300">Name</label>
            <input
              id="profile-name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
        </div>

        <div>
            <label htmlFor="profile-username" className="block text-sm font-semibold mb-1 text-gray-300">Username</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input
                    id="profile-username"
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    className="w-full p-3 pl-7 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
            </div>
        </div>
        
        <div>
            <label htmlFor="profile-bio" className="block text-sm font-semibold mb-1 text-gray-300">Bio</label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-6 py-2 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Cancel
            </button>
             <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;

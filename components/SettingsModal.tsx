import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { useApiKey } from '../contexts/ApiKeyContext';

// Icons
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>;

interface SettingsModalProps {
  profile: UserProfile;
  onClose: () => void;
}

type SettingsTab = 'Account' | 'Notifications' | 'Privacy' | 'Integrations';

const SettingsModal: React.FC<SettingsModalProps> = ({ profile, onClose }) => {
  const { refreshProfile, signOut } = useAuth();
  const { apiKey, setApiKey } = useApiKey();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Account');

  // State for Account details
  const [name, setName] = useState(profile.name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for API Key
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');

  // State for Notifications (placeholders)
  const [emailNotifications, setEmailNotifications] = useState({ followers: true, comments: true, likes: false });
  const [pushNotifications, setPushNotifications] = useState({ updates: true, battles: true });
  
  // State for Privacy (placeholders)
  const [isPrivate, setIsPrivate] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  const handleSave = async () => {
    if (!name || !username) {
      setError("Name and username are required.");
      return;
    }
    setLoading(true);
    setError(null);
    
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name, username: sanitizedUsername, bio, avatar })
      .eq('id', profile.id);

    if (updateError) {
      setError(updateError.code === '23505' ? "This username is already taken." : "Failed to update profile.");
      console.error(updateError);
    } else {
      await refreshProfile();
      onClose();
    }
    setLoading(false);
  };

  const handleSaveApiKey = () => {
    setApiKey(localApiKey);
    alert('API Key saved!');
  };

  const menuItems = [
    { id: 'Account', label: 'Account', icon: <UserCircleIcon /> },
    { id: 'Notifications', label: 'Notifications', icon: <BellIcon /> },
    { id: 'Privacy', label: 'Privacy', icon: <ShieldCheckIcon /> },
    { id: 'Integrations', label: 'Integrations', icon: <KeyIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Account Settings</h3>
            <div className="flex items-center gap-4">
              <img src={avatar || 'https://i.ibb.co/QZ0zRxp/IMG-3953.png'} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-white/20 object-cover" />
              <div className="flex-grow">
                <label htmlFor="avatar-url" className="block text-sm font-semibold mb-1 text-gray-300">Avatar URL</label>
                <input id="avatar-url" type="text" placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full p-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
              </div>
            </div>
            <div>
              <label htmlFor="profile-name" className="block text-sm font-semibold mb-1 text-gray-300">Name</label>
              <input id="profile-name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
            </div>
            <div>
              <label htmlFor="profile-username" className="block text-sm font-semibold mb-1 text-gray-300">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input id="profile-username" type="text" placeholder="your_username" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} className="w-full p-3 pl-7 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
              </div>
            </div>
            <div>
              <label htmlFor="profile-bio" className="block text-sm font-semibold mb-1 text-gray-300">Bio</label>
              <textarea id="profile-bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-white" />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
             <div className="flex justify-end gap-4 pt-4 mt-auto">
                <button onClick={onClose} className="px-6 py-2 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-6 py-2 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        );
      case 'Notifications':
        return (
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Notification Settings</h3>
                <div className="space-y-2">
                    <h4 className="font-bold text-lg text-gray-200 pt-4">Email Notifications</h4>
                    <ToggleSwitch label="New Followers" checked={emailNotifications.followers} onChange={c => setEmailNotifications(p => ({...p, followers: c}))} />
                    <ToggleSwitch label="Comments on your posts" checked={emailNotifications.comments} onChange={c => setEmailNotifications(p => ({...p, comments: c}))} />
                    <ToggleSwitch label="Likes on your posts" checked={emailNotifications.likes} onChange={c => setEmailNotifications(p => ({...p, likes: c}))} />

                    <h4 className="font-bold text-lg text-gray-200 pt-6">Push Notifications</h4>
                    <ToggleSwitch label="App Updates & News" checked={pushNotifications.updates} onChange={c => setPushNotifications(p => ({...p, updates: c}))} />
                    <ToggleSwitch label="Battle Invites" checked={pushNotifications.battles} onChange={c => setPushNotifications(p => ({...p, battles: c}))} />
                </div>
            </div>
        );
      case 'Privacy':
        return (
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-2">
                    <ToggleSwitch label="Private Account" description="When your account is private, only people you approve can see your posts and follow you." checked={isPrivate} onChange={setIsPrivate} />
                    <ToggleSwitch label="Show Activity Status" description="Allow others to see when you were last active on SiloSphere." checked={showActivity} onChange={setShowActivity} />
                </div>
            </div>
        );
      case 'Integrations':
        return (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Integrations</h3>
                <p className="text-gray-400">Manage connections to third-party services like the Gemini API.</p>
                <div>
                    <label htmlFor="gemini-api-key" className="block text-sm font-semibold mb-1 text-gray-300">Gemini API Key</label>
                    <input id="gemini-api-key" type="password" placeholder="Enter your Gemini API key" value={localApiKey} onChange={(e) => setLocalApiKey(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    <p className="text-xs text-gray-500 mt-2">Your key is stored securely in your browser's local storage and is never sent to our servers.</p>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSaveApiKey} className="px-6 py-2 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out">Save API Key</button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl h-[80vh] max-h-[700px] bg-black/50 border border-white/20 rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 bg-white/5 border-r border-white/10 p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-8 px-2">Settings</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto">
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="w-3/4 p-8 overflow-y-auto relative flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex-grow">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
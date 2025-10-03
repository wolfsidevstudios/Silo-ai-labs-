import React from 'react';
// FIX: Added BattleItem to type imports
import type { NavItem, UserProfile, BattleItem } from './types';

const HomeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const ClipsIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const SiloAiIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c.828 0 1.5.672 1.5 1.5v1.235c.421.13.82.312 1.178.536m-3.356 0A12.015 12.015 0 0 0 12 4.5v-1.235c-.421.13-.82.312-1.178-.536m3.356 0a3.75 3.75 0 0 1 2.23 6.643c.12.339.227.688.32 1.045m-4.55 0a3.75 3.75 0 0 0-2.23 6.643c-.12.339-.227.688-.32 1.045m4.55 0c.093.357.199.706.32 1.045m0 0a3.75 3.75 0 0 1-4.137 2.285c-.421-.13-.82-.312-1.178-.536m4.137-2.285a3.75 3.75 0 0 0 4.137 2.285c.421-.13.82-.312 1.178-.536m-4.137-2.285c.328 0 .644-.047.95-.135m-1.9 0c-.306.088-.622.135-.95.135m0 0a3.75 3.75 0 0 1-2.23-6.643c-.12-.339-.227-.688-.32-1.045m4.55 0a3.75 3.75 0 0 0 2.23-6.643c.12-.339.227-.688.32-1.045m-4.55 0c-.093-.357-.199-.706-.32-1.045m0 0a3.75 3.75 0 0 1 4.137-2.285c.421.13.82.312 1.178.536m-4.137 2.285a3.75 3.75 0 0 0-4.137-2.285c-.421.13-.82.312-1.178-.536m0 0a3.75 3.75 0 0 1-2.23 6.643c-.12.339-.227-.688-.32 1.045m2.55 0a3.75 3.75 0 0 0-2.23 6.643c.12.339.227.688.32 1.045m2.55 0c.093.357.199.706.32 1.045" />
    </svg>
);


const BattleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.012 2.25c.499 0 .997.025 1.488.073a11.24 11.24 0 0 1 8.351 4.34c.22.384.22.868 0 1.252a11.24 11.24 0 0 1-8.351 4.34c-.491.048-.989.073-1.488.073s-.997-.025-1.488-.073a11.24 11.24 0 0 1-8.351-4.34c-.22-.384-.22-.868 0-1.252a11.24 11.24 0 0 1 8.351-4.34c.491-.048.989-.073 1.488-.073Zm0 13.5c.499 0 .997.025 1.488.073a11.24 11.24 0 0 1 8.351 4.34c.22.384.22.868 0 1.252a11.24 11.24 0 0 1-8.351 4.34c-.491.048-.989.073-1.488.073s-.997-.025-1.488-.073a11.24 11.24 0 0 1-8.351-4.34c-.22-.384-.22-.868 0-1.252a11.24 11.24 0 0 1 8.351-4.34c.491-.048.989.073 1.488-.073Z" />
    </svg>
);


const InspirationIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const ExploreIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const CreateIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ProfileIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'clips', label: 'Clips', icon: ClipsIcon },
  { id: 'battle', label: 'Battle', icon: BattleIcon },
  { id: 'silo-ai', label: 'Silo AI', icon: SiloAiIcon },
  { id: 'inspiration', label: 'Inspiration', icon: InspirationIcon },
  { id: 'explore', label: 'Explore', icon: ExploreIcon },
  { id: 'create', label: 'Create', icon: CreateIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];

export const USER_PROFILE_DATA: UserProfile = {
  name: 'Alex AI',
  username: '@alex_ai_creates',
  avatar: '',
  bio: 'Exploring the intersection of art and artificial intelligence. \nJoin me on a journey through generative worlds.',
  stats: {
    posts: 42,
    followers: 1200000,
    following: 256,
  }
};

// FIX: Added missing BATTLE_ARENA_ITEMS constant
export const BATTLE_ARENA_ITEMS: BattleItem[] = [
  {
    id: 1,
    contestantA: {
      id: 101,
      imageUrl: 'https://placehold.co/600x800/1e1b4b/ffffff?text=Image+A',
      prompt: 'A majestic cybernetic lion with neon circuits, standing on a rainy neo-tokyo street, photorealistic.'
    },
    contestantB: {
      id: 102,
      imageUrl: 'https://placehold.co/600x800/4c1d95/ffffff?text=Image+B',
      prompt: 'An enchanted forest where trees are made of crystal and the river flows with liquid light, fantasy art.'
    }
  },
  {
    id: 2,
    contestantA: {
      id: 103,
      imageUrl: 'https://placehold.co/600x800/9333ea/FFFFFF/png?text=Image+C',
      prompt: 'A steampunk astronaut exploring a forgotten library on Mars, detailed, warm lighting.'
    },
    contestantB: {
      id: 104,
      imageUrl: 'https://placehold.co/600x800/3b82f6/FFFFFF/png?text=Image+D',
      prompt: 'Underwater city of Atlantis, bioluminescent structures, schools of exotic fish, epic scale.'
    }
  }
];

export const AI_MODELS = ['Sora', 'Veo', 'Kling', 'Dream Machine', 'Vidu', 'DALL-E 3', 'Midjourney', 'Stable Diffusion', 'Other'];

export const EXPLORE_TAGS = ['AI Art', 'Generative Music', 'Sci-Fi Worlds', 'Abstract', 'GANs', 'Futurism', 'Surrealism'];

export const ONBOARDING_AVATARS: string[] = [];

export const MOBILE_NAVIGATION_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'clips', label: 'For You', icon: ClipsIcon },
  { id: 'explore', label: 'Explore', icon: ExploreIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
];
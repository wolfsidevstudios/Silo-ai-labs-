import React from 'react';
import type { NavItem, Video, Inspiration, Clip, UserProfile, Creation, BattleItem } from './types';

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c.828 0 1.5.672 1.5 1.5v1.235c.421.13.82.312 1.178.536m-3.356 0A12.015 12.015 0 0 0 12 4.5v-1.235c-.421.13-.82.312-1.178.536m3.356 0a3.75 3.75 0 0 1 2.23 6.643c.12.339.227.688.32 1.045m-4.55 0a3.75 3.75 0 0 0-2.23 6.643c-.12.339-.227.688-.32 1.045m4.55 0c.093.357.199.706.32 1.045m0 0a3.75 3.75 0 0 1-4.137 2.285c-.421-.13-.82-.312-1.178-.536m4.137-2.285a3.75 3.75 0 0 0 4.137 2.285c.421-.13.82-.312 1.178-.536m-4.137-2.285c.328 0 .644-.047.95-.135m-1.9 0c-.306.088-.622.135-.95.135m0 0a3.75 3.75 0 0 1-2.23-6.643c-.12-.339-.227-.688-.32-1.045m4.55 0a3.75 3.75 0 0 0 2.23-6.643c.12-.339.227-.688.32-1.045m-4.55 0c-.093-.357-.199-.706-.32-1.045m0 0a3.75 3.75 0 0 1 4.137-2.285c.421.13.82.312 1.178.536m-4.137 2.285a3.75 3.75 0 0 0-4.137-2.285c-.421.13-.82.312-1.178-.536m0 0a3.75 3.75 0 0 1-2.23 6.643c-.12.339-.227.688-.32 1.045m2.55 0a3.75 3.75 0 0 0-2.23 6.643c.12.339.227.688.32 1.045m2.55 0c.093.357.199.706.32 1.045" />
    </svg>
);


const BattleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.012 2.25c.499 0 .997.025 1.488.073a11.24 11.24 0 0 1 8.351 4.34c.22.384.22.868 0 1.252a11.24 11.24 0 0 1-8.351 4.34c-.491.048-.989.073-1.488.073s-.997-.025-1.488-.073a11.24 11.24 0 0 1-8.351-4.34c-.22-.384-.22-.868 0-1.252a11.24 11.24 0 0 1 8.351-4.34c.491-.048.989-.073 1.488-.073Zm0 13.5c.499 0 .997.025 1.488.073a11.24 11.24 0 0 1 8.351 4.34c.22.384.22.868 0 1.252a11.24 11.24 0 0 1-8.351 4.34c-.491.048-.989.073-1.488.073s-.997-.025-1.488-.073a11.24 11.24 0 0 1-8.351-4.34c-.22-.384-.22-.868 0-1.252a11.24 11.24 0 0 1 8.351-4.34c.491-.048.989-.073 1.488-.073Z" />
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

const CreateIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
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

export const DAILY_INSPIRATION: Inspiration = {
  id: 1,
  title: 'Cybernetic Dreams',
  description: 'A fusion of organic and synthetic lifeforms in a neon-drenched cityscape. Generated by AI.',
  imageUrl: 'https://picsum.photos/seed/cyber/1200/600',
};

export const TOP_VIDEOS: Video[] = [
  { id: 1, title: 'AI Generates a Symphony', creator: 'Music AI', imageUrl: 'https://picsum.photos/seed/music/400/225', duration: '5:32' },
  { id: 2, title: 'Future of Architecture', creator: 'Architron', imageUrl: 'https://picsum.photos/seed/arch/400/225', duration: '12:15' },
  { id: 3, title: 'Deep Sea Creatures Imagined', creator: 'BioGAN', imageUrl: 'https://picsum.photos/seed/sea/400/225', duration: '8:44' },
  { id: 4, title: 'Walking on Mars', creator: 'SpaceAI', imageUrl: 'https://picsum.photos/seed/mars/400/225', duration: '22:01' },
  { id: 5, title: 'Abstract Fluid Dynamics', creator: 'PhysicsSim', imageUrl: 'https://picsum.photos/seed/fluid/400/225', duration: '3:50' },
];

export const TRENDING_SHORTS: Video[] = [
  { id: 20, title: 'Quantum Flux', creator: 'ArtisanAI', imageUrl: 'https://picsum.photos/seed/short1/400/700', duration: '0:45' },
  { id: 21, title: 'Neon Jungle', creator: 'SynthScapes', imageUrl: 'https://picsum.photos/seed/short2/400/700', duration: '0:32' },
  { id: 22, title: 'Glitch in the Matrix', creator: 'CodeBreaker', imageUrl: 'https://picsum.photos/seed/short3/400/700', duration: '1:02' },
  { id: 23, title: 'Celestial Dance', creator: 'AstroGen', imageUrl: 'https://picsum.photos/seed/short4/400/700', duration: '0:55' },
  { id: 24, title: 'Steampunk Dreams', creator: 'Cog & Canvas', imageUrl: 'https://picsum.photos/seed/short5/400/700', duration: '0:28' },
  { id: 25, title: 'Underwater World', creator: 'AquaAI', imageUrl: 'https://picsum.photos/seed/short6/400/700', duration: '0:41' },
];

export const RECENT_VIDEOS: Video[] = [
  { id: 6, title: 'The Perfect Landscape', creator: 'NatureGen', imageUrl: 'https://picsum.photos/seed/nature/400/225', duration: '6:18' },
  { id: 7, title: 'My Latest AI Animation', creator: 'AnimatorAI', imageUrl: 'https://picsum.photos/seed/anim/400/225', duration: '2:11' },
  { id: 8, title: 'Robots Learning to Dance', creator: 'RoboMove', imageUrl: 'https://picsum.photos/seed/dance/400/225', duration: '4:04' },
  { id: 9, title: 'AI-Powered Fashion Show', creator: 'StyleAI', imageUrl: 'https://picsum.photos/seed/fashion/400/225', duration: '15:30' },
];

export const CLIPS_DATA: Clip[] = [
  { id: 1, videoUrl: 'https://picsum.photos/seed/clip1/400/700', user: { name: '@AI_Explorer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, description: 'Watching generative art unfold is mesmerizing! #AIart #CreativeAI', likes: '1.2M', comments: '3,452', shares: '25.6k' },
  { id: 2, videoUrl: 'https://picsum.photos/seed/clip2/400/700', user: { name: '@SynthwaveDreamer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }, description: 'AI creating sounds from my brainwaves. The future is now.', likes: '890k', comments: '1,987', shares: '12.1k' },
  { id: 3, videoUrl: 'https://picsum.photos/seed/clip3/400/700', user: { name: '@CodeWizard', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }, description: 'Just taught my neural net to beat me at chess. I have mixed feelings.', likes: '543k', comments: '8,123', shares: '9.8k' },
  { id: 4, videoUrl: 'https://picsum.photos/seed/clip4/400/700', user: { name: '@DataIsBeautiful', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' }, description: 'Climate change data visualized by a GAN. Sobering but incredible.', likes: '2.5M', comments: '15.2k', shares: '88.3k' },
];

export const INSPIRATIONS_GRID: Inspiration[] = [
    { id: 10, title: "Oceanic AI", description: "", imageUrl: "https://picsum.photos/seed/grid1/500/800" },
    { id: 11, title: "Forest Spirit", description: "", imageUrl: "https://picsum.photos/seed/grid2/500/600" },
    { id: 12, title: "City of Light", description: "", imageUrl: "https://picsum.photos/seed/grid3/500/750" },
    { id: 13, title: "Galactic Wanderer", description: "", imageUrl: "https://picsum.photos/seed/grid4/500/500" },
    { id: 14, title: "Desert Mirage", description: "", imageUrl: "https://picsum.photos/seed/grid5/500/700" },
    { id: 15, title: "Mechanical Heart", description: "", imageUrl: "https://picsum.photos/seed/grid6/500/900" },
    { id: 16, title: "Floating Islands", description: "", imageUrl: "https://picsum.photos/seed/grid7/500/650" },
    { id: 17, title: "Crystal Caverns", description: "", imageUrl: "https://picsum.photos/seed/grid8/500/850" },
];

export const USER_PROFILE_DATA: UserProfile = {
  name: 'Alex AI',
  username: '@alex_ai_creates',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
  bio: 'Exploring the intersection of art and artificial intelligence. \nJoin me on a journey through generative worlds.',
  stats: {
    posts: 42,
    followers: '1.2M',
    following: '256',
  }
};

export const USER_CREATIONS: Creation[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/user1/500/500', type: 'image' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/user2/500/500', type: 'image' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/user3/500/500', type: 'video' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/user4/500/500', type: 'image' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/user5/500/500', type: 'image' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/user6/500/500', type: 'image' },
  { id: 7, imageUrl: 'https://picsum.photos/seed/user7/500/500', type: 'video' },
  { id: 8, imageUrl: 'https://picsum.photos/seed/user8/500/500', type: 'image' },
  { id: 9, imageUrl: 'https://picsum.photos/seed/user9/500/500', type: 'image' },
];

export const AI_MODELS = ['Sora', 'Veo', 'Kling', 'Dream Machine', 'Vidu', 'Other'];

export const EXPLORE_TAGS = ['AI Art', 'Generative Music', 'Sci-Fi Worlds', 'Abstract', 'GANs', 'Futurism', 'Surrealism'];

export const BATTLE_ARENA_ITEMS: BattleItem[] = [
    {
        id: 1,
        contestantA: { id: 101, imageUrl: 'https://picsum.photos/seed/battleA1/600/800', prompt: 'A hyper-realistic portrait of a wise old owl wearing a monocle' },
        contestantB: { id: 102, imageUrl: 'https://picsum.photos/seed/battleB1/600/800', prompt: 'A surrealist painting of a clock melting over a desert landscape' }
    },
    {
        id: 2,
        contestantA: { id: 103, imageUrl: 'https://picsum.photos/seed/battleA2/600/800', prompt: 'A neon-drenched cyberpunk city street at night in the rain' },
        contestantB: { id: 104, imageUrl: 'https://picsum.photos/seed/battleB2/600/800', prompt: 'A serene, enchanted forest with glowing mushrooms and mystical creatures' }
    },
    {
        id: 3,
        contestantA: { id: 105, imageUrl: 'https://picsum.photos/seed/battleA3/600/800', prompt: 'A steampunk-inspired submarine exploring the depths of the ocean' },
        contestantB: { id: 106, imageUrl: 'https://picsum.photos/seed/battleB3/600/800', prompt: 'An astronaut discovering an ancient alien artifact on a distant planet' }
    },
     {
        id: 4,
        contestantA: { id: 107, imageUrl: 'https://picsum.photos/seed/battleA4/600/800', prompt: 'An abstract explosion of colors, representing the sound of jazz' },
        contestantB: { id: 108, imageUrl: 'https://picsum.photos/seed/battleB4/600/800', prompt: 'A photorealistic image of a majestic dragon flying over a mountain range' }
    },
];

export const ONBOARDING_AVATARS: string[] = [
    'https://i.ibb.co/Df3CWc3Z/IMG-3957.png',
    'https://i.ibb.co/G4Gx2X83/IMG-3955.png',
    'https://i.ibb.co/9HbjgPHS/IMG-3956.png',
];
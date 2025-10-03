import React from 'react';

export type Page = 'home' | 'explore' | 'create' | 'profile' | 'clips' | 'inspiration' | 'battle' | 'silo-ai';

export interface NavItem {
  id: Page;
  label: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

export interface Video {
  id: number;
  title: string;
  creator: string;
  imageUrl: string;
  duration: string;
  youtubeId?: string;
  description?: string;
  hashtags?: string;
  model?: string;
  prompt?: string;
}

export interface Inspiration {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Clip {
  id: number;
  videoUrl: string;
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: {
    posts: number;
    followers: string;
    following: string;
  };
}

export interface Creation {
  id: number;
  imageUrl: string;
  type: 'image' | 'video';
}

export interface BattleContestant {
  id: number;
  imageUrl: string;
  prompt: string;
}

export interface BattleItem {
  id: number;
  contestantA: BattleContestant;
  contestantB: BattleContestant;
}
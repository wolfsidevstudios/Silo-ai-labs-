import React from 'react';

export type Page = 'home' | 'explore' | 'create' | 'profile' | 'clips' | 'inspiration' | 'battle' | 'silo-ai';

export interface NavItem {
  id: Page;
  label: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

export interface Post {
  id: number;
  type: 'video' | 'image';
  title: string;
  creator: string;
  creatorId?: string;
  imageUrl: string; // Thumbnail for videos, or the image URL for image posts
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: string;
  youtubeId?: string;
  videoUrl?: string;
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
    id: string;
    name: string;
    avatar: string;
  };
  description: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
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
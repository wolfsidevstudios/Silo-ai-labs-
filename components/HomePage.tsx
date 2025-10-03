import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import YouTubeVideoCard from './YouTubeVideoCard';
import ImageCard from './ImageCard';
import ShortCard from './ShortCard';
import type { Post } from '../types';
import { supabase } from '../lib/supabase';

const DownloadIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-6 text-gray-200">{title}</h2>
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-1 px-1">
      {children}
    </div>
  </section>
);

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error("Failed to fetch posts from Supabase", error);
      } else {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const youtubeVideos = posts.filter(p => p.type === 'video' && p.youtubeId);
  const uploadedVideos = posts.filter(p => p.type === 'video' && p.videoUrl);
  const landscapeImages = posts.filter(p => p.type === 'image' && p.aspectRatio === '16:9');
  const shorts = posts.filter(p => p.type === 'image' && (p.aspectRatio === '9:16' || p.aspectRatio === '1:1'));

  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">Welcome to SiloSphere</h1>
        <p className="text-lg text-gray-400 mt-2">A social experience powered by AI.</p>
      </header>

      <Section title="Brand Assets">
        <div className="flex-shrink-0 w-80 p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 p-4 bg-black/30 rounded-full mb-4">
                <img src="https://i.ibb.co/QZ0zRxp/IMG-3953.png" alt="SiloSphere Logo" className="w-full h-full" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">SiloSphere Logo</h4>
            <p className="text-sm text-gray-400 mb-4">Download our official logo in PNG format.</p>
            <a
                href="https://i.ibb.co/QZ0zRxp/IMG-3953.png"
                download="SiloSphere_Logo.png"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
            >
                <DownloadIcon />
                Download
            </a>
        </div>
      </Section>


      {loading ? (
        <p className="text-gray-400">Loading feed...</p>
      ) : (
        <>
          {youtubeVideos.length > 0 && (
            <Section title="YouTube AI Videos">
              {youtubeVideos.map((post) => <YouTubeVideoCard key={post.id} video={post} />)}
            </Section>
          )}

          {landscapeImages.length > 0 && (
            <Section title="Recent Images">
              {landscapeImages.map((post) => <ImageCard key={post.id} post={post} />)}
            </Section>
          )}
          
          {uploadedVideos.length > 0 && (
            <Section title="Recent Videos">
              {uploadedVideos.map((post) => <VideoCard key={post.id} video={post} />)}
            </Section>
          )}

          {shorts.length > 0 && (
            <Section title="Trending Shorts">
                {shorts.map((post) => <ShortCard key={post.id} post={post} />)}
            </Section>
          )}

          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <h3 className="text-2xl font-bold">The Sphere is Quiet</h3>
                <p>No posts have been made yet. Be the first to create something!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
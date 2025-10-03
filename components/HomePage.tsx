import React, { useState, useEffect } from 'react';
import { DAILY_INSPIRATION, TOP_VIDEOS, RECENT_VIDEOS, TRENDING_SHORTS } from '../constants';
import InspirationCard from './InspirationCard';
import VideoCard from './VideoCard';
import ShortCard from './ShortCard';
import YouTubeVideoCard from './YouTubeVideoCard';
import type { Video } from '../types';
import { supabase } from '../lib/supabase';

const VideoSection: React.FC<{ title: string; videos: Video[] }> = ({ title, videos }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-6 text-gray-200">{title}</h2>
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-1 px-1">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  </section>
);

const HomePage: React.FC = () => {
  const [allRecentVideos, setAllRecentVideos] = useState<Video[]>(RECENT_VIDEOS);
  const [youtubeVideos, setYoutubeVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error("Failed to fetch posts from Supabase", error);
        setAllRecentVideos(RECENT_VIDEOS); // Fallback to constant data on error
      } else {
        const mappedVideos: Video[] = data.map(post => ({
          id: post.id,
          title: post.title,
          creator: post.creatorName,
          creatorId: post.profileId,
          imageUrl: post.imageUrl,
          duration: post.duration,
          youtubeId: post.youtubeId,
          description: post.description,
          hashtags: post.hashtags,
          model: post.model,
          prompt: post.prompt,
        }));
        
        const ytVideos = mappedVideos.filter(post => post.youtubeId);
        const uploadedVideos = mappedVideos.filter(post => !post.youtubeId);
        
        setYoutubeVideos(ytVideos);
        // Prepend fetched videos to any default/fallback videos
        setAllRecentVideos([...uploadedVideos, ...RECENT_VIDEOS]);
      }
    };
    fetchPosts();
  }, []);


  return (
    <div className="animate-fade-in">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">Welcome to SiloSphere</h1>
        <p className="text-lg text-gray-400 mt-2">A social experience powered by AI.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Daily AI Inspiration</h2>
        <InspirationCard inspiration={DAILY_INSPIRATION} />
      </section>

      {youtubeVideos.length > 0 && (
         <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-200">YouTube AI Videos</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-1 px-1">
              {youtubeVideos.map((video) => (
                <YouTubeVideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
      )}

      <VideoSection title="Top Videos" videos={TOP_VIDEOS} />

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Top Trending AI Shorts</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4 -mx-1 px-1">
          {TRENDING_SHORTS.map((video) => (
            <ShortCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <VideoSection title="Recent Videos" videos={allRecentVideos} />

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Other Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 border border-white/10">Coming Soon</div>
            <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 border border-white/10">Coming Soon</div>
            <div className="h-48 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 border border-white/10">Coming Soon</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
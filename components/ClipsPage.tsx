import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import ImageClipCard from './ImageClipCard';

const ClipsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClips = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .in('aspectRatio', ['9:16', '1:1'])
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching clips:', error);
      } else {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };

    fetchClips();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">Loading Clips...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-center">
        <div>
            <h2 className="text-2xl font-bold">No Clips Yet</h2>
            <p className="text-gray-400">Portrait and square images will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center animate-fade-in">
        <div className="w-full max-w-md h-[calc(100vh-5rem)] overflow-y-auto snap-y snap-mandatory rounded-2xl no-scrollbar">
            {posts.map((post) => (
                <ImageClipCard key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
};

export default ClipsPage;
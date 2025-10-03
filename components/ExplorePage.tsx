import React, { useState, useEffect } from 'react';
import { EXPLORE_TAGS } from '../constants';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';

const ExploreGridItem: React.FC<{ item: Post }> = ({ item }) => (
    <div className="relative overflow-hidden rounded-lg group mb-4 break-inside-avoid">
        <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white">
                <p className="font-bold">{item.title}</p>
                <p className="text-xs text-gray-300">by {item.creator}</p>
            </div>
        </div>
    </div>
);

const ExplorePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchExplorePosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('aspectRatio', '16:9')
                .order('createdAt', { ascending: false });
            
            if (error) {
                console.error("Error fetching explore posts", error);
            } else {
                setPosts(data as Post[]);
            }
            setLoading(false);
        };
        fetchExplorePosts();
    }, []);

    return (
        <div className="animate-fade-in">
            <header className="mb-8 sticky top-4 z-10">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Search for creators, tags, or ideas..."
                        className="w-full p-4 pl-12 text-lg bg-white/5 border border-white/20 rounded-full backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                    {EXPLORE_TAGS.map(tag => (
                        <button key={tag} className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-sm">
                            {tag}
                        </button>
                    ))}
                </div>
            </header>
            
            {loading ? (
                <div className="text-center text-gray-400">Loading content...</div>
            ) : posts.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                    {posts.map(item => (
                        <ExploreGridItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 text-gray-500">
                    <h3 className="text-2xl font-bold">Nothing to Explore Yet</h3>
                    <p>Landscape images and videos will appear here.</p>
                 </div>
            )}
        </div>
    );
};

export default ExplorePage;
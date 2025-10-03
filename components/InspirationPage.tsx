import React from 'react';
import { INSPIRATIONS_GRID } from '../constants';
import type { Inspiration } from '../types';

const InspirationGridItem: React.FC<{ item: Inspiration }> = ({ item }) => (
    <div className="relative overflow-hidden rounded-lg group mb-4 break-inside-avoid">
        <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <h3 className="text-white font-bold text-lg">{item.title}</h3>
        </div>
    </div>
);

const ArrowUpIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
    </svg>
);

const InspirationPage: React.FC = () => {
    return (
        <div className="animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-purple-900/30 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
             <div className="absolute -top-20 -left-40 w-[800px] h-[500px] bg-cyan-900/20 rounded-full blur-3xl -z-10" aria-hidden="true"></div>

            <header className="mb-12">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">Inspiration Wall</h1>
                <p className="text-lg text-gray-400 mt-2">A curated gallery of AI-generated visuals to spark your creativity.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-200">Get inspirations here</h2>
                <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-purple-300 bg-purple-500/20 rounded-full border border-purple-400/30">
                        COMING SOON
                    </div>
                    <p className="text-gray-400 mb-4 max-w-2xl">Get ideas from AI. Describe what you want to see, and let the model generate new visual concepts for you to explore.</p>
                    <div className="relative flex items-center w-full h-20 bg-black/20 border border-white/20 rounded-full p-2.5 shadow-lg">
                        <input
                            type="text"
                            placeholder="e.g., A steampunk owl with glowing mechanical eyes..."
                            disabled
                            className="w-full h-full bg-transparent pl-6 pr-24 text-lg text-white placeholder-gray-500 focus:outline-none cursor-not-allowed"
                            aria-label="Inspiration prompt input (coming soon)"
                        />
                        <button
                            disabled
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-not-allowed opacity-60 hover:opacity-75 transition-opacity"
                            aria-label="Generate inspiration (coming soon)"
                        >
                            <ArrowUpIcon className="w-8 h-8 text-black" />
                        </button>
                    </div>
                </div>
            </section>

            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {INSPIRATIONS_GRID.map(item => (
                    <InspirationGridItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default InspirationPage;

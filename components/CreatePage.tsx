import React, { useState } from 'react';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description }) => (
    <div className="group relative p-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:bg-white/10 cursor-pointer">
        <div className="absolute -top-10 -right-10 text-white/5 text-8xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 ease-in-out">
            {icon}
        </div>
        <div className="relative">
            <div className="w-16 h-16 mb-6 flex items-center justify-center bg-purple-500/20 rounded-xl text-purple-300">
                 <div className="w-8 h-8">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
        <div className="absolute bottom-4 right-4 text-white/30 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </div>
    </div>
);

const UploadArea: React.FC = () => (
    <div className="w-full max-w-3xl mx-auto">
        <div className="relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all duration-300">
            <div className="text-white/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Upload Your Content</h3>
            <p className="text-gray-400 mt-1">Drag & drop files here or click to browse</p>
            <p className="text-xs text-gray-500 mt-4">Supports: JPG, PNG, MP4, MOV. Max 100MB.</p>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
    </div>
);


const CreatePage: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'upload'>('create');

    return (
        <div className="animate-fade-in">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">What will you create?</h1>
                <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
                    {mode === 'create' 
                        ? "Select a tool to start bringing your imagination to life with the power of AI."
                        : "Upload your own media to share with the community."}
                </p>
            </header>

            <div className="flex justify-center mb-12">
                <div className="bg-white/5 p-1 rounded-full flex items-center gap-2 border border-white/10">
                    <button 
                        onClick={() => setMode('create')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${mode === 'create' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Create with AI
                    </button>
                    <button 
                        onClick={() => setMode('upload')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${mode === 'upload' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Upload
                    </button>
                </div>
            </div>

            {mode === 'create' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
                        title="Generate Image"
                        description="Turn your text prompts into stunning, high-resolution images and artwork."
                    />
                    <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
                        title="Create Video"
                        description="Animate your images or generate short video clips from a simple description."
                    />
                    <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>}
                        title="Remix Content"
                        description="Combine, edit, and transform existing images and videos with AI-powered tools."
                    />
                     <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>}
                        title="Compose Music"
                        description="Generate royalty-free background music, sound effects, or entire compositions."
                    />
                    <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>}
                        title="Write a Story"
                        description="Get help with scripts, stories, and descriptions from a creative AI writing assistant."
                    />
                    <ToolCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                        title="More Tools"
                        description="Explore other experimental AI tools and features as they become available."
                    />
                </div>
            )}

            {mode === 'upload' && <UploadArea />}
        </div>
    );
};

export default CreatePage;
import React, { useState, useCallback } from 'react';
import { AI_MODELS } from '../constants';
import type { Page } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

const UploadArea: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onFileSelect(event.dataTransfer.files[0]);
        }
    }, [onFileSelect]);
    
    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
            <div className={`relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-white/50 bg-white/10' : 'border-white/20 hover:bg-white/5 hover:border-white/30'}`}>
                <div className="text-white/30 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Upload Your Content</h3>
                <p className="text-gray-400 mt-1">Drag & drop video here or click to browse</p>
                <p className="text-xs text-gray-500 mt-4">Supports: MP4, MOV. Max 100MB.</p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="video/mp4,video/quicktime" />
            </div>
        </div>
    );
};

const YouTubeUploadArea: React.FC<{ onLinkSubmit: (videoId: string) => void }> = ({ onLinkSubmit }) => {
    const [link, setLink] = useState('');

    const getYoutubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const handleSubmit = () => {
        const videoId = getYoutubeVideoId(link);
        if (videoId) {
            onLinkSubmit(videoId);
        } else {
            alert('Invalid YouTube link. Please enter a valid video URL.');
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-white">Embed a YouTube Video</h3>
            <p className="text-gray-400 mt-1">Paste the video link below to embed it.</p>
            <div className="w-full flex gap-2">
                <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-grow p-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                />
                <button onClick={handleSubmit} className="px-6 py-3 rounded-lg font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out">
                    Process
                </button>
            </div>
        </div>
    );
};


interface CreatePageProps {
  setActivePage: (page: Page) => void;
}

const CreatePage: React.FC<CreatePageProps> = ({ setActivePage }) => {
    const { session, profile } = useAuth();
    const [mode, setMode] = useState<'create' | 'upload'>('create');
    const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
    
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isPromptSubmitted, setIsPromptSubmitted] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

    const handleFileSelect = (file: File) => {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setVideoPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const handleLinkSubmit = (videoId: string) => {
        setYoutubeVideoId(videoId);
    };

    const resetUpload = () => {
        setUploadedFile(null);
        setVideoPreviewUrl(null);
        setYoutubeVideoId(null);
        setSelectedModel(null);
        setPrompt('');
        setIsPromptSubmitted(false);
        setTitle('');
        setDescription('');
        setHashtags('');
        setIsSubmitting(false);
        setSubmissionStatus(null);
    };

    const handlePost = async () => {
        setIsSubmitting(true);
        setSubmissionStatus(null);

        if (!title || (!uploadedFile && !youtubeVideoId) || !selectedModel) {
            setSubmissionStatus({ message: "Please fill out all required fields.", type: 'error' });
            setIsSubmitting(false);
            return;
        }

        if (!session || !profile || !profile.name) {
             setSubmissionStatus({ message: 'You must complete your profile before posting.', type: 'error' });
             setIsSubmitting(false);
             return;
        }

        try {
            let videoUrl = null;
            let imageUrl;

            if (youtubeVideoId) {
                imageUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
            } else if (uploadedFile) {
                // Use a placeholder image for uploaded videos, as client-side thumbnail generation is complex.
                imageUrl = 'https://i.ibb.co/b3my2V2/video-placeholder.png';
                
                const fileExt = uploadedFile.name.split('.').pop();
                const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('media') // Use a 'media' bucket for uploads
                    .upload(fileName, uploadedFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: urlData } = supabase.storage
                    .from('media')
                    .getPublicUrl(uploadData.path);
                
                videoUrl = urlData.publicUrl;
            } else {
                // This case should be caught by initial validation, but it's here as a safeguard.
                throw new Error("No video source provided.");
            }

            const newPost = {
                title,
                creatorName: profile.name,
                imageUrl,
                duration: '0:00', // Placeholder
                description,
                hashtags,
                model: selectedModel,
                prompt,
                youtubeId: youtubeVideoId || null,
                videoUrl: videoUrl, // Save the URL of the uploaded video
                profileId: session.user.id,
            };

            const { error: insertError } = await supabase.from('posts').insert(newPost);
            
            if (insertError) {
                throw insertError;
            }

            setSubmissionStatus({ message: 'Post successful! Redirecting...', type: 'success' });
            setTimeout(() => {
                setActivePage('home');
            }, 2000);

        } catch (error: any) {
            console.error("Could not save post to Supabase", error);
            setSubmissionStatus({ message: `Error submitting post: ${error.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderVideoPreview = () => {
        if (youtubeVideoId) {
            return <iframe src={`https://www.youtube.com/embed/${youtubeVideoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full max-w-sm aspect-[9/16] rounded-2xl object-cover bg-black/50 border border-white/10" />;
        }
        if (videoPreviewUrl) {
            return <video src={videoPreviewUrl} className="w-full max-w-sm aspect-[9/16] rounded-2xl object-cover bg-black/50 border border-white/10" controls autoPlay loop muted />;
        }
        return null;
    }

    const renderFinalPreview = () => {
       if (youtubeVideoId) {
            return <iframe src={`https://www.youtube.com/embed/${youtubeVideoId}`} title="YouTube video player" frameBorder="0" allowFullScreen className="w-full aspect-video rounded-xl object-cover bg-black/50" />;
        }
        if (videoPreviewUrl) {
            return <video src={videoPreviewUrl} className="w-full aspect-[9/16] rounded-xl object-cover bg-black/50" loop muted autoPlay />;
        }
        return null;
    }

    const renderUploadContent = () => {
        if (!session) {
            return (
                <div className="text-center text-gray-400">
                    <p>Please sign in or sign up to upload content.</p>
                </div>
            )
        }
        if (!uploadedFile && !youtubeVideoId) {
             return (
                <div>
                     <div className="flex justify-center mb-8">
                        <div className="bg-white/5 p-1 rounded-full flex items-center gap-2 border border-white/10">
                            <button 
                                onClick={() => setUploadType('file')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${uploadType === 'file' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                File Upload
                            </button>
                            <button 
                                onClick={() => setUploadType('youtube')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${uploadType === 'youtube' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                YouTube Link
                            </button>
                        </div>
                    </div>
                    {uploadType === 'file' ? <UploadArea onFileSelect={handleFileSelect} /> : <YouTubeUploadArea onLinkSubmit={handleLinkSubmit} />}
                </div>
            );
        }

        if (!isPromptSubmitted) {
            return (
                <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8 animate-fade-in">
                    {renderVideoPreview()}
                    <div>
                        <h3 className="text-xl font-bold text-center mb-4">Select the AI model you used</h3>
                        <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4 no-scrollbar">
                            {AI_MODELS.map(model => (
                                <button 
                                    key={model} 
                                    onClick={() => setSelectedModel(model)}
                                    className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${selectedModel === model ? 'bg-white text-black border-white' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                                >
                                    {model}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedModel && (
                        <div className="w-full animate-fade-in">
                            <label htmlFor="prompt-input" className="block text-xl font-bold mb-3">What prompt did you use?</label>
                            <textarea
                                id="prompt-input"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder={`e.g., A cinematic shot of a raccoon in a library...`}
                                className="w-full h-32 p-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-gray-400 resize-none"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                               <button onClick={resetUpload} className="px-6 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors">
                                   Start Over
                               </button>
                                <button 
                                    onClick={() => setIsPromptSubmitted(true)} 
                                    disabled={!prompt}
                                    className="px-8 py-3 rounded-full text-sm font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto animate-fade-in">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold">Add your video details</h2>
                    <div>
                        <label htmlFor="title" className="block text-lg font-semibold mb-2">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-lg font-semibold mb-2">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full h-36 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 resize-none text-white" />
                    </div>
                     <div>
                        <label htmlFor="hashtags" className="block text-lg font-semibold mb-2">Hashtags</label>
                        <input type="text" id="hashtags" placeholder="#AI #generative #sora" value={hashtags} onChange={e => setHashtags(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white" />
                    </div>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">Prompt Used ({selectedModel})</p>
                                <p className="font-mono text-gray-200">{prompt}</p>
                            </div>
                            <button onClick={() => setIsPromptSubmitted(false)} className="text-sm font-semibold hover:underline">Edit</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 pt-4">
                        <div className="flex justify-end gap-4 w-full">
                           <button onClick={resetUpload} disabled={isSubmitting} className="px-6 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50">
                               Cancel
                           </button>
                            <button onClick={handlePost} disabled={isSubmitting} className="px-10 py-3 rounded-full text-sm font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out disabled:opacity-50">
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                        {submissionStatus && (
                            <p className={`text-sm pr-2 ${submissionStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {submissionStatus.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center lg:items-start pt-12">
                     <div className="relative w-48 group">
                         {renderFinalPreview()}
                         {videoPreviewUrl && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                               <button className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 hover:bg-black/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                                    Edit Thumbnail
                               </button>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        );
    }

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
                        onClick={() => { setMode('create'); resetUpload(); }}
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

            {mode === 'upload' && renderUploadContent()}
        </div>
    );
};

export default CreatePage;
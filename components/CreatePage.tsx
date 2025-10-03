import React, { useState, useCallback } from 'react';
import { AI_MODELS } from '../constants';
import type { Page, Post } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const UploadArea: React.FC<{ onFileSelect: (file: File) => void, accept: string }> = ({ onFileSelect, accept }) => {
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
    
    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); }, []);
    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); }, []);

    return (
        <div className="w-full max-w-3xl mx-auto" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
            <div className={`relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-white/50 bg-white/10' : 'border-white/20 hover:bg-white/5 hover:border-white/30'}`}>
                <div className="text-white/30 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Upload Your Content</h3>
                <p className="text-gray-400 mt-1">Drag & drop a file here or click to browse</p>
                <p className="text-xs text-gray-500 mt-4">{accept.includes('video') ? 'Supports: MP4, MOV. Max 100MB.' : 'Supports: JPG, PNG, GIF. Max 10MB.'}</p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={accept} />
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
        if (videoId) onLinkSubmit(videoId);
        else alert('Invalid YouTube link. Please enter a valid video URL.');
    }
    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-white">Embed a YouTube Video</h3>
            <p className="text-gray-400 mt-1">Paste the video link below to embed it.</p>
            <div className="w-full flex gap-2">
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="flex-grow p-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white" />
                <button onClick={handleSubmit} className="px-6 py-3 rounded-lg font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out">Process</button>
            </div>
        </div>
    );
};

interface CreatePageProps { setActivePage: (page: Page) => void; }

const CreatePage: React.FC<CreatePageProps> = ({ setActivePage }) => {
    const { session, profile } = useAuth();
    const [mode, setMode] = useState<'create' | 'upload'>('create');
    const [postType, setPostType] = useState<'video' | 'image' | null>(null);
    const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | null>(null);
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
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
    };
    
    const handleLinkSubmit = (videoId: string) => setYoutubeVideoId(videoId);

    const resetUpload = () => {
        setPostType(null);
        setUploadedFile(null);
        setPreviewUrl(null);
        setYoutubeVideoId(null);
        setAspectRatio(null);
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

        const requiredFields = postType === 'image' 
            ? title && uploadedFile && selectedModel && aspectRatio
            : title && (uploadedFile || youtubeVideoId) && selectedModel;

        if (!requiredFields) {
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
            let imageUrl: string;
            let videoUrl: string | null = null;
            
            const file = uploadedFile;
            if (file) {
                 const fileExt = file.name.split('.').pop();
                 const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
                 const { data: uploadData, error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                 if (uploadError) throw uploadError;
                 const { data: urlData } = supabase.storage.from('media').getPublicUrl(uploadData.path);
                 
                 if (postType === 'video') videoUrl = urlData.publicUrl;
                 imageUrl = postType === 'image' ? urlData.publicUrl : 'https://i.ibb.co/b3my2V2/video-placeholder.png'; // Placeholder for self-hosted video thumbnail
            } else if (youtubeVideoId) {
                imageUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
            } else {
                 throw new Error("No media source provided.");
            }

            // FIX: Corrected the property names to match the 'Post' type ('creator' instead of 'creatorName', 'creatorId' instead of 'profileId') and updated the Omit type.
            const newPost: Omit<Post, 'id'> = {
                type: postType!,
                title,
                creator: profile.name,
                imageUrl,
                duration: postType === 'video' ? '0:00' : undefined,
                description,
                hashtags,
                model: selectedModel!,
                prompt,
                youtubeId: youtubeVideoId || undefined,
                videoUrl: videoUrl || undefined,
                aspectRatio: aspectRatio || undefined,
                creatorId: session.user.id,
            };

            const { error: insertError } = await supabase.from('posts').insert([newPost]);
            if (insertError) throw insertError;

            setSubmissionStatus({ message: 'Post successful! Redirecting...', type: 'success' });
            setTimeout(() => { setActivePage('home'); }, 2000);
        } catch (error: any) {
            console.error("Could not save post", error);
            setSubmissionStatus({ message: `Error submitting post: ${error.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderPreview = (className: string) => {
        if (youtubeVideoId) return <iframe src={`https://www.youtube.com/embed/${youtubeVideoId}`} title="YouTube preview" frameBorder="0" allowFullScreen className={className} />;
        if (previewUrl && postType === 'video') return <video src={previewUrl} className={className} controls autoPlay loop muted />;
        if (previewUrl && postType === 'image') return <img src={previewUrl} alt="Image preview" className={className} />;
        return null;
    }

    const renderUploadContent = () => {
        if (!session) return <div className="text-center text-gray-400"><p>Please sign in or sign up to upload content.</p></div>
        
        if (!postType) {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <button onClick={() => setPostType('video')} className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-2xl font-bold">Upload Video</h3>
                        <p className="text-gray-400">Share your AI-generated videos.</p>
                    </button>
                    <button onClick={() => setPostType('image')} className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-2xl font-bold">Upload Image</h3>
                        <p className="text-gray-400">Share your AI-generated images.</p>
                    </button>
                </div>
            )
        }

        if (!uploadedFile && !youtubeVideoId) {
             return (
                <div className="animate-fade-in">
                    {postType === 'video' ? (
                        <>
                            <div className="flex justify-center mb-8">
                                <div className="bg-white/5 p-1 rounded-full flex items-center gap-2 border border-white/10">
                                    <button onClick={() => setUploadType('file')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${uploadType === 'file' ? 'bg-white/10' : 'text-gray-400'}`}>File Upload</button>
                                    <button onClick={() => setUploadType('youtube')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${uploadType === 'youtube' ? 'bg-white/10' : 'text-gray-400'}`}>YouTube Link</button>
                                </div>
                            </div>
                            {uploadType === 'file' ? <UploadArea onFileSelect={handleFileSelect} accept="video/mp4,video/quicktime" /> : <YouTubeUploadArea onLinkSubmit={handleLinkSubmit} />}
                        </>
                    ) : (
                        <UploadArea onFileSelect={handleFileSelect} accept="image/png,image/jpeg,image/gif" />
                    )}
                     <button onClick={resetUpload} className="block mx-auto mt-8 px-6 py-2 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors">Back</button>
                </div>
            );
        }
        
        const isAspectRatioSelected = postType === 'image' ? !!aspectRatio : true;

        if (!isPromptSubmitted) {
            return (
                <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8 animate-fade-in">
                    {renderPreview("w-full max-w-sm aspect-[9/16] rounded-2xl object-cover bg-black/50 border border-white/10")}
                    
                    {postType === 'image' && !aspectRatio && (
                        <div className="w-full text-center animate-fade-in">
                             <h3 className="text-xl font-bold text-center mb-4">What's the aspect ratio?</h3>
                            <div className="flex justify-center gap-3">
                                {(['16:9', '9:16', '1:1'] as const).map(ratio => (
                                    <button key={ratio} onClick={() => setAspectRatio(ratio)} className="px-5 py-2 rounded-full text-sm font-semibold bg-white/5 border border-white/20 hover:bg-white/10">
                                        {ratio} {ratio === '16:9' ? '(Landscape)' : ratio === '9:16' ? '(Portrait)' : '(Square)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {isAspectRatioSelected && (
                        <>
                            <div>
                                <h3 className="text-xl font-bold text-center mb-4">Select the AI model you used</h3>
                                <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4 no-scrollbar">
                                    {AI_MODELS.map(model => (<button key={model} onClick={() => setSelectedModel(model)} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all border ${selectedModel === model ? 'bg-white text-black border-white' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>{model}</button>))}
                                </div>
                            </div>

                            {selectedModel && (
                                <div className="w-full animate-fade-in">
                                    <label htmlFor="prompt-input" className="block text-xl font-bold mb-3">What prompt did you use?</label>
                                    <textarea id="prompt-input" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={`e.g., A cinematic shot of a raccoon...`} className="w-full h-32 p-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-gray-400 resize-none" />
                                    <div className="flex justify-end gap-4 mt-4">
                                       <button onClick={resetUpload} className="px-6 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors">Start Over</button>
                                        <button onClick={() => setIsPromptSubmitted(true)} disabled={!prompt} className="px-8 py-3 rounded-full text-sm font-semibold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-px active:translate-y-px transition-all">Continue</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto animate-fade-in">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold">Add your post details</h2>
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
                        <input type="text" id="hashtags" placeholder="#AI #generative #art" value={hashtags} onChange={e => setHashtags(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white" />
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
                           <button onClick={resetUpload} disabled={isSubmitting} className="px-6 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50">Cancel</button>
                            <button onClick={handlePost} disabled={isSubmitting} className="px-10 py-3 rounded-full text-sm font-semibold bg-white text-black shadow-lg hover:shadow-xl transform hover:-translate-y-px active:translate-y-px transition-all disabled:opacity-50">{isSubmitting ? 'Posting...' : 'Post'}</button>
                        </div>
                        {submissionStatus && <p className={`text-sm pr-2 ${submissionStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{submissionStatus.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-center lg:items-start pt-12">
                    <div className="relative w-48 group">
                         {renderPreview("w-full aspect-auto rounded-xl object-cover bg-black/50")}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">What will you create?</h1>
            </header>
            {renderUploadContent()}
        </div>
    );
};

export default CreatePage;
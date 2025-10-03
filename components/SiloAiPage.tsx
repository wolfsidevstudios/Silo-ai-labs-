import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApiKey } from '../contexts/ApiKeyContext';

const SiloAiPage: React.FC = () => {
    const { apiKey } = useApiKey();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [shuffledImageUrl, setShuffledImageUrl] = useState<string | null>(null);
    const [aiGeneratedPixelArtUrl, setAiGeneratedPixelArtUrl] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isGeneratingPixelArt, setIsGeneratingPixelArt] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [idea, setIdea] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [promptError, setPromptError] = useState('');

    const handleGeneratePrompt = async () => {
        if (!idea.trim()) {
            setPromptError('Please enter an idea to expand.');
            return;
        }
        if (!apiKey) {
            setPromptError('Please set your Gemini API key in your profile settings to use this feature.');
            return;
        }
        setIsGeneratingPrompt(true);
        setPromptError('');
        setGeneratedPrompt('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = "You are an expert prompt engineer for generative AI models. Your task is to take a user's simple idea and expand it into a detailed, paragraph-style prompt. The prompt should be rich in visual descriptions, including details about the subject, environment, lighting, camera angle, and overall mood or style. Do not add any conversational text or explanations, just output the final prompt.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Idea: "${idea}"`,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            setGeneratedPrompt(response.text);
        } catch (err: any) {
            console.error("Error generating prompt:", err);
            setPromptError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsGeneratingPrompt(false);
        }
    };

    const shufflePixels = useCallback((imageUrl: string) => {
        if (!canvasRef.current) return;
        setIsShuffling(true);
        setShuffledImageUrl(null);
        setAiGeneratedPixelArtUrl(null);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const gridSize = 16;
            const cols = Math.floor(img.width / gridSize);
            const rows = Math.floor(img.height / gridSize);
            const cells = [];

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    cells.push(ctx.getImageData(x * gridSize, y * gridSize, gridSize, gridSize));
                }
            }
            
            for (let i = cells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cells[i], cells[j]] = [cells[j], cells[i]];
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let cellIndex = 0;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (cells[cellIndex]) {
                        ctx.putImageData(cells[cellIndex], x * gridSize, y * gridSize);
                    }
                    cellIndex++;
                }
            }

            setShuffledImageUrl(canvas.toDataURL());
            setIsShuffling(false);
        };
        img.onerror = () => {
          alert("Error loading image. Please try another image, perhaps from a different source.");
          setIsShuffling(false);
        }
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                setUploadedImage(url);
                shufflePixels(url);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReshuffle = () => {
        if (uploadedImage) {
            shufflePixels(uploadedImage);
        }
    }

    const handleAiGeneratePixelArt = () => {
        if (!shuffledImageUrl || !canvasRef.current) {
            alert("No shuffled image to generate from.");
            return;
        }

        setIsGeneratingPixelArt(true);
        setAiGeneratedPixelArtUrl(null);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setIsGeneratingPixelArt(false);
                return;
            }

            const img = new Image();
            img.src = shuffledImageUrl;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.filter = 'brightness(1.2) contrast(1.1) saturate(1.4) blur(0.5px)';
                ctx.drawImage(img, 0, 0);
                ctx.filter = 'none';

                setAiGeneratedPixelArtUrl(canvas.toDataURL());
                setIsGeneratingPixelArt(false);
            };
            img.onerror = () => {
                setIsGeneratingPixelArt(false);
                alert("Failed to process the shuffled image.");
            };
        }, 2500);
    };


    return (
        <div className="animate-fade-in space-y-16">
            <header className="text-center">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">Silo AI Creative Suite</h1>
                <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
                    Your personal playground for AI-powered content creation. Generate, remix, and reimagine.
                </p>
            </header>

            {/* AI Image Generator */}
            <section>
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-200">Generate with Prompts</h2>
                <div className="max-w-3xl mx-auto">
                    <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center">
                        <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-purple-300 bg-purple-500/20 rounded-full border border-purple-400/30">
                            COMING SOON
                        </div>
                        <p className="text-gray-400 mb-4">The AI image generator is currently under development. Soon you'll be able to turn your text prompts into stunning visuals right here.</p>
                        <div className="relative flex items-center w-full h-16 bg-black/20 border border-white/20 rounded-full p-2 shadow-lg">
                            <input
                                type="text"
                                disabled
                                placeholder="e.g., A robot meditating in a cherry blossom forest, synthwave..."
                                className="w-full h-full bg-transparent pl-6 pr-40 text-lg text-white placeholder-gray-500 focus:outline-none cursor-not-allowed"
                                aria-label="Image generation prompt (coming soon)"
                            />
                            <button
                                disabled
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-white rounded-full flex items-center justify-center text-black font-semibold cursor-not-allowed opacity-60"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            </section>

             {/* AI Prompt Assistant */}
            <section>
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-200">AI Prompt Assistant</h2>
                <div className="max-w-3xl mx-auto">
                    <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center space-y-4">
                        {!apiKey && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm text-left">
                                <strong>API Key Required:</strong> Please go to your profile settings and add your Gemini API key in the "Integrations" tab to use this feature.
                            </div>
                        )}
                        <p className="text-gray-400">Enter a simple idea, and our AI assistant will expand it into a detailed prompt ready for any image or video generator.</p>
                        <textarea
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="e.g., A cat wearing a wizard hat"
                            className="w-full h-24 p-4 bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 resize-none"
                            aria-label="Prompt idea input"
                            disabled={isGeneratingPrompt || !apiKey}
                        />
                        <button
                            onClick={handleGeneratePrompt}
                            disabled={isGeneratingPrompt || !apiKey}
                            className="h-12 px-8 bg-white rounded-full flex items-center justify-center text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto mx-auto shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out"
                        >
                            {isGeneratingPrompt ? 'Generating...' : '✨ Generate Prompt'}
                        </button>
                        {promptError && <p className="text-red-400 text-sm">{promptError}</p>}
                        {generatedPrompt && (
                            <div className="text-left p-4 bg-black/30 rounded-lg border border-white/10 mt-4 animate-fade-in space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-200">Generated Prompt:</h4>
                                    <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-300">Copy</button>
                                </div>
                                <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{generatedPrompt}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            <div className="border-b border-white/10 max-w-4xl mx-auto"></div>

            {/* Pixel Grid Rearranger */}
            <section>
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-200">Pixel Grid Rearranger</h2>
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                     <p className="text-gray-400 text-center">Upload an image to deconstruct it, then generate a new piece of abstract art from its pixels.</p>
                    <div className="flex gap-4">
                        <label className="px-8 py-3 rounded-full text-sm font-semibold bg-white text-black cursor-pointer shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out">
                            {uploadedImage ? 'Upload Another' : 'Upload Image'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {uploadedImage && (
                            <button onClick={handleReshuffle} disabled={isShuffling || isGeneratingPixelArt} className="px-8 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50">
                                {isShuffling ? 'Shuffling...' : 'Re-Shuffle'}
                            </button>
                        )}
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden"></canvas>

                    {isShuffling && <div className="text-center mt-4 text-gray-400">Rearranging pixels...</div>}

                    {(uploadedImage) && !isShuffling && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4 animate-fade-in">
                            <div className="text-center">
                                <h3 className="font-semibold mb-2 text-gray-300">Original</h3>
                                <img src={uploadedImage ?? ''} alt="Original" className="rounded-xl w-full aspect-square object-cover" />
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="font-semibold text-gray-300">Shuffled</h3>
                                {shuffledImageUrl && <img src={shuffledImageUrl} alt="Shuffled" className="rounded-xl w-full aspect-square object-cover" />}
                                {shuffledImageUrl && (
                                    <button onClick={handleAiGeneratePixelArt} disabled={isGeneratingPixelArt} className="px-8 py-3 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-all duration-200 ease-in-out disabled:opacity-50 w-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-px active:translate-y-px active:shadow-inner">
                                        {isGeneratingPixelArt ? 'Generating...' : '✨ Generate AI Image'}
                                    </button>
                                )}
                            </div>
                             <div className="text-center">
                                <h3 className="font-semibold mb-2 text-gray-300">AI Generated</h3>
                                {isGeneratingPixelArt && (
                                    <div className="w-full aspect-square bg-white/5 rounded-xl flex items-center justify-center">
                                        <div className="text-gray-400 animate-pulse">Turning pixels into art...</div>
                                    </div>
                                )}
                                {aiGeneratedPixelArtUrl && (
                                  <div className="space-y-4">
                                    <img src={aiGeneratedPixelArtUrl} alt="AI Generated from Pixels" className="rounded-xl w-full aspect-square object-cover" />
                                    <div className="flex justify-center gap-4">
                                        <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors">
                                          Download
                                        </button>
                                        <button className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transform hover:-translate-y-px active:translate-y-px active:shadow-inner transition-all duration-200 ease-in-out">
                                          Publish
                                        </button>
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SiloAiPage;
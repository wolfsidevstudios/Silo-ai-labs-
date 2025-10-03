import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SiloAiPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [shuffledImageUrl, setShuffledImageUrl] = useState<string | null>(null);
    const [aiGeneratedPixelArtUrl, setAiGeneratedPixelArtUrl] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGeneratedImageUrl(null);
        setTimeout(() => {
            const randomSeed = encodeURIComponent(prompt);
            setGeneratedImageUrl(`https://picsum.photos/seed/${randomSeed}/1024/1024`);
            setIsGenerating(false);
        }, 2000);
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

    const handleAiGenerate = async () => {
        if (!shuffledImageUrl) {
            alert("No shuffled image to generate from.");
            return;
        }

        setIsAiGenerating(true);
        setAiGeneratedPixelArtUrl(null);

        try {
            const base64Data = shuffledImageUrl.split(',')[1];
            if (!base64Data) {
                throw new Error("Could not extract base64 data from the shuffled image.");
            }

            const imagePart = {
                inlineData: {
                    mimeType: 'image/png',
                    data: base64Data,
                },
            };

            const textPart = {
                text: 'Transform this abstract pixelated image into a beautiful and coherent piece of digital art. Enhance the colors, add interesting textures, and create a sense of depth and form. Make it look cool and futuristic.',
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const generatedBase64 = part.inlineData.data;
                    const newImageUrl = `data:image/png;base64,${generatedBase64}`;
                    setAiGeneratedPixelArtUrl(newImageUrl);
                    foundImage = true;
                    break;
                }
            }

            if (!foundImage) {
                const textResponse = response.text;
                console.error("AI did not return an image. Response:", textResponse);
                alert(`AI did not return an image. It said: "${textResponse || 'No reason given.'}"`);
            }

        } catch (error) {
            console.error("Error generating AI image from pixels:", error);
            alert("An error occurred while generating the AI image. Please try again.");
        } finally {
            setIsAiGenerating(false);
        }
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
                    <div className="relative flex items-center w-full h-16 bg-white/5 border border-white/10 rounded-full p-2 shadow-lg transition-all duration-300 focus-within:border-white/30">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A robot meditating in a cherry blossom forest, synthwave..."
                            className="w-full h-full bg-transparent pl-6 pr-40 text-lg text-white placeholder-gray-500 focus:outline-none"
                            aria-label="Image generation prompt"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-white rounded-full flex items-center justify-center text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    </div>

                    {isGenerating && <div className="text-center mt-8 text-gray-400">Brewing up your creation...</div>}
                    
                    {generatedImageUrl && (
                        <div className="mt-8 p-4 bg-white/5 rounded-2xl animate-fade-in">
                            <img src={generatedImageUrl} alt="Generated by AI" className="rounded-xl w-full aspect-square object-cover" />
                            <div className="flex justify-end gap-4 mt-4">
                               <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors">
                                   Download
                               </button>
                                <button className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black hover:opacity-90 transition-opacity">
                                    Publish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            
            <div className="border-b border-white/10 max-w-4xl mx-auto"></div>

            {/* Pixel Grid Rearranger */}
            <section>
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-200">Pixel Grid Rearranger</h2>
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                     <p className="text-gray-400 text-center">Upload an image to deconstruct it, then generate a new piece of abstract art from its pixels.</p>
                    <div className="flex gap-4">
                        <label className="px-8 py-3 rounded-full text-sm font-semibold bg-white text-black cursor-pointer hover:opacity-90 transition-opacity">
                            {uploadedImage ? 'Upload Another' : 'Upload Image'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {uploadedImage && (
                            <button onClick={handleReshuffle} disabled={isShuffling || isAiGenerating} className="px-8 py-3 rounded-full text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50">
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
                                    <button onClick={handleAiGenerate} disabled={isAiGenerating} className="px-8 py-3 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 w-full">
                                        {isAiGenerating ? 'Generating...' : '✨ Generate AI Image'}
                                    </button>
                                )}
                            </div>
                             <div className="text-center">
                                <h3 className="font-semibold mb-2 text-gray-300">AI Generated</h3>
                                {isAiGenerating && (
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
                                        <button className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black hover:opacity-90 transition-opacity">
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
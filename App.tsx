
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImagesDisplay } from './components/GeneratedImagesDisplay';
import { Button } from './components/Button';
import { MagicWandIcon } from './components/icons/MagicWandIcon';
import { fileToBase64, editImageWithPrompt } from './services/geminiService';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<{ url: string; prompt: string }[]>([]);
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        setOriginalImage(file);
        setGeneratedImages([]);
        setError(null);
        setCustomPrompt('');
        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalImageUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const generateImages = useCallback(async (prompts: string[]) => {
        if (!originalImage) {
            setError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const base64Image = await fileToBase64(originalImage);
            const mimeType = originalImage.type;

            const promises = prompts.map(prompt => 
                editImageWithPrompt(base64Image, mimeType, prompt)
            );
            
            const results = await Promise.all(promises);

            const newGeneratedImages = results.flatMap((resultImages, index) => 
                resultImages.map(url => ({ url, prompt: prompts[index] }))
            );

            setGeneratedImages(newGeneratedImages);
        } catch (e) {
            const err = e as Error;
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage]);

    const handleCustomEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customPrompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        await generateImages([customPrompt]);
    };

    const handleAgeGeneration = async () => {
        await generateImages([
            "Make this person look 20 years younger, maintaining photorealism.",
            "Make this person look 20 years older, maintaining photorealism."
        ]);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700">
                        <h2 className="text-2xl font-bold mb-4 text-sky-400">1. Upload Your Image</h2>
                        <ImageUploader onImageSelect={handleImageSelect} imageUrl={originalImageUrl} />

                        {originalImage && (
                            <div className="mt-6 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-sky-400">2. Choose Your Edit</h2>
                                    <p className="text-slate-400 mb-4">Select a one-click transformation or write your own custom prompt.</p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold text-lg mb-3">Age Transformation</h3>
                                    <Button onClick={handleAgeGeneration} disabled={isLoading}>
                                        <MagicWandIcon />
                                        Generate Age Variations
                                    </Button>
                                </div>
                                
                                <form onSubmit={handleCustomEdit} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold text-lg mb-3">Custom Edit</h3>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={customPrompt}
                                            onChange={(e) => setCustomPrompt(e.target.value)}
                                            placeholder="e.g., 'Add a retro filter'"
                                            className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                                            disabled={isLoading}
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            Apply Custom Edit
                                        </Button>
                                    </div>
                                </form>
                                {error && <p className="text-red-400 mt-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700">
                        <h2 className="text-2xl font-bold mb-4 text-sky-400">3. View Results</h2>
                        <GeneratedImagesDisplay
                            isLoading={isLoading}
                            images={generatedImages}
                            promptsForLoading={isLoading && generatedImages.length === 0 ? (customPrompt ? [customPrompt] : ['Younger Self', 'Older Self']) : []}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;


import React from 'react';
import { Spinner } from './Spinner';

interface GeneratedImagesDisplayProps {
    isLoading: boolean;
    images: { url: string; prompt: string }[];
    promptsForLoading: string[];
}

const LoadingPlaceholder: React.FC<{prompt: string}> = ({prompt}) => (
    <div className="aspect-square bg-slate-700/50 rounded-lg flex flex-col items-center justify-center p-4 animate-pulse">
        <Spinner />
        <p className="mt-4 text-slate-400 text-center text-sm">Generating: "{prompt}"</p>
    </div>
);

export const GeneratedImagesDisplay: React.FC<GeneratedImagesDisplayProps> = ({ isLoading, images, promptsForLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {promptsForLoading.map((prompt, index) => (
                   <LoadingPlaceholder key={index} prompt={prompt} />
               ))}
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center p-4">
                <p className="text-slate-400 text-center">Your generated images will appear here.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {images.map(({ url, prompt }, index) => (
                <div key={index} className="bg-slate-900/50 p-2 rounded-lg border border-slate-700 shadow-lg">
                    <img src={url} alt={`Generated based on: ${prompt}`} className="w-full h-auto rounded-md" />
                    <p className="text-xs text-slate-400 mt-2 p-2 italic">"{prompt}"</p>
                </div>
            ))}
        </div>
    );
};

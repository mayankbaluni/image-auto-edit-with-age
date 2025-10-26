
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-800/30 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Gemini Image <span className="text-sky-400">Age & Edit</span>
                </h1>
                <p className="text-slate-400 mt-1">Transform your photos with AI-powered text prompts.</p>
            </div>
        </header>
    );
};

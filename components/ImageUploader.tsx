
import React, { useRef } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageUrl }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div>
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />
            {imageUrl ? (
                <div className="mt-4 relative group">
                     <p className="text-slate-400 text-sm mb-2">Current Image:</p>
                    <img src={imageUrl} alt="Uploaded preview" className="w-full rounded-lg shadow-lg" />
                    <button 
                        onClick={() => inputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                        Click to change image
                    </button>
                </div>
            ) : (
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="cursor-pointer mt-2 flex justify-center w-full h-64 px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md transition hover:border-sky-500 bg-slate-900/50"
                >
                    <div className="space-y-1 text-center self-center">
                        <PhotoIcon />
                        <div className="flex text-sm text-slate-400">
                            <span className="relative rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                </label>
            )}
        </div>
    );
};

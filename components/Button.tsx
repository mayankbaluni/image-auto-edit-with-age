
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                bg-sky-600 hover:bg-sky-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900
                transition-all
                disabled:bg-slate-500 disabled:cursor-not-allowed
            `}
        >
            {children}
        </button>
    );
};

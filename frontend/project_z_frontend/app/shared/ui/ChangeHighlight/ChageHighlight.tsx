import React from 'react';

const HIGHLIGHT_CHANGE_CLASSES =
    "bg-primary/20 ring-1 ring-primary/40 shadow-[0_0_12px_rgba(255,163,26,0.15)]";
interface ChangeHighlightProps {
    isChanged?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const ChangeHighlight = ({
    isChanged,
    className = '',
    children,
}: ChangeHighlightProps) => {
    return (
        <div
            className={`transition-all duration-700 ease-out rounded-lg ${isChanged ? HIGHLIGHT_CHANGE_CLASSES : ''
                } ${className}`}
        >
            {children}
        </div>
    );
};
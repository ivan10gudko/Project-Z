import React from 'react';
import { HIGHLIGHT_CHANGE_CLASSES } from '~/shared/constants';

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
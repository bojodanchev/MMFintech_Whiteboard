import React from 'react';
import { cn } from '../../lib/utils';

interface StickyNoteProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        color?: 'yellow' | 'blue' | 'green' | 'pink';
        text?: string;
    };
}

export const StickyNote: React.FC<StickyNoteProps> = ({ width, height, selected, data }) => {
    const color = data?.color || 'yellow';
    const text = data?.text || 'Add a note...';

    const bgColors = {
        yellow: 'bg-yellow-200 text-yellow-900',
        blue: 'bg-blue-200 text-blue-900',
        green: 'bg-green-200 text-green-900',
        pink: 'bg-pink-200 text-pink-900',
    };

    return (
        <div
            style={{ width, height }}
            className={cn(
                "shadow-lg flex flex-col overflow-hidden p-4 font-handwriting",
                bgColors[color],
                selected && "ring-2 ring-accent"
            )}
        >
            <div className="flex-1 w-full h-full whitespace-pre-wrap break-words overflow-hidden text-sm leading-relaxed">
                {text}
            </div>
        </div>
    );
};

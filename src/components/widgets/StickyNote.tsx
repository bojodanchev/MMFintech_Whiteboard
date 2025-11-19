import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { ThumbsUp, Flag } from 'lucide-react';

interface StickyNoteProps {
    id: string;
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        color?: 'yellow' | 'blue' | 'green' | 'pink';
        text?: string;
        votes?: number;
        priority?: 'high' | 'medium' | 'low';
    };
}

export const StickyNote: React.FC<StickyNoteProps> = ({ id, width, height, selected, data }) => {
    const { updateElement } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    
    const color = data?.color || 'yellow';
    const text = data?.text || 'Add a note...';
    const votes = data?.votes || 0;
    const priority = data?.priority || 'medium';

    const bgColors = {
        yellow: 'bg-yellow-200 text-yellow-900',
        blue: 'bg-blue-200 text-blue-900',
        green: 'bg-green-200 text-green-900',
        pink: 'bg-pink-200 text-pink-900',
    };

    const priorityColors = {
        high: 'text-red-600',
        medium: 'text-yellow-600',
        low: 'text-blue-600'
    };

    const handleVote = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Use functional update to ensure we have latest data
        const currentData = data || {};
        updateElement(id, { data: { ...currentData, votes: (currentData.votes || 0) + 1 } });
    };

    const togglePriority = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next: Record<string, 'high' | 'medium' | 'low'> = {
            'low': 'medium',
            'medium': 'high',
            'high': 'low'
        };
        const currentData = data || {};
        const currentPriority = currentData.priority || 'medium';
        updateElement(id, { data: { ...currentData, priority: next[currentPriority] } });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentData = data || {};
        updateElement(id, { data: { ...currentData, text: e.target.value } });
    };

    return (
        <div
            style={{ width, height }}
            className={cn(
                "shadow-lg flex flex-col overflow-hidden font-handwriting relative group transition-shadow duration-200",
                bgColors[color],
                selected && "ring-2 ring-accent shadow-xl"
            )}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
            }}
        >
            {isEditing ? (
                <textarea
                    autoFocus
                    className="flex-1 w-full h-full bg-transparent resize-none outline-none p-4 text-sm leading-relaxed font-handwriting placeholder-opacity-50"
                    value={text}
                    onChange={handleTextChange}
                    onBlur={() => setIsEditing(false)}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="Type your note here..."
                />
            ) : (
                <div className="flex-1 w-full h-full whitespace-pre-wrap break-words overflow-hidden p-4 text-sm leading-relaxed">
                    {text}
                </div>
            )}

            {/* Controls - Visible on hover */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <button 
                    onClick={togglePriority}
                    className={cn("p-1.5 rounded-full hover:bg-black/10 transition-colors", priorityColors[priority])}
                    title={`Priority: ${priority}`}
                >
                    <Flag size={14} fill={priority === 'high' ? 'currentColor' : 'none'} />
                </button>
                <button 
                    onClick={handleVote}
                    className="flex items-center gap-1 p-1.5 rounded-full hover:bg-black/10 transition-colors text-xs font-bold"
                    title="Vote"
                >
                    <ThumbsUp size={14} />
                    <span>{votes > 0 && votes}</span>
                </button>
            </div>
            
            {/* Always visible indicators when inactive */}
            {!isEditing && (votes > 0 || priority !== 'medium') && (
                 <div className="absolute bottom-2 left-2 flex items-center gap-2 pointer-events-none opacity-80">
                    {priority === 'high' && <Flag size={12} className="text-red-600" fill="currentColor" />}
                    {priority === 'low' && <Flag size={12} className="text-blue-600" />}
                    {votes > 0 && (
                        <div className="flex items-center gap-0.5 text-xs font-bold">
                            <ThumbsUp size={10} />
                            <span>{votes}</span>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};

import React from 'react';
import { cn } from '../lib/utils';

interface ResizeHandlesProps {
    width: number;
    height: number;
    onResizeStart: (e: React.MouseEvent, handle: string) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart }) => {
    const handles = [
        { id: 'nw', cursor: 'nw-resize', style: { top: -4, left: -4 } },
        { id: 'ne', cursor: 'ne-resize', style: { top: -4, right: -4 } },
        { id: 'sw', cursor: 'sw-resize', style: { bottom: -4, left: -4 } },
        { id: 'se', cursor: 'se-resize', style: { bottom: -4, right: -4 } },
        // Edge handles can be added later if needed, starting with corners for simplicity
    ];

    return (
        <>
            {/* Border indicator */}
            <div className="absolute inset-0 border-2 border-accent pointer-events-none" />

            {/* Handles */}
            {handles.map((handle) => (
                <div
                    key={handle.id}
                    onMouseDown={(e) => onResizeStart(e, handle.id)}
                    className={cn(
                        "absolute w-3 h-3 bg-background border border-accent rounded-full z-50",
                        "hover:bg-accent hover:scale-125 transition-transform"
                    )}
                    style={{
                        cursor: handle.cursor,
                        ...handle.style
                    }}
                />
            ))}
        </>
    );
};

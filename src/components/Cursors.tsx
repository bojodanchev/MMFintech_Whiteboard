import React, { useEffect, useState } from 'react';
import { MousePointer2 } from 'lucide-react';

const mockCursors = [
    { id: 1, color: '#ef4444', label: 'Alice' },
    { id: 2, color: '#3b82f6', label: 'Bob' },
];

export const Cursors: React.FC = () => {
    const [positions, setPositions] = useState<{ [key: number]: { x: number, y: number } }>({
        1: { x: 200, y: 200 },
        2: { x: 500, y: 400 },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPositions(prev => {
                const next = { ...prev };
                mockCursors.forEach(cursor => {
                    // Random walk
                    const cx = next[cursor.id]?.x || 0;
                    const cy = next[cursor.id]?.y || 0;
                    next[cursor.id] = {
                        x: cx + (Math.random() - 0.5) * 20,
                        y: cy + (Math.random() - 0.5) * 20,
                    };
                });
                return next;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
            {mockCursors.map(cursor => (
                <div
                    key={cursor.id}
                    className="absolute transition-all duration-75 ease-linear flex flex-col gap-1"
                    style={{
                        transform: `translate(${positions[cursor.id]?.x}px, ${positions[cursor.id]?.y}px)`
                    }}
                >
                    <MousePointer2
                        size={16}
                        fill={cursor.color}
                        color={cursor.color}
                        className="transform -rotate-12"
                    />
                    <div
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: cursor.color }}
                    >
                        {cursor.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

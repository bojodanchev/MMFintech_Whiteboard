import React from 'react';
import { Plus, Minus, Maximize } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ZoomControls: React.FC = () => {
    const { scale, setScale } = useStore();

    const handleZoomIn = () => setScale(Math.min(scale + 0.1, 5));
    const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.1));
    const handleReset = () => setScale(1);

    return (
        <div className="fixed bottom-8 left-4 flex items-center gap-2 bg-card border border-border p-1 rounded-lg shadow-lg z-50">
            <button onClick={handleZoomOut} className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground">
                <Minus size={16} />
            </button>
            <span className="text-xs font-mono w-12 text-center text-muted-foreground">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground">
                <Plus size={16} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={handleReset} className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground" title="Reset Zoom">
                <Maximize size={16} />
            </button>
        </div>
    );
};

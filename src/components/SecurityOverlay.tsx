import React from 'react';
import { Lock } from 'lucide-react';

export const SecurityOverlay: React.FC = () => {
    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            {/* Classification Banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-fintech-teal/50" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-fintech-navy text-fintech-slate text-[10px] flex items-center justify-center gap-2 border-t border-border">
                <Lock size={10} />
                <span>MM FINTECH - CONFIDENTIAL - INTERNAL USE ONLY</span>
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <div className="text-9xl font-black -rotate-12 whitespace-nowrap">
                    MM FINTECH
                </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute bottom-8 right-4 bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm">
                Restricted Access
            </div>
        </div>
    );
};

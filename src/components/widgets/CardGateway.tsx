import React from 'react';
import { Globe, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CardGatewayProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        gateway?: string;
        region?: string;
    };
}

export const CardGateway: React.FC<CardGatewayProps> = ({ width, height, selected, data }) => {
    const gateway = data?.gateway || 'Visa';
    const region = data?.region || 'Global';

    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-gradient-to-br from-slate-800 to-slate-900 border border-border rounded-xl shadow-md flex flex-col overflow-hidden relative",
                selected && "ring-2 ring-accent"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}
            />

            <div className="flex-1 flex flex-col justify-between p-4 relative z-10">
                <div className="flex justify-between items-start">
                    <Globe size={20} className="text-fintech-teal" />
                    <Wifi size={16} className="text-green-500" />
                </div>

                <div>
                    <div className="text-2xl font-bold text-white tracking-tight">{gateway}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {region} Network
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { CreditCard, Cpu, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CardIssuanceProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        type?: 'virtual' | 'physical';
        bin?: string;
        network?: 'Visa' | 'Mastercard';
    };
}

export const CardIssuance: React.FC<CardIssuanceProps> = ({ width, height, selected, data }) => {
    const type = data?.type || 'virtual';
    const bin = data?.bin || '4242 42';
    const network = data?.network || 'Visa';

    return (
        <div
            style={{ width, height }}
            className={cn(
                "rounded-xl shadow-md flex flex-col overflow-hidden relative p-4 text-white",
                selected && "ring-2 ring-accent",
                type === 'virtual' ? "bg-gradient-to-br from-indigo-600 to-purple-700" : "bg-gradient-to-br from-slate-700 to-slate-900"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <Cpu size={24} className="opacity-50" />
                <Wifi size={20} className="rotate-90 opacity-50" />
            </div>

            <div className="mt-auto">
                <div className="text-lg font-mono tracking-widest opacity-90">{bin}** **** ****</div>
                <div className="flex justify-between items-end mt-2">
                    <div className="text-xs opacity-75 uppercase tracking-wider">{type} Card</div>
                    <div className="font-bold italic">{network}</div>
                </div>
            </div>

            {/* Chip effect */}
            <div className="absolute top-4 left-4 w-8 h-6 bg-yellow-200/20 rounded-sm border border-yellow-200/40" />
        </div>
    );
};

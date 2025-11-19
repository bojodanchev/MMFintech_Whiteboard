import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DigitalWalletProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        balance?: string;
        currency?: string;
        status?: 'active' | 'frozen' | 'closed';
    };
}

export const DigitalWallet: React.FC<DigitalWalletProps> = ({ width, height, selected, data }) => {
    const balance = data?.balance || '1,250.00';
    const currency = data?.currency || 'USD';
    const status = data?.status || 'active';

    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden",
                selected && "ring-2 ring-accent"
            )}
        >
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-fintech-blue/20 flex items-center justify-center text-fintech-blue">
                            <Wallet size={16} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Wallet</span>
                    </div>
                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        status === 'active' ? "bg-green-500/20 text-green-500" :
                        status === 'frozen' ? "bg-yellow-500/20 text-yellow-500" :
                        "bg-red-500/20 text-red-500"
                    )}>
                        {status}
                    </div>
                </div>

                <div>
                    <div className="text-2xl font-bold text-foreground flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground font-normal">{currency}</span>
                        {balance}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                            <ArrowUpRight size={10} />
                            <span>In</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                            <ArrowDownLeft size={10} />
                            <span>Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TransactionNodeProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        value?: string;
        status?: 'verified' | 'pending' | 'rejected';
    };
}

export const TransactionNode: React.FC<TransactionNodeProps> = ({ width, height, selected, data }) => {
    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden",
                selected && "ring-2 ring-accent"
            )}
        >
            <div className="h-8 bg-fintech-blue/30 border-b border-border flex items-center px-3 justify-between">
                <span className="text-xs font-medium text-muted-foreground">Transaction</span>
                <div className={cn("w-2 h-2 rounded-full", data?.status === 'verified' ? 'bg-green-500' : data?.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500')} />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-center items-center gap-2">
                <div className="flex items-center gap-2 text-xl font-bold">
                    <DollarSign size={16} className="text-muted-foreground" />
                    {data?.value || '1,000.00'}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Sender</span>
                    <ArrowRight size={12} />
                    <span>Receiver</span>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaymentProviderProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        provider?: string;
        status?: 'active' | 'maintenance' | 'down';
    };
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ width, height, selected, data }) => {
    const provider = data?.provider || 'Stripe';
    const status = data?.status || 'active';

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'active': return 'text-green-500';
            case 'maintenance': return 'text-yellow-500';
            case 'down': return 'text-red-500';
            default: return 'text-green-500';
        }
    };

    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden",
                selected && "ring-2 ring-accent"
            )}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard size={24} className="text-foreground" />
                </div>
                <div className="text-lg font-bold text-foreground">{provider}</div>
                <div className={cn("flex items-center gap-1 text-xs font-medium uppercase tracking-wider", getStatusColor(status))}>
                    {status === 'active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    <span>{status}</span>
                </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
        </div>
    );
};

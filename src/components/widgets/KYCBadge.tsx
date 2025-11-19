import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KYCBadgeProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        status?: 'verified' | 'pending' | 'rejected';
    };
}

export const KYCBadge: React.FC<KYCBadgeProps> = ({ width, height, selected, data }) => {
    const status = data?.status || 'pending';

    const config = {
        verified: { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'KYC Verified' },
        pending: { icon: Shield, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'KYC Pending' },
        rejected: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'KYC Rejected' },
    };

    const { icon: Icon, color, bg, border, label } = config[status];

    return (
        <div
            style={{ width, height }}
            className={cn(
                "rounded-full flex items-center justify-center gap-2 border backdrop-blur-sm",
                bg, border,
                selected && "ring-2 ring-accent"
            )}
        >
            <Icon size={16} className={color} />
            <span className={cn("text-sm font-medium", color)}>{label}</span>
        </div>
    );
};

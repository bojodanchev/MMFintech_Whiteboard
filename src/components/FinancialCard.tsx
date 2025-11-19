import React from 'react';
import { TrendingUp, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

interface FinancialCardProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        value?: string;
        trend?: number;
    };
}

export const FinancialCard: React.FC<FinancialCardProps> = ({ width, height, selected, data }) => {
    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden",
                selected && "ring-2 ring-accent"
            )}
        >
            {/* Header */}
            <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-muted/30">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-fintech-teal" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Q3 Revenue</span>
                </div>
                <MoreHorizontal size={14} className="text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="text-2xl font-bold text-foreground">{data?.value || '$2.4M'}</div>
                    <div className={cn("flex items-center gap-1 text-xs mt-1", (data?.trend || 12.5) >= 0 ? "text-green-500" : "text-red-500")}>
                        <TrendingUp size={12} className={(data?.trend || 12.5) < 0 ? "rotate-180" : ""} />
                        <span>{data?.trend ? `${data.trend > 0 ? '+' : ''}${data.trend}%` : '+12.5%'} vs last month</span>
                    </div>
                </div>

                {/* Mini Chart Mockup */}
                <div className="h-12 flex items-end gap-1 mt-2">
                    {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-fintech-blue/20 rounded-sm hover:bg-fintech-teal/50 transition-colors"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer / Compliance Tag */}
            <div className="h-6 bg-fintech-navy/50 flex items-center px-3 border-t border-border">
                <span className="text-[10px] text-fintech-slate">CONFIDENTIAL // INTERNAL USE ONLY</span>
            </div>
        </div>
    );
};

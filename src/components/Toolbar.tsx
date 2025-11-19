import React from 'react';
import { useStore } from '../store/useStore';
import { MousePointer2, Hand, Square, Circle, Type, TrendingUp, Activity, ArrowRightLeft, ShieldCheck, Globe, CreditCard, Server, Wallet, StickyNote } from 'lucide-react';
import { cn } from '../lib/utils';

export const Toolbar: React.FC = () => {
    const { tool, setTool } = useStore();

    const toolGroups = [
        {
            label: 'Essentials',
            tools: [
                { id: 'select', icon: MousePointer2, label: 'Select (V)' },
                { id: 'pan', icon: Hand, label: 'Pan (H)' },
            ]
        },
        {
            label: 'Shapes',
            tools: [
                { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
                { id: 'circle', icon: Circle, label: 'Circle (O)' },
                { id: 'text', icon: Type, label: 'Text (T)' },
            ]
        },
        {
            label: 'Fintech',
            tools: [
                { id: 'financial-card', icon: Activity, label: 'Widget' },
                { id: 'transaction-node', icon: ArrowRightLeft, label: 'Transaction' },
                { id: 'kyc-badge', icon: ShieldCheck, label: 'KYC' },
                { id: 'api-endpoint', icon: Server, label: 'API' },
                { id: 'payment-provider', icon: CreditCard, label: 'Payment Provider' },
                { id: 'card-gateway', icon: Globe, label: 'Card Gateway' },
                { id: 'digital-wallet', icon: Wallet, label: 'Wallet' },
                { id: 'card-issuance', icon: CreditCard, label: 'Issuance' },
            ]
        },
        {
            label: 'Collaboration',
            tools: [
                { id: 'sticky-note', icon: StickyNote, label: 'Note (N)' },
            ]
        }
    ];

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-xl p-2 flex gap-2 z-50 items-center">
            {toolGroups.map((group, groupIndex) => (
                <React.Fragment key={group.label}>
                    {groupIndex > 0 && <div className="w-px h-6 bg-border mx-1" />}
                    {group.tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id as any)}
                            className={cn(
                                "p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground relative group",
                                tool === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                            title={t.label}
                        >
                            <t.icon size={20} />
                            {/* Tooltip */}
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {t.label}
                            </span>
                        </button>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface PaymentFlowProps {
    width: number;
    height: number;
    selected: boolean;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({ width, height, selected }) => {
    const states = [
        { label: 'Initiated', icon: Clock, color: 'bg-blue-500' },
        { label: 'Processing', icon: Loader2, color: 'bg-yellow-500' },
        { label: 'Completed', icon: CheckCircle2, color: 'bg-green-500' },
        { label: 'Failed', icon: XCircle, color: 'bg-red-500' },
    ];

    return (
        <div
            className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 p-4 transition-all ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-slate-600'
                }`}
            style={{ width, height }}
        >
            <div className="text-white font-semibold text-sm mb-4 text-center">Payment Flow</div>

            <div className="flex items-center justify-between gap-2">
                {states.map((state, idx) => (
                    <React.Fragment key={state.label}>
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`${state.color} rounded-full p-2 shadow-lg`}>
                                <state.icon size={16} className="text-white" />
                            </div>
                            <span className="text-xs text-slate-300 text-center">{state.label}</span>
                        </div>
                        {idx < states.length - 1 && (
                            <ArrowRight size={16} className="text-slate-500 flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

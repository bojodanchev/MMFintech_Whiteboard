import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface IncidentTimelineProps {
    width: number;
    height: number;
    selected: boolean;
    data?: {
        events?: Array<{ timestamp: string; message: string; severity: 'critical' | 'warning' | 'info' | 'resolved' }>;
    };
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ width, height, selected, data }) => {
    const events = data?.events || [
        { timestamp: '12:00', message: 'Service degradation detected', severity: 'warning' as const },
        { timestamp: '12:15', message: 'Database connection lost', severity: 'critical' as const },
        { timestamp: '12:30', message: 'Failover initiated', severity: 'info' as const },
        { timestamp: '12:45', message: 'Service restored', severity: 'resolved' as const },
    ];

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' };
            case 'warning':
                return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500' };
            case 'resolved':
                return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' };
            default:
                return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' };
        }
    };

    return (
        <div
            className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 p-4 transition-all ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-slate-600'
                }`}
            style={{ width, height }}
        >
            <div className="text-white font-semibold text-sm mb-3">Incident Timeline</div>

            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: height - 50 }}>
                {events.map((event, idx) => {
                    const config = getSeverityConfig(event.severity);
                    const Icon = config.icon;

                    return (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 text-xs text-slate-400 pt-1">
                                {event.timestamp}
                            </div>
                            <div className={`flex-1 ${config.bg} ${config.border} border-l-2 pl-3 py-2 rounded`}>
                                <div className="flex items-center gap-2">
                                    <Icon size={14} className={config.color} />
                                    <span className="text-xs text-slate-200">{event.message}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

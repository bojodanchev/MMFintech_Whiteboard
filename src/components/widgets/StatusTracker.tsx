import React from 'react';
import { Activity, Clock, AlertCircle } from 'lucide-react';

interface StatusTrackerProps {
    width: number;
    height: number;
    selected: boolean;
    data?: {
        serviceName?: string;
        status?: 'active' | 'maintenance' | 'down';
        uptime?: string;
        responseTime?: string;
        errorRate?: string;
    };
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ width, height, selected, data }) => {
    const serviceName = data?.serviceName || 'Payment API';
    const status = data?.status || 'active';
    const uptime = data?.uptime || '99.9%';
    const responseTime = data?.responseTime || '45ms';
    const errorRate = data?.errorRate || '0.01%';

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return { color: 'bg-green-500', text: 'Active', pulse: true };
            case 'maintenance':
                return { color: 'bg-yellow-500', text: 'Maintenance', pulse: false };
            case 'down':
                return { color: 'bg-red-500', text: 'Down', pulse: true };
            default:
                return { color: 'bg-gray-500', text: 'Unknown', pulse: false };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <div
            className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 p-4 transition-all ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-slate-600'
                }`}
            style={{ width, height }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-white font-semibold text-sm">{serviceName}</div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`} />
                    <span className="text-xs text-slate-300">{statusConfig.text}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded">
                        <Activity size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-400">Uptime</div>
                        <div className="text-sm text-white font-semibold">{uptime}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded">
                        <Clock size={16} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-400">Response Time</div>
                        <div className="text-sm text-white font-semibold">{responseTime}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded">
                        <AlertCircle size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-400">Error Rate</div>
                        <div className="text-sm text-white font-semibold">{errorRate}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

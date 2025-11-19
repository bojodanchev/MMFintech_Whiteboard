import React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

interface APIEndpointProps {
    width: number;
    height: number;
    selected?: boolean;
    data?: {
        method?: 'GET' | 'POST';
        endpoint?: string;
    };
}

export const APIEndpoint: React.FC<APIEndpointProps> = ({ width, height, selected, data }) => {
    const method = data?.method || 'GET';
    const endpoint = data?.endpoint || '/api/v1/resource';

    return (
        <div
            style={{ width, height }}
            className={cn(
                "bg-fintech-navy border border-border rounded-md shadow-md flex flex-col overflow-hidden font-mono",
                selected && "ring-2 ring-accent"
            )}
        >
            <div className="flex items-center h-full">
                <div className={cn(
                    "h-full px-3 flex items-center justify-center text-xs font-bold text-white border-r border-border",
                    method === 'GET' ? 'bg-blue-600' : 'bg-green-600'
                )}>
                    {method}
                </div>
                <div className="flex-1 px-3 flex items-center gap-2 text-xs text-fintech-light truncate">
                    <Globe size={12} className="text-muted-foreground" />
                    {endpoint}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { Database, Key, Link } from 'lucide-react';

interface DatabaseTableProps {
    width: number;
    height: number;
    selected: boolean;
    data?: {
        tableName?: string;
        columns?: Array<{ name: string; type: string; isPrimary?: boolean; isForeign?: boolean }>;
    };
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({ width, height, selected, data }) => {
    const tableName = data?.tableName || 'table_name';
    const columns = data?.columns || [
        { name: 'id', type: 'INTEGER', isPrimary: true },
        { name: 'created_at', type: 'TIMESTAMP' },
        { name: 'user_id', type: 'INTEGER', isForeign: true },
    ];

    return (
        <div
            className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 transition-all ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-slate-600'
                }`}
            style={{ width, height }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2 rounded-t-md flex items-center gap-2">
                <Database size={16} className="text-white" />
                <span className="text-white font-semibold text-sm">{tableName}</span>
            </div>

            {/* Columns */}
            <div className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: height - 40 }}>
                {columns.map((col, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-2 px-2 py-1 bg-slate-700/50 rounded text-xs hover:bg-slate-700 transition-colors"
                    >
                        {col.isPrimary && <Key size={12} className="text-yellow-400" />}
                        {col.isForeign && <Link size={12} className="text-blue-400" />}
                        <span className="text-cyan-300 font-mono">{col.name}</span>
                        <span className="text-slate-400 ml-auto">{col.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

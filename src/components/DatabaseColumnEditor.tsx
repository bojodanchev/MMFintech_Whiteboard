import React, { useState } from 'react';
import { Plus, Trash2, Key, Link as LinkIcon } from 'lucide-react';

interface Column {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
}

interface DatabaseColumnEditorProps {
    columns: Column[];
    onChange: (columns: Column[]) => void;
}

const DATA_TYPES = [
    'INTEGER',
    'VARCHAR',
    'TEXT',
    'TIMESTAMP',
    'BOOLEAN',
    'DECIMAL',
    'DATE',
    'UUID',
];

export const DatabaseColumnEditor: React.FC<DatabaseColumnEditorProps> = ({ columns, onChange }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addColumn = () => {
        const newColumn: Column = {
            name: 'new_column',
            type: 'VARCHAR',
            isPrimary: false,
            isForeign: false,
        };
        onChange([...columns, newColumn]);
        setEditingIndex(columns.length);
    };

    const updateColumn = (index: number, updates: Partial<Column>) => {
        const updated = columns.map((col, i) => (i === index ? { ...col, ...updates } : col));
        onChange(updated);
    };

    const deleteColumn = (index: number) => {
        onChange(columns.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                    {columns.length} column{columns.length !== 1 ? 's' : ''}
                </span>
                <button
                    onClick={addColumn}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 hover:bg-accent/20 rounded transition-colors"
                >
                    <Plus size={12} />
                    Add
                </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {columns.map((column, index) => (
                    <div
                        key={index}
                        className="border border-border rounded p-2 space-y-2 bg-background/50"
                    >
                        <div className="flex items-center gap-1">
                            <input
                                type="text"
                                value={column.name}
                                onChange={(e) => updateColumn(index, { name: e.target.value })}
                                onFocus={() => setEditingIndex(index)}
                                className="flex-1 min-w-0 bg-background border border-input rounded px-1.5 py-1 text-xs"
                                placeholder="name"
                            />
                            <button
                                onClick={() => deleteColumn(index)}
                                className="p-1 hover:bg-destructive/10 rounded transition-colors text-destructive flex-shrink-0"
                                title="Delete"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>

                        <select
                            value={column.type}
                            onChange={(e) => updateColumn(index, { type: e.target.value })}
                            className="w-full bg-background border border-input rounded px-1.5 py-1 text-xs"
                        >
                            {DATA_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2 text-xs flex-wrap">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={column.isPrimary || false}
                                    onChange={(e) => updateColumn(index, { isPrimary: e.target.checked })}
                                    className="rounded w-3 h-3"
                                />
                                <Key size={10} className="text-yellow-500" />
                                <span className="text-[10px]">PK</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={column.isForeign || false}
                                    onChange={(e) => updateColumn(index, { isForeign: e.target.checked })}
                                    className="rounded w-3 h-3"
                                />
                                <LinkIcon size={10} className="text-blue-500" />
                                <span className="text-[10px]">FK</span>
                            </label>
                        </div>
                    </div>
                ))}

                {columns.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                        No columns. Click "Add" to start.
                    </div>
                )}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface TimelineEvent {
    timestamp: string;
    message: string;
    severity: 'critical' | 'warning' | 'info' | 'resolved';
}

interface TimelineEventEditorProps {
    events: TimelineEvent[];
    onChange: (events: TimelineEvent[]) => void;
}

const SEVERITY_CONFIG = {
    critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Warning' },
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Info' },
    resolved: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Resolved' },
};

export const TimelineEventEditor: React.FC<TimelineEventEditorProps> = ({ events, onChange }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addEvent = () => {
        const newEvent: TimelineEvent = {
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            message: 'New event',
            severity: 'info',
        };
        onChange([...events, newEvent]);
        setEditingIndex(events.length);
    };

    const updateEvent = (index: number, updates: Partial<TimelineEvent>) => {
        const updated = events.map((evt, i) => (i === index ? { ...evt, ...updates } : evt));
        onChange(updated);
    };

    const deleteEvent = (index: number) => {
        onChange(events.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                    {events.length} event{events.length !== 1 ? 's' : ''}
                </span>
                <button
                    onClick={addEvent}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 hover:bg-accent/20 rounded transition-colors"
                >
                    <Plus size={12} />
                    Add
                </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {events.map((event, index) => {
                    const config = SEVERITY_CONFIG[event.severity];
                    const Icon = config.icon;

                    return (
                        <div
                            key={index}
                            className={`border border-border rounded p-2 space-y-1.5 ${config.bg}`}
                        >
                            <div className="flex items-center gap-1">
                                <Icon size={14} className={`${config.color} flex-shrink-0`} />
                                <input
                                    type="text"
                                    value={event.timestamp}
                                    onChange={(e) => updateEvent(index, { timestamp: e.target.value })}
                                    onFocus={() => setEditingIndex(index)}
                                    className="w-16 bg-background border border-input rounded px-1.5 py-0.5 text-xs"
                                    placeholder="HH:MM"
                                />
                                <select
                                    value={event.severity}
                                    onChange={(e) => updateEvent(index, { severity: e.target.value as TimelineEvent['severity'] })}
                                    className="flex-1 min-w-0 bg-background border border-input rounded px-1.5 py-0.5 text-xs"
                                >
                                    {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
                                        <option key={key} value={key}>
                                            {cfg.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => deleteEvent(index)}
                                    className="p-1 hover:bg-destructive/10 rounded transition-colors text-destructive flex-shrink-0"
                                    title="Delete"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <textarea
                                value={event.message}
                                onChange={(e) => updateEvent(index, { message: e.target.value })}
                                onFocus={() => setEditingIndex(index)}
                                className="w-full bg-background border border-input rounded px-1.5 py-1 text-xs resize-none"
                                placeholder="Event message"
                                rows={2}
                            />
                        </div>
                    );
                })}

                {events.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                        No events. Click "Add" to start.
                    </div>
                )}
            </div>
        </div>
    );
};

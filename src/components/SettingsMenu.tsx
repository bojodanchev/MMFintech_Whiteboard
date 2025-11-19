import React, { useState, useRef, useEffect } from 'react';
import { Settings, Info, HelpCircle, Moon, Download, LogOut, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { AISettingsDialog } from './AISettingsDialog';
import { useStore } from '../store/useStore';

export const SettingsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAISettings, setShowAISettings] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { elements, connectors } = useStore();

    const handleExport = () => {
        const data = {
            elements,
            connectors,
            version: '1.0.0',
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whiteboard-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuItems = [
        { icon: Moon, label: 'Dark Mode', action: () => console.log('Toggle Theme'), shortcut: '⌘D' },
        { icon: Bot, label: 'AI Configuration', action: () => setShowAISettings(true) },
        { icon: Download, label: 'Export Canvas (JSON)', action: handleExport, shortcut: '⌘E' },
        { type: 'separator' },
        { icon: Info, label: 'About MM Fintech', action: () => console.log('About') },
        { icon: HelpCircle, label: 'Help & Shortcuts', action: () => console.log('Help') },
        { type: 'separator' },
        { icon: LogOut, label: 'Sign Out', action: () => console.log('Sign Out'), className: 'text-red-500 hover:text-red-600 hover:bg-red-500/10' },
    ];

    return (
        <>
            <AISettingsDialog isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
            <div className="absolute top-4 right-4 z-50" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "p-2 rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                        isOpen ? "bg-accent text-accent-foreground rotate-90" : "text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50"
                    )}
                    title="Settings"
                >
                    <Settings size={20} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="px-3 py-2 border-b border-border mb-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</p>
                        </div>
                        {menuItems.map((item, index) => (
                            item.type === 'separator' ? (
                                <div key={index} className="h-px bg-border my-1" />
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.action?.();
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left",
                                        item.className || "text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon size={16} />}
                                        <span>{item.label}</span>
                                    </div>
                                    {item.shortcut && (
                                        <span className="text-xs text-muted-foreground font-mono">{item.shortcut}</span>
                                    )}
                                </button>
                            )
                        ))}
                        <div className="px-3 py-2 border-t border-border mt-1 bg-muted/30">
                            <p className="text-[10px] text-center text-muted-foreground">
                                v1.0.4 • MM Fintech
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

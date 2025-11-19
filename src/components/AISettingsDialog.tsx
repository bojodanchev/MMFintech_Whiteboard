import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Check, AlertCircle, Bot, Server, Key } from 'lucide-react';
import { cn } from '../lib/utils';

import { testAIConnection } from '../services/ai';

interface AISettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AISettingsDialog: React.FC<AISettingsDialogProps> = ({ isOpen, onClose }) => {
    const { aiConfig, setAIConfig } = useStore();
    const [localConfig, setLocalConfig] = useState(aiConfig);
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSave = () => {
        setAIConfig(localConfig);
        onClose();
    };

    const handleTestConnection = async () => {
        setStatus('testing');
        const success = await testAIConnection(localConfig);
        setStatus(success ? 'success' : 'error');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Bot className="text-fintech-blue" size={20} />
                        <h2 className="font-semibold text-foreground">AI Configuration</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Provider Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Provider</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['local', 'openai', 'anthropic'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setLocalConfig({ ...localConfig, provider: p as any })}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize",
                                        localConfig.provider === p
                                            ? "bg-fintech-blue/10 border-fintech-blue text-fintech-blue"
                                            : "bg-background border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Local Settings */}
                    {localConfig.provider === 'local' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Server size={14} />
                                Base URL
                            </label>
                            <input
                                type="text"
                                value={localConfig.baseUrl || ''}
                                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                                placeholder="http://localhost:11434"
                                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-fintech-blue/20 outline-none"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Default for Ollama is http://localhost:11434
                            </p>
                        </div>
                    )}

                    {/* Cloud Settings */}
                    {localConfig.provider !== 'local' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Key size={14} />
                                API Key
                            </label>
                            <input
                                type="password"
                                value={localConfig.apiKey || ''}
                                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                                placeholder={`sk-...`}
                                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-fintech-blue/20 outline-none"
                            />
                        </div>
                    )}

                    {/* Model Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Model Name</label>
                        <input
                            type="text"
                            value={localConfig.model || ''}
                            onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                            placeholder={localConfig.provider === 'local' ? "llama3" : "gpt-4-turbo"}
                            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-fintech-blue/20 outline-none"
                        />
                    </div>

                    {/* Connection Status */}
                    {status !== 'idle' && (
                        <div className={cn(
                            "p-3 rounded-lg text-xs flex items-center gap-2",
                            status === 'testing' && "bg-blue-500/10 text-blue-500",
                            status === 'success' && "bg-green-500/10 text-green-500",
                            status === 'error' && "bg-red-500/10 text-red-500"
                        )}>
                            {status === 'testing' && <span>Testing connection...</span>}
                            {status === 'success' && <><Check size={14} /> <span>Connection successful!</span></>}
                            {status === 'error' && <><AlertCircle size={14} /> <span>Connection failed. Check URL/Key.</span></>}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/30 flex justify-between">
                    <button
                        onClick={handleTestConnection}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Test Connection
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-fintech-blue text-white text-sm font-medium hover:bg-fintech-blue/90 transition-colors shadow-lg shadow-fintech-blue/20"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

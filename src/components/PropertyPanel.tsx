import React from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export const PropertyPanel: React.FC = () => {
    const { selectedIds, elements, updateElement, selectElement } = useStore();

    if (selectedIds.length === 0) return null;

    const selectedId = selectedIds[0];
    const element = elements.find(el => el.id === selectedId);

    if (!element) return null;

    const handleChange = (path: string, value: any) => {
        if (path.startsWith('style.')) {
            const styleField = path.split('.')[1];
            updateElement(selectedId, { style: { ...element.style, [styleField]: value } });
        } else if (path.startsWith('data.')) {
            const dataField = path.split('.')[1];
            updateElement(selectedId, { data: { ...element.data, [dataField]: value } });
        } else {
            updateElement(selectedId, { [path]: value });
        }
    };

    return (
        <div className="fixed top-20 right-4 w-64 bg-card border border-border rounded-lg shadow-xl p-4 z-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Properties</h3>
                <button onClick={() => selectElement('')} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Common Properties */}
                <div className="space-y-1">
                    <label className="text-xs font-medium">Type</label>
                    <div className="text-sm text-muted-foreground capitalize">{element.type.replace('-', ' ')}</div>
                </div>

                {/* Style: Background Color */}
                {(element.type === 'rectangle' || element.type === 'circle') && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Color</label>
                        <div className="flex gap-2">
                            {['#1e293b', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border border-border ${element.style?.backgroundColor === color ? 'ring-2 ring-accent' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleChange('style.backgroundColor', color)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Text Specifics */}
                {element.type === 'text' && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Content</label>
                        <textarea
                            value={element.content || ''}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className="w-full bg-background border border-input rounded px-2 py-1 text-sm min-h-[60px]"
                        />
                    </div>
                )}

                {/* Financial Card Specifics */}
                {element.type === 'financial-card' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Value</label>
                            <input
                                type="text"
                                value={element.data?.value || '$0.00'}
                                onChange={(e) => handleChange('data.value', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Trend (%)</label>
                            <input
                                type="number"
                                value={element.data?.trend || 0}
                                onChange={(e) => handleChange('data.trend', Number(e.target.value))}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Transaction Node Specifics */}
                {element.type === 'transaction-node' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Amount</label>
                            <input
                                type="text"
                                value={element.data?.value || ''}
                                onChange={(e) => handleChange('data.value', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Status</label>
                            <select
                                value={element.data?.status || 'pending'}
                                onChange={(e) => handleChange('data.status', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </>
                )}

                {/* KYC Badge Specifics */}
                {element.type === 'kyc-badge' && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Status</label>
                        <select
                            value={element.data?.status || 'pending'}
                            onChange={(e) => handleChange('data.status', e.target.value)}
                            className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                        >
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                )}

                {/* API Endpoint Specifics */}
                {element.type === 'api-endpoint' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Method</label>
                            <select
                                value={element.data?.method || 'GET'}
                                onChange={(e) => handleChange('data.method', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Endpoint</label>
                            <input
                                type="text"
                                value={element.data?.endpoint || ''}
                                onChange={(e) => handleChange('data.endpoint', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Payment Provider Specifics */}
                {element.type === 'payment-provider' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Provider</label>
                            <select
                                value={element.data?.provider || 'Stripe'}
                                onChange={(e) => handleChange('data.provider', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="Stripe">Stripe</option>
                                <option value="Adyen">Adyen</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Checkout.com">Checkout.com</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Status</label>
                            <select
                                value={element.data?.status || 'active'}
                                onChange={(e) => handleChange('data.status', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="down">Down</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Card Gateway Specifics */}
                {element.type === 'card-gateway' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Gateway</label>
                            <select
                                value={element.data?.gateway || 'Visa'}
                                onChange={(e) => handleChange('data.gateway', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="Amex">Amex</option>
                                <option value="Discover">Discover</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Region</label>
                            <select
                                value={element.data?.region || 'Global'}
                                onChange={(e) => handleChange('data.region', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="Global">Global</option>
                                <option value="North America">North America</option>
                                <option value="Europe">Europe</option>
                                <option value="APAC">APAC</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Digital Wallet Specifics */}
                {element.type === 'digital-wallet' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Balance</label>
                            <input
                                type="text"
                                value={element.data?.balance || ''}
                                onChange={(e) => handleChange('data.balance', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Currency</label>
                            <select
                                value={element.data?.currency || 'USD'}
                                onChange={(e) => handleChange('data.currency', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="BGN">BGN</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Status</label>
                            <select
                                value={element.data?.status || 'active'}
                                onChange={(e) => handleChange('data.status', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="frozen">Frozen</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Card Issuance Specifics */}
                {element.type === 'card-issuance' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Type</label>
                            <select
                                value={element.data?.type || 'virtual'}
                                onChange={(e) => handleChange('data.type', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="virtual">Virtual</option>
                                <option value="physical">Physical</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Network</label>
                            <select
                                value={element.data?.network || 'Visa'}
                                onChange={(e) => handleChange('data.network', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">BIN Range</label>
                            <input
                                type="text"
                                value={element.data?.bin || ''}
                                onChange={(e) => handleChange('data.bin', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Sticky Note Specifics */}
                {element.type === 'sticky-note' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Color</label>
                            <div className="flex gap-2">
                                {['yellow', 'blue', 'green', 'pink'].map(color => (
                                    <button
                                        key={color}
                                        className={`w-6 h-6 rounded-full border border-border ${element.data?.color === color ? 'ring-2 ring-accent' : ''}`}
                                        style={{ backgroundColor: color === 'yellow' ? '#fef08a' : color === 'blue' ? '#bfdbfe' : color === 'green' ? '#bbf7d0' : '#fbcfe8' }}
                                        onClick={() => handleChange('data.color', color)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Note</label>
                            <textarea
                                value={element.data?.text || ''}
                                onChange={(e) => handleChange('data.text', e.target.value)}
                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm min-h-[100px]"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

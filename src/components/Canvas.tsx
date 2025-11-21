import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { FinancialCard } from './FinancialCard';
import { TransactionNode } from './widgets/TransactionNode';
import { KYCBadge } from './widgets/KYCBadge';
import { APIEndpoint } from './widgets/APIEndpoint';
import { PaymentProvider } from './widgets/PaymentProvider';
import { CardGateway } from './widgets/CardGateway';
import { DigitalWallet } from './widgets/DigitalWallet';
import { CardIssuance } from './widgets/CardIssuance';
import { StickyNote } from './widgets/StickyNote';
import { DatabaseTable } from './widgets/DatabaseTable';
import { IncidentTimeline } from './widgets/IncidentTimeline';
import { StatusTracker } from './widgets/StatusTracker';
import { PaymentFlow } from './widgets/PaymentFlow';
import { ResizeHandles } from './ResizeHandles';
import { type CanvasElement } from '../types';

export const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        elements,
        connectors,
        scale,
        offset,
        setOffset,
        setScale,
        tool,
        addElement,
        selectElement,
        selectedIds,
        removeElement,
        addConnector
    } = useStore();

    const [isPanning, setIsPanning] = useState(false);
    const [isDraggingElement, setIsDraggingElement] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState<{ id: string; handle: string; startX: number; startY: number; startWidth: number; startHeight: number; startLeft: number; startTop: number } | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const [connectingStartId, setConnectingStartId] = useState<string | null>(null);
    const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

    // Ghost element dimensions
    const getGhostDimensions = (t: string) => {
        if (t === 'financial-card') return { width: 240, height: 160 };
        if (t === 'transaction-node') return { width: 200, height: 80 };
        if (t === 'kyc-badge') return { width: 140, height: 32 };
        if (t === 'api-endpoint') return { width: 220, height: 40 };
        if (t === 'payment-provider') return { width: 200, height: 120 };
        if (t === 'card-gateway') return { width: 240, height: 140 };
        if (t === 'digital-wallet') return { width: 220, height: 140 };
        if (t === 'card-issuance') return { width: 240, height: 150 };
        if (t === 'sticky-note') return { width: 180, height: 180 };
        if (t === 'database-table') return { width: 200, height: 250 };
        if (t === 'incident-timeline') return { width: 300, height: 300 };
        if (t === 'status-tracker') return { width: 250, height: 180 };
        if (t === 'payment-flow') return { width: 400, height: 120 };
        return { width: 100, height: 100 };
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const newScale = Math.min(Math.max(scale - e.deltaY * zoomSensitivity, 0.1), 5);
            setScale(newScale);
        } else {
            setOffset({ x: offset.x - e.deltaX, y: offset.y - e.deltaY });
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing && selectedIds.length > 0) {
                selectedIds.forEach(id => removeElement(id));
            }

            // Cancel connector on Esc
            if (e.key === 'Escape') {
                setConnectingStartId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, isEditing, removeElement]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || tool === 'pan') {
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (tool === 'select') {
            // If clicking on empty space with select tool, clear selection
            // Note: Clicking on an element stops propagation, so this only fires for empty space
            useStore.getState().selectElement('');
        }
    };

    const handlePlacementClick = (e: React.MouseEvent) => {
        if (tool === 'select' || tool === 'pan' || tool === 'connector') return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Center the element on the mouse cursor
        const dims = getGhostDimensions(tool);
        const rawX = (e.clientX - rect.left - offset.x) / scale;
        const rawY = (e.clientY - rect.top - offset.y) / scale;

        const x = rawX - dims.width / 2;
        const y = rawY - dims.height / 2;

        addElement({
            id: crypto.randomUUID(),
            type: tool,
            x,
            y,
            width: dims.width,
            height: dims.height,
            style: (tool === 'rectangle' || tool === 'circle') ? { backgroundColor: '#1e293b', borderColor: '#64ffda', borderWidth: 2 } : {},
            data: {}
        });

        useStore.getState().setTool('select');
    };

    const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tool === 'select') {
            selectElement(id);
            setIsDraggingElement(id);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (tool === 'connector') {
            setConnectingStartId(id);
        }
    };

    const handleElementMouseUp = (e: React.MouseEvent, id: string) => {
        // Only stop propagation if we actually performed an action that should consume the event
        if (tool === 'connector' && connectingStartId && connectingStartId !== id) {
            e.stopPropagation();
            addConnector({
                id: crypto.randomUUID(),
                sourceId: connectingStartId,
                targetId: id
            });
            setConnectingStartId(null);
        }
    };

    const handleResizeStart = (e: React.MouseEvent, id: string, handle: string, el: any) => {
        e.stopPropagation();
        setIsResizing({
            id,
            handle,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: el.width,
            startHeight: el.height,
            startLeft: el.x,
            startTop: el.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            // Update current mouse pos for connector drawing and ghost placement
            setCurrentMousePos({
                x: (e.clientX - rect.left - offset.x) / scale,
                y: (e.clientY - rect.top - offset.y) / scale
            });
        }

        if (isPanning) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setOffset({ x: offset.x + dx, y: offset.y + dy });
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (isResizing) {
            const dx = (e.clientX - isResizing.startX) / scale;
            const dy = (e.clientY - isResizing.startY) / scale;

            let newWidth = isResizing.startWidth;
            let newHeight = isResizing.startHeight;
            let newX = isResizing.startLeft;
            let newY = isResizing.startTop;

            if (isResizing.handle.includes('e')) newWidth += dx;
            if (isResizing.handle.includes('w')) { newWidth -= dx; newX += dx; }
            if (isResizing.handle.includes('s')) newHeight += dy;
            if (isResizing.handle.includes('n')) { newHeight -= dy; newY += dy; }

            // Minimum size constraints
            if (newWidth < 20) newWidth = 20;
            if (newHeight < 20) newHeight = 20;

            useStore.getState().updateElement(isResizing.id, {
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            }, true);

        } else if (isDraggingElement) {
            const dx = (e.clientX - lastMousePos.x) / scale;
            const dy = (e.clientY - lastMousePos.y) / scale;

            const el = elements.find(e => e.id === isDraggingElement);
            if (el) {
                useStore.getState().updateElement(isDraggingElement, { x: el.x + dx, y: el.y + dy }, true);
            }
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setIsDraggingElement(null);
        setIsResizing(null);
        if (tool === 'connector') {
            setConnectingStartId(null);
        }
    };

    // Helper for connectors
    const getElement = (id: string) => elements.find(e => e.id === id);
    const getCenter = (el: CanvasElement) => ({
        x: el.x + el.width / 2,
        y: el.y + el.height / 2
    });

    const isPlacementMode = !['select', 'pan', 'connector'].includes(tool);

    return (
        <div
            ref={canvasRef}
            className={cn(
                "w-full h-screen overflow-hidden bg-background relative",
                tool === 'pan' || isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                tool === 'connector' && "cursor-crosshair"
            )}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Placement Overlay Layer - Ensures clicks are captured for placement */}
            {isPlacementMode && (
                <div
                    className="absolute inset-0 z-50 cursor-none"
                    onClick={handlePlacementClick}
                >
                    {/* Ghost Element Following Mouse */}
                    <div
                        style={{
                            position: 'absolute',
                            // We need to transform screen coords back to screen relative to this container
                            // Since this container is inset-0 fixed, mouse coords are relative to it.
                            // BUT we want to render the preview using the logic we already have.
                            // Actually, to keep it simple, we can just use fixed positioning or
                            // render it inside the transformed container but managed by this overlay?
                            // Let's render a simple crosshair or just rely on the transformed ghost below.
                            // Wait, if this overlay is on top, the transformed ghost below won't capture hover?
                            // No, this overlay is transparent.
                            // WE WANT THE GHOST TO BE VISIBLE.
                        }}
                    />
                </div>
            )}

            <div
                className="absolute origin-top-left transition-transform duration-75 ease-out"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                }}
            >
                {/* Connector Layer */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>
                    {connectors.map(c => {
                        const source = getElement(c.sourceId);
                        const target = getElement(c.targetId);
                        if (!source || !target) return null;
                        const p1 = getCenter(source);
                        const p2 = getCenter(target);
                        return (
                            <line
                                key={c.id}
                                x1={p1.x} y1={p1.y}
                                x2={p2.x} y2={p2.y}
                                stroke="#64748b"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                    {connectingStartId && (
                        (() => {
                            const source = getElement(connectingStartId);
                            if (!source) return null;
                            const p1 = getCenter(source);
                            return (
                                <line
                                    x1={p1.x} y1={p1.y}
                                    x2={currentMousePos.x} y2={currentMousePos.y}
                                    stroke="#64748b"
                                    strokeWidth="2"
                                    strokeDasharray="4"
                                />
                            );
                        })()
                    )}
                </svg>

                {/* Ghost Element for Placement - Rendered in World Space */}
                {isPlacementMode && !isPanning && !isDraggingElement && !isResizing && (
                    <div
                        style={{
                            position: 'absolute',
                            left: currentMousePos.x - getGhostDimensions(tool).width / 2,
                            top: currentMousePos.y - getGhostDimensions(tool).height / 2,
                            width: getGhostDimensions(tool).width,
                            height: getGhostDimensions(tool).height,
                            opacity: 0.5,
                            pointerEvents: 'none',
                            zIndex: 60, // Higher than placement layer? No, layer is 50. 
                            // Actually, this is inside transformed div. Layer is outside.
                            // This ghost is visual only.
                            border: '2px dashed #64ffda'
                        }}
                        className="flex items-center justify-center"
                    >
                        {/* Optional: Render preview of widget here if desired */}
                    </div>
                )}

                {elements.map((el) => (
                    <div
                        key={el.id}
                        onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                        onMouseUp={(e) => handleElementMouseUp(e, el.id)}
                        style={{
                            position: 'absolute',
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height,
                            zIndex: 10,
                            ...el.style
                        }}
                        className={cn(
                            "flex items-center justify-center text-white select-none",
                            selectedIds.includes(el.id) && !['financial-card', 'transaction-node', 'kyc-badge', 'api-endpoint', 'payment-provider', 'card-gateway', 'digital-wallet', 'card-issuance', 'sticky-note', 'database-table', 'incident-timeline', 'status-tracker', 'payment-flow'].includes(el.type) && "ring-2 ring-accent",
                            el.type === 'circle' && "rounded-full"
                        )}
                    >
                        {el.type === 'rectangle' && <div className="w-full h-full opacity-50" style={{ backgroundColor: el.style?.backgroundColor }} />}
                        {el.type === 'financial-card' && <FinancialCard width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'transaction-node' && <TransactionNode width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'kyc-badge' && <KYCBadge width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'api-endpoint' && <APIEndpoint width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'payment-provider' && <PaymentProvider width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'card-gateway' && <CardGateway width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'digital-wallet' && <DigitalWallet width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'card-issuance' && <CardIssuance width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'sticky-note' && <StickyNote id={el.id} width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'database-table' && <DatabaseTable width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'incident-timeline' && <IncidentTimeline width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'status-tracker' && <StatusTracker width={el.width} height={el.height} selected={selectedIds.includes(el.id)} data={el.data as any} />}
                        {el.type === 'payment-flow' && <PaymentFlow width={el.width} height={el.height} selected={selectedIds.includes(el.id)} />}
                        {el.type === 'text' && (
                            isEditing === el.id ? (
                                <textarea
                                    autoFocus
                                    className="z-20 bg-transparent text-center resize-none outline-none w-full h-full overflow-hidden"
                                    value={el.content || ''}
                                    onChange={(e) => useStore.getState().updateElement(el.id, { content: e.target.value })}
                                    onBlur={() => setIsEditing(null)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setIsEditing(null); } }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    placeholder="Double click to edit"
                                />
                            ) : (
                                <span
                                    className="z-10 whitespace-pre-wrap text-center w-full h-full flex items-center justify-center"
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(el.id);
                                    }}
                                >
                                    {el.content || 'Double click to edit'}
                                </span>
                            )
                        )}

                        {selectedIds.includes(el.id) && (
                            <ResizeHandles
                                width={el.width}
                                height={el.height}
                                onResizeStart={(e, handle) => handleResizeStart(e, el.id, handle, el)}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `radial-gradient(#8892b0 1px, transparent 1px)`,
                    backgroundSize: `${20 * scale}px ${20 * scale}px`,
                    backgroundPosition: `${offset.x}px ${offset.y}px`
                }}
            />


        </div>
    );
};

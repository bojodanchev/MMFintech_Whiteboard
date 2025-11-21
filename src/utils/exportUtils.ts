import html2canvas from 'html2canvas';
import { CanvasElement, Connector } from '../types';

interface ContentBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
}

/**
 * Calculate the bounding box that contains all elements
 */
export function calculateContentBounds(elements: CanvasElement[], padding: number = 50): ContentBounds {
    if (elements.length === 0) {
        return {
            minX: 0,
            minY: 0,
            maxX: 800,
            maxY: 600,
            width: 800,
            height: 600
        };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(el => {
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + el.width);
        maxY = Math.max(maxY, el.y + el.height);
    });

    // Add padding
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY
    };
}

/**
 * Export canvas to PNG - captures the entire whiteboard canvas
 */
export async function exportToPNG(
    elements: CanvasElement[],
    connectors: Connector[],
    scale: number = 1,
    offset: { x: number; y: number } = { x: 0, y: 0 }
): Promise<void> {
    const canvas = document.getElementById('whiteboard-canvas');
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    try {
        // Capture the entire canvas element
        const capturedCanvas = await html2canvas(canvas, {
            backgroundColor: '#0f172a',
            scale: 2,
            logging: false,
            useCORS: true,
            width: canvas.scrollWidth,
            height: canvas.scrollHeight,
            windowWidth: canvas.scrollWidth,
            windowHeight: canvas.scrollHeight
        });

        // Download
        const url = capturedCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('PNG export failed:', error);
        throw error;
    }
}

/**
 * Export canvas to JSON with enhanced metadata
 */
export function exportToJSON(
    elements: CanvasElement[],
    connectors: Connector[],
    scale: number,
    offset: { x: number; y: number },
    currentUser: string
): void {
    const bounds = calculateContentBounds(elements, 0);

    // Calculate element statistics
    const elementStats: Record<string, number> = {};
    elements.forEach(el => {
        elementStats[el.type] = (elementStats[el.type] || 0) + 1;
    });

    const data = {
        version: '1.1.0',
        schemaVersion: 1,
        timestamp: new Date().toISOString(),
        exportedBy: currentUser,
        canvas: {
            scale,
            offset,
            bounds: {
                minX: bounds.minX,
                minY: bounds.minY,
                maxX: bounds.maxX,
                maxY: bounds.maxY,
                width: bounds.width,
                height: bounds.height
            }
        },
        statistics: {
            totalElements: elements.length,
            totalConnectors: connectors.length,
            elementsByType: elementStats
        },
        elements,
        connectors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

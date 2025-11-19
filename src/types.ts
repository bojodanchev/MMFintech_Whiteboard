export type ElementType = 'rectangle' | 'circle' | 'text' | 'financial-card' | 'transaction-node' | 'kyc-badge' | 'api-endpoint' | 'payment-provider' | 'card-gateway' | 'digital-wallet' | 'card-issuance' | 'sticky-note';

export interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    label?: string;
    style?: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        color?: string;
        fontSize?: number;
    };
    // Specific properties for financial widgets can be added here later
    data?: {
        value?: string;
        trend?: number;
        status?: 'verified' | 'pending' | 'rejected' | 'active' | 'maintenance' | 'down' | 'frozen' | 'closed';
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        endpoint?: string;
        provider?: string;
        gateway?: string;
        region?: string;
        balance?: string;
        currency?: string;
        type?: 'virtual' | 'physical';
        bin?: string;
        network?: 'Visa' | 'Mastercard';
        color?: 'yellow' | 'blue' | 'green' | 'pink';
        text?: string;
    };
}

export interface AIConfig {
    provider: 'openai' | 'anthropic' | 'local';
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}

export interface CanvasState {
    elements: CanvasElement[];
    selectedIds: string[];
    scale: number;
    offset: { x: number; y: number };
    tool: 'select' | 'pan' | 'rectangle' | 'circle' | 'text' | 'financial-card' | 'transaction-node' | 'kyc-badge' | 'api-endpoint' | 'payment-provider' | 'card-gateway' | 'digital-wallet' | 'card-issuance' | 'sticky-note';
    aiConfig: AIConfig;

    addElement: (element: CanvasElement) => void;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    removeElement: (id: string) => void;
    selectElement: (id: string) => void;
    setTool: (tool: CanvasState['tool']) => void;
    setOffset: (offset: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
    setAIConfig: (config: Partial<AIConfig>) => void;
}

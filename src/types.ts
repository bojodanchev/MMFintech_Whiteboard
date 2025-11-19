export type ElementType = 'rectangle' | 'circle' | 'text' | 'financial-card' | 'transaction-node' | 'kyc-badge' | 'api-endpoint' | 'payment-provider' | 'card-gateway' | 'digital-wallet' | 'card-issuance' | 'sticky-note' | 'database-table' | 'payment-flow' | 'incident-timeline' | 'status-tracker' | 'connector';

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
        color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
        text?: string;
        // Sticky note voting
        votes?: number;
        priority?: 'high' | 'medium' | 'low';
        // Database table
        tableName?: string;
        columns?: Array<{ name: string; type: string; isPrimary?: boolean; isForeign?: boolean }>;
        // Incident timeline
        events?: Array<{ timestamp: string; message: string; severity: 'critical' | 'warning' | 'info' | 'resolved' }>;
        // Status tracker
        serviceName?: string;
        uptime?: string;
        responseTime?: string;
        errorRate?: string;
        // Connector properties
        sourceId?: string;
        targetId?: string;
        lineStyle?: 'straight' | 'curved' | 'orthogonal';
        arrowStart?: boolean;
        arrowEnd?: boolean;
    };
}

export interface AIConfig {
    provider: 'openai' | 'anthropic' | 'local';
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}

export interface Connector {
    id: string;
    sourceId: string;
    targetId: string;
    sourcePoint?: { x: number; y: number };
    targetPoint?: { x: number; y: number };
    style?: {
        lineStyle?: 'straight' | 'curved' | 'orthogonal';
        color?: string;
        width?: number;
        arrowStart?: boolean;
        arrowEnd?: boolean;
    };
}

export interface Comment {
    id: string;
    elementId: string;
    text: string;
    author: string;
    timestamp: string;
    resolved: boolean;
    replies?: Comment[];
}

export interface Version {
    id: string;
    timestamp: string;
    elements: CanvasElement[];
    connectors: Connector[];
    thumbnail?: string;
}

export interface Activity {
    id: string;
    type: 'create' | 'update' | 'delete' | 'comment';
    elementId?: string;
    user: string;
    timestamp: string;
    description: string;
}

export interface CanvasState {
    elements: CanvasElement[];
    connectors: Connector[];
    comments: Comment[];
    versions: Version[];
    activities: Activity[];
    selectedIds: string[];
    scale: number;
    offset: { x: number; y: number };
    tool: 'select' | 'pan' | 'rectangle' | 'circle' | 'text' | 'financial-card' | 'transaction-node' | 'kyc-badge' | 'api-endpoint' | 'payment-provider' | 'card-gateway' | 'digital-wallet' | 'card-issuance' | 'sticky-note' | 'database-table' | 'payment-flow' | 'incident-timeline' | 'status-tracker' | 'connector';
    aiConfig: AIConfig;
    currentUser: string;

    addElement: (element: CanvasElement) => void;
    updateElement: (id: string, updates: Partial<CanvasElement>, skipLog?: boolean) => void;
    removeElement: (id: string) => void;
    selectElement: (id: string) => void;
    setTool: (tool: CanvasState['tool']) => void;
    setOffset: (offset: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
    setAIConfig: (config: Partial<AIConfig>) => void;

    // Connector actions
    addConnector: (connector: Connector) => void;
    updateConnector: (id: string, updates: Partial<Connector>) => void;
    removeConnector: (id: string) => void;

    // Comment actions
    addComment: (comment: Comment) => void;
    updateComment: (id: string, updates: Partial<Comment>) => void;
    removeComment: (id: string) => void;

    // Version actions
    createSnapshot: () => void;
    restoreVersion: (versionId: string) => void;

    // Activity actions
    logActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'user'>) => void;
}

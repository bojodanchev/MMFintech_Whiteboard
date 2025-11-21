import { ElementType } from '../types';

/**
 * Get default data for a given element type
 */
export function getDefaultElementData(type: ElementType): Record<string, any> {
    switch (type) {
        case 'financial-card':
            return {
                value: '$2.4M',
                trend: 12.5
            };

        case 'transaction-node':
            return {
                value: '$1,250.00',
                status: 'verified'
            };

        case 'kyc-badge':
            return {
                status: 'pending'
            };

        case 'api-endpoint':
            return {
                method: 'GET',
                endpoint: '/api/v1/resource'
            };

        case 'payment-provider':
            return {
                provider: 'Stripe',
                status: 'active'
            };

        case 'card-gateway':
            return {
                gateway: 'Visa',
                region: 'Global'
            };

        case 'digital-wallet':
            return {
                balance: '$5,000.00',
                currency: 'USD',
                status: 'active'
            };

        case 'card-issuance':
            return {
                type: 'virtual',
                network: 'Visa',
                bin: '424242'
            };

        case 'sticky-note':
            return {
                color: 'yellow',
                text: 'Add your note here...'
            };

        case 'database-table':
            return {
                tableName: 'table_name',
                columns: [
                    { name: 'id', type: 'INTEGER', isPrimary: true },
                    { name: 'created_at', type: 'TIMESTAMP' }
                ]
            };

        case 'payment-flow':
            return {};

        case 'incident-timeline':
            return {
                events: [
                    { timestamp: new Date().toISOString(), message: 'Incident detected', severity: 'critical' as const }
                ]
            };

        case 'status-tracker':
            return {
                serviceName: 'Payment API',
                status: 'active',
                uptime: '99.9%',
                responseTime: '45ms',
                errorRate: '0.01%'
            };

        default:
            return {};
    }
}

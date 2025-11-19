import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CanvasState, type Version, type Activity } from '../types';

export const useStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            elements: [],
            connectors: [],
            comments: [],
            versions: [],
            activities: [],
            selectedIds: [],
            scale: 1,
            offset: { x: 0, y: 0 },
            tool: 'select',
            aiConfig: {
                provider: 'local',
                baseUrl: 'http://localhost:11434',
                model: 'llama3',
            },
            currentUser: 'User',

            addElement: (element) => {
                set((state) => ({ elements: [...state.elements, element] }));
                get().logActivity({ type: 'create', elementId: element.id, description: `Created ${element.type}` });
            },
            updateElement: (id, updates, skipLog = false) => {
                set((state) => ({
                    elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
                }));
                if (!skipLog) {
                    get().logActivity({ type: 'update', elementId: id, description: `Updated element` });
                }
            },
            removeElement: (id) => {
                set((state) => ({
                    elements: state.elements.filter((el) => el.id !== id),
                    connectors: state.connectors.filter((c) => c.sourceId !== id && c.targetId !== id),
                }));
                get().logActivity({ type: 'delete', elementId: id, description: `Deleted element` });
            },
            selectElement: (id) => set({ selectedIds: [id] }),
            setTool: (tool) => set({ tool }),
            setOffset: (offset) => set({ offset }),
            setScale: (scale) => set({ scale }),
            setAIConfig: (config) => set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),

            // Connector actions
            addConnector: (connector) => {
                set((state) => ({ connectors: [...state.connectors, connector] }));
                get().logActivity({ type: 'create', description: `Created connector` });
            },
            updateConnector: (id, updates) =>
                set((state) => ({
                    connectors: state.connectors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            removeConnector: (id) =>
                set((state) => ({
                    connectors: state.connectors.filter((c) => c.id !== id),
                })),

            // Comment actions
            addComment: (comment) => {
                set((state) => ({ comments: [...state.comments, comment] }));
                get().logActivity({ type: 'comment', elementId: comment.elementId, description: `Added comment` });
            },
            updateComment: (id, updates) =>
                set((state) => ({
                    comments: state.comments.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            removeComment: (id) =>
                set((state) => ({
                    comments: state.comments.filter((c) => c.id !== id),
                })),

            // Version actions
            createSnapshot: () => {
                const state = get();
                const snapshot: Version = {
                    id: crypto.randomUUID(),
                    timestamp: new Date().toISOString(),
                    elements: JSON.parse(JSON.stringify(state.elements)),
                    connectors: JSON.parse(JSON.stringify(state.connectors)),
                };
                set((state) => ({
                    versions: [...state.versions, snapshot].slice(-20), // Keep last 20 versions
                }));
            },
            restoreVersion: (versionId) => {
                const state = get();
                const version = state.versions.find((v) => v.id === versionId);
                if (version) {
                    set({
                        elements: JSON.parse(JSON.stringify(version.elements)),
                        connectors: JSON.parse(JSON.stringify(version.connectors)),
                    });
                    get().logActivity({ type: 'update', description: `Restored version from ${version.timestamp}` });
                }
            },

            // Activity actions
            logActivity: (activity) => {
                const newActivity: Activity = {
                    ...activity,
                    id: crypto.randomUUID(),
                    timestamp: new Date().toISOString(),
                    user: get().currentUser,
                };
                set((state) => ({
                    activities: [...state.activities, newActivity].slice(-100), // Keep last 100 activities
                }));
            },
        }),
        {
            name: 'fintech-whiteboard-storage',
            partialize: (state) => ({
                elements: state.elements,
                connectors: state.connectors,
                comments: state.comments,
                versions: state.versions,
                activities: state.activities,
                aiConfig: state.aiConfig,
                currentUser: state.currentUser,
            }),
        }
    )
);

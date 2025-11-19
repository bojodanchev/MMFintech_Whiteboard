import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CanvasState, type CanvasElement } from '../types';

export const useStore = create<CanvasState>()(
    persist(
        (set) => ({
            elements: [],
            selectedIds: [],
            scale: 1,
            offset: { x: 0, y: 0 },
            tool: 'select',
            aiConfig: {
                provider: 'local',
                baseUrl: 'http://localhost:11434',
                model: 'llama3',
            },

            addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
            updateElement: (id, updates) =>
                set((state) => ({
                    elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
                })),
            removeElement: (id) =>
                set((state) => ({
                    elements: state.elements.filter((el) => el.id !== id),
                })),
            selectElement: (id) => set({ selectedIds: [id] }), // Single selection for now
            setTool: (tool) => set({ tool }),
            setOffset: (offset) => set({ offset }),
            setScale: (scale) => set({ scale }),
            setAIConfig: (config) => set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
        }),
        {
            name: 'fintech-whiteboard-storage',
            partialize: (state) => ({
                elements: state.elements,
                aiConfig: state.aiConfig,
            }),
        }
    )
);

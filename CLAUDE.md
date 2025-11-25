# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a **fintech-focused whiteboard application** built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It enables users to create visual diagrams with specialized financial/technical widgets.

### State Management

- **Zustand store** (`src/store/useStore.ts`) manages all application state
- State is persisted to localStorage via zustand's `persist` middleware (key: `fintech-whiteboard-storage`)
- The store handles elements, connectors, comments, versions, activities, and canvas state (scale, offset, tool selection)

### Core Types (`src/types.ts`)

- `ElementType`: All widget types including shapes, fintech widgets (transaction-node, kyc-badge, api-endpoint, payment-provider, etc.), and collaboration tools
- `CanvasElement`: Base interface for all canvas elements with position, dimensions, style, and type-specific `data` field
- `Connector`: Links between elements with styling options
- `CanvasState`: Full store interface including all actions

### Component Structure

- `src/app/page.tsx`: Main page component with keyboard shortcuts (V=select, H=pan, R=rectangle, O=circle, T=text, N=sticky-note)
- `src/components/Canvas.tsx`: Main canvas with pan/zoom, element placement, drag/resize, and connector drawing
- `src/components/Toolbar.tsx`: Tool selection grouped by category (Essentials, Shapes, Fintech, Collaboration, System & Ops)
- `src/components/widgets/`: Individual widget components (StickyNote, DatabaseTable, TransactionNode, etc.)

### Key Utilities

- `src/utils/elementDefaults.ts`: Default data values for each element type
- `src/utils/exportUtils.ts`: PNG (via html2canvas) and JSON export functionality
- `src/services/ai.ts`: AI provider connection testing (supports OpenAI, Anthropic, local Ollama)

### Canvas Interaction Model

- Elements are positioned absolutely within a transformed container
- Scale and offset are applied via CSS transform on the parent container
- Mouse coordinates are transformed from screen space to canvas space: `(clientX - rect.left - offset.x) / scale`
- Placement mode shows a ghost preview element following the cursor

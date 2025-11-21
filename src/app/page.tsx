'use client';

import React from 'react';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { SecurityOverlay } from '../components/SecurityOverlay';
import { ZoomControls } from '../components/ZoomControls';
import { PropertyPanel } from '../components/PropertyPanel';

import { SettingsMenu } from '../components/SettingsMenu';
import { useStore } from '../store/useStore';

export default function Home() {
    const { setTool } = useStore();

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'v': setTool('select'); break;
                case 'h': setTool('pan'); break;
                case ' ': setTool('pan'); break; // Spacebar for pan
                case 'r': setTool('rectangle'); break;
                case 'o': setTool('circle'); break;
                case 't': setTool('text'); break;
                case 'n': setTool('sticky-note'); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setTool]);

    return (
        <div className="w-full h-screen bg-background text-foreground overflow-hidden relative">
            <SecurityOverlay />
            <SettingsMenu />
            <Toolbar />
            <ZoomControls />
            <PropertyPanel />
            <Canvas />
        </div>
    );
}

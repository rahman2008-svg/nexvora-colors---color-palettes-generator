/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { GeneratorView } from './components/GeneratorView';
import { HomeLanding } from './components/HomeLanding';
import { ExploreView } from './components/ExploreView';
import { ImagePickerView } from './components/ImagePickerView';
import { ContrastCheckerView } from './components/ContrastCheckerView';
import { AboutModal } from './components/AboutModal';
import { ExportModal } from './components/ExportModal';
import { VisualizerModal } from './components/VisualizerModal';
import { cleanHex } from './utils/colorUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [currentColors, setCurrentColors] = useState<string[]>([
    '264653',
    '2A9D8F',
    'E9C46A',
    'F4A261',
    'E76F51',
  ]);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerColors, setVisualizerColors] = useState<string[]>(currentColors);

  // Parse URL params for shared palettes or deep links on initial mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paletteParam = params.get('palette');
      const tabParam = params.get('tab') as ActiveTab | null;

      if (paletteParam) {
        const rawColors = paletteParam.split('-').map(cleanHex).filter((c) => c.length === 6);
        if (rawColors.length >= 2) {
          setCurrentColors(rawColors);
          setVisualizerColors(rawColors);
        }
      }

      if (tabParam && ['generator', 'explore', 'image-picker', 'contrast-checker', 'landing'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Sync currentColors to visualizer colors if updated
  const handleOpenExport = (colors: string[]) => {
    setCurrentColors(colors);
    setIsExportOpen(true);
  };

  const handleOpenVisualizer = (colors: string[]) => {
    setVisualizerColors(colors);
    setIsVisualizerOpen(true);
  };

  const handleOpenContrast = (colors: string[]) => {
    setCurrentColors(colors);
    setActiveTab('contrast-checker');
  };

  const handleLoadInGenerator = (colors: string[]) => {
    setCurrentColors(colors);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenAboutModal={() => setIsAboutOpen(true)}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'generator' && (
          <GeneratorView
            initialColors={currentColors}
            onOpenExport={handleOpenExport}
            onOpenVisualizer={handleOpenVisualizer}
            onOpenContrast={handleOpenContrast}
          />
        )}

        {activeTab === 'landing' && (
          <HomeLanding
            onNavigate={setActiveTab}
            onOpenInGenerator={handleLoadInGenerator}
            onOpenAboutModal={() => setIsAboutOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onOpenInGenerator={handleLoadInGenerator}
            onOpenInVisualizer={handleOpenVisualizer}
          />
        )}

        {activeTab === 'image-picker' && (
          <ImagePickerView onOpenInGenerator={handleLoadInGenerator} />
        )}

        {activeTab === 'contrast-checker' && (
          <ContrastCheckerView
            initialTextColor={currentColors[0]}
            initialBgColor={currentColors[1]}
          />
        )}
      </main>

      {/* Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={currentColors}
      />

      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        colors={visualizerColors}
      />
    </div>
  );
}

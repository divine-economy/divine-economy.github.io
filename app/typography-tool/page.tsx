'use client';

import { useState } from 'react';
import ParameterPanel from './components/ParameterPanel';
import PreviewCanvas from './components/PreviewCanvas';
import ExportPanel from './components/ExportPanel';
import { useTypographyStore } from '@/lib/typography/store';

export default function TypographyToolPage() {
  const { previewText, selectedLetter } = useTypographyStore();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Pixel Blob</h1>
              <p className="text-sm text-gray-400">Typography Tool</p>
            </div>
            <ExportPanel />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <PreviewCanvas />
          </div>

          {/* Parameter Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <ParameterPanel />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>Export fonts as TTF/OTF for use in Figma and other design tools</p>
        </div>
      </footer>
    </div>
  );
}

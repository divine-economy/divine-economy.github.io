'use client';

import { useTypographyStore } from '@/lib/typography/store';
import { getAvailableCharacters } from '@/lib/typography/glyphTemplates';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { GlyphPreview, TextPreview } from './GlyphPreview';

export default function PreviewCanvas() {
  const {
    previewText,
    setPreviewText,
    selectedLetter,
    setSelectedLetter,
    zoomLevel,
    setZoomLevel,
  } = useTypographyStore();

  const [viewMode, setViewMode] = useState<'full' | 'alphabet' | 'single'>('full');
  const availableChars = getAvailableCharacters();

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* View Mode Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'full'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Full Preview
            </button>
            <button
              onClick={() => setViewMode('alphabet')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'alphabet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Alphabet
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Single Letter
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm text-gray-400 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Custom Text Input (for full preview mode) */}
        {viewMode === 'full' && (
          <div className="mt-4">
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value.toUpperCase())}
              placeholder="Type to preview..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Letter Selector (for single letter mode) */}
        {viewMode === 'single' && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {availableChars.map((char) => (
                <button
                  key={char}
                  onClick={() => setSelectedLetter(char)}
                  className={`w-10 h-10 rounded font-mono transition-colors ${
                    selectedLetter === char
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 min-h-[400px] flex items-center justify-center overflow-auto">
        <div
          className="bg-white rounded-lg p-8 shadow-2xl max-w-full text-black"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {viewMode === 'full' && (
            <div className="flex items-center justify-center">
              <TextPreview text={previewText || 'PIXEL BLOB'} fontSize={72} />
            </div>
          )}

          {viewMode === 'alphabet' && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <TextPreview text="ABCDEFGH" fontSize={60} />
              </div>
              <div className="flex gap-2">
                <TextPreview text="IJKLMNOP" fontSize={60} />
              </div>
              <div className="flex gap-2">
                <TextPreview text="QRSTUVWX" fontSize={60} />
              </div>
              <div className="flex gap-2">
                <TextPreview text="YZ" fontSize={60} />
              </div>
            </div>
          )}

          {viewMode === 'single' && (
            <div className="flex items-center justify-center">
              <GlyphPreview character={selectedLetter} size={300} />
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Characters</div>
            <div className="font-medium">26 Uppercase</div>
          </div>
          <div>
            <div className="text-gray-400">Style</div>
            <div className="font-medium">Edge Pixels</div>
          </div>
          <div>
            <div className="text-gray-400">Format</div>
            <div className="font-medium">TTF/OTF</div>
          </div>
          <div>
            <div className="text-gray-400">Status</div>
            <div className="font-medium text-green-400">Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}

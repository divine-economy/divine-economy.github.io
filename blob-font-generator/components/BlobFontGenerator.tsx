'use client';

import React, { useState } from 'react';
import { ParameterControls } from './ParameterControls';
import { DisplayControls } from './DisplayControls';
import { TextPreview } from './TextPreview';
import { LetterPreview } from './LetterPreview';
import { BlobParams } from '@/lib/blobGenerator';
import { GridParams } from '@/lib/gridOverlay';
import { DisplayParams, defaultDisplayParams } from '@/lib/displayParams';
import { generateFont, downloadFont } from '@/lib/fontExporter';

export function BlobFontGenerator() {
  const [blobParams, setBlobParams] = useState<BlobParams>({
    thickness: 90,
    smoothness: 20,
    curvature: 30,
  });

  const [gridParams, setGridParams] = useState<GridParams>({
    spacing: 15,
    lineWidth: 1.5,
    gridColor: '#999999',
  });

  const [displayParams, setDisplayParams] = useState<DisplayParams>(defaultDisplayParams);

  const [customText, setCustomText] = useState('HELLO WORLD');
  const [isExporting, setIsExporting] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const handleExportFont = async () => {
    setIsExporting(true);
    try {
      const arrayBuffer = await generateFont({
        fontName: 'BlobFont',
        thickness: blobParams.thickness,
        smoothness: blobParams.smoothness,
        curvature: blobParams.curvature,
      });

      downloadFont(arrayBuffer, 'BlobFont.otf');
    } catch (error) {
      console.error('Error exporting font:', error);
      alert('Error exporting font. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Blob Font Generator</h1>
          <p className="text-gray-600">
            Create custom organic blob-shaped fonts with grid overlays
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Controls */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-6">
              <ParameterControls
                blobParams={blobParams}
                gridParams={gridParams}
                onBlobParamsChange={setBlobParams}
                onGridParamsChange={setGridParams}
              />

              <DisplayControls
                displayParams={displayParams}
                onDisplayParamsChange={setDisplayParams}
              />

              {/* Export Button */}
              <button
                onClick={handleExportFont}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isExporting ? 'Generating...' : 'Export Font (.otf)'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Export and install on your computer or use in Figma
              </p>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Text Input */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Custom Text Preview</h2>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your text here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
                maxLength={50}
              />
              <div className="rounded-lg overflow-hidden min-h-[120px]">
                <TextPreview
                  text={customText}
                  blobParams={blobParams}
                  gridParams={gridParams}
                  displayParams={displayParams}
                />
              </div>
            </div>

            {/* Alphabet Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Alphabet (A-Z)</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {alphabet.split('').map((letter) => (
                    <LetterPreview
                      key={letter}
                      letter={letter}
                      blobParams={blobParams}
                      gridParams={gridParams}
                      size={60}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Numbers Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Numbers (0-9)</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {numbers.split('').map((number) => (
                    <LetterPreview
                      key={number}
                      letter={number}
                      blobParams={blobParams}
                      gridParams={gridParams}
                      size={60}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

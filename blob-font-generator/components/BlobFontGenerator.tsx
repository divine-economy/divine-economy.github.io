'use client';

import React, { useState } from 'react';
import TextPreview from './TextPreview';
import ParameterControls from './ParameterControls';
import DisplayControls from './DisplayControls';
import {
  BlobParams,
  GridParams,
  DisplayParams,
  defaultBlobParams,
  defaultGridParams,
  defaultDisplayParams,
} from '@/lib/displayParams';
import { exportAndDownloadFont } from '@/lib/fontExporter';

export default function BlobFontGenerator() {
  // State management
  const [blobParams, setBlobParams] = useState<BlobParams>(defaultBlobParams);
  const [gridParams, setGridParams] = useState<GridParams>(defaultGridParams);
  const [displayParams, setDisplayParams] = useState<DisplayParams>(defaultDisplayParams);
  const [text, setText] = useState<string>('BLOB FONT');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAndDownloadFont(blobParams, 'BlobFont', 'BlobFont.otf');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export font. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: displayParams.backgroundColor }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Blob Font Generator</h1>
          <p className="text-gray-600 mt-1">
            Create custom blob fonts with smooth organic shapes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto space-y-6 pb-4">
            {/* Text Input */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Preview Text</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                rows={3}
                placeholder="Enter text to preview..."
              />
            </div>

            {/* Grid Toggle */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Grid Overlay</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Parameter Controls */}
            <ParameterControls
              blobParams={blobParams}
              gridParams={gridParams}
              onBlobChange={setBlobParams}
              onGridChange={setGridParams}
            />

            {/* Display Controls */}
            <DisplayControls
              displayParams={displayParams}
              onChange={setDisplayParams}
            />

            {/* Export Button */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isExporting ? 'Exporting...' : 'Export Font (.otf)'}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Download your custom blob font as an OTF file
              </p>
            </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complete Alphabet Preview */}
            <div
              className="rounded-lg shadow-lg p-8"
              style={{ backgroundColor: displayParams.backgroundColor }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Complete Character Set</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Uppercase Letters</p>
                  <TextPreview
                    text="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                    blobParams={blobParams}
                    gridParams={gridParams}
                    displayParams={displayParams}
                    showGrid={showGrid}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Numbers</p>
                  <TextPreview
                    text="0123456789"
                    blobParams={blobParams}
                    gridParams={gridParams}
                    displayParams={displayParams}
                    showGrid={showGrid}
                  />
                </div>
              </div>
            </div>

            {/* Custom Text Preview */}
            <div
              className="rounded-lg shadow-lg p-8 min-h-[400px] flex items-center justify-center"
              style={{ backgroundColor: displayParams.backgroundColor }}
            >
              <div className="w-full">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Custom Text Preview</h3>
                <TextPreview
                  text={text}
                  blobParams={blobParams}
                  gridParams={gridParams}
                  displayParams={displayParams}
                  showGrid={showGrid}
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How to Use</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Adjust blob parameters (thickness, smoothness, curvature) to shape your letters</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Toggle grid overlay to see how letters interact with grid patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Customize display settings (spacing, colors, rotation) for preview</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  <span>Click &quot;Export Font&quot; to download your custom OTF font file</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">5.</span>
                  <span>Install the font on your system and use it in any application</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

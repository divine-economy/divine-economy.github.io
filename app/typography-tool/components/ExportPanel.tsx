'use client';

import { useTypographyStore } from '@/lib/typography/store';
import { Download, Save, Settings } from 'lucide-react';
import { useState } from 'react';
import { generateAllGlyphs } from '@/lib/typography/glyphGenerator';
import { exportFont } from '@/lib/typography/fontBuilder';

export default function ExportPanel() {
  const {
    metadata,
    setMetadata,
    isGenerating,
    generationProgress,
    setIsGenerating,
    setGenerationProgress,
    parameters,
  } = useTypographyStore();
  const [showSettings, setShowSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState<'ttf' | 'otf'>('ttf');

  const handleExport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Generate all glyphs
      const glyphs = generateAllGlyphs(parameters, (progress) => {
        setGenerationProgress(progress);
      });

      // Export font
      await exportFont(
        {
          glyphs,
          metadata,
          parameters,
        },
        exportFormat
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export font. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleSaveProject = () => {
    // Save parameters to localStorage
    const state = useTypographyStore.getState();
    const project = {
      parameters: state.parameters,
      metadata: state.metadata,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('pixelblob-project', JSON.stringify(project));

    // Also trigger download as JSON
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.familyName.replace(/\s+/g, '-')}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          onClick={handleSaveProject}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Save size={16} />
          Save
        </button>
        <div className="flex items-center gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'ttf' | 'otf')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            disabled={isGenerating}
          >
            <option value="ttf">TTF</option>
            <option value="otf">OTF</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            {isGenerating ? `Generating... ${generationProgress}%` : 'Export Font'}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Font Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Family Name
                </label>
                <input
                  type="text"
                  value={metadata.familyName}
                  onChange={(e) => setMetadata('familyName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Pixel Blob"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Style Name
                </label>
                <input
                  type="text"
                  value={metadata.styleName}
                  onChange={(e) => setMetadata('styleName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Regular"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Designer Name (Optional)
                </label>
                <input
                  type="text"
                  value={metadata.designer}
                  onChange={(e) => setMetadata('designer', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => setMetadata('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Describe your font..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Copyright (Optional)
                </label>
                <input
                  type="text"
                  value={metadata.copyright}
                  onChange={(e) => setMetadata('copyright', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="© 2026 Your Name"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  handleExport();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

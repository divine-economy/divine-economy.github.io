'use client';

import React from 'react';
import { DisplayParams } from '@/lib/displayParams';

interface DisplayControlsProps {
  displayParams: DisplayParams;
  onChange: (params: DisplayParams) => void;
}

export default function DisplayControls({
  displayParams,
  onChange,
}: DisplayControlsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Display Parameters</h3>

      <div className="space-y-4">
        {/* Letter Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letter Spacing: {displayParams.letterSpacing}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={displayParams.letterSpacing}
            onChange={(e) =>
              onChange({ ...displayParams, letterSpacing: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Word Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Spacing: {displayParams.wordSpacing}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={displayParams.wordSpacing}
            onChange={(e) =>
              onChange({ ...displayParams, wordSpacing: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {displayParams.size}
          </label>
          <input
            type="range"
            min="20"
            max="300"
            value={displayParams.size}
            onChange={(e) =>
              onChange({ ...displayParams, size: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Rotation Variance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation Variance: {displayParams.rotationVariance}°
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={displayParams.rotationVariance}
            onChange={(e) =>
              onChange({ ...displayParams, rotationVariance: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Vertical Offset Variance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertical Offset: {displayParams.verticalOffset}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={displayParams.verticalOffset}
            onChange={(e) =>
              onChange({ ...displayParams, verticalOffset: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Vertical Crop */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertical Crop: {displayParams.verticalCrop}%
          </label>
          <input
            type="range"
            min="50"
            max="150"
            value={displayParams.verticalCrop}
            onChange={(e) =>
              onChange({ ...displayParams, verticalCrop: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Monospace Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="monospace"
            checked={displayParams.monospace}
            onChange={(e) =>
              onChange({ ...displayParams, monospace: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="monospace" className="ml-2 text-sm font-medium text-gray-700">
            Monospace
          </label>
        </div>

        {/* Letter Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letter Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={displayParams.letterColor}
              onChange={(e) =>
                onChange({ ...displayParams, letterColor: e.target.value })
              }
              className="w-12 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={displayParams.letterColor}
              onChange={(e) =>
                onChange({ ...displayParams, letterColor: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={displayParams.backgroundColor}
              onChange={(e) =>
                onChange({ ...displayParams, backgroundColor: e.target.value })
              }
              className="w-12 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={displayParams.backgroundColor}
              onChange={(e) =>
                onChange({ ...displayParams, backgroundColor: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

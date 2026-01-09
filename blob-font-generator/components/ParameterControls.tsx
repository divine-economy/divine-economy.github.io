'use client';

import React from 'react';
import { BlobParams, GridParams } from '@/lib/displayParams';

interface ParameterControlsProps {
  blobParams: BlobParams;
  gridParams: GridParams;
  onBlobChange: (params: BlobParams) => void;
  onGridChange: (params: GridParams) => void;
}

export default function ParameterControls({
  blobParams,
  gridParams,
  onBlobChange,
  onGridChange,
}: ParameterControlsProps) {
  return (
    <div className="space-y-6">
      {/* Blob Parameters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Blob Parameters</h3>

        <div className="space-y-4">
          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thickness: {blobParams.thickness}
            </label>
            <input
              type="range"
              min="30"
              max="150"
              value={blobParams.thickness}
              onChange={(e) =>
                onBlobChange({ ...blobParams, thickness: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30</span>
              <span>150</span>
            </div>
          </div>

          {/* Smoothness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Smoothness: {blobParams.smoothness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blobParams.smoothness}
              onChange={(e) =>
                onBlobChange({ ...blobParams, smoothness: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Curvature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curvature: {blobParams.curvature}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blobParams.curvature}
              onChange={(e) =>
                onBlobChange({ ...blobParams, curvature: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0% (Sharp)</span>
              <span>100% (Very Round)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Parameters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Grid Parameters</h3>

        <div className="space-y-4">
          {/* Grid Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grid Spacing: {gridParams.spacing}
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={gridParams.spacing}
              onChange={(e) =>
                onGridChange({ ...gridParams, spacing: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>40</span>
            </div>
          </div>

          {/* Grid Line Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grid Line Width: {gridParams.lineWidth}
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={gridParams.lineWidth}
              onChange={(e) =>
                onGridChange({ ...gridParams, lineWidth: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5</span>
              <span>5</span>
            </div>
          </div>

          {/* Grid Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grid Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={gridParams.color}
                onChange={(e) =>
                  onGridChange({ ...gridParams, color: e.target.value })
                }
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={gridParams.color}
                onChange={(e) =>
                  onGridChange({ ...gridParams, color: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="#cccccc"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

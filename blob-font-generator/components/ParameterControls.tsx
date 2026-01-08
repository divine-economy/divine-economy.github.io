'use client';

import React from 'react';
import { BlobParams } from '@/lib/blobGenerator';
import { GridParams } from '@/lib/gridOverlay';

interface ParameterControlsProps {
  blobParams: BlobParams;
  gridParams: GridParams;
  onBlobParamsChange: (params: BlobParams) => void;
  onGridParamsChange: (params: GridParams) => void;
}

export function ParameterControls({
  blobParams,
  gridParams,
  onBlobParamsChange,
  onGridParamsChange,
}: ParameterControlsProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Blob Parameters</h3>

        <div className="space-y-4">
          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Blob Thickness: {blobParams.thickness}
            </label>
            <input
              type="range"
              min="30"
              max="150"
              value={blobParams.thickness}
              onChange={(e) =>
                onBlobParamsChange({
                  ...blobParams,
                  thickness: parseInt(e.target.value),
                })
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
            <label className="block text-sm font-medium mb-2">
              Smoothness: {blobParams.smoothness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blobParams.smoothness}
              onChange={(e) =>
                onBlobParamsChange({
                  ...blobParams,
                  smoothness: parseInt(e.target.value),
                })
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
            <label className="block text-sm font-medium mb-2">
              Curvature: {blobParams.curvature}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blobParams.curvature}
              onChange={(e) =>
                onBlobParamsChange({
                  ...blobParams,
                  curvature: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0% (sharp)</span>
              <span>100% (round)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Grid Parameters</h3>

        <div className="space-y-4">
          {/* Grid Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Grid Spacing: {gridParams.spacing}
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={gridParams.spacing}
              onChange={(e) =>
                onGridParamsChange({
                  ...gridParams,
                  spacing: parseInt(e.target.value),
                })
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
            <label className="block text-sm font-medium mb-2">
              Grid Line Width: {gridParams.lineWidth.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={gridParams.lineWidth}
              onChange={(e) =>
                onGridParamsChange({
                  ...gridParams,
                  lineWidth: parseFloat(e.target.value),
                })
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
            <label className="block text-sm font-medium mb-2">
              Grid Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gridParams.gridColor}
                onChange={(e) =>
                  onGridParamsChange({
                    ...gridParams,
                    gridColor: e.target.value,
                  })
                }
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gridParams.gridColor}
                onChange={(e) =>
                  onGridParamsChange({
                    ...gridParams,
                    gridColor: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#999999"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

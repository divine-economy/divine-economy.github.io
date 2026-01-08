'use client';

import React from 'react';
import { DisplayParams } from '@/lib/displayParams';

interface DisplayControlsProps {
  displayParams: DisplayParams;
  onDisplayParamsChange: (params: DisplayParams) => void;
}

export function DisplayControls({
  displayParams,
  onDisplayParamsChange,
}: DisplayControlsProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Display & Spacing</h3>

        <div className="space-y-4">
          {/* Letter Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Letter Size: {displayParams.letterSize}px
            </label>
            <input
              type="range"
              min="40"
              max="200"
              value={displayParams.letterSize}
              onChange={(e) =>
                onDisplayParamsChange({
                  ...displayParams,
                  letterSize: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40px</span>
              <span>200px</span>
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Letter Spacing: {displayParams.letterSpacing}px
            </label>
            <input
              type="range"
              min="-20"
              max="50"
              value={displayParams.letterSpacing}
              onChange={(e) =>
                onDisplayParamsChange({
                  ...displayParams,
                  letterSpacing: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-20px (tight)</span>
              <span>50px (loose)</span>
            </div>
          </div>

          {/* Word Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Word Spacing: {displayParams.wordSpacing}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={displayParams.wordSpacing}
              onChange={(e) =>
                onDisplayParamsChange({
                  ...displayParams,
                  wordSpacing: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>100px</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Organic Variation</h3>

        <div className="space-y-4">
          {/* Rotation Variance */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rotation Variance: {displayParams.rotationVariance}°
            </label>
            <input
              type="range"
              min="0"
              max="15"
              value={displayParams.rotationVariance}
              onChange={(e) =>
                onDisplayParamsChange({
                  ...displayParams,
                  rotationVariance: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0° (straight)</span>
              <span>15° (playful)</span>
            </div>
          </div>

          {/* Vertical Variance */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vertical Variance: {displayParams.verticalVariance}px
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={displayParams.verticalVariance}
              onChange={(e) =>
                onDisplayParamsChange({
                  ...displayParams,
                  verticalVariance: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px (aligned)</span>
              <span>30px (bouncy)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Colors</h3>

        <div className="space-y-4">
          {/* Letter Color */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Letter Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={displayParams.letterColor}
                onChange={(e) =>
                  onDisplayParamsChange({
                    ...displayParams,
                    letterColor: e.target.value,
                  })
                }
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={displayParams.letterColor}
                onChange={(e) =>
                  onDisplayParamsChange({
                    ...displayParams,
                    letterColor: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Background Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={displayParams.backgroundColor}
                onChange={(e) =>
                  onDisplayParamsChange({
                    ...displayParams,
                    backgroundColor: e.target.value,
                  })
                }
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={displayParams.backgroundColor}
                onChange={(e) =>
                  onDisplayParamsChange({
                    ...displayParams,
                    backgroundColor: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#F9FAFB"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

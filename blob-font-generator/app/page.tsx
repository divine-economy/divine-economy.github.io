'use client';

import { useState } from 'react';
import { letterTemplates } from '@/lib/letterTemplates';
import { generateBlobPath, getLetterTransform, type BlobParams, type OrganicParams } from '@/lib/blobGenerator';

export default function Home() {
  // Text input
  const [text, setText] = useState('CONFETTI');

  // Display & Spacing
  const [letterSize, setLetterSize] = useState(80);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [wordSpacing, setWordSpacing] = useState(20);
  const [verticalCrop, setVerticalCrop] = useState(0);
  const [monospace, setMonospace] = useState(false);

  // Organic Variation
  const [rotationVariance, setRotationVariance] = useState(0);
  const [verticalVariance, setVerticalVariance] = useState(0);

  // Colors
  const [letterColor, setLetterColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#F9FAFB');

  // Blob Parameters
  const [blobThickness, setBlobThickness] = useState(69);
  const [smoothness, setSmoothness] = useState(20);
  const [curvature, setCurvature] = useState(30);

  // Grid Parameters
  const [showGrid, setShowGrid] = useState(false);
  const [gridSpacing, setGridSpacing] = useState(15);
  const [gridLineWidth, setGridLineWidth] = useState(1.5);
  const [gridColor, setGridColor] = useState('#999999');

  const blobParams: BlobParams = {
    thickness: blobThickness,
    curvature,
    smoothness
  };

  const organicParams: OrganicParams = {
    rotationVariance,
    verticalVariance
  };

  // Render text as blob letters
  const renderText = () => {
    const letters = text.toUpperCase().split('');
    let xOffset = 0;
    const elements: JSX.Element[] = [];

    letters.forEach((char, index) => {
      const template = letterTemplates[char] || letterTemplates[' '];
      const path = generateBlobPath(template.path, blobParams);
      const width = monospace ? 100 : template.width;

      const transform = getLetterTransform(index, organicParams);

      elements.push(
        <g
          key={index}
          transform={`translate(${xOffset}, ${verticalCrop}) ${transform}`}
        >
          <svg
            viewBox="0 0 100 100"
            width={letterSize}
            height={letterSize}
            style={{ overflow: 'visible' }}
          >
            <path d={path} fill={letterColor} />
          </svg>
        </g>
      );

      const spacing = char === ' ' ? wordSpacing : letterSpacing;
      xOffset += width * (letterSize / 100) + spacing;
    });

    return elements;
  };

  // Calculate total width for SVG
  const calculateTotalWidth = () => {
    const letters = text.toUpperCase().split('');
    let total = 0;
    letters.forEach((char) => {
      const template = letterTemplates[char] || letterTemplates[' '];
      const width = monospace ? 100 : template.width;
      const spacing = char === ' ' ? wordSpacing : letterSpacing;
      total += width * (letterSize / 100) + spacing;
    });
    return Math.max(total, 800);
  };

  const totalWidth = calculateTotalWidth();
  const totalHeight = letterSize + Math.abs(verticalCrop) + Math.abs(verticalVariance) * 2 + 100;

  return (
    <div className="flex h-screen">
      {/* Scrollable Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-4">Blob Font Generator</h1>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter text..."
            />
          </div>

          {/* Display & Spacing */}
          <section>
            <h2 className="text-lg font-bold mb-4">Display & Spacing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Letter Size: {letterSize}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={letterSize}
                  onChange={(e) => setLetterSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>40px</span>
                  <span>200px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Letter Spacing: {letterSpacing}px
                </label>
                <input
                  type="range"
                  min="-10"
                  max="50"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Word Spacing: {wordSpacing}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wordSpacing}
                  onChange={(e) => setWordSpacing(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0px</span>
                  <span>100px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vertical Crop: {verticalCrop}
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={verticalCrop}
                  onChange={(e) => setVerticalCrop(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-50 (show more)</span>
                  <span>50 (crop)</span>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={monospace}
                    onChange={(e) => setMonospace(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Monospace (equal letter width)</span>
                </label>
              </div>
            </div>
          </section>

          {/* Organic Variation */}
          <section>
            <h2 className="text-lg font-bold mb-4">Organic Variation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rotation Variance: {rotationVariance}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={rotationVariance}
                  onChange={(e) => setRotationVariance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0° (straight)</span>
                  <span>15° (playful)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vertical Variance: {verticalVariance}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={verticalVariance}
                  onChange={(e) => setVerticalVariance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0px (aligned)</span>
                  <span>30px (bouncy)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <h2 className="text-lg font-bold mb-4">Colors</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Letter Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={letterColor}
                    onChange={(e) => setLetterColor(e.target.value)}
                    className="w-20 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={letterColor}
                    onChange={(e) => setLetterColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Blob Parameters */}
          <section>
            <h2 className="text-lg font-bold mb-4">Blob Parameters</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Blob Thickness: {blobThickness}
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={blobThickness}
                  onChange={(e) => setBlobThickness(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30</span>
                  <span>150</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Smoothness: {smoothness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Curvature: {curvature}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={curvature}
                  onChange={(e) => setCurvature(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% (sharp)</span>
                  <span>100% (round)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Parameters */}
          <section>
            <h2 className="text-lg font-bold mb-4">Grid Parameters</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Show Grid</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Grid Spacing: {gridSpacing}
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={gridSpacing}
                  onChange={(e) => setGridSpacing(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>40</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Grid Line Width: {gridLineWidth}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={gridLineWidth}
                  onChange={(e) => setGridLineWidth(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5</span>
                  <span>5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Grid Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={gridColor}
                    onChange={(e) => setGridColor(e.target.value)}
                    className="w-20 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={gridColor}
                    onChange={(e) => setGridColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Preview Area */}
      <div
        className="flex-1 flex items-center justify-center overflow-auto"
        style={{ backgroundColor }}
      >
        <div className="relative">
          <svg
            width={totalWidth}
            height={totalHeight}
            style={{ display: 'block' }}
          >
            {/* Grid */}
            {showGrid && (
              <defs>
                <pattern
                  id="grid"
                  width={gridSpacing}
                  height={gridSpacing}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${gridSpacing} 0 L 0 0 0 ${gridSpacing}`}
                    fill="none"
                    stroke={gridColor}
                    strokeWidth={gridLineWidth}
                  />
                </pattern>
              </defs>
            )}
            {showGrid && (
              <rect width="100%" height="100%" fill="url(#grid)" />
            )}

            {/* Text */}
            <g transform={`translate(50, ${letterSize / 2 + 50})`}>
              {renderText()}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

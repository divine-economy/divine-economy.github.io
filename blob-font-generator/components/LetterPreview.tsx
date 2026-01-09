'use client';

import React from 'react';
import { letterTemplates } from '@/lib/letterTemplates';
import { generateGridPattern, GridParams } from '@/lib/gridOverlay';
import { BlobParams } from '@/lib/blobGenerator';
import { transformPath } from '@/lib/pathProcessor';

interface LetterPreviewProps {
  letter: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  size?: number;
  rotation?: number;
  verticalOffset?: number;
  letterColor?: string;
  verticalCrop?: number;
  monospaceWidth?: number;
}

export function LetterPreview({
  letter,
  blobParams,
  gridParams,
  size = 100,
  rotation = 0,
  verticalOffset = 0,
  letterColor = '#000000',
  verticalCrop = 0,
  monospaceWidth,
}: LetterPreviewProps) {
  const template = letterTemplates[letter];

  if (!template) {
    return null;
  }

  const uniqueId = `letter-${letter}-${Math.random().toString(36).substr(2, 9)}`;
  const gridPatternId = `grid-${uniqueId}`;
  const clipPathId = `clip-${uniqueId}`;

  // Transform the path with actual coordinate modifications
  const modifiedPath = transformPath(template.path, {
    thickness: blobParams.thickness,
    smoothness: blobParams.smoothness,
    curvature: blobParams.curvature,
  });

  // Calculate viewBox based on vertical crop
  // Negative crop = show more (zoom out), positive = show less (zoom in/crop)
  const viewBoxPadding = verticalCrop * -0.5; // -50 to 50 becomes 25 to -25
  const viewBoxY = 0 + viewBoxPadding;
  const viewBoxHeight = 100 - (viewBoxPadding * 2);
  const viewBox = `0 ${viewBoxY} 100 ${viewBoxHeight}`;

  // Calculate width for monospace or natural width
  const letterWidth = monospaceWidth || template.width;
  const aspectRatio = letterWidth / 100;
  const actualWidth = size * aspectRatio;

  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
        transition: 'transform 0.3s ease',
      }}
    >
      <svg
        width={actualWidth}
        height={size}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Grid pattern */}
          <g dangerouslySetInnerHTML={{ __html: generateGridPattern(gridPatternId, gridParams) }} />

          {/* Mask for grid overlay using modified shape */}
          <mask id={clipPathId}>
            <path
              d={modifiedPath}
              fill="white"
            />
          </mask>
        </defs>

        {/* Letter shape with custom color and modified path */}
        <path
          d={modifiedPath}
          fill={letterColor}
        />

        {/* Grid overlay masked to letter shape */}
        <rect
          width="100"
          height="100"
          fill={`url(#${gridPatternId})`}
          mask={`url(#${clipPathId})`}
        />
      </svg>
    </div>
  );
}

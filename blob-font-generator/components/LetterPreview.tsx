'use client';

import React from 'react';
import { BlobParams, GridParams } from '@/lib/displayParams';
import { generateFilterSVG, getThicknessTransform } from '@/lib/blobGenerator';
import { generateLetterGrid } from '@/lib/gridOverlay';

interface LetterPreviewProps {
  char: string;
  path: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  showGrid: boolean;
  color: string;
  size?: number;
  rotation?: number;
  verticalOffset?: number;
  verticalCrop?: number;
}

export default function LetterPreview({
  char,
  path,
  blobParams,
  gridParams,
  showGrid,
  color,
  size = 100,
  rotation = 0,
  verticalOffset = 0,
  verticalCrop = 100,
}: LetterPreviewProps) {
  const filterId = `blob-filter-${char.charCodeAt(0)}-${Math.random().toString(36).substr(2, 9)}`;
  const filterSVG = generateFilterSVG(filterId, blobParams);
  const transform = getThicknessTransform(blobParams.thickness);

  // Grid configuration
  const gridConfig = showGrid
    ? generateLetterGrid(char, path, gridParams, filterId)
    : null;

  // Calculate crop viewBox
  const cropAmount = (100 - verticalCrop) / 2;
  const viewBox = `0 ${cropAmount} 100 ${verticalCrop}`;

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg) translateY(${verticalOffset}px)`,
        display: 'inline-block',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <g dangerouslySetInnerHTML={{ __html: filterSVG }} />
          {gridConfig && (
            <>
              <g dangerouslySetInnerHTML={{ __html: gridConfig.patternSVG }} />
              <g dangerouslySetInnerHTML={{ __html: gridConfig.maskSVG }} />
            </>
          )}
        </defs>

        {/* Letter shape */}
        <path
          d={path}
          fill={color}
          filter={`url(#${filterId})`}
          transform={transform}
        />

        {/* Grid overlay */}
        {gridConfig && (
          <g dangerouslySetInnerHTML={{ __html: gridConfig.overlaySVG }} />
        )}
      </svg>
    </div>
  );
}

'use client';

import React from 'react';
import { letterTemplates } from '@/lib/letterTemplates';
import { generateGridPattern, generateSmoothingFilter, GridParams } from '@/lib/gridOverlay';
import { getBlobTransform, getSmoothnessBlur, BlobParams } from '@/lib/blobGenerator';

interface LetterPreviewProps {
  letter: string;
  blobParams: BlobParams;
  gridParams: GridParams;
  size?: number;
}

export function LetterPreview({
  letter,
  blobParams,
  gridParams,
  size = 100,
}: LetterPreviewProps) {
  const template = letterTemplates[letter];

  if (!template) {
    return null;
  }

  const uniqueId = `letter-${letter}-${Math.random().toString(36).substr(2, 9)}`;
  const gridPatternId = `grid-${uniqueId}`;
  const clipPathId = `clip-${uniqueId}`;
  const filterId = `filter-${uniqueId}`;

  const blur = getSmoothnessBlur(blobParams);
  const transform = getBlobTransform(blobParams);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'inline-block' }}
    >
      <defs>
        {/* Grid pattern */}
        <g dangerouslySetInnerHTML={{ __html: generateGridPattern(gridPatternId, gridParams) }} />

        {/* Smoothing filter */}
        {blur > 0 && (
          <g dangerouslySetInnerHTML={{ __html: generateSmoothingFilter(filterId, blur) }} />
        )}

        {/* Clip path for grid */}
        <clipPath id={clipPathId}>
          <path d={template.path} transform={transform} />
        </clipPath>
      </defs>

      {/* Black letter shape */}
      <path
        d={template.path}
        fill="black"
        transform={transform}
        filter={blur > 0 ? `url(#${filterId})` : undefined}
      />

      {/* Grid overlay clipped to letter shape */}
      <rect
        width="100"
        height="100"
        fill={`url(#${gridPatternId})`}
        clipPath={`url(#${clipPathId})`}
      />
    </svg>
  );
}

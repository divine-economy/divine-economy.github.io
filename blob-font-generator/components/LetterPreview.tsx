'use client';

import React from 'react';
import { letterTemplates } from '@/lib/letterTemplates';
import { generateGridPattern, GridParams } from '@/lib/gridOverlay';
import { getBlobTransform, getSmoothnessBlur, getCurvature, BlobParams } from '@/lib/blobGenerator';

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
  const combinedFilterId = `combined-${uniqueId}`;

  const smoothnessBlur = getSmoothnessBlur(blobParams);
  const curvature = getCurvature(blobParams);
  const transform = getBlobTransform(blobParams);

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

  // Generate combined filter with curvature and smoothness
  const generateCombinedFilter = () => {
    if (curvature === 0 && smoothnessBlur === 0) return '';

    // Use even smaller radius for very gradual rounding
    const curvatureRadius = (curvature / 100) * 2.5;
    const parts = [];

    if (curvature > 0) {
      // Very gradual morphology with proportionally larger blur
      parts.push(`
        <!-- Dilate to expand and round -->
        <feMorphology operator="dilate" radius="${curvatureRadius}" result="dilated" />
        <!-- Much larger blur for smoother, more even rounding -->
        <feGaussianBlur in="dilated" stdDeviation="${curvatureRadius * 1.2}" result="blurred" />
        <!-- Erode back to original size with rounded corners -->
        <feMorphology in="blurred" operator="erode" radius="${curvatureRadius}" result="rounded" />
      `);
    }

    if (smoothnessBlur > 0) {
      const inputSource = curvature > 0 ? 'rounded' : 'SourceGraphic';
      parts.push(`
        <!-- Apply smoothness blur -->
        <feGaussianBlur in="${inputSource}" stdDeviation="${smoothnessBlur}" result="smoothed" />
      `);
    }

    // Sharpen edges
    const finalInput = smoothnessBlur > 0 ? 'smoothed' : (curvature > 0 ? 'rounded' : 'SourceGraphic');
    if (curvature > 0) {
      parts.push(`
        <!-- Sharpen edges while keeping rounded corners -->
        <feComponentTransfer in="${finalInput}">
          <feFuncA type="discrete" tableValues="0 1" />
        </feComponentTransfer>
      `);
    }

    return `
      <filter id="${combinedFilterId}">
        ${parts.join('\n')}
      </filter>
    `;
  };

  const hasFilters = curvature > 0 || smoothnessBlur > 0;

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

          {/* Combined curvature and smoothness filter */}
          {hasFilters && (
            <g dangerouslySetInnerHTML={{ __html: generateCombinedFilter() }} />
          )}

          {/* Mask for grid overlay using filtered shape */}
          <mask id={clipPathId}>
            <path
              d={template.path}
              transform={transform}
              fill="white"
              filter={hasFilters ? `url(#${combinedFilterId})` : undefined}
            />
          </mask>
        </defs>

        {/* Letter shape with custom color */}
        <path
          d={template.path}
          fill={letterColor}
          transform={transform}
          filter={hasFilters ? `url(#${combinedFilterId})` : undefined}
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

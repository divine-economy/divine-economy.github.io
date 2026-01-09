// Blob generator for preview - calculates filter values for SVG morphology
// These filters are for VISUAL PREVIEW ONLY

import { BlobParams } from './displayParams';

export interface FilterValues {
  dilateRadius: number;
  blurStdDeviation: number;
  erodeRadius: number;
  scaleTransform: number;
}

// Calculate filter values for morphological operations
export function calculateFilterValues(params: BlobParams): FilterValues {
  const { thickness, smoothness, curvature } = params;

  // Thickness affects scale
  const scaleTransform = thickness / 100;

  // Curvature affects dilate-blur-erode chain
  const curvatureFactor = curvature / 100;

  // Smoothness affects blur amount
  const smoothnessFactor = smoothness / 100;

  // Calculate morphology radii
  const dilateRadius = curvatureFactor * 3; // 0-3
  const erodeRadius = curvatureFactor * 2.5; // 0-2.5
  const blurStdDeviation = smoothnessFactor * 4 + dilateRadius * 0.8; // 0-4 plus dilation contribution

  return {
    dilateRadius,
    blurStdDeviation,
    erodeRadius,
    scaleTransform,
  };
}

// Generate SVG filter definition
export function generateFilterSVG(filterId: string, params: BlobParams): string {
  const values = calculateFilterValues(params);

  return `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
      <feMorphology operator="dilate" radius="${values.dilateRadius}" in="SourceGraphic" result="dilated" />
      <feGaussianBlur in="dilated" stdDeviation="${values.blurStdDeviation}" result="blurred" />
      <feMorphology operator="erode" radius="${values.erodeRadius}" in="blurred" result="eroded" />
      <feComponentTransfer in="eroded" result="final">
        <feFuncA type="discrete" tableValues="0 1" />
      </feComponentTransfer>
    </filter>
  `;
}

// Get transform string for thickness scaling
export function getThicknessTransform(thickness: number): string {
  const scale = thickness / 100;
  return `translate(50, 50) scale(${scale}) translate(-50, -50)`;
}

// Generate complete filter chain for a letter
export interface LetterFilterConfig {
  filterId: string;
  transform: string;
  filterSVG: string;
}

export function generateLetterFilter(
  letterChar: string,
  params: BlobParams
): LetterFilterConfig {
  const filterId = `blob-filter-${letterChar.charCodeAt(0)}`;
  const filterSVG = generateFilterSVG(filterId, params);
  const transform = getThicknessTransform(params.thickness);

  return {
    filterId,
    transform,
    filterSVG,
  };
}

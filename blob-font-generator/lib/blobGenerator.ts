// Blob generation and path smoothing utilities

export interface BlobParams {
  thickness: number; // 30-150
  smoothness: number; // 0-100
}

/**
 * Apply blob parameters to a letter path
 * This scales and transforms the path based on thickness and smoothness
 */
export function applyBlobParams(
  path: string,
  params: BlobParams
): string {
  // Normalize thickness to a scale factor (0.5 to 2.0)
  const thicknessFactor = 0.5 + (params.thickness / 100) * 1.5;

  // For now, we'll apply thickness by scaling the entire path
  // In a more advanced implementation, we could parse and modify individual points

  return path;
}

/**
 * Calculate the bounding box of an SVG path
 */
export function getPathBounds(path: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // For our letter templates, we use a standard viewBox of 0 0 100 100
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
}

/**
 * Generate transformation string for SVG based on blob parameters
 */
export function getBlobTransform(params: BlobParams): string {
  const thicknessFactor = 0.5 + (params.thickness / 100) * 1.5;

  // Apply thickness by scaling from center
  const scale = thicknessFactor;
  const translateX = 50 * (1 - scale);
  const translateY = 50 * (1 - scale);

  return `translate(${translateX} ${translateY}) scale(${scale})`;
}

/**
 * Get stroke-based thickness effect
 * Returns stroke width that creates the blob effect
 */
export function getStrokeThickness(params: BlobParams): number {
  // Map thickness param (30-150) to stroke width (0-20)
  const minStroke = 0;
  const maxStroke = 20;
  const normalizedThickness = (params.thickness - 30) / (150 - 30);

  return minStroke + normalizedThickness * (maxStroke - minStroke);
}

/**
 * Get filter blur for smoothness effect
 */
export function getSmoothnessBlur(params: BlobParams): number {
  // Map smoothness (0-100) to blur (0-3)
  return (params.smoothness / 100) * 3;
}

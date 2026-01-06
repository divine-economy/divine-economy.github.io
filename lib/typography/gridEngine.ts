/**
 * Simple Grid Engine - Deterministic blob generation with edge pixels
 */

import { Parameters, Point, Stroke, LetterSkeleton } from './types';

export const UNITS_PER_EM = 1000;
export const CAP_HEIGHT = 700;

/**
 * Generate a simple filled blob from skeleton strokes
 */
function generateFilledBlob(skeleton: LetterSkeleton, params: Parameters): string {
  let pathData = '';
  const strokeWidth = params.blobThickness;

  for (const stroke of skeleton.strokes) {
    const points = stroke.points;
    if (points.length < 2) continue;

    // Scale points to actual coordinates
    const scaledPoints = points.map(p => ({
      x: p.x * UNITS_PER_EM * (params.width / 100),
      y: p.y * CAP_HEIGHT,
    }));

    const width = strokeWidth * stroke.weight;

    if (stroke.type === 'vertical' || stroke.type === 'horizontal' || stroke.type === 'diagonal') {
      // Straight strokes - create rectangles
      pathData += createRectangleStroke(scaledPoints, width);
    } else {
      // Curved strokes - create smooth paths
      pathData += createCurvedStroke(scaledPoints, width, params.blobSmoothness);
    }
  }

  return pathData;
}

/**
 * Create a rectangle stroke from points
 */
function createRectangleStroke(points: Point[], width: number): string {
  if (points.length < 2) return '';

  const start = points[0];
  const end = points[points.length - 1];

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len === 0) return '';

  // Perpendicular vector
  const px = -dy / len * (width / 2);
  const py = dx / len * (width / 2);

  return `
    M ${start.x + px} ${start.y + py}
    L ${end.x + px} ${end.y + py}
    L ${end.x - px} ${end.y - py}
    L ${start.x - px} ${start.y - py}
    Z
  `;
}

/**
 * Create a smooth curved stroke
 */
function createCurvedStroke(points: Point[], width: number, smoothness: number): string {
  if (points.length < 2) return '';

  // For now, create polygonal path with rounded joins
  // Can be enhanced later with proper offset curves

  const halfWidth = width / 2;
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    let dx = 0, dy = 0;

    if (i === 0) {
      dx = points[1].x - curr.x;
      dy = points[1].y - curr.y;
    } else if (i === points.length - 1) {
      dx = curr.x - points[i - 1].x;
      dy = curr.y - points[i - 1].y;
    } else {
      dx = points[i + 1].x - points[i - 1].x;
      dy = points[i + 1].y - points[i - 1].y;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    const px = -dy * halfWidth;
    const py = dx * halfWidth;

    leftSide.push({ x: curr.x + px, y: curr.y + py });
    rightSide.push({ x: curr.x - px, y: curr.y - py });
  }

  let path = `M ${leftSide[0].x} ${leftSide[0].y}`;

  // Left side
  for (let i = 1; i < leftSide.length; i++) {
    path += ` L ${leftSide[i].x} ${leftSide[i].y}`;
  }

  // Right side (reversed)
  for (let i = rightSide.length - 1; i >= 0; i--) {
    path += ` L ${rightSide[i].x} ${rightSide[i].y}`;
  }

  path += ' Z';

  return path;
}

/**
 * Generate edge pixels around the blob
 */
function generateEdgePixels(blobPath: string, params: Parameters): string {
  // For MVP, skip edge pixels and just return the blob
  // This will make letters consistent first
  return '';
}

/**
 * Generate complete glyph
 */
export function generateGlyph(
  skeleton: LetterSkeleton,
  params: Parameters
): { svgPath: string; advanceWidth: number } {
  // Generate filled blob
  const blobPath = generateFilledBlob(skeleton, params);

  // For now, just return the blob without edge pixels
  // Once this works consistently, we can add edge decoration
  const finalPath = blobPath;

  // Calculate advance width
  const baseWidth = UNITS_PER_EM * skeleton.width * (params.width / 100);
  const advanceWidth = baseWidth + params.tracking;

  return {
    svgPath: finalPath,
    advanceWidth: params.monospace ? UNITS_PER_EM : advanceWidth,
  };
}

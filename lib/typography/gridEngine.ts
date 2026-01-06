/**
 * Edge-Based Grid Engine - Places pixels only on the outline of organic shapes
 */

import { Parameters, Point, Stroke, LetterSkeleton } from './types';

export const UNITS_PER_EM = 1000;
export const CAP_HEIGHT = 700;

/**
 * Generate smooth blob outline from letter skeleton
 */
export function generateBlobOutline(skeleton: LetterSkeleton, params: Parameters): string {
  let pathData = '';

  for (const stroke of skeleton.strokes) {
    const points = stroke.points;
    const strokeWidth = (params.blobThickness / 100) * 100; // Base thickness

    if (points.length < 2) continue;

    // Scale points to actual coordinates
    const scaledPoints = points.map(p => ({
      x: p.x * UNITS_PER_EM,
      y: p.y * CAP_HEIGHT,
    }));

    // Create path with proper width
    if (stroke.type === 'curve' || stroke.type === 'blob') {
      // For curves, create a smooth path
      pathData += createSmoothStroke(scaledPoints, strokeWidth * stroke.weight);
    } else {
      // For straight lines
      pathData += createStraightStroke(scaledPoints, strokeWidth * stroke.weight);
    }
  }

  return pathData;
}

/**
 * Create a stroke path from points with given width
 */
function createSmoothStroke(points: Point[], width: number): string {
  if (points.length === 0) return '';

  // Create offset paths on both sides of the center line
  const leftPath: Point[] = [];
  const rightPath: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    // Calculate perpendicular direction
    let dx = 0;
    let dy = 0;

    if (i === 0 && points.length > 1) {
      dx = points[1].x - p.x;
      dy = points[1].y - p.y;
    } else if (i === points.length - 1) {
      dx = p.x - points[i - 1].x;
      dy = p.y - points[i - 1].y;
    } else {
      dx = points[i + 1].x - points[i - 1].x;
      dy = points[i + 1].y - points[i - 1].y;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    // Perpendicular vector
    const perpX = -dy;
    const perpY = dx;

    // Offset points
    const halfWidth = width / 2;
    leftPath.push({
      x: p.x + perpX * halfWidth,
      y: p.y + perpY * halfWidth,
    });
    rightPath.push({
      x: p.x - perpX * halfWidth,
      y: p.y - perpY * halfWidth,
    });
  }

  // Build path: start -> left side -> end -> right side (reversed) -> close
  let path = `M ${leftPath[0].x} ${leftPath[0].y} `;

  // Left side with curves
  for (let i = 1; i < leftPath.length; i++) {
    if (i === 1 || i === leftPath.length - 1) {
      path += `L ${leftPath[i].x} ${leftPath[i].y} `;
    } else {
      // Use quadratic curves for smoothness
      const prev = leftPath[i - 1];
      const curr = leftPath[i];
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      path += `Q ${cpx} ${cpy} ${curr.x} ${curr.y} `;
    }
  }

  // Right side (reversed)
  for (let i = rightPath.length - 1; i >= 0; i--) {
    path += `L ${rightPath[i].x} ${rightPath[i].y} `;
  }

  path += 'Z ';

  return path;
}

/**
 * Create straight stroke with width
 */
function createStraightStroke(points: Point[], width: number): string {
  if (points.length < 2) return '';

  const start = points[0];
  const end = points[points.length - 1];

  // Calculate perpendicular
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len === 0) return '';

  const perpX = (-dy / len) * (width / 2);
  const perpY = (dx / len) * (width / 2);

  // Create rectangle
  return `
    M ${start.x + perpX} ${start.y + perpY}
    L ${end.x + perpX} ${end.y + perpY}
    L ${end.x - perpX} ${end.y - perpY}
    L ${start.x - perpX} ${start.y - perpY}
    Z
  `;
}

/**
 * Sample points along an SVG path outline
 */
function samplePathOutline(pathData: string, spacing: number): Point[] {
  // This is a simplified version - in a real implementation,
  // we'd parse the SVG path and sample it properly
  // For now, we'll extract key points from the path commands

  const points: Point[] = [];
  const commands = pathData.match(/[MLQCZmlqcz][^MLQCZmlqcz]*/g) || [];

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const coords = cmd.slice(1).trim().split(/[\s,]+/).filter(s => s).map(parseFloat);

    switch (type) {
      case 'M':
      case 'L':
        if (coords.length >= 2) {
          points.push({ x: coords[0], y: coords[1] });
          currentX = coords[0];
          currentY = coords[1];
        }
        break;
      case 'Q':
        if (coords.length >= 4) {
          // Add control point and end point
          points.push({ x: coords[0], y: coords[1] });
          points.push({ x: coords[2], y: coords[3] });
          currentX = coords[2];
          currentY = coords[3];
        }
        break;
    }
  }

  // Subsample based on spacing
  if (points.length === 0) return points;

  const subsampledPoints: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const dist = Math.sqrt(
      Math.pow(p.x - lastPoint.x, 2) + Math.pow(p.y - lastPoint.y, 2)
    );

    if (dist >= spacing) {
      subsampledPoints.push(p);
      lastPoint = p;
    }
  }

  return subsampledPoints;
}

/**
 * Place edge pixels along the outline
 */
export function generateEdgePixels(
  blobPath: string,
  params: Parameters
): string {
  const pixelSize = params.edgePixelSize;
  const edgeSpacing = params.edgePixelSpacing;
  const cornerRadius = (params.cornerRadius / 100) * (pixelSize / 2);

  // Sample points along the blob outline
  const edgePoints = samplePathOutline(blobPath, edgeSpacing);

  let pixelsPath = '';

  // Place a square at each edge point
  for (const point of edgePoints) {
    const x = point.x - pixelSize / 2;
    const y = point.y - pixelSize / 2;

    if (cornerRadius > 0) {
      // Rounded square
      const r = Math.min(cornerRadius, pixelSize / 2);
      pixelsPath += `
        M ${x + r} ${y}
        L ${x + pixelSize - r} ${y}
        Q ${x + pixelSize} ${y} ${x + pixelSize} ${y + r}
        L ${x + pixelSize} ${y + pixelSize - r}
        Q ${x + pixelSize} ${y + pixelSize} ${x + pixelSize - r} ${y + pixelSize}
        L ${x + r} ${y + pixelSize}
        Q ${x} ${y + pixelSize} ${x} ${y + pixelSize - r}
        L ${x} ${y + r}
        Q ${x} ${y} ${x + r} ${y}
        Z
      `;
    } else {
      // Sharp square
      pixelsPath += `
        M ${x} ${y}
        L ${x + pixelSize} ${y}
        L ${x + pixelSize} ${y + pixelSize}
        L ${x} ${y + pixelSize}
        Z
      `;
    }
  }

  return pixelsPath;
}

/**
 * Generate complete glyph: solid blob + edge pixels
 */
export function generateGlyph(
  skeleton: LetterSkeleton,
  params: Parameters
): { svgPath: string; advanceWidth: number } {
  // Generate smooth blob outline
  const blobPath = generateBlobOutline(skeleton, params);

  // Generate edge pixels
  const edgePixelsPath = generateEdgePixels(blobPath, params);

  // Combine: blob fill + edge pixels on top
  let finalPath = '';

  if (params.fillStyle === 'solid') {
    // Solid blob with edge pixels
    finalPath = blobPath + ' ' + edgePixelsPath;
  } else if (params.fillStyle === 'outline-only') {
    // Only edge pixels
    finalPath = edgePixelsPath;
  } else {
    // Hollow: blob outline as stroke + edge pixels
    finalPath = blobPath + ' ' + edgePixelsPath;
  }

  // Calculate advance width
  const baseWidth = UNITS_PER_EM * skeleton.width;
  const widthAdjustment = params.width / 100;
  const advanceWidth = baseWidth * widthAdjustment + params.tracking;

  return {
    svgPath: finalPath,
    advanceWidth: params.monospace ? UNITS_PER_EM : advanceWidth,
  };
}

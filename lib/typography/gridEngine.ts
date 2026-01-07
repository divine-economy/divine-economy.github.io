/**
 * Blob-Based Generation Engine with Grid Overlay
 * Creates smooth organic letterforms with a grid pattern inside
 */

import { Parameters, Point, Stroke, LetterSkeleton } from './types';

export const UNITS_PER_EM = 1000;
export const CAP_HEIGHT = 700;

/**
 * Generate smooth organic blob shapes with grid overlay
 */
export function generateGlyph(
  skeleton: LetterSkeleton,
  params: Parameters
): { svgPath: string; gridPath: string; advanceWidth: number } {
  try {
    // Step 1: Generate smooth blob shape (this is the letter itself)
    const svgPath = generateBlobShape(skeleton, params);
    console.log('Generated blob path:', svgPath.substring(0, 100) + '...');

    // Step 2: Get bounds of the blob for grid generation
    const bounds = getPathBounds(svgPath);
    console.log('Blob bounds:', bounds);

    // Step 3: Generate grid lines that cover the blob area
    const gridPath = generateGridPattern(bounds, params.gridSpacing);
    console.log('Generated grid path:', gridPath.substring(0, 100) + '...');

    // Calculate advance width
    const baseWidth = UNITS_PER_EM * skeleton.width * (params.width / 100);
    const advanceWidth = baseWidth + params.tracking;

    return {
      svgPath,
      gridPath,
      advanceWidth: params.monospace ? UNITS_PER_EM : advanceWidth,
    };
  } catch (error) {
    console.error('Error in generateGlyph:', error);
    return {
      svgPath: '',
      gridPath: '',
      advanceWidth: UNITS_PER_EM,
    };
  }
}

/**
 * Generate smooth organic blob shape
 */
function generateBlobShape(skeleton: LetterSkeleton, params: Parameters): string {
  let pathData = '';
  const baseThickness = params.blobThickness;

  for (const stroke of skeleton.strokes) {
    const points = stroke.points;
    if (points.length < 2) continue;

    // Scale points to actual coordinates
    const scaledPoints = points.map(p => ({
      x: p.x * UNITS_PER_EM * (params.width / 100),
      y: p.y * CAP_HEIGHT,
    }));

    // Create blob shape with consistent thickness
    const thickness = baseThickness;

    if (stroke.type === 'curve' || stroke.type === 'blob') {
      pathData += createBlobPath(scaledPoints, thickness, true, params.blobSmoothness);
    } else {
      pathData += createBlobPath(scaledPoints, thickness, false, params.blobSmoothness);
    }
  }

  return pathData;
}

/**
 * Generate a regular grid pattern (horizontal and vertical lines)
 */
function generateGridPattern(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  gridSpacing: number
): string {
  let path = '';

  // Add some padding to ensure grid covers the entire shape
  const padding = gridSpacing;
  const startX = Math.floor(bounds.minX / gridSpacing) * gridSpacing - padding;
  const startY = Math.floor(bounds.minY / gridSpacing) * gridSpacing - padding;
  const endX = Math.ceil(bounds.maxX / gridSpacing) * gridSpacing + padding;
  const endY = Math.ceil(bounds.maxY / gridSpacing) * gridSpacing + padding;

  // Vertical lines
  for (let x = startX; x <= endX; x += gridSpacing) {
    path += `M ${x} ${startY} L ${x} ${endY} `;
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSpacing) {
    path += `M ${startX} ${y} L ${endX} ${y} `;
  }

  return path;
}

/**
 * Get bounding box of SVG path
 */
function getPathBounds(pathData: string): { minX: number; minY: number; maxX: number; maxY: number } {
  // Simple regex-based parser for M, L, Q, Z commands
  const coords: number[] = [];
  const numbers = pathData.match(/[-+]?[0-9]*\.?[0-9]+/g);

  if (!numbers) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  for (const num of numbers) {
    coords.push(parseFloat(num));
  }

  const xCoords = coords.filter((_, i) => i % 2 === 0);
  const yCoords = coords.filter((_, i) => i % 2 === 1);

  return {
    minX: Math.min(...xCoords),
    maxX: Math.max(...xCoords),
    minY: Math.min(...yCoords),
    maxY: Math.max(...yCoords),
  };
}

/**
 * Create a blob-like path with smooth curves
 */
function createBlobPath(points: Point[], thickness: number, curved: boolean, smoothness: number): string {
  if (points.length < 2) return '';

  const halfThickness = thickness / 2;

  if (points.length === 2) {
    // Simple stroke - just a rectangle
    return createSimpleStroke(points[0], points[1], thickness);
  }

  // Multi-point path - create offset curves
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const perpendicular = getPerpendicular(points, i);

    leftSide.push({
      x: curr.x + perpendicular.x * halfThickness,
      y: curr.y + perpendicular.y * halfThickness,
    });

    rightSide.push({
      x: curr.x - perpendicular.x * halfThickness,
      y: curr.y - perpendicular.y * halfThickness,
    });
  }

  // Build path - start at first left point
  let path = `M ${leftSide[0].x} ${leftSide[0].y} `;

  // Left side to end
  for (let i = 1; i < leftSide.length; i++) {
    if (curved && smoothness > 50) {
      const prev = leftSide[i - 1];
      const curr = leftSide[i];
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      path += `Q ${cpx} ${cpy} ${curr.x} ${curr.y} `;
    } else {
      path += `L ${leftSide[i].x} ${leftSide[i].y} `;
    }
  }

  // Connect to right side end
  path += `L ${rightSide[rightSide.length - 1].x} ${rightSide[rightSide.length - 1].y} `;

  // Right side back to start (reversed)
  for (let i = rightSide.length - 2; i >= 0; i--) {
    if (curved && smoothness > 50) {
      const curr = rightSide[i];
      const next = rightSide[i + 1];
      const cpx = (curr.x + next.x) / 2;
      const cpy = (curr.y + next.y) / 2;
      path += `Q ${cpx} ${cpy} ${curr.x} ${curr.y} `;
    } else {
      path += `L ${rightSide[i].x} ${rightSide[i].y} `;
    }
  }

  // Close path back to start
  path += `Z `;

  return path;
}

/**
 * Create a simple stroke between two points
 */
function createSimpleStroke(start: Point, end: Point, thickness: number): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return '';

  const perpX = -dy / length;
  const perpY = dx / length;
  const halfThickness = thickness / 2;

  const p1 = { x: start.x + perpX * halfThickness, y: start.y + perpY * halfThickness };
  const p2 = { x: end.x + perpX * halfThickness, y: end.y + perpY * halfThickness };
  const p3 = { x: end.x - perpX * halfThickness, y: end.y - perpY * halfThickness };
  const p4 = { x: start.x - perpX * halfThickness, y: start.y - perpY * halfThickness };

  return `
    M ${p1.x} ${p1.y}
    L ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    L ${p4.x} ${p4.y}
    Z
  `;
}

/**
 * Get perpendicular vector at a point along the path
 */
function getPerpendicular(points: Point[], index: number): Point {
  let dx = 0;
  let dy = 0;

  if (index === 0 && points.length > 1) {
    dx = points[1].x - points[0].x;
    dy = points[1].y - points[0].y;
  } else if (index === points.length - 1) {
    dx = points[index].x - points[index - 1].x;
    dy = points[index].y - points[index - 1].y;
  } else {
    dx = points[index + 1].x - points[index - 1].x;
    dy = points[index + 1].y - points[index - 1].y;
  }

  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return { x: 0, y: 1 };

  return {
    x: -dy / length,
    y: dx / length,
  };
}

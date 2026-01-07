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

    // Step 2: Get bounds of the blob for grid generation
    const bounds = getPathBounds(svgPath);

    // Step 3: Generate grid lines that cover the entire blob area
    const gridPath = generateGridPattern(bounds, params.gridSpacing);

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
 * Generate smooth organic blob shape from skeleton
 */
function generateBlobShape(skeleton: LetterSkeleton, params: Parameters): string {
  let pathData = '';
  const baseThickness = params.blobThickness;
  const smoothness = params.blobSmoothness / 100; // 0 to 1

  for (const stroke of skeleton.strokes) {
    const points = stroke.points;
    if (points.length < 2) continue;

    // Scale points to actual coordinates
    const scaledPoints = points.map(p => ({
      x: p.x * UNITS_PER_EM * (params.width / 100),
      y: p.y * CAP_HEIGHT,
    }));

    const thickness = baseThickness;
    const curved = stroke.type === 'curve' || stroke.type === 'blob';

    // Create smooth blob path with rounded caps
    pathData += createSmoothBlobStroke(scaledPoints, thickness, curved, smoothness);
  }

  return pathData;
}

/**
 * Create a smooth blob stroke with rounded caps
 */
function createSmoothBlobStroke(
  points: Point[],
  thickness: number,
  curved: boolean,
  smoothness: number
): string {
  if (points.length < 2) return '';

  const halfThickness = thickness / 2;

  // For a single line segment, create a rounded capsule shape
  if (points.length === 2) {
    return createRoundedCapsule(points[0], points[1], thickness, smoothness);
  }

  // For multi-point paths, create offset curves with rounded joins
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];

  // Generate offset points on both sides
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

  // Build the path with smooth curves
  let path = '';

  // Start with a rounded cap at the beginning
  path += createRoundedCap(
    leftSide[0],
    rightSide[0],
    points[0],
    thickness,
    true // start cap
  );

  // Draw left side
  for (let i = 1; i < leftSide.length; i++) {
    if (curved && smoothness > 0.3) {
      // Use smooth quadratic curves
      const prev = leftSide[i - 1];
      const curr = leftSide[i];
      const controlPoint = {
        x: prev.x + (curr.x - prev.x) * 0.5,
        y: prev.y + (curr.y - prev.y) * 0.5,
      };
      path += `Q ${controlPoint.x} ${controlPoint.y} ${curr.x} ${curr.y} `;
    } else {
      path += `L ${leftSide[i].x} ${leftSide[i].y} `;
    }
  }

  // Rounded cap at the end
  path += createRoundedCap(
    leftSide[leftSide.length - 1],
    rightSide[rightSide.length - 1],
    points[points.length - 1],
    thickness,
    false // end cap
  );

  // Draw right side back
  for (let i = rightSide.length - 2; i >= 0; i--) {
    if (curved && smoothness > 0.3) {
      const curr = rightSide[i];
      const next = rightSide[i + 1];
      const controlPoint = {
        x: next.x + (curr.x - next.x) * 0.5,
        y: next.y + (curr.y - next.y) * 0.5,
      };
      path += `Q ${controlPoint.x} ${controlPoint.y} ${curr.x} ${curr.y} `;
    } else {
      path += `L ${rightSide[i].x} ${rightSide[i].y} `;
    }
  }

  path += 'Z';
  return path;
}

/**
 * Create a rounded capsule (pill shape) between two points
 */
function createRoundedCapsule(start: Point, end: Point, thickness: number, smoothness: number): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    // Just a circle
    const radius = thickness / 2;
    return `
      M ${start.x - radius} ${start.y}
      A ${radius} ${radius} 0 1 0 ${start.x + radius} ${start.y}
      A ${radius} ${radius} 0 1 0 ${start.x - radius} ${start.y}
      Z
    `;
  }

  const perpX = -dy / length;
  const perpY = dx / length;
  const halfThickness = thickness / 2;

  // Four corner points of the rectangle
  const p1 = { x: start.x + perpX * halfThickness, y: start.y + perpY * halfThickness };
  const p2 = { x: end.x + perpX * halfThickness, y: end.y + perpY * halfThickness };
  const p3 = { x: end.x - perpX * halfThickness, y: end.y - perpY * halfThickness };
  const p4 = { x: start.x - perpX * halfThickness, y: start.y - perpY * halfThickness };

  // Create path with rounded ends
  return `
    M ${p1.x} ${p1.y}
    L ${p2.x} ${p2.y}
    A ${halfThickness} ${halfThickness} 0 0 1 ${p3.x} ${p3.y}
    L ${p4.x} ${p4.y}
    A ${halfThickness} ${halfThickness} 0 0 1 ${p1.x} ${p1.y}
    Z
  `;
}

/**
 * Create a rounded cap at the end of a stroke
 */
function createRoundedCap(
  left: Point,
  right: Point,
  center: Point,
  thickness: number,
  isStart: boolean
): string {
  const radius = thickness / 2;

  if (isStart) {
    // Arc from right to left around the start
    return `M ${right.x} ${right.y} A ${radius} ${radius} 0 0 1 ${left.x} ${left.y} `;
  } else {
    // Arc from left to right around the end
    return `A ${radius} ${radius} 0 0 1 ${right.x} ${right.y} `;
  }
}

/**
 * Generate a regular grid pattern (horizontal and vertical lines)
 */
function generateGridPattern(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  gridSpacing: number
): string {
  let path = '';

  // Add padding to ensure grid covers everything
  const padding = gridSpacing * 2;
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

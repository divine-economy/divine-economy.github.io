/**
 * Blob-Based Generation Engine with Pixel Grid Overlay
 * Creates organic letterforms that appear to be made of visible pixels
 */

import { Parameters, Point, Stroke, LetterSkeleton } from './types';

export const UNITS_PER_EM = 1000;
export const CAP_HEIGHT = 700;

/**
 * Generate organic blob shapes with pixel grid overlay
 */
export function generateGlyph(
  skeleton: LetterSkeleton,
  params: Parameters
): { svgPath: string; gridPath: string; advanceWidth: number } {
  try {
    // Step 1: Generate smooth blob shape
    const blobPath = generateBlobShape(skeleton, params);

    // Step 2: Rasterize blob into pixel grid
    const pixels = rasterizeBlobToGrid(blobPath, params.pixelSize);

    // Step 3: Draw pixels (solid black)
    const svgPath = drawPixels(pixels, params.pixelSize);

    // Step 4: Generate grid lines
    const gridPath = drawGridLines(pixels, params);

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
 * Step 1: Generate smooth organic blob shape
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
 * Step 2: Rasterize blob shape into a pixel grid
 * Returns array of pixel coordinates that are "on"
 */
function rasterizeBlobToGrid(blobPath: string, pixelSize: number): Point[] {
  // Parse the SVG path to get bounds and sample points
  const bounds = getPathBounds(blobPath);

  const pixels: Point[] = [];

  // Sample grid cells to see which ones intersect the blob
  const gridStartX = Math.floor(bounds.minX / pixelSize) * pixelSize;
  const gridStartY = Math.floor(bounds.minY / pixelSize) * pixelSize;
  const gridEndX = Math.ceil(bounds.maxX / pixelSize) * pixelSize;
  const gridEndY = Math.ceil(bounds.maxY / pixelSize) * pixelSize;

  for (let x = gridStartX; x < gridEndX; x += pixelSize) {
    for (let y = gridStartY; y < gridEndY; y += pixelSize) {
      // Check if this pixel cell intersects with the blob
      // We'll use a simple approach: check the center point
      const centerX = x + pixelSize / 2;
      const centerY = y + pixelSize / 2;

      if (isPointInPath(centerX, centerY, blobPath)) {
        pixels.push({ x, y });
      }
    }
  }

  return pixels;
}

/**
 * Step 3: Draw solid black pixels
 */
function drawPixels(pixels: Point[], pixelSize: number): string {
  let path = '';

  for (const pixel of pixels) {
    path += `M ${pixel.x} ${pixel.y} `;
    path += `L ${pixel.x + pixelSize} ${pixel.y} `;
    path += `L ${pixel.x + pixelSize} ${pixel.y + pixelSize} `;
    path += `L ${pixel.x} ${pixel.y + pixelSize} `;
    path += `Z `;
  }

  return path;
}

/**
 * Step 4: Draw grid lines between pixels
 * Only draws lines where there are adjacent pixels
 */
function drawGridLines(pixels: Point[], params: Parameters): string {
  const { pixelSize, gridLineWidth } = params;
  const lines = new Set<string>();

  // Create a lookup set for quick pixel existence checks
  const pixelSet = new Set(pixels.map(p => `${p.x},${p.y}`));

  for (const pixel of pixels) {
    // Check for adjacent pixels and draw grid lines between them
    const x = pixel.x;
    const y = pixel.y;

    // Right edge - draw vertical line if there's a pixel to the right
    const rightKey = `${x + pixelSize},${y}`;
    if (pixelSet.has(rightKey)) {
      const lineKey = `V|${x + pixelSize}|${y}|${y + pixelSize}`;
      lines.add(lineKey);
    }

    // Bottom edge - draw horizontal line if there's a pixel below
    const bottomKey = `${x},${y + pixelSize}`;
    if (pixelSet.has(bottomKey)) {
      const lineKey = `H|${y + pixelSize}|${x}|${x + pixelSize}`;
      lines.add(lineKey);
    }

    // Always draw bottom and right edges as they're part of the pixel boundary
    // This creates the grid effect on the edges of the letter
  }

  // Convert line descriptors to SVG path
  let path = '';
  for (const lineDesc of lines) {
    const parts = lineDesc.split('|');
    if (parts[0] === 'V') {
      // Vertical line
      const x = parseFloat(parts[1]);
      const y1 = parseFloat(parts[2]);
      const y2 = parseFloat(parts[3]);
      path += `M ${x} ${y1} L ${x} ${y2} `;
    } else {
      // Horizontal line
      const y = parseFloat(parts[1]);
      const x1 = parseFloat(parts[2]);
      const x2 = parseFloat(parts[3]);
      path += `M ${x1} ${y} L ${x2} ${y} `;
    }
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
 * Check if a point is inside an SVG path
 * Uses ray casting algorithm
 */
function isPointInPath(px: number, py: number, pathData: string): boolean {
  // Extract all points from the path
  const points = extractPathPoints(pathData);

  if (points.length === 0) return false;

  // Ray casting algorithm
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersect = ((yi > py) !== (yj > py)) &&
                      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Extract coordinate points from SVG path data
 */
function extractPathPoints(pathData: string): Point[] {
  const points: Point[] = [];
  const numbers = pathData.match(/[-+]?[0-9]*\.?[0-9]+/g);

  if (!numbers) return points;

  for (let i = 0; i < numbers.length; i += 2) {
    if (i + 1 < numbers.length) {
      points.push({
        x: parseFloat(numbers[i]),
        y: parseFloat(numbers[i + 1]),
      });
    }
  }

  return points;
}

/**
 * Create a blob-like path
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

/**
 * Export pixel data with grid styling for rendering
 */
export function getGridStyleData(params: Parameters): {
  gridLineWidth: number;
  gridLineColor: string;
} {
  const colorValue = Math.round((params.gridLineLightness / 100) * 255);
  return {
    gridLineWidth: params.gridLineWidth,
    gridLineColor: `rgb(${colorValue}, ${colorValue}, ${colorValue})`,
  };
}

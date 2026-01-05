/**
 * Grid Engine - Generates pixel grid representations of letters
 */

import { Parameters, Point, GridCell, Stroke, LetterSkeleton } from './types';

/**
 * Standard units per em (UPM) for font generation
 */
export const UNITS_PER_EM = 1000;
export const CAP_HEIGHT = 700;
export const BASELINE = 0;

/**
 * Create a grid of cells based on resolution
 */
export function createGrid(resolution: number): GridCell[][] {
  const grid: GridCell[][] = [];

  for (let y = 0; y < resolution; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < resolution; x++) {
      row.push({
        x,
        y,
        filled: false,
      });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Convert normalized point (0-1) to grid coordinates
 */
export function normalizedToGrid(
  point: Point,
  resolution: number
): { x: number; y: number } {
  return {
    x: Math.floor(point.x * resolution),
    y: Math.floor(point.y * resolution),
  };
}

/**
 * Calculate distance from a point to a line segment
 */
function distanceToLineSegment(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance from a point to a curve (simplified)
 */
function distanceToCurve(point: Point, curvePoints: Point[]): number {
  let minDistance = Infinity;

  // Sample the curve at multiple points
  for (let i = 0; i < curvePoints.length - 1; i++) {
    const dist = distanceToLineSegment(point, curvePoints[i], curvePoints[i + 1]);
    minDistance = Math.min(minDistance, dist);
  }

  return minDistance;
}

/**
 * Fill grid cells based on stroke proximity
 */
export function fillGridFromStrokes(
  grid: GridCell[][],
  strokes: Stroke[],
  params: Parameters
): GridCell[][] {
  const resolution = params.gridResolution;
  const strokeWidth = (params.weight / 100) * (resolution / 10); // Base stroke width

  // Clone grid
  const filledGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  // Process each stroke
  for (const stroke of strokes) {
    const adjustedWidth = strokeWidth * stroke.weight;

    // Fill cells near the stroke
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const cellCenter: Point = {
          x: (x + 0.5) / resolution,
          y: (y + 0.5) / resolution,
        };

        let distance: number;

        if (stroke.type === 'curve' || stroke.type === 'blob') {
          distance = distanceToCurve(cellCenter, stroke.points);
        } else {
          // For straight strokes, check each segment
          let minDist = Infinity;
          for (let i = 0; i < stroke.points.length - 1; i++) {
            const dist = distanceToLineSegment(
              cellCenter,
              stroke.points[i],
              stroke.points[i + 1]
            );
            minDist = Math.min(minDist, dist);
          }
          distance = minDist;
        }

        // Convert distance to grid units
        const distanceInGrid = distance * resolution;

        if (distanceInGrid <= adjustedWidth / 2) {
          filledGrid[y][x].filled = true;
        }
      }
    }
  }

  return filledGrid;
}

/**
 * Apply density gradient to grid
 */
export function applyDensityGradient(
  grid: GridCell[][],
  params: Parameters
): GridCell[][] {
  const resolution = params.gridResolution;
  const densityFactor = params.fillDensity / 100;

  const processedGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (!processedGrid[y][x].filled) continue;

      let probability = densityFactor;

      // Apply gradient based on type
      if (params.densityGradient === 'center') {
        const centerX = resolution / 2;
        const centerY = resolution / 2;
        const distFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        probability *= 1 - (distFromCenter / maxDist) * 0.5;
      } else if (params.densityGradient === 'edge') {
        const centerX = resolution / 2;
        const centerY = resolution / 2;
        const distFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        probability *= 0.5 + (distFromCenter / maxDist) * 0.5;
      } else if (params.densityGradient === 'random') {
        // Random is handled by scatter noise
      }

      // Apply scatter noise
      if (params.scatterNoise > 0) {
        const noiseFactor = 1 - params.scatterNoise / 100;
        probability *= noiseFactor + (Math.random() * (1 - noiseFactor));
      }

      // Randomly remove cells based on probability
      if (Math.random() > probability) {
        processedGrid[y][x].filled = false;
      }
    }
  }

  return processedGrid;
}

/**
 * Apply negative space cutouts
 */
export function applyNegativeSpace(
  grid: GridCell[][],
  params: Parameters,
  strokes: Stroke[]
): GridCell[][] {
  if (params.negativeSpaceCount === 0 || params.negativeSpaceSize === 0) {
    return grid;
  }

  const resolution = params.gridResolution;
  const processedGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  // Simple implementation: create circular cutouts at key points
  const cutoutRadius = (params.negativeSpaceSize / 100) * (resolution / 4);

  for (let i = 0; i < params.negativeSpaceCount; i++) {
    // Determine cutout position based on letter structure
    // For now, use simple positions - this will be refined later
    const positions = [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.5, y: 0.5 },
      { x: 0.3, y: 0.7 },
      { x: 0.7, y: 0.7 },
    ];

    if (i >= positions.length) break;

    const cutoutCenter = positions[i];
    const centerX = cutoutCenter.x * resolution;
    const centerY = cutoutCenter.y * resolution;

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const dist = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        if (dist <= cutoutRadius) {
          processedGrid[y][x].filled = false;
        }
      }
    }
  }

  return processedGrid;
}

/**
 * Convert grid cells to SVG path
 */
export function gridToSVGPath(
  grid: GridCell[][],
  params: Parameters
): string {
  const resolution = params.gridResolution;
  const cellSize = CAP_HEIGHT / resolution;
  const cornerRadius = (params.cornerRadius / 100) * (cellSize / 2);
  const squareSize = cellSize * params.squareSize;
  const offset = (cellSize - squareSize) / 2;

  let path = '';

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (!grid[y][x].filled) continue;

      const px = x * cellSize + offset;
      const py = y * cellSize + offset;

      if (cornerRadius > 0) {
        // Rounded rectangle
        const r = Math.min(cornerRadius, squareSize / 2);
        path += `M ${px + r} ${py} `;
        path += `L ${px + squareSize - r} ${py} `;
        path += `Q ${px + squareSize} ${py} ${px + squareSize} ${py + r} `;
        path += `L ${px + squareSize} ${py + squareSize - r} `;
        path += `Q ${px + squareSize} ${py + squareSize} ${px + squareSize - r} ${py + squareSize} `;
        path += `L ${px + r} ${py + squareSize} `;
        path += `Q ${px} ${py + squareSize} ${px} ${py + squareSize - r} `;
        path += `L ${px} ${py + r} `;
        path += `Q ${px} ${py} ${px + r} ${py} Z `;
      } else {
        // Sharp rectangle
        path += `M ${px} ${py} `;
        path += `L ${px + squareSize} ${py} `;
        path += `L ${px + squareSize} ${py + squareSize} `;
        path += `L ${px} ${py + squareSize} Z `;
      }
    }
  }

  return path;
}

/**
 * Generate glyph from letter skeleton
 */
export function generateGlyph(
  skeleton: LetterSkeleton,
  params: Parameters
): { svgPath: string; advanceWidth: number } {
  // Create grid
  const grid = createGrid(params.gridResolution);

  // Fill grid from strokes
  const filledGrid = fillGridFromStrokes(grid, skeleton.strokes, params);

  // Apply density effects
  const densityGrid = applyDensityGradient(filledGrid, params);

  // Apply negative space
  const finalGrid = applyNegativeSpace(densityGrid, params, skeleton.strokes);

  // Convert to SVG path
  const svgPath = gridToSVGPath(finalGrid, params);

  // Calculate advance width
  const baseWidth = UNITS_PER_EM * skeleton.width;
  const widthAdjustment = params.width / 100;
  const advanceWidth = baseWidth * widthAdjustment + params.tracking;

  return {
    svgPath,
    advanceWidth: params.monospace ? UNITS_PER_EM : advanceWidth,
  };
}

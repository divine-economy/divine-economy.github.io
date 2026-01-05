/**
 * Organic Engine - Transforms letter skeletons with organic flow
 */

import { Parameters, Point, Stroke, LetterSkeleton } from './types';

/**
 * Apply organic flow transformation to strokes
 * This creates smooth, blob-like curves from the base skeleton
 */
export function applyOrganicFlow(
  skeleton: LetterSkeleton,
  params: Parameters
): Stroke[] {
  const smoothness = params.blobSmoothness / 100;
  const flowStrength = params.flowStrength / 100;

  return skeleton.strokes.map((stroke) => {
    if (smoothness === 0) {
      return stroke; // No transformation
    }

    // Transform based on stroke type
    if (stroke.type === 'curve' || stroke.type === 'blob') {
      return smoothCurve(stroke, params);
    } else {
      // Convert straight strokes to curves
      return straightToOrganic(stroke, params);
    }
  });
}

/**
 * Smooth a curve stroke
 */
function smoothCurve(stroke: Stroke, params: Parameters): Stroke {
  const tension = params.curveTension;
  const points = stroke.points;

  if (points.length < 3) {
    return stroke;
  }

  // Apply Catmull-Rom spline smoothing
  const smoothedPoints: Point[] = [];
  const segments = 8; // Points per segment

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let t = 0; t < segments; t++) {
      const tt = t / segments;
      const point = catmullRom(p0, p1, p2, p3, tt, tension);
      smoothedPoints.push(point);
    }
  }

  // Add last point
  smoothedPoints.push(points[points.length - 1]);

  return {
    ...stroke,
    points: smoothedPoints,
  };
}

/**
 * Convert straight stroke to organic curve
 */
function straightToOrganic(stroke: Stroke, params: Parameters): Stroke {
  const flowStrength = params.flowStrength / 100;
  const branchThickness = params.branchThickness;

  if (stroke.points.length < 2) {
    return stroke;
  }

  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];

  // Create control points for organic curve
  const controlPoints: Point[] = [start];

  // Add undulation based on flow strength
  const numWaves = Math.max(1, Math.floor(flowStrength * 3));
  for (let i = 1; i < numWaves + 1; i++) {
    const t = i / (numWaves + 1);
    const basePoint = interpolatePoint(start, end, t);

    // Perpendicular offset for wave effect
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / length;
    const perpY = dx / length;

    const amplitude = flowStrength * 0.1 * Math.sin(i * Math.PI);
    const wavePoint: Point = {
      x: basePoint.x + perpX * amplitude,
      y: basePoint.y + perpY * amplitude,
    };

    controlPoints.push(wavePoint);
  }

  controlPoints.push(end);

  return {
    ...stroke,
    type: 'curve',
    points: controlPoints,
    weight: stroke.weight * branchThickness,
  };
}

/**
 * Catmull-Rom spline interpolation
 */
function catmullRom(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number
): Point {
  const t2 = t * t;
  const t3 = t2 * t;

  const v0x = (p2.x - p0.x) * tension;
  const v0y = (p2.y - p0.y) * tension;
  const v1x = (p3.x - p1.x) * tension;
  const v1y = (p3.y - p1.y) * tension;

  return {
    x:
      (2 * p1.x - 2 * p2.x + v0x + v1x) * t3 +
      (-3 * p1.x + 3 * p2.x - 2 * v0x - v1x) * t2 +
      v0x * t +
      p1.x,
    y:
      (2 * p1.y - 2 * p2.y + v0y + v1y) * t3 +
      (-3 * p1.y + 3 * p2.y - 2 * v0y - v1y) * t2 +
      v0y * t +
      p1.y,
  };
}

/**
 * Linear interpolation between two points
 */
function interpolatePoint(start: Point, end: Point, t: number): Point {
  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t,
  };
}

/**
 * Apply symmetry to letter skeleton
 */
export function applySymmetry(
  skeleton: LetterSkeleton,
  params: Parameters
): LetterSkeleton {
  const symmetryStrength = params.symmetryStrength / 100;

  if (symmetryStrength === 0) {
    return skeleton;
  }

  // Mirror strokes across vertical center line
  const mirroredStrokes = skeleton.strokes.map((stroke) => {
    const mirroredPoints = stroke.points.map((point) => ({
      x: 1 - point.x, // Mirror across x = 0.5
      y: point.y,
    }));

    return {
      ...stroke,
      points: mirroredPoints,
    };
  });

  // Blend original and mirrored based on symmetry strength
  const blendedStrokes = skeleton.strokes.map((stroke, i) => {
    const mirrored = mirroredStrokes[i];
    const blendedPoints = stroke.points.map((point, j) => {
      const mPoint = mirrored.points[j];
      return {
        x: point.x * (1 - symmetryStrength) + mPoint.x * symmetryStrength,
        y: point.y * (1 - symmetryStrength) + mPoint.y * symmetryStrength,
      };
    });

    return {
      ...stroke,
      points: blendedPoints,
    };
  });

  return {
    ...skeleton,
    strokes: blendedStrokes,
  };
}

/**
 * Transform skeleton with all organic parameters
 */
export function transformSkeleton(
  skeleton: LetterSkeleton,
  params: Parameters
): LetterSkeleton {
  // Apply symmetry first
  let transformed = applySymmetry(skeleton, params);

  // Apply organic flow to strokes
  const organicStrokes = applyOrganicFlow(transformed, params);

  return {
    ...transformed,
    strokes: organicStrokes,
  };
}

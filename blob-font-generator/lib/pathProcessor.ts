// Path processing for blob font generation
// Modifies actual SVG path data by manipulating coordinates

export interface PathTransformParams {
  thickness: number; // 30-100
  smoothness: number; // 0-100
  curvature: number; // 0-100
}

interface Point {
  x: number;
  y: number;
}

/**
 * Parse SVG path into commands and coordinates
 */
function parsePath(pathString: string): { cmd: string; coords: number[] }[] {
  const commands: { cmd: string; coords: number[] }[] = [];
  const regex = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi;
  let match;

  while ((match = regex.exec(pathString)) !== null) {
    const cmd = match[1];
    const coordsStr = match[2].trim();
    const coords = coordsStr
      .split(/[\s,]+/)
      .filter(s => s.length > 0)
      .map(parseFloat);

    commands.push({ cmd, coords });
  }

  return commands;
}

/**
 * Convert path commands back to SVG path string
 */
function pathToString(commands: { cmd: string; coords: number[] }[]): string {
  return commands
    .map(({ cmd, coords }) => {
      if (coords.length === 0) return cmd;
      return `${cmd} ${coords.join(' ')}`;
    })
    .join('\n           ');
}

/**
 * Apply thickness by scaling path from center point (50, 50)
 */
function applyThickness(pathString: string, thickness: number): string {
  // Normalize thickness: 30 -> 1.0, 100 -> 1.5
  const scale = 1.0 + ((thickness - 30) / 70) * 0.5;

  if (scale === 1.0) return pathString;

  const commands = parsePath(pathString);
  const center = { x: 50, y: 50 };

  const scaled = commands.map(({ cmd, coords }) => {
    const newCoords = coords.map((val, i) => {
      const isX = i % 2 === 0;
      const centerVal = isX ? center.x : center.y;

      // Scale coordinate from center point
      return centerVal + (val - centerVal) * scale;
    });

    return { cmd, coords: newCoords };
  });

  return pathToString(scaled);
}

/**
 * Apply curvature by adjusting bezier control points
 * Makes curves smoother and rounder
 */
function applyCurvature(pathString: string, curvature: number): string {
  if (curvature === 0) return pathString;

  const commands = parsePath(pathString);
  const factor = curvature / 200; // 0-100 becomes 0-0.5

  const smoothed = commands.map(({ cmd, coords }) => {
    // For Q (quadratic bezier) commands, adjust control points
    if (cmd.toUpperCase() === 'Q' && coords.length >= 4) {
      const newCoords = [...coords];

      // Move control point closer to midpoint between start and end
      // This creates smoother, more rounded curves
      const cpX = coords[0];
      const cpY = coords[1];
      const endX = coords[2];
      const endY = coords[3];

      // Assume previous point is the start (simplified)
      // In a full implementation, we'd track the current point
      const midX = endX;
      const midY = endY;

      newCoords[0] = cpX + (midX - cpX) * factor * 0.1;
      newCoords[1] = cpY + (midY - cpY) * factor * 0.1;

      return { cmd, coords: newCoords };
    }

    return { cmd, coords };
  });

  return pathToString(smoothed);
}

/**
 * Main function: Transform a path with all blob parameters
 * Returns modified SVG path string
 */
export function transformPath(
  basePath: string,
  params: PathTransformParams
): string {
  let path = basePath;

  // Apply thickness by scaling from center
  if (params.thickness !== 30) {
    path = applyThickness(path, params.thickness);
  }

  // Apply curvature to smooth bezier curves
  if (params.curvature > 0) {
    path = applyCurvature(path, params.curvature);
  }

  // Note: Smoothness is currently handled by visual blur
  // Could be implemented as path simplification if needed

  return path;
}

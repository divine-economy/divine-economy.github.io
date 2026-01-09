// Path processor for actual coordinate modifications (used in export)
// Transforms SVG path coordinates based on thickness and curvature settings

interface Point {
  x: number;
  y: number;
}

interface PathCommand {
  type: string;
  values: number[];
}

// Parse SVG path string into commands
function parsePath(pathString: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const pathRegex = /([MmLlHhVvCcSsQqTtAaZz])([\s,]*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?[\s,]*)+/g;
  const numberRegex = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;

  let match;
  while ((match = pathRegex.exec(pathString)) !== null) {
    const type = match[0][0];
    const valueString = match[0].slice(1);
    const values: number[] = [];
    let numMatch;

    while ((numMatch = numberRegex.exec(valueString)) !== null) {
      values.push(parseFloat(numMatch[0]));
    }

    commands.push({ type, values });
  }

  return commands;
}

// Convert commands back to path string
function commandsToPath(commands: PathCommand[]): string {
  return commands.map(cmd => {
    if (cmd.type === 'Z' || cmd.type === 'z') {
      return cmd.type;
    }
    return cmd.type + ' ' + cmd.values.join(' ');
  }).join(' ');
}

// Scale a point from center (50, 50)
function scaleFromCenter(point: Point, scale: number, center: Point = { x: 50, y: 50 }): Point {
  return {
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  };
}

// Smooth control points for curvature effect
function smoothControlPoint(
  point: Point,
  prevPoint: Point,
  nextPoint: Point,
  curvature: number
): Point {
  const factor = curvature / 100;

  // Calculate the direction vector
  const dx = nextPoint.x - prevPoint.x;
  const dy = nextPoint.y - prevPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return point;

  // Move control point perpendicular to the line
  const perpX = -dy / distance;
  const perpY = dx / distance;

  // Apply curvature
  const offset = distance * 0.2 * factor;

  return {
    x: point.x + perpX * offset * 0.1,
    y: point.y + perpY * offset * 0.1,
  };
}

// Apply thickness transformation by scaling from center
function applyThickness(commands: PathCommand[], thickness: number): PathCommand[] {
  const scale = thickness / 100;
  const center = { x: 50, y: 50 };

  return commands.map(cmd => {
    const newValues: number[] = [];

    // Process coordinate pairs
    for (let i = 0; i < cmd.values.length; i += 2) {
      if (i + 1 < cmd.values.length) {
        const point = scaleFromCenter(
          { x: cmd.values[i], y: cmd.values[i + 1] },
          scale,
          center
        );
        newValues.push(point.x, point.y);
      } else {
        // Odd number of values (shouldn't happen in valid paths)
        newValues.push(cmd.values[i]);
      }
    }

    return { type: cmd.type, values: newValues };
  });
}

// Apply curvature by adjusting control points
function applyCurvature(commands: PathCommand[], curvature: number): PathCommand[] {
  if (curvature === 0) return commands;

  const points: Point[] = [];

  // Extract all endpoint coordinates
  commands.forEach(cmd => {
    if (cmd.type !== 'Z' && cmd.type !== 'z') {
      for (let i = 0; i < cmd.values.length; i += 2) {
        if (i + 1 < cmd.values.length) {
          points.push({ x: cmd.values[i], y: cmd.values[i + 1] });
        }
      }
    }
  });

  // Apply smoothing to control points
  return commands.map((cmd, index) => {
    if (cmd.type === 'Q' || cmd.type === 'q' || cmd.type === 'C' || cmd.type === 'c') {
      const newValues = [...cmd.values];
      const factor = 1 + (curvature / 100) * 0.15;

      // Adjust control points
      if (cmd.type === 'Q' || cmd.type === 'q') {
        // Quadratic: control point at indices 0,1
        if (newValues.length >= 4) {
          const controlIdx = 0;
          const scale = factor;

          // Scale control point slightly to add more curve
          const cx = newValues[controlIdx];
          const cy = newValues[controlIdx + 1];
          const ex = newValues[2];
          const ey = newValues[3];

          const midX = (cx + ex) / 2;
          const midY = (cy + ey) / 2;

          newValues[controlIdx] = midX + (cx - midX) * scale;
          newValues[controlIdx + 1] = midY + (cy - midY) * scale;
        }
      } else if (cmd.type === 'C' || cmd.type === 'c') {
        // Cubic: control points at indices 0,1 and 2,3
        if (newValues.length >= 6) {
          const scale = factor;

          // First control point
          const c1x = newValues[0];
          const c1y = newValues[1];
          const ex = newValues[4];
          const ey = newValues[5];

          const mid1X = (c1x + ex) / 2;
          const mid1Y = (c1y + ey) / 2;

          newValues[0] = mid1X + (c1x - mid1X) * scale;
          newValues[1] = mid1Y + (c1y - mid1Y) * scale;

          // Second control point
          const c2x = newValues[2];
          const c2y = newValues[3];

          const mid2X = (c2x + ex) / 2;
          const mid2Y = (c2y + ey) / 2;

          newValues[2] = mid2X + (c2x - mid2X) * scale;
          newValues[3] = mid2Y + (c2y - mid2Y) * scale;
        }
      }

      return { type: cmd.type, values: newValues };
    }

    return cmd;
  });
}

// Main function to transform a path based on blob parameters
export function transformPath(
  pathString: string,
  thickness: number,
  curvature: number
): string {
  if (!pathString || pathString.trim() === '') {
    return '';
  }

  let commands = parsePath(pathString);

  // Apply thickness (scaling)
  commands = applyThickness(commands, thickness);

  // Apply curvature (control point adjustment)
  commands = applyCurvature(commands, curvature);

  return commandsToPath(commands);
}

// Transform all letter paths in a font
export function transformAllPaths(
  letterPaths: Record<string, string>,
  thickness: number,
  curvature: number
): Record<string, string> {
  const transformed: Record<string, string> = {};

  for (const [char, path] of Object.entries(letterPaths)) {
    transformed[char] = transformPath(path, thickness, curvature);
  }

  return transformed;
}

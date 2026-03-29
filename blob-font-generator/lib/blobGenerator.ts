// Blob generator - applies thickness and curvature transformations to letter templates

export interface BlobParams {
  thickness: number; // 30-150 (maps to 1.0x - 2.0x scale)
  curvature: number; // 0-100 (controls bezier smoothness)
  smoothness: number; // 0-100 (controls overall smoothness)
}

// Convert thickness slider value (30-150) to scale factor (1.0 - 2.0)
export function getThicknessScale(thickness: number): number {
  // Map 30-150 to 1.0-2.0
  const min = 30;
  const max = 150;
  const normalized = (thickness - min) / (max - min); // 0-1
  return 1.0 + normalized * 1.0; // 1.0-2.0
}

// Scale a point from center (50, 50)
function scalePointFromCenter(x: number, y: number, scale: number): { x: number; y: number } {
  const centerX = 50;
  const centerY = 50;
  const dx = x - centerX;
  const dy = y - centerY;
  return {
    x: centerX + dx * scale,
    y: centerY + dy * scale
  };
}

// Parse SVG path and extract coordinates
interface PathCommand {
  type: string;
  coords: number[];
}

function parsePath(pathStr: string): PathCommand[] {
  if (!pathStr) return [];

  const commands: PathCommand[] = [];
  const regex = /([MLHVCSQTAZ])\s*([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?(?:\s*,?\s*[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)*)?/gi;

  let match;
  while ((match = regex.exec(pathStr)) !== null) {
    const type = match[1];
    const coordStr = match[2];
    const coords = coordStr ? coordStr.trim().split(/[\s,]+/).map(Number) : [];
    commands.push({ type, coords });
  }

  return commands;
}

// Apply thickness scaling to path
function scalePathCoordinates(commands: PathCommand[], scale: number): PathCommand[] {
  return commands.map(cmd => {
    const scaledCoords: number[] = [];

    // Scale x,y pairs
    for (let i = 0; i < cmd.coords.length; i += 2) {
      if (i + 1 < cmd.coords.length) {
        const scaled = scalePointFromCenter(cmd.coords[i], cmd.coords[i + 1], scale);
        scaledCoords.push(scaled.x, scaled.y);
      }
    }

    return { type: cmd.type, coords: scaledCoords };
  });
}

// Rebuild path string from commands
function buildPathString(commands: PathCommand[]): string {
  return commands.map(cmd => {
    if (cmd.coords.length === 0) {
      return cmd.type;
    }
    return `${cmd.type} ${cmd.coords.join(' ')}`;
  }).join(' ');
}

// Apply curvature adjustments (for future bezier curve modifications)
function applyCurvature(pathStr: string, curvature: number): string {
  // For now, return as-is. This can be expanded to modify bezier control points
  // to make curves more or less pronounced based on curvature value
  return pathStr;
}

// Apply smoothness adjustments
function applySmoothness(pathStr: string, smoothness: number): string {
  // For now, return as-is. This can be expanded to add/modify bezier curves
  // to make edges smoother based on smoothness value
  return pathStr;
}

// Main function to generate blob path from template
export function generateBlobPath(templatePath: string, params: BlobParams): string {
  if (!templatePath) return '';

  // Parse the path
  const commands = parsePath(templatePath);

  // Apply thickness scaling
  const scale = getThicknessScale(params.thickness);
  const scaledCommands = scalePathCoordinates(commands, scale);

  // Rebuild path
  let path = buildPathString(scaledCommands);

  // Apply curvature
  path = applyCurvature(path, params.curvature);

  // Apply smoothness
  path = applySmoothness(path, params.smoothness);

  return path;
}

// Apply organic variations for playful effects
export interface OrganicParams {
  rotationVariance: number; // 0-15 degrees
  verticalVariance: number; // 0-30px
}

export function getLetterTransform(index: number, organic: OrganicParams): string {
  if (organic.rotationVariance === 0 && organic.verticalVariance === 0) {
    return '';
  }

  // Use index as seed for consistent randomness
  const seed = index * 12.9898;
  const pseudo = Math.sin(seed) * 43758.5453;
  const random = pseudo - Math.floor(pseudo);

  // Calculate rotation
  const rotation = (random - 0.5) * 2 * organic.rotationVariance;

  // Calculate vertical offset
  const verticalOffset = (random - 0.5) * 2 * organic.verticalVariance;

  return `rotate(${rotation}) translate(0, ${verticalOffset})`;
}

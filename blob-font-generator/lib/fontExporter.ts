// Font export functionality using opentype.js
import opentype from 'opentype.js';
import { letterTemplates } from './letterTemplates';

export interface FontExportParams {
  fontName: string;
  thickness: number;
  smoothness: number;
}

/**
 * Convert SVG path to OpenType.js path
 * OpenType uses a different coordinate system and command structure
 */
function svgPathToGlyphPath(svgPath: string, scale: number = 10): opentype.Path {
  const path = new opentype.Path();

  // Parse SVG path commands
  // This is a simplified parser - for production use a proper SVG path parser
  const commands = svgPath.trim().split(/(?=[MLHVCSQTAZ])/i);

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const coords = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter((s) => s)
      .map(parseFloat);

    // OpenType.js uses inverted Y axis, so we need to flip
    const flipY = (y: number) => 100 * scale - y * scale;

    switch (type.toUpperCase()) {
      case 'M': // Move to
        currentX = coords[0] * scale;
        currentY = flipY(coords[1]);
        path.moveTo(currentX, currentY);
        break;

      case 'L': // Line to
        currentX = coords[0] * scale;
        currentY = flipY(coords[1]);
        path.lineTo(currentX, currentY);
        break;

      case 'Q': // Quadratic curve
        path.quadraticCurveTo(
          coords[0] * scale,
          flipY(coords[1]),
          coords[2] * scale,
          flipY(coords[3])
        );
        currentX = coords[2] * scale;
        currentY = flipY(coords[3]);
        break;

      case 'C': // Cubic curve
        path.curveTo(
          coords[0] * scale,
          flipY(coords[1]),
          coords[2] * scale,
          flipY(coords[3]),
          coords[4] * scale,
          flipY(coords[5])
        );
        currentX = coords[4] * scale;
        currentY = flipY(coords[5]);
        break;

      case 'Z': // Close path
        path.close();
        break;
    }
  }

  return path;
}

/**
 * Generate OpenType font from letter templates
 */
export async function generateFont(params: FontExportParams): Promise<ArrayBuffer> {
  const { fontName, thickness } = params;

  // Create glyphs for each letter
  const glyphs: opentype.Glyph[] = [];

  // Add .notdef glyph (required)
  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: 650,
    path: new opentype.Path(),
  });
  glyphs.push(notdefGlyph);

  // Calculate scale based on thickness
  const scale = 7 + (thickness / 100) * 3; // 7-10 scale

  // Add letter glyphs
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (const char of chars) {
    const template = letterTemplates[char];
    if (!template) continue;

    const glyphPath = svgPathToGlyphPath(template.path, scale);

    const glyph = new opentype.Glyph({
      name: char,
      unicode: char.charCodeAt(0),
      advanceWidth: template.width * scale,
      path: glyphPath,
    });

    glyphs.push(glyph);
  }

  // Create font
  const font = new opentype.Font({
    familyName: fontName,
    styleName: 'Regular',
    unitsPerEm: 1000,
    ascender: 800,
    descender: -200,
    glyphs: glyphs,
  });

  // Convert to ArrayBuffer
  return font.toArrayBuffer();
}

/**
 * Download font file
 */
export function downloadFont(arrayBuffer: ArrayBuffer, filename: string): void {
  const blob = new Blob([arrayBuffer], { type: 'font/otf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

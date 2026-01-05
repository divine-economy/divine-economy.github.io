/**
 * Font Builder - Exports fonts using opentype.js
 */

import opentype from 'opentype.js';
import { GlyphData, FontMetadata, GeneratedFont, Parameters } from './types';
import { UNITS_PER_EM, CAP_HEIGHT } from './gridEngine';

/**
 * Convert SVG path string to opentype.js path
 */
function svgPathToOpentypePath(svgPath: string): opentype.Path {
  const path = new opentype.Path();

  if (!svgPath) {
    return path;
  }

  // Parse SVG path commands
  const commands = svgPath.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

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

    switch (type) {
      case 'M': // Move to
        currentX = coords[0];
        currentY = coords[1];
        path.moveTo(currentX, currentY);
        break;

      case 'L': // Line to
        currentX = coords[0];
        currentY = coords[1];
        path.lineTo(currentX, currentY);
        break;

      case 'Q': // Quadratic curve
        path.quadraticCurveTo(coords[0], coords[1], coords[2], coords[3]);
        currentX = coords[2];
        currentY = coords[3];
        break;

      case 'C': // Cubic curve
        path.curveTo(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);
        currentX = coords[4];
        currentY = coords[5];
        break;

      case 'Z': // Close path
      case 'z':
        path.close();
        break;

      default:
        console.warn(`Unsupported path command: ${type}`);
    }
  }

  return path;
}

/**
 * Build font from generated glyphs
 */
export function buildFont(
  glyphs: GlyphData[],
  metadata: FontMetadata,
  params: Parameters
): opentype.Font {
  // Create notdef glyph (required)
  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: UNITS_PER_EM * 0.5,
    path: new opentype.Path(),
  });

  // Convert our glyphs to opentype glyphs
  const opentypeGlyphs = [notdefGlyph];

  for (const glyph of glyphs) {
    const path = svgPathToOpentypePath(glyph.svgPath);

    const opentypeGlyph = new opentype.Glyph({
      name: glyph.character,
      unicode: glyph.unicode,
      advanceWidth: glyph.advanceWidth,
      path: path,
    });

    opentypeGlyphs.push(opentypeGlyph);
  }

  // Create font
  const font = new opentype.Font({
    familyName: metadata.familyName,
    styleName: metadata.styleName,
    unitsPerEm: UNITS_PER_EM,
    ascender: CAP_HEIGHT,
    descender: -300,
    designer: metadata.designer || 'Unknown',
    designerURL: '',
    manufacturer: 'Pixel Blob Typography Tool',
    manufacturerURL: '',
    license: metadata.copyright || '',
    licenseURL: '',
    version: metadata.version,
    description: metadata.description || '',
    glyphs: opentypeGlyphs,
  });

  return font;
}

/**
 * Export font as TTF
 */
export function exportTTF(font: opentype.Font, filename: string): void {
  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Export font as OTF
 */
export function exportOTF(font: opentype.Font, filename: string): void {
  // OpenType.js generates OTF format by default
  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'font/otf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Complete export pipeline
 */
export async function exportFont(
  generatedFont: GeneratedFont,
  format: 'ttf' | 'otf' = 'ttf'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Build font
      const font = buildFont(
        generatedFont.glyphs,
        generatedFont.metadata,
        generatedFont.parameters
      );

      // Generate filename
      const baseName = generatedFont.metadata.familyName
        .replace(/\s+/g, '-')
        .toLowerCase();
      const filename = `${baseName}.${format}`;

      // Export
      if (format === 'ttf') {
        exportTTF(font, filename);
      } else {
        exportOTF(font, filename);
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

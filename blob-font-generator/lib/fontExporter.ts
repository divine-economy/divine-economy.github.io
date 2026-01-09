// Font exporter using opentype.js
// Exports the transformed letter paths as an OTF font file

import opentype from 'opentype.js';
import { letterTemplates } from './letterTemplates';
import { transformPath } from './pathProcessor';
import { BlobParams } from './displayParams';

// Convert SVG path to opentype.js path
function svgPathToGlyphPath(svgPath: string): opentype.Path {
  const path = new opentype.Path();

  if (!svgPath || svgPath.trim() === '') {
    return path;
  }

  // Parse SVG path commands
  const commands = svgPath.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);

  if (!commands) {
    return path;
  }

  let currentX = 0;
  let currentY = 0;

  commands.forEach(command => {
    const type = command[0];
    const values = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter(v => v.length > 0)
      .map(parseFloat);

    switch (type) {
      case 'M':
        if (values.length >= 2) {
          currentX = values[0];
          currentY = values[1];
          path.moveTo(currentX, currentY);
        }
        break;

      case 'm':
        if (values.length >= 2) {
          currentX += values[0];
          currentY += values[1];
          path.moveTo(currentX, currentY);
        }
        break;

      case 'L':
        if (values.length >= 2) {
          currentX = values[0];
          currentY = values[1];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'l':
        if (values.length >= 2) {
          currentX += values[0];
          currentY += values[1];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'H':
        if (values.length >= 1) {
          currentX = values[0];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'h':
        if (values.length >= 1) {
          currentX += values[0];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'V':
        if (values.length >= 1) {
          currentY = values[0];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'v':
        if (values.length >= 1) {
          currentY += values[0];
          path.lineTo(currentX, currentY);
        }
        break;

      case 'C':
        if (values.length >= 6) {
          path.curveTo(
            values[0], values[1],
            values[2], values[3],
            values[4], values[5]
          );
          currentX = values[4];
          currentY = values[5];
        }
        break;

      case 'c':
        if (values.length >= 6) {
          path.curveTo(
            currentX + values[0], currentY + values[1],
            currentX + values[2], currentY + values[3],
            currentX + values[4], currentY + values[5]
          );
          currentX += values[4];
          currentY += values[5];
        }
        break;

      case 'Q':
        if (values.length >= 4) {
          path.quadTo(
            values[0], values[1],
            values[2], values[3]
          );
          currentX = values[2];
          currentY = values[3];
        }
        break;

      case 'q':
        if (values.length >= 4) {
          path.quadTo(
            currentX + values[0], currentY + values[1],
            currentX + values[2], currentY + values[3]
          );
          currentX += values[2];
          currentY += values[3];
        }
        break;

      case 'Z':
      case 'z':
        path.close();
        break;
    }
  });

  return path;
}

// Create a glyph from letter template
function createGlyph(
  char: string,
  transformedPath: string,
  advanceWidth: number
): opentype.Glyph {
  const glyphPath = svgPathToGlyphPath(transformedPath);

  // Create glyph with unicode value
  const unicode = char.charCodeAt(0);

  const glyph = new opentype.Glyph({
    name: char === ' ' ? 'space' : char,
    unicode: unicode,
    advanceWidth: advanceWidth,
    path: glyphPath,
  });

  return glyph;
}

// Export font with blob parameters applied
export async function exportBlobFont(
  params: BlobParams,
  fontName: string = 'BlobFont'
): Promise<Blob> {
  const glyphs: opentype.Glyph[] = [];

  // Create notdef glyph (required)
  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: 650,
    path: new opentype.Path(),
  });
  glyphs.push(notdefGlyph);

  // Process all letters
  const chars = Object.keys(letterTemplates);

  for (const char of chars) {
    const template = letterTemplates[char];
    const originalPath = template.path;

    // Apply transformations using pathProcessor
    const transformedPath = transformPath(
      originalPath,
      params.thickness,
      params.curvature
    );

    // Calculate advance width
    const advanceWidth = (template.width || 100) * 10; // Scale to font units

    // Create glyph
    const glyph = createGlyph(char, transformedPath, advanceWidth);
    glyphs.push(glyph);
  }

  // Create font
  const font = new opentype.Font({
    familyName: fontName,
    styleName: 'Regular',
    unitsPerEm: 1000,
    ascender: 950,
    descender: -50,
    glyphs: glyphs,
  });

  // Convert to ArrayBuffer
  const arrayBuffer = font.toArrayBuffer();

  // Create Blob
  const blob = new Blob([arrayBuffer], { type: 'font/otf' });

  return blob;
}

// Download font file
export function downloadFont(blob: Blob, filename: string = 'BlobFont.otf'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Main export function
export async function exportAndDownloadFont(
  params: BlobParams,
  fontName: string = 'BlobFont',
  filename: string = 'BlobFont.otf'
): Promise<void> {
  try {
    const blob = await exportBlobFont(params, fontName);
    downloadFont(blob, filename);
  } catch (error) {
    console.error('Error exporting font:', error);
    throw error;
  }
}

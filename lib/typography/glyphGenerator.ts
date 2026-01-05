/**
 * Main Glyph Generator
 * Combines all engines to generate complete glyphs
 */

import { Parameters, GlyphData } from './types';
import { getLetterSkeleton } from './glyphTemplates';
import { transformSkeleton } from './organicEngine';
import { generateGlyph } from './gridEngine';

/**
 * Generate a single glyph for a character
 */
export function generateCharacterGlyph(
  character: string,
  params: Parameters
): GlyphData | null {
  // Get base skeleton
  const skeleton = getLetterSkeleton(character);
  if (!skeleton) {
    return null;
  }

  // Apply organic transformations
  const transformed = transformSkeleton(skeleton, params);

  // Generate grid-based glyph
  const { svgPath, advanceWidth } = generateGlyph(transformed, params);

  return {
    character,
    unicode: character.charCodeAt(0),
    svgPath,
    advanceWidth,
  };
}

/**
 * Generate all uppercase glyphs (A-Z)
 */
export function generateAllGlyphs(
  params: Parameters,
  onProgress?: (progress: number) => void
): GlyphData[] {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const glyphs: GlyphData[] = [];

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const glyph = generateCharacterGlyph(char, params);

    if (glyph) {
      glyphs.push(glyph);
    }

    // Report progress
    if (onProgress) {
      const progress = Math.round(((i + 1) / characters.length) * 100);
      onProgress(progress);
    }
  }

  return glyphs;
}

/**
 * Preview a single letter as SVG
 */
export function previewLetter(
  character: string,
  params: Parameters,
  size: number = 200
): string {
  const glyph = generateCharacterGlyph(character, params);

  if (!glyph) {
    return '';
  }

  const viewBoxSize = 1000; // Match UNITS_PER_EM

  return `
    <svg
      width="${size}"
      height="${size}"
      viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="${glyph.svgPath}"
        fill="currentColor"
        transform="translate(${(viewBoxSize - glyph.advanceWidth) / 2}, ${
    (viewBoxSize - 700) / 2
  })"
      />
    </svg>
  `;
}

/**
 * Preview text as SVG
 */
export function previewText(
  text: string,
  params: Parameters,
  fontSize: number = 72
): string {
  const glyphs: GlyphData[] = [];
  let totalWidth = 0;

  // Generate glyphs for each character
  for (const char of text) {
    const glyph = generateCharacterGlyph(char.toUpperCase(), params);
    if (glyph) {
      glyphs.push(glyph);
      totalWidth += glyph.advanceWidth;
    }
  }

  if (glyphs.length === 0) {
    return '';
  }

  const scale = fontSize / 700; // Scale based on cap height
  const width = totalWidth * scale;
  const height = 1000 * scale;

  let paths = '';
  let xOffset = 0;

  for (const glyph of glyphs) {
    paths += `
      <path
        d="${glyph.svgPath}"
        fill="currentColor"
        transform="translate(${xOffset}, 0) scale(${scale})"
      />
    `;
    xOffset += glyph.advanceWidth * scale;
  }

  return `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${paths}
    </svg>
  `;
}

/**
 * Main Glyph Generator
 * Combines all engines to generate complete glyphs
 */

import { Parameters, GlyphData } from './types';
import { getLetterSkeleton } from './glyphTemplates';
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

  // Generate glyph directly from skeleton (deterministic)
  const { svgPath, gridPath, advanceWidth } = generateGlyph(skeleton, params);

  return {
    character,
    unicode: character.charCodeAt(0),
    svgPath,
    gridPath,
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
  const translate = `translate(${(viewBoxSize - glyph.advanceWidth) / 2}, ${(viewBoxSize - 700) / 2})`;

  // Calculate grid line color
  const colorValue = Math.round((params.gridLineLightness / 100) * 255);
  const gridColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  // Generate unique ID for clip path
  const clipId = `clip-${character}-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <svg
      width="${size}"
      height="${size}"
      viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="${clipId}">
          <path d="${glyph.svgPath}" transform="${translate}" />
        </clipPath>
      </defs>
      <path
        d="${glyph.svgPath}"
        fill="currentColor"
        transform="${translate}"
      />
      <path
        d="${glyph.gridPath}"
        fill="none"
        stroke="${gridColor}"
        stroke-width="${params.gridLineWidth}"
        transform="${translate}"
        clip-path="url(#${clipId})"
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

  // Calculate grid line color
  const colorValue = Math.round((params.gridLineLightness / 100) * 255);
  const gridColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  let clipPaths = '';
  let blobPaths = '';
  let gridPaths = '';
  let xOffset = 0;

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const transform = `translate(${xOffset}, 0) scale(${scale})`;
    const clipId = `clip-text-${i}-${Math.random().toString(36).substr(2, 9)}`;

    clipPaths += `
      <clipPath id="${clipId}">
        <path d="${glyph.svgPath}" transform="${transform}" />
      </clipPath>
    `;

    blobPaths += `
      <path
        d="${glyph.svgPath}"
        fill="currentColor"
        transform="${transform}"
      />
    `;

    gridPaths += `
      <path
        d="${glyph.gridPath}"
        fill="none"
        stroke="${gridColor}"
        stroke-width="${params.gridLineWidth}"
        transform="${transform}"
        clip-path="url(#${clipId})"
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
      <defs>
        ${clipPaths}
      </defs>
      ${blobPaths}
      ${gridPaths}
    </svg>
  `;
}

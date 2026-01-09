// Grid overlay system with SVG masking
// Grid follows letter shapes using masks

import { GridParams } from './displayParams';

export interface GridPattern {
  patternId: string;
  patternSVG: string;
}

// Generate SVG pattern for grid lines
export function generateGridPattern(
  patternId: string,
  params: GridParams
): GridPattern {
  const { spacing, lineWidth, color } = params;

  const patternSVG = `
    <pattern id="${patternId}" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="${spacing}" height="${spacing}" fill="none" />
      <line x1="0" y1="0" x2="${spacing}" y2="0" stroke="${color}" stroke-width="${lineWidth}" />
      <line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${color}" stroke-width="${lineWidth}" />
    </pattern>
  `;

  return {
    patternId,
    patternSVG,
  };
}

// Generate mask for clipping grid to letter shape
export function generateLetterMask(
  maskId: string,
  letterPath: string,
  filterId?: string
): string {
  const filterAttr = filterId ? `filter="url(#${filterId})"` : '';

  return `
    <mask id="${maskId}">
      <rect x="0" y="0" width="100" height="100" fill="black" />
      <path d="${letterPath}" fill="white" ${filterAttr} />
    </mask>
  `;
}

// Generate grid overlay element with mask
export function generateGridOverlay(
  patternId: string,
  maskId: string
): string {
  return `
    <rect
      x="0"
      y="0"
      width="100"
      height="100"
      fill="url(#${patternId})"
      mask="url(#${maskId})"
    />
  `;
}

// Complete grid system for a letter
export interface LetterGridConfig {
  patternId: string;
  maskId: string;
  patternSVG: string;
  maskSVG: string;
  overlaySVG: string;
}

export function generateLetterGrid(
  letterChar: string,
  letterPath: string,
  gridParams: GridParams,
  filterId?: string
): LetterGridConfig {
  const patternId = `grid-pattern-${letterChar.charCodeAt(0)}`;
  const maskId = `grid-mask-${letterChar.charCodeAt(0)}`;

  const { patternSVG } = generateGridPattern(patternId, gridParams);
  const maskSVG = generateLetterMask(maskId, letterPath, filterId);
  const overlaySVG = generateGridOverlay(patternId, maskId);

  return {
    patternId,
    maskId,
    patternSVG,
    maskSVG,
    overlaySVG,
  };
}

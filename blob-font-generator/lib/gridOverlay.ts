// Grid overlay system for blob font generator

export interface GridParams {
  spacing: number; // 5-40
  lineWidth: number; // 0.5-5
  lightness: number; // 0-100 (0 = black, 100 = white)
}

/**
 * Get the grid color based on lightness parameter
 */
export function getGridColor(lightness: number): string {
  const value = Math.round((lightness / 100) * 255);
  return `rgb(${value}, ${value}, ${value})`;
}

/**
 * Generate SVG pattern for grid overlay
 */
export function generateGridPattern(
  id: string,
  params: GridParams
): string {
  const { spacing, lineWidth } = params;
  const color = getGridColor(params.lightness);

  return `
    <pattern id="${id}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <!-- Vertical line -->
      <line
        x1="${spacing / 2}"
        y1="0"
        x2="${spacing / 2}"
        y2="${spacing}"
        stroke="${color}"
        stroke-width="${lineWidth}"
      />
      <!-- Horizontal line -->
      <line
        x1="0"
        y1="${spacing / 2}"
        x2="${spacing}"
        y2="${spacing / 2}"
        stroke="${color}"
        stroke-width="${lineWidth}"
      />
    </pattern>
  `;
}

/**
 * Generate SVG filter definitions for smoothness effect
 */
export function generateSmoothingFilter(
  id: string,
  blur: number
): string {
  if (blur === 0) return '';

  return `
    <filter id="${id}">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" />
    </filter>
  `;
}

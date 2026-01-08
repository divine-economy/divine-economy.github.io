// Grid overlay system for blob font generator

export interface GridParams {
  spacing: number; // 5-40
  lineWidth: number; // 0.5-5
  gridColor: string; // hex color
}

/**
 * Generate SVG pattern for grid overlay
 */
export function generateGridPattern(
  id: string,
  params: GridParams
): string {
  const { spacing, lineWidth, gridColor } = params;

  return `
    <pattern id="${id}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <!-- Vertical line -->
      <line
        x1="${spacing / 2}"
        y1="0"
        x2="${spacing / 2}"
        y2="${spacing}"
        stroke="${gridColor}"
        stroke-width="${lineWidth}"
      />
      <!-- Horizontal line -->
      <line
        x1="0"
        y1="${spacing / 2}"
        x2="${spacing}"
        y2="${spacing / 2}"
        stroke="${gridColor}"
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

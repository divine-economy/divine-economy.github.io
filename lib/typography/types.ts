/**
 * Pixel Blob Typography Tool - Type Definitions
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type StrokeType = 'diagonal' | 'vertical' | 'horizontal' | 'curve' | 'blob';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  type: StrokeType;
  points: Point[];
  weight: number; // Relative thickness (1.0 = normal)
}

export interface LetterSkeleton {
  strokes: Stroke[];
  width: number; // Relative width (1.0 = normal)
}

export interface GridCell {
  x: number;
  y: number;
  filled: boolean;
}

// ============================================================================
// PARAMETERS
// ============================================================================

export interface Parameters {
  // Blob Shape
  blobThickness: number;       // 30-150 - Thickness of organic strokes
  blobSmoothness: number;      // 0-100 - How smooth/curvy the blobs are

  // Grid Overlay
  gridSpacing: number;         // 5-40 - Spacing between grid lines
  gridLineWidth: number;       // 0.5-5 - Thickness of grid lines
  gridLineLightness: number;   // 0-100 - Grid line color (0=black, 100=white)

  // Typography Metrics
  width: number;               // 60-140 - Letter width
  tracking: number;            // -100-300 - Letter spacing
  monospace: boolean;          // Fixed width letters
}

export const DEFAULT_PARAMETERS: Parameters = {
  // Blob Shape
  blobThickness: 100,
  blobSmoothness: 70,

  // Grid Overlay
  gridSpacing: 15,
  gridLineWidth: 2,
  gridLineLightness: 30,

  // Typography Metrics
  width: 100,
  tracking: 0,
  monospace: false,
};

// ============================================================================
// PRESETS
// ============================================================================

export interface Preset {
  name: string;
  description: string;
  parameters: Parameters;
}

export const PRESETS: Preset[] = [
  {
    name: 'Default',
    description: 'Balanced organic blobs with visible grid',
    parameters: {
      ...DEFAULT_PARAMETERS,
    },
  },
  {
    name: 'Fine Grid',
    description: 'Small grid spacing with subtle lines',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridSpacing: 8,
      gridLineWidth: 1,
      gridLineLightness: 40,
      blobThickness: 90,
      blobSmoothness: 85,
    },
  },
  {
    name: 'Chunky',
    description: 'Wide grid spacing with bold lines',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridSpacing: 25,
      gridLineWidth: 3,
      gridLineLightness: 20,
      blobThickness: 130,
      blobSmoothness: 50,
    },
  },
  {
    name: 'Smooth Flow',
    description: 'Very curvy blobs with fine mesh',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridSpacing: 10,
      gridLineWidth: 1.5,
      gridLineLightness: 35,
      blobThickness: 85,
      blobSmoothness: 95,
    },
  },
  {
    name: 'High Contrast',
    description: 'Thick blobs with prominent grid',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridSpacing: 18,
      gridLineWidth: 4,
      gridLineLightness: 15,
      blobThickness: 140,
      blobSmoothness: 60,
    },
  },
];

// ============================================================================
// FONT METADATA
// ============================================================================

export interface FontMetadata {
  familyName: string;
  styleName: string;
  designer: string;
  description: string;
  version: string;
  copyright: string;
}

export const DEFAULT_FONT_METADATA: FontMetadata = {
  familyName: 'Pixel Blob',
  styleName: 'Regular',
  designer: '',
  description: 'Generated with Pixel Blob Typography Tool',
  version: '1.0',
  copyright: '',
};

// ============================================================================
// GLYPH DATA
// ============================================================================

export interface GlyphData {
  character: string;
  unicode: number;
  svgPath: string;
  gridPath: string;
  advanceWidth: number;
}

export interface GeneratedFont {
  metadata: FontMetadata;
  glyphs: GlyphData[];
  parameters: Parameters;
}

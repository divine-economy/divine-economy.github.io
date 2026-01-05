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

export type DensityGradient = 'none' | 'center' | 'edge' | 'random';
export type OrganicTemplate = 'blob' | 'branch' | 'hybrid';

export interface Parameters {
  // Grid Structure
  gridResolution: number;      // 10-32
  squareSize: number;          // 0.6-1.0
  cornerRadius: number;        // 0-50

  // Organic Flow
  blobSmoothness: number;      // 0-100
  flowStrength: number;        // 0-100
  curveTension: number;        // 0.2-1.0
  branchThickness: number;     // 0.5-2.5

  // Form & Structure
  organicTemplate: OrganicTemplate;
  negativeSpaceSize: number;   // 0-50
  negativeSpaceCount: number;  // 0-5
  symmetryStrength: number;    // 0-100

  // Density & Distribution
  fillDensity: number;         // 50-100
  densityGradient: DensityGradient;
  scatterNoise: number;        // 0-40

  // Typography Metrics
  width: number;               // 60-140
  weight: number;              // 50-200
  tracking: number;            // -100-300
  monospace: boolean;

  // Advanced Tweaks
  overshoot: number;           // 0-5
  junctionMerge: number;       // 0-100
  outerGlow: number;           // 0-3
}

export const DEFAULT_PARAMETERS: Parameters = {
  // Grid Structure
  gridResolution: 20,
  squareSize: 0.9,
  cornerRadius: 15,

  // Organic Flow
  blobSmoothness: 65,
  flowStrength: 70,
  curveTension: 0.6,
  branchThickness: 1.2,

  // Form & Structure
  organicTemplate: 'blob',
  negativeSpaceSize: 25,
  negativeSpaceCount: 2,
  symmetryStrength: 40,

  // Density & Distribution
  fillDensity: 85,
  densityGradient: 'center',
  scatterNoise: 10,

  // Typography Metrics
  width: 100,
  weight: 100,
  tracking: 0,
  monospace: false,

  // Advanced Tweaks
  overshoot: 2,
  junctionMerge: 60,
  outerGlow: 0,
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
    name: 'Dense Organic',
    description: 'Tight grid with strong organic flow',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridResolution: 24,
      squareSize: 0.95,
      cornerRadius: 20,
      blobSmoothness: 80,
      flowStrength: 85,
      fillDensity: 95,
      negativeSpaceSize: 15,
    },
  },
  {
    name: 'Sparse Retro',
    description: 'Low-res pixelated with minimal smoothing',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridResolution: 12,
      squareSize: 0.85,
      cornerRadius: 5,
      blobSmoothness: 30,
      flowStrength: 40,
      fillDensity: 70,
      scatterNoise: 20,
      negativeSpaceSize: 35,
    },
  },
  {
    name: 'Heavy Flow',
    description: 'Maximum organic curves with thick branches',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridResolution: 20,
      squareSize: 0.92,
      cornerRadius: 25,
      blobSmoothness: 90,
      flowStrength: 95,
      curveTension: 0.8,
      branchThickness: 2.0,
      fillDensity: 88,
      negativeSpaceSize: 20,
      negativeSpaceCount: 3,
    },
  },
  {
    name: 'Geometric Blob',
    description: 'Balanced organic shapes with clear structure',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridResolution: 18,
      squareSize: 0.88,
      cornerRadius: 12,
      blobSmoothness: 60,
      flowStrength: 65,
      fillDensity: 82,
      symmetryStrength: 60,
      negativeSpaceSize: 28,
    },
  },
  {
    name: 'Scattered Pixels',
    description: 'High noise with organic undertones',
    parameters: {
      ...DEFAULT_PARAMETERS,
      gridResolution: 16,
      squareSize: 0.75,
      cornerRadius: 8,
      blobSmoothness: 45,
      flowStrength: 50,
      fillDensity: 65,
      densityGradient: 'random',
      scatterNoise: 35,
      negativeSpaceSize: 40,
      negativeSpaceCount: 1,
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
  advanceWidth: number;
}

export interface GeneratedFont {
  metadata: FontMetadata;
  glyphs: GlyphData[];
  parameters: Parameters;
}

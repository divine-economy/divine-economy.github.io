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

export type FillStyle = 'solid' | 'outline-only' | 'hollow';
export type OrganicTemplate = 'blob' | 'branch' | 'hybrid';

export interface Parameters {
  // Edge Pixels
  edgePixelSize: number;       // 10-80 - Size of pixels on the outline
  edgePixelSpacing: number;    // 20-150 - Space between edge pixels
  cornerRadius: number;        // 0-50 - Roundness of edge pixels

  // Blob Shape
  blobThickness: number;       // 50-200 - Thickness of organic strokes
  blobSmoothness: number;      // 0-100 - How smooth/curvy the blobs are
  curveTension: number;        // 0.2-1.0 - Tightness of curves

  // Form & Structure
  organicTemplate: OrganicTemplate;
  fillStyle: FillStyle;        // solid, outline-only, or hollow
  symmetryStrength: number;    // 0-100

  // Typography Metrics
  width: number;               // 60-140
  tracking: number;            // -100-300
  monospace: boolean;

  // Advanced Tweaks
  flowStrength: number;        // 0-100 - Organic undulation
  branchThickness: number;     // 0.5-2.5 - Width at junctions
}

export const DEFAULT_PARAMETERS: Parameters = {
  // Edge Pixels
  edgePixelSize: 30,
  edgePixelSpacing: 50,
  cornerRadius: 20,

  // Blob Shape
  blobThickness: 120,
  blobSmoothness: 70,
  curveTension: 0.6,

  // Form & Structure
  organicTemplate: 'blob',
  fillStyle: 'solid',
  symmetryStrength: 30,

  // Typography Metrics
  width: 100,
  tracking: 0,
  monospace: false,

  // Advanced Tweaks
  flowStrength: 60,
  branchThickness: 1.2,
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
    name: 'Smooth Blob',
    description: 'Organic shapes with tiny edge pixels',
    parameters: {
      ...DEFAULT_PARAMETERS,
      edgePixelSize: 20,
      edgePixelSpacing: 40,
      cornerRadius: 30,
      blobThickness: 150,
      blobSmoothness: 90,
      flowStrength: 80,
    },
  },
  {
    name: 'Chunky Retro',
    description: 'Large pixels with bold blobs',
    parameters: {
      ...DEFAULT_PARAMETERS,
      edgePixelSize: 60,
      edgePixelSpacing: 80,
      cornerRadius: 10,
      blobThickness: 180,
      blobSmoothness: 50,
      flowStrength: 40,
    },
  },
  {
    name: 'Delicate Flow',
    description: 'Thin strokes with small detailed pixels',
    parameters: {
      ...DEFAULT_PARAMETERS,
      edgePixelSize: 15,
      edgePixelSpacing: 30,
      cornerRadius: 25,
      blobThickness: 80,
      blobSmoothness: 95,
      curveTension: 0.8,
      flowStrength: 90,
      branchThickness: 0.8,
    },
  },
  {
    name: 'Geometric Balance',
    description: 'Medium pixels with structured blobs',
    parameters: {
      ...DEFAULT_PARAMETERS,
      edgePixelSize: 35,
      edgePixelSpacing: 60,
      cornerRadius: 15,
      blobThickness: 120,
      blobSmoothness: 60,
      symmetryStrength: 70,
      flowStrength: 50,
    },
  },
  {
    name: 'Outline Only',
    description: 'Hollow letters with pixel edges',
    parameters: {
      ...DEFAULT_PARAMETERS,
      edgePixelSize: 25,
      edgePixelSpacing: 45,
      cornerRadius: 20,
      blobThickness: 100,
      blobSmoothness: 75,
      fillStyle: 'outline-only',
      flowStrength: 65,
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

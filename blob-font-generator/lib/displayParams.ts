// Type definitions for all display and blob parameters

export interface BlobParams {
  thickness: number;      // 30-150: Scales letters fatter/thinner
  smoothness: number;     // 0-100%: Edge blur amount
  curvature: number;      // 0-100%: Rounds corners (0=sharp, 100=very round)
}

export interface GridParams {
  spacing: number;        // 5-40: Size of grid cells
  lineWidth: number;      // 0.5-5: Thickness of grid lines
  color: string;          // Grid color
}

export interface DisplayParams {
  letterSpacing: number;  // Space between letters
  wordSpacing: number;    // Space between words
  size: number;           // Overall font size
  rotationVariance: number; // Random rotation per letter
  verticalOffset: number; // Random vertical shift
  verticalCrop: number;   // Zoom in/out on letters
  monospace: boolean;     // Toggle fixed-width letters
  letterColor: string;    // Letter color
  backgroundColor: string; // Background color
}

export interface AllParams {
  blob: BlobParams;
  grid: GridParams;
  display: DisplayParams;
}

// Default parameter values
export const defaultBlobParams: BlobParams = {
  thickness: 100,
  smoothness: 20,
  curvature: 50,
};

export const defaultGridParams: GridParams = {
  spacing: 15,
  lineWidth: 1,
  color: '#cccccc',
};

export const defaultDisplayParams: DisplayParams = {
  letterSpacing: 5,
  wordSpacing: 30,
  size: 100,
  rotationVariance: 0,
  verticalOffset: 0,
  verticalCrop: 100,
  monospace: false,
  letterColor: '#000000',
  backgroundColor: '#ffffff',
};

export const defaultAllParams: AllParams = {
  blob: defaultBlobParams,
  grid: defaultGridParams,
  display: defaultDisplayParams,
};

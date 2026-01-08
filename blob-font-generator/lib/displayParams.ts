// Display and spacing parameters for blob font

export interface DisplayParams {
  letterSpacing: number; // -20 to 50 (pixels)
  wordSpacing: number; // 0 to 100 (pixels)
  letterSize: number; // 40 to 200 (pixels)
  rotationVariance: number; // 0 to 15 (degrees)
  verticalVariance: number; // 0 to 30 (pixels)
  letterColor: string; // hex color
  backgroundColor: string; // hex color
  verticalCrop: number; // -50 to 50 (percentage of overflow)
  monospace: boolean; // equal width for all letters
}

export const defaultDisplayParams: DisplayParams = {
  letterSpacing: 2,
  wordSpacing: 20,
  letterSize: 80,
  rotationVariance: 0,
  verticalVariance: 0,
  letterColor: '#000000',
  backgroundColor: '#F9FAFB',
  verticalCrop: 0,
  monospace: false,
};

/**
 * Generate random rotation within variance
 */
export function getRandomRotation(variance: number, seed: number): number {
  if (variance === 0) return 0;

  // Use seed for consistent randomness per letter position
  const random = Math.sin(seed * 9999) * 10000;
  const normalized = random - Math.floor(random);

  return (normalized - 0.5) * 2 * variance;
}

/**
 * Generate random vertical offset within variance
 */
export function getRandomVerticalOffset(variance: number, seed: number): number {
  if (variance === 0) return 0;

  // Use different seed multiplier for different randomness
  const random = Math.sin(seed * 7777) * 10000;
  const normalized = random - Math.floor(random);

  return (normalized - 0.5) * 2 * variance;
}

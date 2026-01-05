/**
 * Letter Skeleton Templates
 * Defines the basic structure of each uppercase letter A-Z
 */

import { LetterSkeleton, Point } from './types';

// Helper function to create points
const p = (x: number, y: number): Point => ({ x, y });

/**
 * Letter skeletons define the basic structure using normalized coordinates
 * x: 0-1 (left to right)
 * y: 0-1 (top to bottom, 0 = cap height, 1 = baseline)
 */
export const LETTER_SKELETONS: Record<string, LetterSkeleton> = {
  'A': {
    strokes: [
      { type: 'diagonal', points: [p(0.15, 1), p(0.5, 0)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.5, 0), p(0.85, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.28, 0.6), p(0.72, 0.6)], weight: 0.8 },
    ],
    width: 1.0,
  },

  'B': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'blob', points: [p(0.15, 0), p(0.7, 0.05), p(0.75, 0.22), p(0.15, 0.45)], weight: 1.0 },
      { type: 'blob', points: [p(0.15, 0.5), p(0.75, 0.53), p(0.8, 0.75), p(0.15, 1)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'C': {
    strokes: [
      { type: 'curve', points: [p(0.85, 0.15), p(0.7, 0), p(0.3, 0), p(0.15, 0.15), p(0.15, 0.85), p(0.3, 1), p(0.7, 1), p(0.85, 0.85)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'D': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'curve', points: [p(0.15, 0), p(0.6, 0), p(0.85, 0.2), p(0.85, 0.8), p(0.6, 1), p(0.15, 1)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'E': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 0), p(0.8, 0)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 0.5), p(0.7, 0.5)], weight: 0.9 },
      { type: 'horizontal', points: [p(0.15, 1), p(0.8, 1)], weight: 1.0 },
    ],
    width: 0.9,
  },

  'F': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 0), p(0.8, 0)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 0.5), p(0.7, 0.5)], weight: 0.9 },
    ],
    width: 0.85,
  },

  'G': {
    strokes: [
      { type: 'curve', points: [p(0.85, 0.15), p(0.7, 0), p(0.3, 0), p(0.15, 0.15), p(0.15, 0.85), p(0.3, 1), p(0.7, 1), p(0.85, 0.85)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.85, 0.5), p(0.55, 0.5)], weight: 1.0 },
      { type: 'vertical', points: [p(0.85, 0.5), p(0.85, 0.85)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'H': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'vertical', points: [p(0.85, 0), p(0.85, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 0.5), p(0.85, 0.5)], weight: 0.9 },
    ],
    width: 1.0,
  },

  'I': {
    strokes: [
      { type: 'vertical', points: [p(0.5, 0), p(0.5, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.25, 0), p(0.75, 0)], weight: 0.9 },
      { type: 'horizontal', points: [p(0.25, 1), p(0.75, 1)], weight: 0.9 },
    ],
    width: 0.6,
  },

  'J': {
    strokes: [
      { type: 'vertical', points: [p(0.7, 0), p(0.7, 0.75)], weight: 1.0 },
      { type: 'curve', points: [p(0.7, 0.75), p(0.7, 0.95), p(0.45, 1), p(0.25, 0.9), p(0.2, 0.75)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.45, 0), p(0.85, 0)], weight: 0.9 },
    ],
    width: 0.8,
  },

  'K': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.85, 0), p(0.15, 0.5)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.15, 0.5), p(0.85, 1)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'L': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 1), p(0.8, 1)], weight: 1.0 },
    ],
    width: 0.8,
  },

  'M': {
    strokes: [
      { type: 'vertical', points: [p(0.1, 0), p(0.1, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.1, 0), p(0.5, 0.4)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.5, 0.4), p(0.9, 0)], weight: 1.0 },
      { type: 'vertical', points: [p(0.9, 0), p(0.9, 1)], weight: 1.0 },
    ],
    width: 1.2,
  },

  'N': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.15, 0), p(0.85, 1)], weight: 1.0 },
      { type: 'vertical', points: [p(0.85, 0), p(0.85, 1)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'O': {
    strokes: [
      { type: 'curve', points: [p(0.5, 0), p(0.15, 0.15), p(0.15, 0.85), p(0.5, 1), p(0.85, 0.85), p(0.85, 0.15), p(0.5, 0)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'P': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'blob', points: [p(0.15, 0), p(0.7, 0.05), p(0.75, 0.25), p(0.15, 0.5)], weight: 1.0 },
    ],
    width: 0.9,
  },

  'Q': {
    strokes: [
      { type: 'curve', points: [p(0.5, 0), p(0.15, 0.15), p(0.15, 0.85), p(0.5, 1), p(0.85, 0.85), p(0.85, 0.15), p(0.5, 0)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.6, 0.7), p(0.9, 1.1)], weight: 0.9 },
    ],
    width: 1.0,
  },

  'R': {
    strokes: [
      { type: 'vertical', points: [p(0.15, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'blob', points: [p(0.15, 0), p(0.7, 0.05), p(0.75, 0.25), p(0.15, 0.5)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.5, 0.5), p(0.85, 1)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'S': {
    strokes: [
      { type: 'curve', points: [p(0.85, 0.2), p(0.7, 0), p(0.3, 0), p(0.15, 0.15), p(0.3, 0.3), p(0.5, 0.4), p(0.7, 0.5), p(0.85, 0.6), p(0.85, 0.85), p(0.7, 1), p(0.3, 1), p(0.15, 0.8)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'T': {
    strokes: [
      { type: 'horizontal', points: [p(0.1, 0), p(0.9, 0)], weight: 1.0 },
      { type: 'vertical', points: [p(0.5, 0), p(0.5, 1)], weight: 1.0 },
    ],
    width: 0.9,
  },

  'U': {
    strokes: [
      { type: 'curve', points: [p(0.15, 0), p(0.15, 0.75), p(0.25, 1), p(0.75, 1), p(0.85, 0.75), p(0.85, 0)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'V': {
    strokes: [
      { type: 'diagonal', points: [p(0.1, 0), p(0.5, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.5, 1), p(0.9, 0)], weight: 1.0 },
    ],
    width: 1.0,
  },

  'W': {
    strokes: [
      { type: 'diagonal', points: [p(0.05, 0), p(0.25, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.25, 1), p(0.5, 0.5)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.5, 0.5), p(0.75, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.75, 1), p(0.95, 0)], weight: 1.0 },
    ],
    width: 1.3,
  },

  'X': {
    strokes: [
      { type: 'diagonal', points: [p(0.15, 0), p(0.85, 1)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.85, 0), p(0.15, 1)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'Y': {
    strokes: [
      { type: 'diagonal', points: [p(0.15, 0), p(0.5, 0.5)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.85, 0), p(0.5, 0.5)], weight: 1.0 },
      { type: 'vertical', points: [p(0.5, 0.5), p(0.5, 1)], weight: 1.0 },
    ],
    width: 0.95,
  },

  'Z': {
    strokes: [
      { type: 'horizontal', points: [p(0.15, 0), p(0.85, 0)], weight: 1.0 },
      { type: 'diagonal', points: [p(0.85, 0), p(0.15, 1)], weight: 1.0 },
      { type: 'horizontal', points: [p(0.15, 1), p(0.85, 1)], weight: 1.0 },
    ],
    width: 0.9,
  },
};

/**
 * Get the skeleton for a given character
 */
export function getLetterSkeleton(char: string): LetterSkeleton | null {
  const upperChar = char.toUpperCase();
  return LETTER_SKELETONS[upperChar] || null;
}

/**
 * Get all available characters
 */
export function getAvailableCharacters(): string[] {
  return Object.keys(LETTER_SKELETONS);
}

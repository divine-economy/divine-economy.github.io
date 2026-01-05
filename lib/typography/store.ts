/**
 * Zustand store for typography tool state
 */

import { create } from 'zustand';
import { Parameters, DEFAULT_PARAMETERS, FontMetadata, DEFAULT_FONT_METADATA, Preset } from './types';

interface TypographyStore {
  // Parameters
  parameters: Parameters;
  setParameter: <K extends keyof Parameters>(key: K, value: Parameters[K]) => void;
  setParameters: (params: Partial<Parameters>) => void;
  resetParameters: () => void;

  // Font metadata
  metadata: FontMetadata;
  setMetadata: <K extends keyof FontMetadata>(key: K, value: FontMetadata[K]) => void;

  // UI state
  previewText: string;
  setPreviewText: (text: string) => void;
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;

  // Preset management
  loadPreset: (preset: Preset) => void;

  // Generation state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  generationProgress: number;
  setGenerationProgress: (progress: number) => void;
}

export const useTypographyStore = create<TypographyStore>((set) => ({
  // Parameters
  parameters: DEFAULT_PARAMETERS,
  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
    })),
  setParameters: (params) =>
    set((state) => ({
      parameters: { ...state.parameters, ...params },
    })),
  resetParameters: () => set({ parameters: DEFAULT_PARAMETERS }),

  // Font metadata
  metadata: DEFAULT_FONT_METADATA,
  setMetadata: (key, value) =>
    set((state) => ({
      metadata: { ...state.metadata, [key]: value },
    })),

  // UI state
  previewText: 'PIXEL BLOB',
  setPreviewText: (text) => set({ previewText: text }),
  selectedLetter: 'A',
  setSelectedLetter: (letter) => set({ selectedLetter: letter }),
  zoomLevel: 1,
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

  // Preset management
  loadPreset: (preset) =>
    set({
      parameters: preset.parameters,
    }),

  // Generation state
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  generationProgress: 0,
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
}));

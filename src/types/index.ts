export interface ColorItem {
  id: string;
  hex: string;
  name: string;
  locked: boolean;
}

export type HarmonyMode =
  | 'auto'
  | 'analogous'
  | 'monochromatic'
  | 'triad'
  | 'complementary'
  | 'split'
  | 'pastel'
  | 'warm'
  | 'cool'
  | 'neon'
  | 'vintage'
  | 'deep';

export type ColorBlindnessType =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export interface PalettePreset {
  id: string;
  name: string;
  colors: string[];
  category: 'trending' | 'pastel' | 'warm' | 'cool' | 'neon' | 'vintage' | 'dark' | 'nature';
  likes: number;
}

export type ActiveTab = 'generator' | 'explore' | 'image-picker' | 'contrast-checker' | 'landing';

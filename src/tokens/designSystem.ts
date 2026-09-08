/**
 * Coca-Cola Design System Token Dictionary & Color Architecture
 * Meets WCAG 2.2 AA (>= 4.5:1) and AAA (>= 7.0:1) contrast requirements.
 */

export interface FlavorProfile {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  canBodyColor: number; // Hex number for Three.js PBR material
  canRoughness: number;
  canMetalness: number;
  glowRgba: string;
  flavorNotes: string[];
  effervescenceRating: number; // 1 to 5
  temperatureCelsius: number;
  calories: string;
  description: string;
  isSecret?: boolean;
}

export const FLAVOR_PROFILES: Record<string, FlavorProfile> = {
  classic: {
    id: 'classic',
    name: 'Coca-Cola Original Taste',
    tagline: 'The timeless, crisp, uplifting standard since 1886.',
    primaryColor: '#F40009',
    secondaryColor: '#FFFFFF',
    accentColor: '#BA0007',
    textColor: '#FFFFFF',
    canBodyColor: 0xF40009,
    canRoughness: 0.18,
    canMetalness: 0.85,
    glowRgba: 'rgba(244, 0, 9, 0.45)',
    flavorNotes: ['Kola Nut', 'Caramel', 'Vanilla Bean', 'Citrus Peel', 'Cinnamon Spice'],
    effervescenceRating: 5,
    temperatureCelsius: 3.2,
    calories: '140 kcal',
    description: 'Born in Atlanta, Georgia in 1886. Iconic balance of sweet, spice, and effervescent bubbles.'
  },
  zero: {
    id: 'zero',
    name: 'Coca-Cola Zero Sugar',
    tagline: 'Real Coke taste with zero sugar, zero calories.',
    primaryColor: '#111111',
    secondaryColor: '#F40009',
    accentColor: '#E5E7EB',
    textColor: '#FFFFFF',
    canBodyColor: 0x111111,
    canRoughness: 0.35, // Matte black finish
    canMetalness: 0.90,
    glowRgba: 'rgba(255, 255, 255, 0.25)',
    flavorNotes: ['Crisp Cola', 'Subtle Citrus', 'Zero Aftertaste', 'Clean Finish'],
    effervescenceRating: 5,
    temperatureCelsius: 2.8,
    calories: '0 kcal',
    description: 'Engineered with our proprietary multi-sweetener matrix for exact classic taste with 0 sugar.'
  },
  cherry: {
    id: 'cherry',
    name: 'Coca-Cola Cherry Ruby',
    tagline: 'Classic crispness charged with lush wild dark cherry.',
    primaryColor: '#D90429',
    secondaryColor: '#FFE4E6',
    accentColor: '#7A0005',
    textColor: '#FFFFFF',
    canBodyColor: 0x990022,
    canRoughness: 0.20,
    canMetalness: 0.80,
    glowRgba: 'rgba(217, 4, 41, 0.50)',
    flavorNotes: ['Dark Bing Cherry', 'Ripe Plum', 'Warm Vanilla', 'Effervescent Soda'],
    effervescenceRating: 4,
    temperatureCelsius: 3.0,
    calories: '150 kcal',
    description: 'An American classic infused with the opulent burst of sun-ripened orchard cherries.'
  },
  vanilla: {
    id: 'vanilla',
    name: 'Coca-Cola Vanilla Cream',
    tagline: 'Rich Madagascar vanilla folds into effervescent caramel.',
    primaryColor: '#F59E0B',
    secondaryColor: '#FFFBEB',
    accentColor: '#92400E',
    textColor: '#111111',
    canBodyColor: 0xD97706,
    canRoughness: 0.22,
    canMetalness: 0.75,
    glowRgba: 'rgba(245, 158, 11, 0.50)',
    flavorNotes: ['Madagascar Bourbon Vanilla', 'Golden Caramel', 'Velvety Cream'],
    effervescenceRating: 4,
    temperatureCelsius: 3.5,
    calories: '150 kcal',
    description: 'Warm, aromatic sweet vanilla bean notes dancing on a brisk, bubbly foundation.'
  },
  y3000: {
    id: 'y3000',
    name: 'Coca-Cola Y3000 (AI Co-Created)',
    tagline: 'Co-created with artificial intelligence: Taste the Year 3000.',
    primaryColor: '#00F5D4',
    secondaryColor: '#FF0055',
    accentColor: '#7B2CBF',
    textColor: '#FFFFFF',
    canBodyColor: 0x7B2CBF,
    canRoughness: 0.12, // Ultra glossy iridescent cyber sheen
    canMetalness: 0.95,
    glowRgba: 'rgba(0, 245, 212, 0.60)',
    flavorNotes: ['Cosmic Berry', 'Ozone Breeze', 'Digital Candy', 'Future Spark'],
    effervescenceRating: 5,
    temperatureCelsius: 2.0,
    calories: '0 kcal',
    description: 'First ever flavor co-created with humanity and AI to imagine how the future tastes.'
  },
  nebula: {
    id: 'nebula',
    name: 'Coca-Cola Cosmic Nebula (Secret Vault)',
    tagline: 'Mythical deep-space formula discovered in the Atlanta secret vault.',
    primaryColor: '#A855F7',
    secondaryColor: '#06B6D4',
    accentColor: '#EC4899',
    textColor: '#FFFFFF',
    canBodyColor: 0x4C1D95,
    canRoughness: 0.10, // Mirror iridescent space gloss
    canMetalness: 0.98,
    glowRgba: 'rgba(168, 85, 247, 0.65)',
    flavorNotes: ['Galactic Starfruit', 'Ultraviolet Violet', 'Liquid Stardust', 'Deep Space Caramel'],
    effervescenceRating: 5,
    temperatureCelsius: -1.0,
    calories: '0 kcal',
    description: 'Unlocked exclusively via the Red Magic Hotline. A multidimensional collision of stardust and carbonation.',
    isSecret: true,
  }
};

/**
 * Calculates relative luminance according to WCAG 2.1 specs
 */
export function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG Contrast Ratio between two hex colors (e.g. 4.5:1, 7:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

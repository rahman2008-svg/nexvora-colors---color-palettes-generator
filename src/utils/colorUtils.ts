// Color conversion, harmony generator, and analysis utilities

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function cleanHex(hex: string): string {
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return cleaned.toUpperCase();
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

export function hexToRgb(hex: string): RGB {
  const cleaned = cleanHex(hex);
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0').toUpperCase();
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Relative luminance based on WCAG 2.1 specs
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast ratio between two colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

// Check if white or dark text is better on this background
export function getReadableTextColor(bgHex: string): '#000000' | '#FFFFFF' {
  const lum = getLuminance(bgHex);
  return lum > 0.4 ? '#000000' : '#FFFFFF';
}

// Named Colors Dictionary (sample of 120+ popular design colors)
const COLOR_NAMES: Array<{ name: string; hex: string; r: number; g: number; b: number }> = [
  { name: 'Charcoal', hex: '264653', r: 38, g: 70, b: 83 },
  { name: 'Persian Green', hex: '2A9D8F', r: 42, g: 157, b: 143 },
  { name: 'Saffron', hex: 'E9C46A', r: 233, g: 196, b: 106 },
  { name: 'Sandy Brown', hex: 'F4A261', r: 244, g: 162, b: 97 },
  { name: 'Burnt Sienna', hex: 'E76F51', r: 231, g: 111, b: 81 },
  { name: 'Electric Indigo', hex: '4361EE', r: 67, g: 97, b: 238 },
  { name: 'Neon Blue', hex: '4CC9F0', r: 76, g: 201, b: 240 },
  { name: 'Deep Violet', hex: '3F37C9', r: 63, g: 55, b: 201 },
  { name: 'Rose Red', hex: 'F72585', r: 247, g: 37, b: 133 },
  { name: 'Grape', hex: '7209B7', r: 114, g: 9, b: 183 },
  { name: 'Jet Black', hex: '121212', r: 18, g: 18, b: 18 },
  { name: 'Pure White', hex: 'FFFFFF', r: 255, g: 255, b: 255 },
  { name: 'Coral', hex: 'FF6B6B', r: 255, g: 107, b: 107 },
  { name: 'Teal', hex: '4ECDC4', r: 78, g: 205, b: 196 },
  { name: 'Cream', hex: 'FFE66D', r: 255, g: 230, b: 109 },
  { name: 'Oxford Blue', hex: '1A535C', r: 26, g: 83, b: 92 },
  { name: 'Mint Green', hex: '83E8BA', r: 131, g: 232, b: 186 },
  { name: 'Sunset Orange', hex: 'FF5722', r: 255, g: 87, b: 34 },
  { name: 'Amber Gold', hex: 'FFC107', r: 255, g: 193, b: 7 },
  { name: 'Emerald', hex: '2EC4B6', r: 46, g: 196, b: 182 },
  { name: 'Ferrari Red', hex: 'E71D36', r: 231, g: 29, b: 54 },
  { name: 'Cyber Yellow', hex: 'FF9F1C', r: 255, g: 159, b: 28 },
  { name: 'Baby Powder', hex: 'FDFFFC', r: 253, g: 255, b: 252 },
  { name: 'Rich Black', hex: '011627', r: 1, g: 22, b: 39 },
  { name: 'Orchid', hex: 'DDA0DD', r: 221, g: 160, b: 221 },
  { name: 'Plum', hex: '8E44AD', r: 142, g: 68, b: 173 },
  { name: 'Midnight Blue', hex: '2C3E50', r: 44, g: 62, b: 80 },
  { name: 'Sky Blue', hex: '3498DB', r: 52, g: 152, b: 219 },
  { name: 'Turquoise', hex: '1ABC9C', r: 26, g: 188, b: 156 },
  { name: 'Sunflower', hex: 'F1C40F', r: 241, g: 196, b: 15 },
  { name: 'Carrot', hex: 'E67E22', r: 230, g: 126, b: 34 },
  { name: 'Alizarin', hex: 'E74C3C', r: 231, g: 76, b: 60 },
  { name: 'Clouds', hex: 'ECF0F1', r: 236, g: 240, b: 241 },
  { name: 'Concrete', hex: '95A5A6', r: 149, g: 165, b: 166 },
  { name: 'Asbestos', hex: '7F8C8D', r: 127, g: 140, b: 141 },
  { name: 'Lavender', hex: 'E6E6FA', r: 230, g: 230, b: 250 },
  { name: 'Thistle', hex: 'D8BFD8', r: 216, g: 191, b: 216 },
  { name: 'Salmon', hex: 'FA8072', r: 250, g: 128, b: 114 },
  { name: 'Peach', hex: 'FFDAB9', r: 255, g: 218, b: 185 },
  { name: 'Papaya', hex: 'FFEFD5', r: 255, g: 239, b: 213 },
  { name: 'Khaki', hex: 'F0E68C', r: 240, g: 230, b: 140 },
  { name: 'Goldenrod', hex: 'DAA520', r: 218, g: 165, b: 32 },
  { name: 'Olive', hex: '808000', r: 128, g: 128, b: 0 },
  { name: 'Forest Green', hex: '228B22', r: 34, g: 139, b: 34 },
  { name: 'Sea Green', hex: '2E8B57', r: 46, g: 139, b: 87 },
  { name: 'Cadet Blue', hex: '5F9EA0', r: 95, g: 158, b: 160 },
  { name: 'Steel Blue', hex: '4682B4', r: 70, g: 130, b: 180 },
  { name: 'Royal Blue', hex: '4169E1', r: 65, g: 105, b: 225 },
  { name: 'Navy', hex: '000080', r: 0, g: 0, b: 128 },
  { name: 'Hot Pink', hex: 'FF69B4', r: 255, g: 105, b: 180 },
  { name: 'Crimson', hex: 'DC143C', r: 220, g: 20, b: 60 },
  { name: 'Firebrick', hex: 'B22222', r: 178, g: 34, b: 34 },
  { name: 'Maroon', hex: '800000', r: 128, g: 0, b: 0 },
  { name: 'Chocolate', hex: 'D2691E', r: 210, g: 105, b: 30 },
  { name: 'Sienna', hex: 'A0522D', r: 160, g: 82, b: 45 },
  { name: 'Slate Gray', hex: '708090', r: 112, g: 128, b: 144 },
  { name: 'Dark Slate', hex: '2F4F4F', r: 47, g: 79, b: 79 },
  { name: 'Lime Green', hex: '32CD32', r: 50, g: 205, b: 50 },
  { name: 'Chartreuse', hex: '7FFF00', r: 127, g: 255, b: 0 },
  { name: 'Spring Green', hex: '00FF7F', r: 0, g: 255, b: 127 },
  { name: 'Aquamarine', hex: '7FFFD4', r: 127, g: 255, b: 212 },
  { name: 'Dodger Blue', hex: '1E90FF', r: 30, g: 144, b: 255 },
  { name: 'Deep Sky Blue', hex: '00BFFF', r: 0, g: 191, b: 255 },
  { name: 'Magenta', hex: 'FF00FF', r: 255, g: 0, b: 255 },
  { name: 'Fuchsia', hex: 'FF0080', r: 255, g: 0, b: 128 },
  { name: 'Indigo', hex: '4B0082', r: 75, g: 0, b: 130 },
  { name: 'Dark Orchid', hex: '9932CC', r: 153, g: 50, b: 204 },
  { name: 'Periwinkle', hex: 'CCCCFF', r: 204, g: 204, b: 255 },
  { name: 'Mauve', hex: 'E0B0FF', r: 224, g: 176, b: 255 },
  { name: 'Tangerine', hex: 'F28500', r: 242, g: 133, b: 0 },
  { name: 'Cerulean', hex: '007BA7', r: 0, g: 123, b: 167 },
  { name: 'Cobalt', hex: '0047AB', r: 0, g: 71, b: 171 },
  { name: 'Prussian Blue', hex: '003153', r: 0, g: 49, b: 83 },
  { name: 'Viridian', hex: '40826D', r: 64, g: 130, b: 109 },
  { name: 'Sage', hex: 'BCB88A', r: 188, g: 184, b: 138 },
  { name: 'Sand', hex: 'C2B280', r: 194, g: 178, b: 128 },
  { name: 'Ochre', hex: 'CC7722', r: 204, g: 119, b: 34 },
  { name: 'Rust', hex: 'B7410E', r: 183, g: 65, b: 14 },
  { name: 'Wine', hex: '722F37', r: 114, g: 47, b: 55 },
  { name: 'Mulberry', hex: 'C54B8C', r: 197, g: 75, b: 140 },
  { name: 'Rose Gold', hex: 'B76E79', r: 183, g: 110, b: 121 },
  { name: 'Champagne', hex: 'F7E7CE', r: 247, g: 231, b: 206 },
  { name: 'Ivory', hex: 'FFFFF0', r: 255, g: 255, b: 240 },
  { name: 'Vanilla', hex: 'F3E5AB', r: 243, g: 229, b: 171 },
  { name: 'Ice Blue', hex: 'AFEEEE', r: 175, g: 238, b: 238 },
  { name: 'Electric Green', hex: '00FF00', r: 0, g: 255, b: 0 },
  { name: 'Pistachio', hex: '93C572', r: 147, g: 197, b: 114 },
  { name: 'Moss Green', hex: '8A9A5B', r: 138, g: 154, b: 91 },
  { name: 'Army Green', hex: '4B5320', r: 75, g: 83, b: 32 },
  { name: 'Beige', hex: 'F5F5DC', r: 245, g: 245, b: 220 },
  { name: 'Sepia', hex: '704214', r: 112, g: 66, b: 20 },
  { name: 'Denim', hex: '1560BD', r: 21, g: 96, b: 189 },
  { name: 'Lapis Lazuli', hex: '26619C', r: 38, g: 97, b: 156 },
  { name: 'Celeste', hex: 'B2FFFF', r: 178, g: 255, b: 255 },
  { name: 'Amber', hex: 'FFBF00', r: 255, g: 191, b: 0 },
  { name: 'Carmine', hex: '960018', r: 150, g: 0, b: 24 },
  { name: 'Rubine Red', hex: 'D10056', r: 209, g: 0, b: 86 },
];

export function getColorName(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  let minDistance = Infinity;
  let closestName = 'Custom';

  for (const c of COLOR_NAMES) {
    // Weighted Euclidean distance (human eye is more sensitive to green)
    const dr = r - c.r;
    const dg = g - c.g;
    const db = b - c.b;
    const dist = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
    if (dist < minDistance) {
      minDistance = dist;
      closestName = c.name;
    }
  }

  return closestName;
}

// Generate random color in HEX
export function getRandomHex(): string {
  const letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Generate 10-step ladder of shades and tints
export function generateShadesAndTints(baseHex: string): string[] {
  const { h, s } = rgbToHsl(hexToRgb(baseHex).r, hexToRgb(baseHex).g, hexToRgb(baseHex).b);
  const steps = [95, 85, 75, 65, 55, 45, 35, 25, 15, 8];
  return steps.map((lightness) => hslToHex(h, s, lightness));
}

// Harmonious palette generator algorithms
export function generatePaletteByHarmony(
  count: number,
  mode: string,
  existingColors: { hex: string; locked: boolean }[] = []
): string[] {
  const result: string[] = [];

  // Find an anchor color from locked colors or generate a random pleasing base
  const firstLocked = existingColors.find((c) => c.locked);
  let baseHue = firstLocked
    ? rgbToHsl(hexToRgb(firstLocked.hex).r, hexToRgb(firstLocked.hex).g, hexToRgb(firstLocked.hex).b).h
    : Math.floor(Math.random() * 360);

  for (let i = 0; i < count; i++) {
    if (existingColors[i]?.locked) {
      result.push(cleanHex(existingColors[i].hex));
      continue;
    }

    let h = baseHue;
    let s = 65;
    let l = 50;

    switch (mode) {
      case 'analogous':
        h = (baseHue + (i - Math.floor(count / 2)) * 30 + 360) % 360;
        s = 55 + (i % 3) * 15;
        l = 40 + (i % 4) * 12;
        break;

      case 'monochromatic':
        h = baseHue;
        s = 40 + (i * 12) % 45;
        l = 20 + Math.floor((i / count) * 65);
        break;

      case 'triad':
        const triadOffsets = [0, 120, 240, 40, 160, 280];
        h = (baseHue + triadOffsets[i % triadOffsets.length]) % 360;
        s = 60 + (i % 2) * 20;
        l = 35 + (i % 3) * 18;
        break;

      case 'complementary':
        const isComp = i % 2 === 1;
        h = (baseHue + (isComp ? 180 : 0) + (i > 1 ? (i * 20) % 40 : 0)) % 360;
        s = 60 + (i % 3) * 15;
        l = 30 + (i % 4) * 16;
        break;

      case 'split':
        const splitOffsets = [0, 150, 210, 30, 180];
        h = (baseHue + splitOffsets[i % splitOffsets.length]) % 360;
        s = 60 + (i % 2) * 25;
        l = 35 + (i % 3) * 16;
        break;

      case 'pastel':
        h = (baseHue + i * 55) % 360;
        s = 55 + Math.floor(Math.random() * 20);
        l = 80 + Math.floor(Math.random() * 12);
        break;

      case 'neon':
        h = (baseHue + i * 65) % 360;
        s = 90 + Math.floor(Math.random() * 10);
        l = 50 + Math.floor(Math.random() * 15);
        break;

      case 'warm':
        h = (Math.floor(Math.random() * 70) + 340) % 360; // 340 to 50 deg (reds, oranges, yellows)
        s = 65 + Math.floor(Math.random() * 30);
        l = 40 + Math.floor(Math.random() * 35);
        break;

      case 'cool':
        h = 160 + Math.floor(Math.random() * 120); // 160 to 280 deg (greens, cyans, blues, purples)
        s = 50 + Math.floor(Math.random() * 35);
        l = 35 + Math.floor(Math.random() * 40);
        break;

      case 'vintage':
        h = (baseHue + i * 45) % 360;
        s = 35 + Math.floor(Math.random() * 20);
        l = 45 + Math.floor(Math.random() * 25);
        break;

      case 'deep':
        h = (baseHue + i * 60) % 360;
        s = 60 + Math.floor(Math.random() * 25);
        l = 18 + Math.floor(Math.random() * 22);
        break;

      case 'auto':
      default:
        // High quality aesthetic generator with natural hue spread and balanced contrast
        h = (baseHue + i * (360 / count) + (Math.random() * 30 - 15) + 360) % 360;
        s = 50 + Math.floor(Math.random() * 40);
        l = 30 + Math.floor(Math.random() * 45);
        break;
    }

    result.push(hslToHex(h, s, l));
  }

  return result;
}

// Color blindness simulation algorithms
export function simulateColorBlindness(hex: string, type: string): string {
  if (type === 'normal') return hex;
  const { r, g, b } = hexToRgb(hex);

  let sr = r;
  let sg = g;
  let sb = b;

  if (type === 'protanopia') {
    // Red-blind
    sr = 0.56667 * r + 0.43333 * g + 0.0 * b;
    sg = 0.55833 * r + 0.44167 * g + 0.0 * b;
    sb = 0.0 * r + 0.24167 * g + 0.75833 * b;
  } else if (type === 'deuteranopia') {
    // Green-blind
    sr = 0.625 * r + 0.375 * g + 0.0 * b;
    sg = 0.7 * r + 0.3 * g + 0.0 * b;
    sb = 0.0 * r + 0.3 * g + 0.7 * b;
  } else if (type === 'tritanopia') {
    // Blue-blind
    sr = 0.95 * r + 0.05 * g + 0.0 * b;
    sg = 0.0 * r + 0.43333 * g + 0.56667 * b;
    sb = 0.0 * r + 0.475 * g + 0.525 * b;
  } else if (type === 'achromatopsia') {
    // Complete monochromacy
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    sr = gray;
    sg = gray;
    sb = gray;
  }

  return rgbToHex(sr, sg, sb);
}

// Generate SVG representation of palette
export function generateSvgPalette(colors: string[], name: string = 'NexVora Palette'): string {
  const width = 1000;
  const height = 400;
  const colWidth = width / colors.length;

  const rects = colors
    .map(
      (c, i) => `
    <rect x="${i * colWidth}" y="0" width="${colWidth}" height="${height}" fill="#${c}" />
    <text x="${i * colWidth + colWidth / 2}" y="${height - 40}" 
      fill="${getReadableTextColor(c)}" 
      font-family="sans-serif" 
      font-size="20" 
      font-weight="bold" 
      text-anchor="middle">#${c}</text>
    <text x="${i * colWidth + colWidth / 2}" y="${height - 18}" 
      fill="${getReadableTextColor(c)}" 
      opacity="0.8" 
      font-family="sans-serif" 
      font-size="14" 
      text-anchor="middle">${getColorName(c)}</text>`
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <title>${name} - NexVora Colors</title>
    ${rects}
  </svg>`;
}

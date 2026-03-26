export interface TemplateConfig {
  id: string
  name: string
  nameKey: string
  tagKey: string
  defaultPalette: string
  decorations: 'branches' | 'hearts' | 'geometric' | 'none'
}

export interface PaletteConfig {
  id: string
  name: string
  primary: string
  primaryLight: string
  primaryDark: string
  accent: string
  accentLight: string
  bg: string
  text: string
  textLight: string
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic-garden',
    name: 'Classic Garden',
    nameKey: 'classicGarden',
    tagKey: 'classicGardenTag',
    defaultPalette: 'sage-cream',
    decorations: 'branches',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    nameKey: 'minimalWhite',
    tagKey: 'minimalWhiteTag',
    defaultPalette: 'mono',
    decorations: 'none',
  },
  {
    id: 'romantic-blush',
    name: 'Romantic Blush',
    nameKey: 'romanticBlush',
    tagKey: 'romanticBlushTag',
    defaultPalette: 'blush-gold',
    decorations: 'hearts',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    nameKey: 'modernDark',
    tagKey: 'modernDarkTag',
    defaultPalette: 'dark-gold',
    decorations: 'geometric',
  },
]

export const PALETTES: PaletteConfig[] = [
  {
    id: 'sage-cream',
    name: 'Classic Garden',
    primary: '#7A8B5E',
    primaryLight: '#9BAF7C',
    primaryDark: '#5C6B45',
    accent: '#C4A35A',
    accentLight: '#D4BA7A',
    bg: '#FDFBF7',
    text: '#2C3E2D',
    textLight: '#4A5E4B',
  },
  {
    id: 'blush-gold',
    name: 'Romantic Blush',
    primary: '#D4A0A0',
    primaryLight: '#E8C4C4',
    primaryDark: '#B07070',
    accent: '#C4A35A',
    accentLight: '#D4BA7A',
    bg: '#FFF5F5',
    text: '#3D2C2C',
    textLight: '#6B5050',
  },
  {
    id: 'mono',
    name: 'Minimal White',
    primary: '#333333',
    primaryLight: '#999999',
    primaryDark: '#111111',
    accent: '#999999',
    accentLight: '#CCCCCC',
    bg: '#FFFFFF',
    text: '#111111',
    textLight: '#555555',
  },
  {
    id: 'dark-gold',
    name: 'Modern Dark',
    primary: '#D4A853',
    primaryLight: '#E8C878',
    primaryDark: '#A8863E',
    accent: '#D4A853',
    accentLight: '#E8C878',
    bg: '#1a1a2e',
    text: '#D4A853',
    textLight: '#C4A35A',
  },
  {
    id: 'navy-gold',
    name: 'Navy Elegance',
    primary: '#1B3A5C',
    primaryLight: '#3A6A9C',
    primaryDark: '#0F2440',
    accent: '#C4A35A',
    accentLight: '#D4BA7A',
    bg: '#F5F5F5',
    text: '#1B3A5C',
    textLight: '#3A5070',
  },
  {
    id: 'terracotta',
    name: 'Sunset Gold',
    primary: '#8B4513',
    primaryLight: '#A0662F',
    primaryDark: '#6B3010',
    accent: '#DAA520',
    accentLight: '#E8C44A',
    bg: '#FFF8DC',
    text: '#4A2810',
    textLight: '#6B4A30',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    primary: '#6B4C7A',
    primaryLight: '#9B7CAA',
    primaryDark: '#4A3058',
    accent: '#C4A35A',
    accentLight: '#D4BA7A',
    bg: '#F8F0FF',
    text: '#3A2848',
    textLight: '#5E4870',
  },
]

export function getTemplateById(id: string): TemplateConfig | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export function getPaletteById(id: string): PaletteConfig | undefined {
  return PALETTES.find(p => p.id === id)
}

export function getDefaultPaletteForTemplate(templateId: string): string {
  return getTemplateById(templateId)?.defaultPalette || 'sage-cream'
}

export function getPaletteColors(paletteId: string): PaletteConfig {
  return getPaletteById(paletteId) || PALETTES[0]
}

export function getTemplateThumbnailColors(template: TemplateConfig): PaletteConfig {
  return getPaletteColors(template.defaultPalette)
}

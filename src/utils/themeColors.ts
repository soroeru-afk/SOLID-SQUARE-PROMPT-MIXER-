export type ThemeName = 'light' | 'dark' | 'black' | 'navy' | 'pink' | 'mono' | 'red';

export interface ThemeColorConfig {
  markColor?: string;
  toolbarIconColor?: string;
}

export const THEME_DEFAULT_COLORS: Record<ThemeName, { markColor: string; toolbarIconColor: string; label: string; nameJa: string; dotColor: string }> = {
  navy: {
    markColor: '#93C5FD',
    toolbarIconColor: '#93C5FD',
    label: 'NAVY',
    nameJa: 'ネイビー',
    dotColor: '#3B82F6'
  },
  dark: {
    markColor: '#B5C8DC',
    toolbarIconColor: '#A4B8CE',
    label: 'DARK',
    nameJa: 'ダーク',
    dotColor: '#64748B'
  },
  black: {
    markColor: '#B5C8DC',
    toolbarIconColor: '#A4B8CE',
    label: 'BLACK',
    nameJa: 'ブラック',
    dotColor: '#171717'
  },
  pink: {
    markColor: '#F472B6',
    toolbarIconColor: '#F472B6',
    label: 'PINK',
    nameJa: 'ピンク',
    dotColor: '#E05688'
  },
  light: {
    markColor: '#334155',
    toolbarIconColor: '#475569',
    label: 'LIGHT',
    nameJa: 'ライト',
    dotColor: '#E2E8F0'
  },
  mono: {
    markColor: '#000000',
    toolbarIconColor: '#000000',
    label: 'MONO',
    nameJa: 'モノトーン',
    dotColor: '#FFFFFF'
  },
  red: {
    markColor: '#FFB0B0',
    toolbarIconColor: '#FFA0A0',
    label: 'RED',
    nameJa: 'レッド',
    dotColor: '#EF4444'
  },
};

export const COLOR_PALETTE_PRESETS = [
  { hex: '#EAB308', label: 'Gold / Yellow' },
  { hex: '#38BDF8', label: 'Sky Blue' },
  { hex: '#2563EB', label: 'Blue' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#A855F7', label: 'Purple' },
  { hex: '#64748B', label: 'Slate Gray' },
  { hex: '#F8FAFC', label: 'White' },
  { hex: '#06B6D4', label: 'Cyan' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#334155', label: 'Dark Slate' },
  { hex: '#000000', label: 'Black' },
];

const STORAGE_KEY = 'custom_theme_colors_v1';

export function getCustomThemeColors(): Record<ThemeName, ThemeColorConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load custom theme colors', e);
  }
  return {
    light: {},
    dark: {},
    black: {},
    navy: {},
    pink: {},
    mono: {},
    red: {},
  };
}

export function saveCustomThemeColors(colors: Record<ThemeName, ThemeColorConfig>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch (e) {
    console.error('Failed to save custom theme colors', e);
  }
}

export function applyThemeColors(currentTheme: ThemeName) {
  const custom = getCustomThemeColors();
  const themeSetting = custom[currentTheme] || {};
  const defaultColors = THEME_DEFAULT_COLORS[currentTheme] || THEME_DEFAULT_COLORS.dark;

  const markColor = themeSetting.markColor || defaultColors.markColor;
  const toolbarIconColor = themeSetting.toolbarIconColor || defaultColors.toolbarIconColor;

  document.documentElement.style.setProperty('--mark-color', markColor);
  document.documentElement.style.setProperty('--toolbar-icon-color', toolbarIconColor);
}

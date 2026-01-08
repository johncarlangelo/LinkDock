export const defaultThemes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      hover: '#f9fafb',
      hoverText: '#1f2937',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      hover: '#293548',
      hoverText: '#f1f5f9',
    }
  }
};

/**
 * Apply theme to CSS variables
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case (e.g., hoverText -> hover-text)
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--color-${kebabKey}`, value);
  });
}

/**
 * Create a custom theme object
 */
export function createCustomTheme(name, colors) {
  return {
    name,
    colors: {
      primary: colors.primary || '#3b82f6',
      secondary: colors.secondary || '#8b5cf6',
      background: colors.background || '#ffffff',
      surface: colors.surface || '#f3f4f6',
      text: colors.text || '#1f2937',
      textSecondary: colors.textSecondary || '#6b7280',
      border: colors.border || '#e5e7eb',
      hover: colors.hover || '#f9fafb',
      hoverText: colors.hoverText || colors.text || '#1f2937',
    },
    isCustom: true
  };
}

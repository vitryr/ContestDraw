/**
 * Centralized Theme Configuration
 * Dark theme matching the web design system
 */

export const colors = {
  background: {
    primary: '#09090b',    // Near black - main background
    elevated: '#13092b',   // Dark purple - header/elevated surfaces
    card: '#18181b',       // Card background
    header: '#13092b',     // Header specific dark purple
  },
  accent: {
    primary: '#7c3aed',    // Vibrant purple
    secondary: '#ec4899',  // Hot pink
    tertiary: '#a855f7',   // Softer purple
  },
  text: {
    primary: '#ffffff',    // White
    secondary: '#a1a1aa',  // Muted
    muted: '#71717a',      // Very muted
  },
  border: {
    default: '#27272a',
    light: '#3f3f46',
  },
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  gradients: {
    primary: ['#7c3aed', '#ec4899'] as const,     // Purple to pink
    secondary: ['#6366f1', '#8b5cf6'] as const,   // Indigo to purple
    success: ['#10b981', '#059669'] as const,     // Green gradient
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const fonts = {
  bold: 'Inter-Bold',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
};

export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  h3: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
};

// Export a default theme object for convenience
const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  fonts,
  typography,
};

export default theme;

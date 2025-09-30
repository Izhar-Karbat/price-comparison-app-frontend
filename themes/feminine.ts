// themes/feminine.ts - 3D Wellness Theme
export const feminineTheme = {
  mode: 'feminine' as const,
  colors: {
    background: '#F8F6F3',        // Warmer, more beige cream base
    surface: '#FFFFFF',           // Pure white surfaces
    cardBackground: '#FFFFFF',    // White cards with shadows
    primary: '#A8D8A8',          // Soft mint green
    accent: '#F4C2C2',           // Soft pink
    secondary: '#E8E0D6',        // Light beige
    textPrimary: '#2C2C2C',      // Dark charcoal
    text: '#2C2C2C',
    textSecondary: '#8A8A8A',    // Medium gray
    priceTag: '#A8D8A8',         // Mint green for prices
    navIcon: '#8A8A8A',
    success: '#A8D8A8',          // Mint green
    error: '#F4C2C2',            // Soft pink for errors
    warning: '#F7E6A3',          // Soft yellow
    danger: '#F4C2C2',
    dangerLight: '#F8E6E6',
    primaryAlpha: 'rgba(168, 216, 168, 0.15)',
    white: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    gray: {
      light: '#F8F6F3',
      medium: '#E0DDD8',
      dark: '#8A8A8A',
    },
    // 3D Wellness specific colors
    savingsGreen: '#A8D8A8',     // Savings circle
    pillPink: '#F4C2C2',         // Decorative elements
    pillCream: '#FFF8E7',        // Warm cream accents
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    button: 12,
  },
  typography: {
    size: {
      caption: 12,
      small: 14,
      body: 16,
      large: 18,
      title: 20,
      heading: 24,
      xl: 28,
      display: 32,
      subheading: 18,
      button: 16,
    },
    weight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
  },
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
    // 3D Wellness shadows
    floating: {
      shadowColor: '#A8D8A8',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    savings: {
      shadowColor: '#A8D8A8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    primary: {
      shadowColor: '#A8D8A8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    accent: {
      shadowColor: '#F4C2C2',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  fonts: {
    primary: 'SF Pro Display',
    system: 'System',
  },
};

export type Theme = typeof feminineTheme;
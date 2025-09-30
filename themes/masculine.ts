// themes/masculine.ts
import { Theme } from './feminine';

export const masculineTheme: Theme = {
  mode: 'masculine' as const,
  colors: {
    background: '#2E2B28',        // warm charcoal
    surface: '#3A322A',           // espresso
    cardBackground: '#3A322A',
    primary: '#B9A281',           // hazel
    accent: '#889C84',            // olive
    secondary: '#4A3F37',         // darker espresso
    textPrimary: '#F2ECE8',
    text: '#F2ECE8',
    textSecondary: '#B1A9A1',
    priceTag: '#C4A779',
    navIcon: '#B9A281',
    success: '#889C84',
    error: '#C4A779',
    warning: '#B9A281',
    danger: '#C4A779',
    dangerLight: '#4A3F37',
    primaryAlpha: 'rgba(185, 162, 129, 0.1)',
    white: '#F2ECE8',
    cardBorder: '#4A3F37',
    gray: {
      light: '#4A3F37',
      medium: '#5A4D45',
      dark: '#B1A9A1',
    },
    // 3D Wellness specific colors
    savingsGreen: '#889C84',     // Olive green for savings
    pillPink: '#C4A779',         // Hazel tone
    pillCream: '#B9A281',        // Primary hazel
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
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    primary: {
      shadowColor: '#B9A281',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    accent: {
      shadowColor: '#889C84',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  fonts: {
    primary: 'SF Pro Display',
    system: 'System',
  },
};
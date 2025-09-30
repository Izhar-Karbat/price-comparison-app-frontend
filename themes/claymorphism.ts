// themes/claymorphism.ts - Soft, tactile Claymorphism design system
export const claymorphismTheme = {
  mode: 'claymorphism' as const,
  colors: {
    // Core background colors matching the mockup
    background: '#F7F5F3',        // Off-white cream from mockup
    surface: '#F7F5F3',           // Same as background for seamless look
    cardBackground: '#F7F5F3',    // Cards blend with background

    // Primary accent colors
    primary: '#8FBF9F',           // Soft sage green from savings meter
    accent: '#F4B2B2',            // Soft coral pink
    secondary: '#E8E0D8',         // Light warm beige

    // Text colors
    textPrimary: '#3A3937',       // Dark charcoal
    text: '#3A3937',
    textSecondary: '#8A8680',     // Muted brown-gray

    // Functional colors
    priceTag: '#8FBF9F',          // Green for savings/prices
    navIcon: '#8A8680',           // Muted for icons
    success: '#8FBF9F',           // Sage green
    error: '#E89A9A',             // Soft red
    warning: '#F7D4A3',           // Soft yellow
    danger: '#E89A9A',
    dangerLight: '#F8E6E6',

    // Alpha colors
    primaryAlpha: 'rgba(143, 191, 159, 0.15)',
    white: '#FFFFFF',
    cardBorder: 'transparent',     // No visible borders in claymorphism

    // Gray scale
    gray: {
      light: '#F2EFEC',
      medium: '#E0DDD8',
      dark: '#8A8680',
    },

    // Claymorphism specific colors
    savingsGreen: '#8FBF9F',       // Savings meter green
    shadowLight: '#FFFFFF',        // Light shadow for top/left
    shadowDark: '#D4D0CC',         // Dark shadow for bottom/right
    shadowMedium: '#E8E5E2',       // Medium shadow for subtle effects
    pillPink: '#F4B2B2',           // Soft pink accent
    pillCream: '#FFF8F0',          // Cream accent
    pillGreen: '#B8DBC8',          // Light green variant

    // Tab and button states
    buttonPressed: '#ECEAE8',      // Slightly darker for pressed state
    buttonRaised: '#F7F5F3',       // Same as background for raised
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    button: 20,      // Rounded buttons
    circle: 9999,    // Full circle
    card: 24,        // Card corners
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
      display: 48,    // Large number display
      huge: 64,       // Savings number
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
    // Standard shadows
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },

    // Claymorphism specific shadows
    clayRaised: {
      // Light shadow (top-left)
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 8,
    },
    clayRaisedDark: {
      // Dark shadow (bottom-right)
      shadowColor: '#D4D0CC',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },
    clayPressed: {
      // Inverted shadows for pressed state
      shadowColor: '#D4D0CC',
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    clayPressedLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 2,
    },

    // Component specific shadows
    floating: {
      shadowColor: '#8FBF9F',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
    card: {
      shadowColor: '#D4D0CC',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    cardLight: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 5,
    },
    savings: {
      shadowColor: '#8FBF9F',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 10,
    },
    primary: {
      shadowColor: '#8FBF9F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: '#F4B2B2',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  fonts: {
    primary: 'Nunito',    // Rounded, friendly font
    system: 'System',
  },
};

export type ClaymorphismTheme = typeof claymorphismTheme;
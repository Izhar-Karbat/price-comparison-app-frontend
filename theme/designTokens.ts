// theme/designTokens.ts
const designTokens = {
  colors: {
    // Vibrant Background System
    background: '#FAFCFF', // Clean, bright white-blue
    backgroundSecondary: '#F5F8FE', // Subtle blue tint
    backgroundTertiary: '#EDF2FD', // Deeper blue accent
    
    // Professional Healthcare Blue - Industry Standard
    primary: '#0066CC', // Medical blue - trust and reliability
    primaryLight: '#3399FF', // Lighter blue for highlights  
    primaryDark: '#003D7A', // Deeper blue for contrast
    primaryAlpha: 'rgba(0, 102, 204, 0.12)', // Transparent overlay
    
    // Vibrant Accent System - Electric Orange
    accent: '#F59E0B', // Vibrant amber/orange
    accentLight: '#FCD34D', // Bright yellow accent
    accentDark: '#D97706', // Deep orange
    accentAlpha: 'rgba(245, 158, 11, 0.15)',
    
    // Premium Card System
    cardBackground: '#FFFFFF',
    cardElevated: '#FEFEFE', // Slight elevation
    cardPressed: '#F9F9F9', // Pressed state
    cardBorder: 'rgba(26, 74, 74, 0.08)', // Subtle primary border
    
    // Enhanced Status Colors
    success: '#10B981', // Modern green
    successLight: '#D1FAE5', // Light background
    successDark: '#047857', // Dark variant
    
    danger: '#EF4444', // Modern red
    dangerLight: '#FEE2E2', // Light background
    dangerDark: '#DC2626', // Dark variant
    
    warning: '#F59E0B', // Modern amber
    warningLight: '#FEF3C7', // Light background
    warningDark: '#D97706', // Dark variant
    
    info: '#3B82F6', // Modern blue
    infoLight: '#DBEAFE', // Light background
    infoDark: '#1D4ED8', // Dark variant
    
    // Sophisticated Neutrals
    white: '#FFFFFF',
    black: '#000000',
    
    // Enhanced Text System
    textPrimary: '#1F2937', // Darker, better contrast
    text: '#1F2937', // Alias for consistency
    textSecondary: '#6B7280', // More refined gray
    textTertiary: '#9CA3AF', // Lighter variant
    textInverse: '#FFFFFF', // For dark backgrounds
    
    // Premium Gray System
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      light: '#F3F4F6', // Keeping for backward compatibility
      medium: '#D1D5DB',
      dark: '#6B7280',
    },
    
    // Premium Overlays
    overlay: {
      light: 'rgba(255, 255, 255, 0.9)',
      medium: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(0, 0, 0, 0.5)',
      darker: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Electric Gradient System
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', // Indigo to purple
      accent: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', // Orange to red
      success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', // Green to cyan
      electric: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)', // Triple gradient
      sunset: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #8B5CF6 100%)', // Sunset colors
      warm: 'linear-gradient(135deg, #FAFCFF 0%, #F5F8FE 100%)',
      card: 'linear-gradient(135deg, #FFFFFF 0%, #FAFCFF 100%)',
    },
  },
  typography: {
    // Modern Typography Scale
    size: {
      xs: 10, // New micro size
      caption: 12,
      small: 14,
      body: 16,
      subheading: 18, // New subheading
      button: 18,
      large: 20,
      xl: 22, // New extra large
      title: 24,
      heading: 28, // More refined heading
      display: 32, // New display size
      hero: 36, // New hero size
    },
    // Enhanced Font Weights
    weight: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    // Line Heights for better readability
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
    // Letter Spacing for premium feel
    letterSpacing: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
  },
  spacing: {
    // Enhanced Spacing Scale
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64, // New extra large spacing
    huge: 96, // New huge spacing
  },
  
  borderRadius: {
    // Modern Border Radius System
    none: 0,
    xs: 2,
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
    xxl: 24,
    round: 999,
    // Specific use cases
    button: 12,
    card: 16,
    modal: 24,
  },
  
  // Premium Shadow & Elevation System
  shadows: {
    // Subtle shadows for depth
    xs: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 1 }, 
      shadowOpacity: 0.05, 
      shadowRadius: 2, 
      elevation: 2, 
    },
    sm: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.08, 
      shadowRadius: 4, 
      elevation: 3, 
    },
    md: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 8, 
      elevation: 5, 
    },
    lg: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 8 }, 
      shadowOpacity: 0.12, 
      shadowRadius: 16, 
      elevation: 8, 
    },
    xl: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 12 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 24, 
      elevation: 12, 
    },
    // Colored shadows for special elements
    primary: { 
      shadowColor: '#1A4A4A', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.2, 
      shadowRadius: 12, 
      elevation: 6, 
    },
    accent: { 
      shadowColor: '#B8A382', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 8, 
      elevation: 5, 
    },
    success: { 
      shadowColor: '#10B981', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.12, 
      shadowRadius: 6, 
      elevation: 4, 
    },
  },
  
  // Animation & Motion System
  animation: {
    duration: {
      fast: 150,
      normal: 200,
      slow: 300,
      slower: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

export { designTokens };
export default designTokens;
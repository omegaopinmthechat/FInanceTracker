export const colors = {
  // Base
  background: '#09090B',
  surface: '#18181B',
  surfaceHighlight: '#27272A',
  card: '#1E1E21', // Added for Card and chart backgrounds

  // Text
  text: '#FFFFFF',
  textPrimary: '#FFFFFF', // Added for consistency
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',

  // Brand
  primary: '#6D28D9',
  primaryLight: '#8B5CF6',

  // UI Elements
  border: '#27272A',
  inputBackground: '#27272A',
  buttonText: '#FFFFFF',

  // Gradients
  headerGradient: ['#6D28D9', '#4F46E5'],
  buttonGradient: ['#6D28D9', '#4F46E5'],

  // Chart
  chartBackground: '#18181B', // Added for chart backgrounds
  chartGrid: '#27272A',       // Added for chart grid lines

  // Status
  success: '#22C55E',
  error: '#EF4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
};

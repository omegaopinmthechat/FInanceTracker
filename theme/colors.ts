import { Platform } from "react-native";

export const colors = {
  // Base
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceHighlight: "#F7F7F7",
  card: "#FFFFFF",

  // Text
  text: "#111111",
  textPrimary: "#111111",
  textSecondary: "#525252",
  textMuted: "#737373",

  // Brand (Accent)
  primary: "#111111",
  primaryLight: "#2A2A2A",

  // UI Elements
  border: "#E6E6E6",
  inputBackground: "#FAFAFA",
  buttonText: "#FFFFFF",

  // Chart
  chartBackground: "#FFFFFF",
  chartGrid: "#E5E7EB",

  // Status
  success: "#16A34A",
  error: "#EF4444", // red
  warning: "#F59E0B", // optional (very useful)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: "#111111",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  medium: {
    shadowColor: "#111111",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};

export const fonts = {
  display:
    Platform.select({
      ios: "AvenirNext-Bold",
      android: "sans-serif-medium",
      default: "System",
    }) ?? "System",
  heading:
    Platform.select({
      ios: "AvenirNext-DemiBold",
      android: "sans-serif-medium",
      default: "System",
    }) ?? "System",
  body:
    Platform.select({
      ios: "AvenirNext-Regular",
      android: "sans-serif",
      default: "System",
    }) ?? "System",
};

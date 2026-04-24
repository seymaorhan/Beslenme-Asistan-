export const theme = {
  colors: {
    primary: "#2E7D32",
    primaryDark: "#1B5E20",
    primaryLight: "#A5D6A7",
    primarySurface: "#E8F5E9",
    accent: "#FF9800",
    accentLight: "#FFF3E0",
    background: "#F7F8FA",
    card: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#374151",
    muted: "#6B7280",
    mutedLight: "#9CA3AF",
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    success: "#10B981",
    white: "#FFFFFF",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
    full: 999,
  },
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  typography: {
    h1: { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5 },
    h2: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
    h3: { fontSize: 18, fontWeight: "700" as const },
    h4: { fontSize: 16, fontWeight: "600" as const },
    body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: "500" as const },
    small: { fontSize: 11, fontWeight: "600" as const },
  },
};

// react-native-paper theme
export const paperTheme = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    surface: theme.colors.card,
    text: theme.colors.text,
    accent: theme.colors.accent,
  },
};

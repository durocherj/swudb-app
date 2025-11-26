import { MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: { fontFamily: 'System', fontWeight: '700' as const },
  displayMedium: { fontFamily: 'System', fontWeight: '600' as const },
  displaySmall: { fontFamily: 'System', fontWeight: '600' as const },
  headlineLarge: { fontFamily: 'System', fontWeight: '600' as const },
  headlineMedium: { fontFamily: 'System', fontWeight: '600' as const },
  headlineSmall: { fontFamily: 'System', fontWeight: '500' as const },
  titleLarge: { fontFamily: 'System', fontWeight: '600' as const },
  titleMedium: { fontFamily: 'System', fontWeight: '500' as const },
  titleSmall: { fontFamily: 'System', fontWeight: '500' as const },
  bodyLarge: { fontFamily: 'System', fontWeight: '400' as const },
  bodyMedium: { fontFamily: 'System', fontWeight: '400' as const },
  bodySmall: { fontFamily: 'System', fontWeight: '400' as const },
  labelLarge: { fontFamily: 'System', fontWeight: '500' as const },
  labelMedium: { fontFamily: 'System', fontWeight: '500' as const },
  labelSmall: { fontFamily: 'System', fontWeight: '500' as const },
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFD700', // Star Wars gold
    primaryContainer: '#3D3100',
    secondary: '#00A8E8', // Lightsaber blue
    secondaryContainer: '#004D6D',
    tertiary: '#E63946', // Sith red accent
    tertiaryContainer: '#5C1620',
    background: '#0A0A0A',
    surface: '#141414',
    surfaceVariant: '#1E1E1E',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#E5E5E5',
    onSurface: '#E5E5E5',
    onSurfaceVariant: '#B0B0B0',
    outline: '#404040',
    error: '#CF6679',
    // Custom colors for aspects (matching actual SWU card colors)
    vigilance: '#3B82F6',  // Blue
    command: '#22C55E',    // Green
    aggression: '#EF4444', // Red
    cunning: '#EAB308',    // Yellow
    villainy: '#404040',   // Dark Gray (substituting for Black)
    heroism: '#FFFFFF',    // White
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};

export const aspectColors: Record<string, string> = {
  Vigilance: '#3B82F6',  // Blue
  Command: '#22C55E',    // Green
  Aggression: '#EF4444', // Red
  Cunning: '#EAB308',    // Yellow
  Villainy: '#404040',   // Dark Gray (substituting for Black)
  Heroism: '#FFFFFF',    // White
};

export const rarityColors: Record<string, string> = {
  Starter: '#FF00FF',   // Magenta
  Common: '#CD7F32',    // Bronze
  Uncommon: '#C0C0C0',  // Silver
  Rare: '#FFD700',      // Gold
  Legendary: '#3B82F6', // Blue
  Special: '#FF00FF',   // Magenta (same as Starter)
};

export const rarityLetters: Record<string, string> = {
  Starter: 'S',
  Common: 'C',
  Uncommon: 'U',
  Rare: 'R',
  Legendary: 'L',
  Special: 'S',
};



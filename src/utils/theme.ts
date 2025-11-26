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
    // Custom colors for aspects
    vigilance: '#4A90D9',
    command: '#2ECC71',
    aggression: '#E74C3C',
    cunning: '#F1C40F',
    villainy: '#9B59B6',
    heroism: '#3498DB',
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};

export const aspectColors: Record<string, string> = {
  Vigilance: '#4A90D9',
  Command: '#2ECC71',
  Aggression: '#E74C3C',
  Cunning: '#F1C40F',
  Villainy: '#9B59B6',
  Heroism: '#3498DB',
};

export const rarityColors: Record<string, string> = {
  Common: '#808080',
  Uncommon: '#4CAF50',
  Rare: '#2196F3',
  Legendary: '#FFD700',
  Special: '#9C27B0',
};



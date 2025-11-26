import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProviders } from './src/context';
import { theme } from './src/utils/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AppProviders>
            <StatusBar style="light" />
            <AppNavigator />
          </AppProviders>
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { LeftDrawerContent } from '../components/LeftDrawerContent';
import { RightDrawerContent } from '../components/RightDrawerContent';
import { HomeScreen } from '../screens/HomeScreen';
import { CardDetailsScreen } from '../screens/CardDetailsScreen';
import { MyDecksScreen } from '../screens/MyDecksScreen';
import { DeckEditorScreen } from '../screens/DeckEditorScreen';
import { HotDecksScreen } from '../screens/HotDecksScreen';
import { CollectionScreen } from '../screens/CollectionScreen';
import { MarketsScreen } from '../screens/MarketsScreen';
import { SetsScreen } from '../screens/SetsScreen';
import { SetDetailsScreen } from '../screens/SetDetailsScreen';
import { RulesScreen } from '../screens/RulesScreen';
import { MainStackParamList } from '../types/navigation';
import { theme } from '../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

const LeftDrawer = createDrawerNavigator();
const RightDrawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Stack navigator for all screens
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="CardDetails" 
        component={CardDetailsScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="MyDecks" component={MyDecksScreen} />
      <Stack.Screen name="DeckEditor" component={DeckEditorScreen} />
      <Stack.Screen name="HotDecks" component={HotDecksScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Markets" component={MarketsScreen} />
      <Stack.Screen name="Sets" component={SetsScreen} />
      <Stack.Screen name="SetDetails" component={SetDetailsScreen} />
      <Stack.Screen name="Rules" component={RulesScreen} />
    </Stack.Navigator>
  );
}

// Right drawer wrapper that contains the main stack
function RightDrawerNavigator() {
  return (
    <RightDrawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: theme.colors.surface,
        },
        headerShown: false,
        swipeEdgeWidth: 50,
        swipeMinDistance: 10,
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
      drawerContent={(props) => (
        <RightDrawerContent closeDrawer={() => props.navigation.closeDrawer()} />
      )}
    >
      <RightDrawer.Screen name="MainStack" component={MainStack} />
    </RightDrawer.Navigator>
  );
}

// Left drawer wrapper that contains everything
function LeftDrawerNavigator() {
  return (
    <LeftDrawer.Navigator
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: theme.colors.surface,
        },
        headerShown: false,
        swipeEdgeWidth: 50,
        swipeMinDistance: 10,
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
      drawerContent={(props) => (
        <LeftDrawerContent closeDrawer={() => props.navigation.closeDrawer()} />
      )}
    >
      <LeftDrawer.Screen name="RightDrawerWrapper" component={RightDrawerNavigator} />
    </LeftDrawer.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          border: theme.colors.outline,
          notification: theme.colors.error,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <LeftDrawerNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

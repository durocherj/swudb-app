import React, { createContext, useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

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

const Stack = createNativeStackNavigator<MainStackParamList>();

// Context for managing menu visibility
interface MenuContextType {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  filterVisible: boolean;
  setFilterVisible: (visible: boolean) => void;
}

const MenuContext = createContext<MenuContextType>({
  menuVisible: false,
  setMenuVisible: () => {},
  filterVisible: false,
  setFilterVisible: () => {},
});

export const useMenu = () => useContext(MenuContext);

export function AppNavigator() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <MenuContext.Provider value={{ menuVisible, setMenuVisible, filterVisible, setFilterVisible }}>
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
      </NavigationContainer>
    </MenuContext.Provider>
  );
}

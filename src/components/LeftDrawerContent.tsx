import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type NavItem = {
  key: string;
  label: string;
  icon: IconName;
  route: string;
};

const navItems: NavItem[] = [
  { key: 'home', label: 'SWUDB', icon: 'cards', route: 'Home' },
  { key: 'mydecks', label: 'My Decks', icon: 'card-multiple', route: 'MyDecks' },
  { key: 'hotdecks', label: 'Hot Decks', icon: 'fire', route: 'HotDecks' },
  { key: 'collection', label: 'Collection', icon: 'folder-star', route: 'Collection' },
  { key: 'markets', label: 'Markets', icon: 'chart-line', route: 'Markets' },
  { key: 'sets', label: 'Sets', icon: 'package-variant-closed', route: 'Sets' },
  { key: 'rules', label: 'Rules', icon: 'book-open-variant', route: 'Rules' },
];

interface LeftDrawerContentProps {
  closeDrawer: () => void;
}

export function LeftDrawerContent({ closeDrawer }: LeftDrawerContentProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [activeRoute, setActiveRoute] = React.useState('Home');

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    navigation.navigate(route as never);
    closeDrawer();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header/Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={36}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            SWUDB
          </Text>
        </View>
        <Text variant="bodySmall" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Star Wars: Unlimited Database
        </Text>
      </View>

      {/* Navigation Items */}
      <Drawer.Section style={styles.section}>
        {navItems.map((item) => (
          <Drawer.Item
            key={item.key}
            label={item.label}
            icon={({ size, color }) => (
              <MaterialCommunityIcons name={item.icon} size={size} color={color} />
            )}
            active={activeRoute === item.route}
            onPress={() => handleNavigation(item.route)}
            style={styles.drawerItem}
          />
        ))}
      </Drawer.Section>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Data from swudb.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 4,
    marginLeft: 48,
  },
  section: {
    marginTop: 8,
  },
  drawerItem: {
    marginHorizontal: 8,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    marginTop: 'auto',
  },
});

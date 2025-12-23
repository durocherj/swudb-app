import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer, Text, useTheme, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

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
  { key: 'collection', label: 'Collection', icon: 'folder-star', route: 'Collection' },
  { key: 'markets', label: 'Markets', icon: 'chart-line', route: 'Markets' },
];

interface LeftDrawerContentProps {
  closeDrawer: () => void;
}

export function LeftDrawerContent({ closeDrawer }: LeftDrawerContentProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isLoggedIn } = useAuth();
  const [activeRoute, setActiveRoute] = React.useState('Home');

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    navigation.navigate(route as never);
    closeDrawer();
  };

  const handleAccountPress = () => {
    navigation.navigate('Account' as never);
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

      {/* User Account Section */}
      <View style={styles.accountSection}>
        {isLoggedIn && user ? (
          <Drawer.Item
            label={user.userName}
            icon={({ size }) => (
              <Avatar.Text
                size={size + 8}
                label={user.userName?.substring(0, 2).toUpperCase() || '??'}
                style={{ backgroundColor: theme.colors.primary }}
                labelStyle={{ fontSize: size * 0.5 }}
              />
            )}
            onPress={handleAccountPress}
            style={styles.accountItem}
          />
        ) : (
          <Drawer.Item
            label="Sign In"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="login" size={size} color={color} />
            )}
            onPress={handleAccountPress}
            style={styles.accountItem}
          />
        )}
      </View>

      <Divider style={{ marginHorizontal: 16 }} />

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
  accountSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  accountItem: {
    marginHorizontal: 8,
    borderRadius: 8,
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

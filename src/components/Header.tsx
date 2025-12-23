import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions, ScrollView } from 'react-native';
import { Appbar, useTheme, Badge, Text, Drawer, Avatar, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFilters, useAuth } from '../context';
import { RightDrawerContent } from './RightDrawerContent';

interface HeaderProps {
  title: string;
  showMenuButton?: boolean;
  showFilterButton?: boolean;
  showBackButton?: boolean;
  rightActions?: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 300);
const FILTER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 340);

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

export function Header({
  title,
  showMenuButton = true,
  showFilterButton = true,
  showBackButton = false,
  rightActions,
}: HeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { hasActiveFilters } = useFilters();
  const { user, isLoggedIn } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const handleNavigation = (route: string) => {
    setMenuVisible(false);
    navigation.navigate(route as never);
  };

  const handleAccountPress = () => {
    setMenuVisible(false);
    navigation.navigate('Account' as never);
  };

  return (
    <>
      <View style={{ paddingTop: insets.top, backgroundColor: theme.colors.surface }}>
        <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]} elevated>
          {showBackButton ? (
            <Appbar.BackAction onPress={goBack} iconColor={theme.colors.onSurface} />
          ) : showMenuButton ? (
            <Appbar.Action
              icon="menu"
              onPress={() => setMenuVisible(true)}
              iconColor={theme.colors.onSurface}
            />
          ) : null}

          <Appbar.Content
            title={title}
            titleStyle={[styles.title, { color: theme.colors.onSurface }]}
          />

          {rightActions}

          {showFilterButton && (
            <View>
              <Appbar.Action
                icon="filter-variant"
                onPress={() => setFilterVisible(true)}
                iconColor={hasActiveFilters ? theme.colors.primary : theme.colors.onSurface}
              />
              {hasActiveFilters && (
                <Badge
                  size={8}
                  style={[styles.badge, { backgroundColor: theme.colors.primary }]}
                />
              )}
            </View>
          )}
        </Appbar.Header>
      </View>

      {/* Navigation Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setMenuVisible(false)}
        >
          <Pressable 
            style={[styles.menuPanel, { backgroundColor: theme.colors.surface, width: MENU_WIDTH }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView contentContainerStyle={styles.menuScrollContent}>
              {/* Menu Header */}
              <View style={styles.menuHeader}>
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text variant="headlineSmall" style={[styles.menuTitle, { color: theme.colors.primary }]}>
                    SWUDB
                  </Text>
                </View>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Star Wars: Unlimited Database
                </Text>
              </View>

              {/* Account / Sign In */}
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
                    style={styles.menuItem}
                  />
                ) : (
                  <Drawer.Item
                    label="Sign In"
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons name="login" size={size} color={color} />
                    )}
                    onPress={handleAccountPress}
                    style={styles.menuItem}
                  />
                )}
              </View>
              
              <Divider style={{ marginHorizontal: 16 }} />

              {/* Navigation Items */}
              <Drawer.Section style={styles.menuSection}>
                {navItems.map((item) => (
                  <Drawer.Item
                    key={item.key}
                    label={item.label}
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons name={item.icon} size={size} color={color} />
                    )}
                    active={title === item.label || (title === 'SWUDB' && item.key === 'home')}
                    onPress={() => handleNavigation(item.route)}
                    style={styles.menuItem}
                  />
                ))}
              </Drawer.Section>

              {/* Footer */}
              <View style={styles.menuFooter}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Data from swudb.com
                </Text>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable 
          style={styles.filterOverlay} 
          onPress={() => setFilterVisible(false)}
        >
          <Pressable 
            style={[styles.filterPanel, { backgroundColor: theme.colors.surface, width: FILTER_WIDTH }]}
            onPress={(e) => e.stopPropagation()}
          >
            <RightDrawerContent closeDrawer={() => setFilterVisible(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  title: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  menuPanel: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuScrollContent: {
    flexGrow: 1,
  },
  menuHeader: {
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
    marginBottom: 4,
  },
  menuTitle: {
    fontWeight: '700',
    letterSpacing: 2,
  },
  accountSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuSection: {
    marginTop: 8,
  },
  menuItem: {
    marginHorizontal: 8,
    borderRadius: 8,
  },
  menuFooter: {
    padding: 20,
    marginTop: 'auto',
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  filterPanel: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});

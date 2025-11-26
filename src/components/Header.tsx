import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import { Appbar, useTheme, Badge } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useFilters } from '../context';
import { RightDrawerContent } from './RightDrawerContent';

interface HeaderProps {
  title: string;
  showMenuButton?: boolean;
  showFilterButton?: boolean;
  showBackButton?: boolean;
  rightActions?: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FILTER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 340);

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
  const [filterVisible, setFilterVisible] = useState(false);

  const openLeftDrawer = () => {
    // Navigate up to the left drawer and open it
    try {
      const parent = navigation.getParent();
      if (parent) {
        const grandParent = parent.getParent();
        if (grandParent) {
          grandParent.dispatch(DrawerActions.openDrawer());
        } else {
          parent.dispatch(DrawerActions.openDrawer());
        }
      }
    } catch (e) {
      console.log('Could not open drawer');
    }
  };

  const goBack = () => {
    navigation.goBack();
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
              onPress={openLeftDrawer}
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

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
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

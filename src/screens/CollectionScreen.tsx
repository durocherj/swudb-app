import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  SegmentedButtons,
  Chip,
  Button,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Header, CardTile, EmptyState } from '../components';
import { useCollection } from '../context';
import { CollectionCard, Card } from '../types';
import { MainStackParamList } from '../types/navigation';

type CollectionNavProp = NativeStackNavigationProp<MainStackParamList, 'Collection'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ViewMode = 'all' | 'owned' | 'wishlist';

export function CollectionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<CollectionNavProp>();
  const { collection, clearCollection, updateQuantity, toggleWishlist } = useCollection();

  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [clearDialogVisible, setClearDialogVisible] = useState(false);

  const filteredCards = useMemo(() => {
    switch (viewMode) {
      case 'owned':
        return collection.cards.filter((c) => c.quantity > 0);
      case 'wishlist':
        return collection.cards.filter((c) => c.wishlisted);
      default:
        return collection.cards;
    }
  }, [collection.cards, viewMode]);

  const stats = useMemo(() => {
    const owned = collection.cards.filter((c) => c.quantity > 0);
    const totalCards = owned.reduce((sum, c) => sum + c.quantity, 0);
    const uniqueCards = owned.length;
    const wishlistCount = collection.cards.filter((c) => c.wishlisted).length;
    return { totalCards, uniqueCards, wishlistCount, totalValue: collection.totalValue };
  }, [collection]);

  const handleCardPress = (card: Card) => {
    navigation.navigate('CardDetails', { card });
  };

  const handleClearCollection = () => {
    clearCollection();
    setClearDialogVisible(false);
  };

  const renderCard = ({ item }: { item: CollectionCard }) => (
    <CardTile
      card={item.card}
      size="medium"
      showPrice
      quantity={item.quantity}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <Surface style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="cards" size={24} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {stats.totalCards}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
            Total Cards
          </Text>
        </Surface>
        <Surface style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <MaterialCommunityIcons name="card-multiple" size={24} color={theme.colors.secondary} />
          <Text variant="headlineSmall" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
            {stats.uniqueCards}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
            Unique
          </Text>
        </Surface>
        <Surface style={[styles.statCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <MaterialCommunityIcons name="heart" size={24} color={theme.colors.tertiary} />
          <Text variant="headlineSmall" style={{ color: theme.colors.tertiary, fontWeight: '700' }}>
            {stats.wishlistCount}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
            Wishlist
          </Text>
        </Surface>
      </View>

      {/* Total Value */}
      <Surface style={[styles.valueCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.valueContent}>
          <MaterialCommunityIcons name="currency-usd" size={28} color={theme.colors.primary} />
          <View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Estimated Collection Value
            </Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              ${stats.totalValue.toFixed(2)}
            </Text>
          </View>
        </View>
      </Surface>

      {/* View Mode Selector */}
      <SegmentedButtons
        value={viewMode}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        buttons={[
          { value: 'all', label: 'All', icon: 'view-grid' },
          { value: 'owned', label: 'Owned', icon: 'check-circle' },
          { value: 'wishlist', label: 'Wishlist', icon: 'heart' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Clear Button */}
      {collection.cards.length > 0 && (
        <Button
          mode="text"
          onPress={() => setClearDialogVisible(true)}
          textColor={theme.colors.error}
          icon="delete"
          style={styles.clearButton}
        >
          Clear Collection
        </Button>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Collection" showFilterButton={false} />

      {collection.cards.length === 0 ? (
        <>
          {renderHeader()}
          <EmptyState
            icon="folder-star-outline"
            title="Your Collection is Empty"
            description="Start adding cards to track your collection"
            actionLabel="Browse Cards"
            onAction={() => navigation.navigate('Home' as never)}
          />
        </>
      ) : filteredCards.length === 0 ? (
        <>
          {renderHeader()}
          <EmptyState
            icon={viewMode === 'wishlist' ? 'heart-outline' : 'cards-outline'}
            title={viewMode === 'wishlist' ? 'No Wishlisted Cards' : 'No Owned Cards'}
            description={
              viewMode === 'wishlist'
                ? 'Tap the heart on cards to add them to your wishlist'
                : 'Add cards to your collection from the card details'
            }
          />
        </>
      ) : (
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.card.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={clearDialogVisible}
          onDismiss={() => setClearDialogVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Clear Collection</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Are you sure you want to clear your entire collection? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleClearCollection} textColor={theme.colors.error}>
              Clear All
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  valueCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  valueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});



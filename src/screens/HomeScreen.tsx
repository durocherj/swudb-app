import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Searchbar, Chip, useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, CardTile, EmptyState } from '../components';
import { cardsApi } from '../api';
import { Card, PaginatedResponse, CardType } from '../types';
import { MainStackParamList } from '../types/navigation';
import { useFilters, useDecks } from '../context';
import { aspectColors } from '../utils/theme';

type HomeScreenNavProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<MainStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters();
  const { setLeader, setBase, addCardToDeck } = useDecks();

  // Get navigation params for filtering
  const filterType = route.params?.filterType;
  const selectForDeck = route.params?.selectForDeck;

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Build effective filters including navigation params
  const effectiveFilters = useCallback(() => {
    const baseFilters = { ...filters, search: searchQuery };
    if (filterType) {
      return { ...baseFilters, types: [filterType] };
    }
    return baseFilters;
  }, [filters, searchQuery, filterType]);

  const loadCards = useCallback(async (pageNum: number, refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    }

    try {
      const response: PaginatedResponse<Card> = await cardsApi.searchCards(
        effectiveFilters(),
        pageNum,
        20
      );

      if (refresh || pageNum === 1) {
        setCards(response.data);
      } else {
        setCards((prev) => [...prev, ...response.data]);
      }

      setHasMore(pageNum < response.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [effectiveFilters]);

  useEffect(() => {
    loadCards(1);
  }, [filters, filterType]);

  const handleSearch = () => {
    updateFilter('search', searchQuery);
  };

  const handleRefresh = () => {
    loadCards(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCards(page + 1);
    }
  };

  const handleCardPress = (card: Card) => {
    // If we're selecting for a deck, handle the selection
    if (selectForDeck) {
      if (filterType === 'Leader' && card.type === 'Leader') {
        setLeader(selectForDeck, card);
        navigation.goBack();
        return;
      }
      if (filterType === 'Base' && card.type === 'Base') {
        setBase(selectForDeck, card);
        navigation.goBack();
        return;
      }
      // For regular cards, add to deck
      if (!filterType || (filterType !== 'Leader' && filterType !== 'Base')) {
        addCardToDeck(selectForDeck, card);
        // Don't navigate back, allow selecting more cards
        return;
      }
    }
    // Normal behavior - show card details
    navigation.navigate('CardDetails', { card });
  };

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case 'search':
        setSearchQuery('');
        updateFilter('search', '');
        break;
      case 'type':
        updateFilter('types', filters.types.filter((t) => t !== value));
        break;
      case 'aspect':
        updateFilter('aspects', filters.aspects.filter((a) => a !== value));
        break;
      case 'rarity':
        updateFilter('rarities', filters.rarities.filter((r) => r !== value));
        break;
      case 'all':
        setSearchQuery('');
        resetFilters();
        break;
    }
  };

  const renderCard = ({ item }: { item: Card }) => (
    <CardTile card={item} onPress={handleCardPress} size="medium" showPrice />
  );

  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          {filters.search && (
            <Chip
              mode="outlined"
              onClose={() => removeFilter('search')}
              style={styles.filterChip}
            >
              "{filters.search}"
            </Chip>
          )}
          {filters.types.map((type) => (
            <Chip
              key={type}
              mode="outlined"
              onClose={() => removeFilter('type', type)}
              style={styles.filterChip}
            >
              {type}
            </Chip>
          ))}
          {filters.aspects.map((aspect) => (
            <Chip
              key={aspect}
              mode="outlined"
              onClose={() => removeFilter('aspect', aspect)}
              style={[styles.filterChip, { borderColor: aspectColors[aspect] }]}
              textStyle={{ color: aspectColors[aspect] }}
            >
              {aspect}
            </Chip>
          ))}
          {filters.rarities.map((rarity) => (
            <Chip
              key={rarity}
              mode="outlined"
              onClose={() => removeFilter('rarity', rarity)}
              style={styles.filterChip}
            >
              {rarity}
            </Chip>
          ))}
          <Chip
            mode="flat"
            onPress={() => removeFilter('all')}
            icon="close"
            style={styles.clearChip}
          >
            Clear All
          </Chip>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  // Determine header title based on selection mode
  const getHeaderTitle = () => {
    if (filterType === 'Leader') return 'Select Leader';
    if (filterType === 'Base') return 'Select Base';
    if (selectForDeck) return 'Add Cards';
    return 'SWUDB';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={getHeaderTitle()} 
        showBackButton={!!selectForDeck}
        showFilterButton={!filterType} // Hide filter when already filtering by type
      />

      {/* Selection Mode Banner */}
      {filterType && (
        <View style={[styles.selectionBanner, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Tap a {filterType.toLowerCase()} to select it
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={filterType ? `Search ${filterType.toLowerCase()}s...` : "Search cards..."}
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}
          >
            Loading cards...
          </Text>
        </View>
      ) : cards.length === 0 ? (
        <EmptyState
          icon="cards-outline"
          title="No Cards Found"
          description="Try adjusting your filters or search query"
          actionLabel="Clear Filters"
          onAction={() => removeFilter('all')}
        />
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectionBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
  },
  filtersContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  filterChip: {
    height: 32,
  },
  clearChip: {
    height: 32,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});



import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, ProgressBar, Surface } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, CardTile, EmptyState } from '../components';
import { cardsApi } from '../api';
import { Card, PaginatedResponse } from '../types';
import { MainStackParamList } from '../types/navigation';
import { useCollection } from '../context';

type SetDetailsRouteProp = RouteProp<MainStackParamList, 'SetDetails'>;
type SetDetailsNavProp = NativeStackNavigationProp<MainStackParamList, 'SetDetails'>;

const NUM_COLUMNS = 2;

export function SetDetailsScreen() {
  const theme = useTheme();
  const route = useRoute<SetDetailsRouteProp>();
  const navigation = useNavigation<SetDetailsNavProp>();
  const { setCode, setName } = route.params;
  const { collection, isInCollection } = useCollection();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadCards = useCallback(async (pageNum: number, refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    }

    try {
      const response: PaginatedResponse<Card> = await cardsApi.getCardsBySet(setCode, pageNum, 20);

      if (refresh || pageNum === 1) {
        setCards(response.data);
      } else {
        setCards((prev) => [...prev, ...response.data]);
      }

      setHasMore(pageNum < response.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load set cards:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setCode]);

  useEffect(() => {
    loadCards(1);
  }, [loadCards]);

  const handleRefresh = () => {
    loadCards(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCards(page + 1);
    }
  };

  const handleCardPress = (card: Card) => {
    navigation.navigate('CardDetails', { card });
  };

  // Calculate collection stats for this set
  const ownedCards = cards.filter((c) => isInCollection(c.id));
  const completion = cards.length > 0 ? ownedCards.length / cards.length : 0;

  const renderCard = ({ item }: { item: Card }) => {
    const owned = isInCollection(item.id);
    return (
      <View style={owned ? styles.ownedCard : undefined}>
        <CardTile card={item} onPress={handleCardPress} size="medium" showPrice />
      </View>
    );
  };

  const renderHeader = () => (
    <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
        {setName}
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {cards.length} cards in set
      </Text>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            Collected: {ownedCards.length}/{cards.length}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            {(completion * 100).toFixed(0)}%
          </Text>
        </View>
        <ProgressBar progress={completion} color={theme.colors.primary} style={styles.progressBar} />
      </View>
    </Surface>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={setCode} showBackButton showFilterButton />

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
        <EmptyState icon="cards-outline" title="No Cards Found" description="This set appears to be empty" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  headerCard: {
    margin: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  progressSection: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  ownedCard: {
    opacity: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});



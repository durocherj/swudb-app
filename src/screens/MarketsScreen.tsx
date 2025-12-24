import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
  Searchbar,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Header, CardTile } from '../components';
import { cardsApi, pricesApi } from '../api';
import { Card, PriceInfo } from '../types';
import { MainStackParamList } from '../types/navigation';
import { rarityColors } from '../utils/theme';

type MarketsNavProp = NativeStackNavigationProp<MainStackParamList, 'Markets'>;

interface PricedCard extends Card {
  price: PriceInfo;
}

export function MarketsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<MarketsNavProp>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [topCards, setTopCards] = useState<PricedCard[]>([]);

  const loadMarketData = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Load random cards and add prices
      const cards = await cardsApi.getRandomCards(10);
      const prices = await pricesApi.getBulkPrices(cards.map((c) => c.id));
      
      const pricedCards: PricedCard[] = cards
        .map((card) => ({
          ...card,
          price: prices[card.id] || { market: 0, low: 0, mid: 0, high: 0, currency: 'USD', lastUpdated: '' },
        }))
        .filter((c) => c.price.market > 0)
        .sort((a, b) => b.price.market - a.price.market);

      setTopCards(pricedCards);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await cardsApi.searchCards({ search: searchQuery }, 1, 10);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCardPress = (card: Card) => {
    navigation.navigate('CardDetails', { card });
  };

  const handleRefresh = () => {
    loadMarketData(true);
  };

  const renderPriceCard = ({ item }: { item: PricedCard }) => (
    <Surface
      style={[styles.priceCard, { backgroundColor: theme.colors.surfaceVariant }]}
      onTouchEnd={() => handleCardPress(item)}
    >
      <View style={styles.priceCardContent}>
        <View style={styles.priceCardLeft}>
          <Text
            variant="titleMedium"
            numberOfLines={1}
            style={{ color: theme.colors.onSurface, flex: 1 }}
          >
            {item.name}
          </Text>
          <View style={styles.priceCardMeta}>
            <Text
              variant="labelSmall"
              style={[styles.rarityText, { color: rarityColors[item.rarity] }]}
            >
              {item.rarity}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.setCode} #{item.cardNumber}
            </Text>
          </View>
        </View>
        <View style={styles.priceCardRight}>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            ${item.price.market.toFixed(2)}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Market
          </Text>
        </View>
      </View>
    </Surface>
  );

  const renderSearchResult = ({ item }: { item: Card }) => (
    <CardTile card={item} size="small" showPrice />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Markets" showFilterButton={false} />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search card prices..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
            inputStyle={{ color: theme.colors.onSurface }}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Search Results
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Market Overview */}
        <View style={styles.section}>
          <Surface style={[styles.overviewCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={styles.overviewHeader}>
              <MaterialCommunityIcons name="chart-line" size={32} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                  Market Overview
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Star Wars: Unlimited TCG
                </Text>
              </View>
            </View>
            <Divider style={{ marginVertical: 12 }} />
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
                  $45.50
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Avg Legendary
                </Text>
              </View>
              <View style={styles.overviewStat}>
                <Text variant="headlineSmall" style={{ color: theme.colors.secondary }}>
                  $2.25
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Avg Rare
                </Text>
              </View>
              <View style={styles.overviewStat}>
                <Text variant="headlineSmall" style={{ color: theme.colors.tertiary }}>
                  $0.35
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Avg Common
                </Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* Top Priced Cards */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Top Priced Cards
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            topCards.map((card) => (
              <View key={card.id}>{renderPriceCard({ item: card })}</View>
            ))
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
            Prices are estimates based on market data and may not reflect actual trading values.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 12,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  priceCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  priceCardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  priceCardLeft: {
    flex: 1,
    gap: 4,
  },
  priceCardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  rarityText: {
    fontWeight: '600',
  },
  priceCardRight: {
    alignItems: 'flex-end',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    marginBottom: 20,
  },
});



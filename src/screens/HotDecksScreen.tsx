import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Searchbar,
  useTheme,
  ActivityIndicator,
  Text,
  Snackbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, DeckCard, EmptyState } from '../components';
import { decksApi } from '../api';
import { Deck, PaginatedResponse } from '../types';
import { MainStackParamList } from '../types/navigation';
import { useDecks } from '../context';

type HotDecksNavProp = NativeStackNavigationProp<MainStackParamList, 'HotDecks'>;

export function HotDecksScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HotDecksNavProp>();
  const { duplicateDeck } = useDecks();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadDecks = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      let response: PaginatedResponse<Deck>;
      if (searchQuery) {
        response = await decksApi.searchDecks(searchQuery);
      } else {
        response = await decksApi.getHotDecks();
      }
      setDecks(response.data);
    } catch (error) {
      console.error('Failed to load hot decks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadDecks();
  }, [searchQuery]);

  const handleRefresh = () => {
    loadDecks(true);
  };

  const handleDeckPress = (deck: Deck) => {
    // For community decks, we'd show a read-only view
    // For now, copy to user's decks and open editor
    const copied = duplicateDeck(deck, deck.name);
    setSnackbarMessage(`Copied "${deck.name}" to My Decks`);
    setSnackbarVisible(true);
    navigation.navigate('DeckEditor', { deck: copied });
  };

  const handleCopyDeck = (deck: Deck) => {
    duplicateDeck(deck);
    setSnackbarMessage(`Copied "${deck.name}" to My Decks`);
    setSnackbarVisible(true);
  };

  const renderDeck = ({ item }: { item: Deck }) => (
    <DeckCard
      deck={item}
      onPress={handleDeckPress}
      cardCount={item.cards.reduce((sum, dc) => sum + dc.quantity, 0)}
      showActions={false}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Hot Decks" showFilterButton={false} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search community decks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}
          >
            Loading hot decks...
          </Text>
        </View>
      ) : decks.length === 0 ? (
        <EmptyState
          icon="fire"
          title="No Decks Found"
          description={searchQuery ? 'Try a different search term' : 'Check back later for popular decks'}
        />
      ) : (
        <FlatList
          data={decks}
          renderItem={renderDeck}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
});



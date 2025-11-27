import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import {
  FAB,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  Button,
  Text,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Header, DeckCard, EmptyState } from '../components';
import { useDecks, useAuth } from '../context';
import { decksApi } from '../api';
import { Deck } from '../types';
import { MainStackParamList } from '../types/navigation';

type MyDecksNavProp = NativeStackNavigationProp<MainStackParamList, 'MyDecks'>;

export function MyDecksScreen() {
  const theme = useTheme();
  const navigation = useNavigation<MyDecksNavProp>();
  const { decks: localDecks, createDeck, deleteDeck, getDeckCardCount } = useDecks();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  const [swudbDecks, setSwudbDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  // Fetch SWUDB decks when logged in
  const fetchSwudbDecks = useCallback(async (refresh = false) => {
    if (!isLoggedIn || !user?.userName) return;

    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const decks = await decksApi.getUserDecks(user.userName);
      setSwudbDecks(decks);
    } catch (error) {
      console.error('Failed to fetch SWUDB decks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn, user?.userName]);

  useEffect(() => {
    if (isLoggedIn && user?.userName) {
      fetchSwudbDecks();
    } else {
      setSwudbDecks([]);
    }
  }, [isLoggedIn, user?.userName]);

  const handleRefresh = () => {
    fetchSwudbDecks(true);
  };

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      const deck = createDeck(newDeckName.trim(), newDeckDescription.trim() || undefined);
      setCreateDialogVisible(false);
      setNewDeckName('');
      setNewDeckDescription('');
      navigation.navigate('DeckEditor', { deck });
    }
  };

  const handleDeckPress = (deck: Deck) => {
    if (deck.isSwudbDeck) {
      // For SWUDB decks, we can't edit them fully yet (API limitation)
      // For now, show a message or open in browser
      // TODO: Implement full deck viewing when API is available
    } else {
      navigation.navigate('DeckEditor', { deck });
    }
  };

  const handleEditDeck = (deck: Deck) => {
    if (!deck.isSwudbDeck) {
      navigation.navigate('DeckEditor', { deck });
    }
  };

  const handleDeleteDeck = (deck: Deck) => {
    if (!deck.isSwudbDeck) {
      setSelectedDeck(deck);
      setDeleteDialogVisible(true);
    }
  };

  const confirmDelete = () => {
    if (selectedDeck) {
      deleteDeck(selectedDeck.id);
      setDeleteDialogVisible(false);
      setSelectedDeck(null);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Account' as never);
  };

  // Render SWUDB deck item
  const renderSwudbDeck = ({ item }: { item: Deck }) => (
    <Surface style={[styles.swudbDeckCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={2}>
      <View style={styles.swudbDeckContent}>
        {/* Leader Artwork Thumbnail - cropped to show character art */}
        <View style={styles.leaderArtContainer}>
          {item.leaderImageUrl ? (
            <Image
              source={{ uri: item.leaderImageUrl }}
              style={styles.leaderArtwork}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderArt, { backgroundColor: theme.colors.outline }]}>
              <MaterialCommunityIcons name="account-star" size={28} color={theme.colors.onSurfaceVariant} />
            </View>
          )}
        </View>

        {/* Deck Info */}
        <View style={styles.deckInfo}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            by {item.author}
          </Text>
          <View style={styles.deckMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="heart" size={14} color={theme.colors.tertiary} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                {item.likes || 0}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                SWUDB
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Surface>
  );

  // Render local deck item
  const renderLocalDeck = ({ item }: { item: Deck }) => (
    <DeckCard
      deck={item}
      onPress={handleDeckPress}
      onEdit={handleEditDeck}
      onDelete={handleDeleteDeck}
      cardCount={getDeckCardCount(item)}
    />
  );

  // Show loading while checking auth
  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="My Decks" showFilterButton={false} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="My Decks" showFilterButton={false} />
        <View style={styles.centerContainer}>
          <Surface style={[styles.loginPrompt, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <MaterialCommunityIcons
              name="account-lock"
              size={64}
              color={theme.colors.primary}
              style={styles.loginIcon}
            />
            <Text variant="headlineSmall" style={[styles.loginTitle, { color: theme.colors.onSurface }]}>
              Sign In Required
            </Text>
            <Text variant="bodyMedium" style={[styles.loginText, { color: theme.colors.onSurfaceVariant }]}>
              Sign in with your SWUDB account to view and manage your decks.
            </Text>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              icon="login"
            >
              Sign In to SWUDB
            </Button>
          </Surface>
        </View>
      </View>
    );
  }

  // Combine local and SWUDB decks
  const allDecks = [...swudbDecks, ...localDecks];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="My Decks" showFilterButton={false} />

      {loading && swudbDecks.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
            Loading your decks...
          </Text>
        </View>
      ) : allDecks.length === 0 ? (
        <EmptyState
          icon="card-multiple-outline"
          title="No Decks Yet"
          description="Your SWUDB decks will appear here. You can also create local decks."
          actionLabel="Create Local Deck"
          onAction={() => setCreateDialogVisible(true)}
        />
      ) : (
        <FlatList
          data={allDecks}
          renderItem={({ item }) => 
            item.isSwudbDeck ? renderSwudbDeck({ item }) : renderLocalDeck({ item })
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListHeaderComponent={
            swudbDecks.length > 0 ? (
              <View style={styles.sectionHeader}>
                <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
                  SWUDB Decks ({swudbDecks.length})
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setCreateDialogVisible(true)}
      />

      {/* Create Deck Dialog */}
      <Portal>
        <Dialog
          visible={createDialogVisible}
          onDismiss={() => setCreateDialogVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Create Local Deck</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
              This creates a deck stored on your device. To sync with SWUDB, create decks on swudb.com.
            </Text>
            <TextInput
              label="Deck Name"
              value={newDeckName}
              onChangeText={setNewDeckName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Description (optional)"
              value={newDeckDescription}
              onChangeText={setNewDeckDescription}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateDeck} disabled={!newDeckName.trim()}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Delete Deck</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Are you sure you want to delete "{selectedDeck?.name}"? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              Delete
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginPrompt: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 320,
  },
  loginIcon: {
    marginBottom: 16,
  },
  loginTitle: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  swudbDeckCard: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swudbDeckContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  leaderArtContainer: {
    width: 50,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  leaderArtwork: {
    width: 100,
    height: 70,
    marginLeft: 0,
    marginTop: 0,
  },
  placeholderArt: {
    width: 50,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckInfo: {
    flex: 1,
  },
  deckMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 12,
  },
});

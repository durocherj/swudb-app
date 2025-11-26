import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  FAB,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, DeckCard, EmptyState } from '../components';
import { useDecks } from '../context';
import { Deck } from '../types';
import { MainStackParamList } from '../types/navigation';

type MyDecksNavProp = NativeStackNavigationProp<MainStackParamList, 'MyDecks'>;

export function MyDecksScreen() {
  const theme = useTheme();
  const navigation = useNavigation<MyDecksNavProp>();
  const { decks, createDeck, deleteDeck, getDeckCardCount } = useDecks();

  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

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
    navigation.navigate('DeckEditor', { deck });
  };

  const handleEditDeck = (deck: Deck) => {
    navigation.navigate('DeckEditor', { deck });
  };

  const handleDeleteDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (selectedDeck) {
      deleteDeck(selectedDeck.id);
      setDeleteDialogVisible(false);
      setSelectedDeck(null);
    }
  };

  const renderDeck = ({ item }: { item: Deck }) => (
    <DeckCard
      deck={item}
      onPress={handleDeckPress}
      onEdit={handleEditDeck}
      onDelete={handleDeleteDeck}
      cardCount={getDeckCardCount(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="My Decks" showFilterButton={false} />

      {decks.length === 0 ? (
        <EmptyState
          icon="card-multiple-outline"
          title="No Decks Yet"
          description="Create your first deck to start building"
          actionLabel="Create Deck"
          onAction={() => setCreateDialogVisible(true)}
        />
      ) : (
        <FlatList
          data={decks}
          renderItem={renderDeck}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
          <Dialog.Title>Create New Deck</Dialog.Title>
          <Dialog.Content>
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
            <Button
              mode="text"
              textColor={theme.colors.onSurfaceVariant}
              style={{ alignItems: 'flex-start' }}
            >
              Are you sure you want to delete "{selectedDeck?.name}"? This action cannot be undone.
            </Button>
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
  listContent: {
    paddingVertical: 12,
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



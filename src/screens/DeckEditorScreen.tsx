import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Share,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  IconButton,
  Button,
  Chip,
  TextInput,
  Portal,
  Dialog,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header, CardTile } from '../components';
import { useDecks } from '../context';
import { Deck, DeckCard as DeckCardType, Card } from '../types';
import { MainStackParamList } from '../types/navigation';
import { DECK_LIMITS } from '../utils/constants';
import { aspectColors } from '../utils/theme';

type DeckEditorRouteProp = RouteProp<MainStackParamList, 'DeckEditor'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function DeckEditorScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DeckEditorRouteProp>();
  const insets = useSafeAreaInsets();
  const { decks, updateDeck, addCardToDeck, removeCardFromDeck, getDeckCardCount, isDeckValid, exportDeck } = useDecks();

  const [deck, setDeck] = useState<Deck | null>(route.params?.deck || null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showStats, setShowStats] = useState(false);

  // Keep deck in sync with context
  useEffect(() => {
    if (deck) {
      const updated = decks.find((d) => d.id === deck.id);
      if (updated) {
        setDeck(updated);
      }
    }
  }, [decks]);

  if (!deck) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Deck Editor" showBackButton showFilterButton={false} />
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            No deck selected
          </Text>
        </View>
      </View>
    );
  }

  const cardCount = getDeckCardCount(deck);
  const validation = isDeckValid(deck);
  const progress = cardCount / DECK_LIMITS.maxCards;

  // Group cards by type
  const cardsByType = deck.cards.reduce((acc, dc) => {
    const type = dc.card.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(dc);
    return acc;
  }, {} as Record<string, DeckCardType[]>);

  // Calculate cost curve
  const costCurve = deck.cards.reduce((acc, dc) => {
    const cost = Math.min(dc.card.cost || 0, 7);
    acc[cost] = (acc[cost] || 0) + dc.quantity;
    return acc;
  }, {} as Record<number, number>);

  const maxCostCount = Math.max(...Object.values(costCurve), 1);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updateDeck(deck.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });
      setEditing(false);
    }
  };

  const handleShare = async () => {
    const deckList = exportDeck(deck);
    try {
      await Share.share({
        message: deckList,
        title: deck.name,
      });
    } catch (error) {
      console.error('Error sharing deck:', error);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    removeCardFromDeck(deck.id, cardId);
  };

  const handleAddCard = (card: Card) => {
    addCardToDeck(deck.id, card);
  };


  const handleAddCards = () => {
    navigation.navigate('Home', { selectForDeck: deck.id } as never);
  };

  const handleAddLeader = () => {
    navigation.navigate('Home', { filterType: 'Leader', selectForDeck: deck.id } as never);
  };

  const handleAddBase = () => {
    navigation.navigate('Home', { filterType: 'Base', selectForDeck: deck.id } as never);
  };

  const renderDeckCard = ({ item }: { item: DeckCardType }) => (
    <CardTile
      card={item.card}
      size="medium"
      showPrice={false}
      quantity={item.quantity}
      showDeckControls={true}
      onAddCard={handleAddCard}
      onRemoveCard={(card) => handleRemoveCard(card.id)}
      currentQuantity={item.quantity}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title={deck.name}
        showBackButton
        showFilterButton={false}
        rightActions={
          <>
            <IconButton
              icon="pencil"
              onPress={() => {
                setEditName(deck.name);
                setEditDescription(deck.description || '');
                setEditing(true);
              }}
              iconColor={theme.colors.onSurface}
            />
            <IconButton icon="share-variant" onPress={handleShare} iconColor={theme.colors.onSurface} />
          </>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Deck Stats Summary */}
        <Surface style={[styles.summarySection, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.summaryHeader}>
            <View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {cardCount}/{DECK_LIMITS.maxCards} Cards
              </Text>
              <ProgressBar
                progress={progress}
                color={validation.valid ? theme.colors.primary : theme.colors.error}
                style={styles.progressBar}
              />
            </View>
            <Button
              mode="text"
              onPress={() => setShowStats(!showStats)}
              icon={showStats ? 'chevron-up' : 'chevron-down'}
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Stats
            </Button>
          </View>

          {/* Validation Errors */}
          {!validation.valid && (
            <View style={styles.validationErrors}>
              {validation.errors.map((error, index) => (
                <View key={index} style={styles.errorItem}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text variant="bodySmall" style={{ color: theme.colors.error, flex: 1 }}>
                    {error}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Extended Stats */}
          {showStats && (
            <View style={styles.extendedStats}>
              <Divider style={{ marginVertical: 12 }} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                Cost Curve
              </Text>
              <View style={styles.costCurve}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((cost) => (
                  <View key={cost} style={styles.costBar}>
                    <View
                      style={[
                        styles.costBarFill,
                        {
                          height: ((costCurve[cost] || 0) / maxCostCount) * 60,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {cost === 7 ? '7+' : cost}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {costCurve[cost] || 0}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Surface>

        {/* Leader */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Leader
          </Text>
          {deck.leader ? (
            <Pressable onPress={handleAddLeader}>
              <Surface style={styles.leaderCardWithImage} elevation={2}>
                {/* Background Image */}
                <Image
                  source={{ uri: deck.leader.imageUrl }}
                  style={styles.leaderBackgroundImage}
                  resizeMode="cover"
                />
                {/* Text Overlay with semi-transparent background */}
                <View style={styles.leaderTextOverlay}>
                  <Text variant="titleMedium" style={styles.leaderNameText}>
                    {deck.leader.name}
                  </Text>
                  {deck.leader.subtitle && (
                    <Text variant="bodySmall" style={styles.leaderSubtitleText}>
                      {deck.leader.subtitle}
                    </Text>
                  )}
                </View>
              </Surface>
            </Pressable>
          ) : (
            <Button mode="outlined" onPress={handleAddLeader} icon="plus" style={styles.addButton}>
              Add Leader
            </Button>
          )}
        </View>

        {/* Base */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Base
          </Text>
          {deck.base ? (
            <Pressable onPress={handleAddBase}>
              <Surface style={styles.leaderCardWithImage} elevation={2}>
                {/* Background Image */}
                <Image
                  source={{ uri: deck.base.imageUrl }}
                  style={styles.baseBackgroundImage}
                  resizeMode="cover"
                />
                {/* Text Overlay with semi-transparent background */}
                <View style={styles.leaderTextOverlay}>
                  <Text variant="titleMedium" style={styles.leaderNameText}>
                    {deck.base.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.leaderSubtitleText}>
                    HP: {deck.base.hp}
                  </Text>
                </View>
              </Surface>
            </Pressable>
          ) : (
            <Button mode="outlined" onPress={handleAddBase} icon="plus" style={styles.addButton}>
              Add Base
            </Button>
          )}
        </View>

        {/* Main Deck Cards by Type */}
        {['Unit', 'Event', 'Upgrade'].map((type) =>
          cardsByType[type]?.length > 0 ? (
            <View key={type} style={styles.section}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                {type}s ({cardsByType[type].reduce((sum, dc) => sum + dc.quantity, 0)})
              </Text>
              <View style={styles.cardsGrid}>
                {cardsByType[type]
                  .sort((a, b) => (a.card.cost || 0) - (b.card.cost || 0))
                  .map((dc) => (
                    <View key={dc.card.id}>{renderDeckCard({ item: dc })}</View>
                  ))}
              </View>
            </View>
          ) : null
        )}

        {/* Add Cards Button */}
        <View style={styles.addCardsSection}>
          <Button mode="contained" onPress={handleAddCards} icon="plus" style={styles.addCardsButton}>
            Add Cards to Deck
          </Button>
        </View>
      </ScrollView>

      {/* Edit Dialog */}
      <Portal>
        <Dialog
          visible={editing}
          onDismiss={() => setEditing(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Edit Deck</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Deck Name"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={editDescription}
              onChangeText={setEditDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditing(false)}>Cancel</Button>
            <Button onPress={handleSaveEdit} disabled={!editName.trim()}>
              Save
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  summarySection: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    width: 150,
  },
  validationErrors: {
    marginTop: 12,
    gap: 4,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extendedStats: {
    marginTop: 4,
  },
  costCurve: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 20,
  },
  costBar: {
    alignItems: 'center',
    flex: 1,
  },
  costBarFill: {
    width: 24,
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 4,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  leaderCard: {
    borderRadius: 12,
    padding: 16,
  },
  leaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderCardWithImage: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 80,
    position: 'relative',
  },
  leaderBackgroundImage: {
    position: 'absolute',
    width: '200%',
    height: '400%',
    left: 0, // Keep left side visible where character art is
    top: '-25%', // Start above container to show full image
  },
  baseBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '300%',
    left: 0,
    top: '-25%', // Start above container to show full image
  },
  leaderTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leaderNameText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  leaderSubtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addButton: {
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  deckCardItem: {
    borderRadius: 8,
    marginBottom: 4,
  },
  deckCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  costBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckCardInfo: {
    flex: 1,
  },
  aspectDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  aspectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addCardsSection: {
    padding: 12,
    paddingBottom: 80, // Increased to prevent button from being hidden behind phone menu
  },
  addCardsButton: {
    borderRadius: 12,
  },
  input: {
    marginBottom: 12,
  },
});



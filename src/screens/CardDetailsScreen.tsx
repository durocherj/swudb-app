import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  Text,
  Button,
  Chip,
  Surface,
  useTheme,
  IconButton,
  Divider,
  Portal,
  Modal,
  Menu,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainStackParamList } from '../types/navigation';
import { useCollection, useDecks } from '../context';
import { pricesApi } from '../api';
import { PriceInfo, Deck } from '../types';
import { aspectColors, rarityColors } from '../utils/theme';

type CardDetailsRouteProp = RouteProp<MainStackParamList, 'CardDetails'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function CardDetailsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<CardDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { card } = route.params;

  const { addToCollection, removeFromCollection, toggleWishlist, isInCollection, isWishlisted, getQuantity } =
    useCollection();
  const { decks, addCardToDeck } = useDecks();

  const [price, setPrice] = useState<PriceInfo | null>(card.price || null);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [deckMenuVisible, setDeckMenuVisible] = useState(false);

  const quantity = getQuantity(card.id);
  const inCollection = isInCollection(card.id);
  const wishlisted = isWishlisted(card.id);

  useEffect(() => {
    loadPrice();
  }, [card.id]);

  const loadPrice = async () => {
    const priceData = await pricesApi.getCardPrice(card.id);
    if (priceData) {
      setPrice(priceData);
    }
  };

  const handleAddToCollection = () => {
    addToCollection(card, 1);
  };

  const handleRemoveFromCollection = () => {
    removeFromCollection(card.id, 1);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(card);
  };

  const handleAddToDeck = (deck: Deck) => {
    addCardToDeck(deck.id, card);
    setDeckMenuVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={theme.colors.onSurface}
          style={[styles.closeButton, { backgroundColor: theme.colors.surfaceVariant }]}
        />
        <IconButton
          icon={wishlisted ? 'heart' : 'heart-outline'}
          size={24}
          onPress={handleToggleWishlist}
          iconColor={wishlisted ? theme.colors.tertiary : theme.colors.onSurface}
          style={[styles.wishlistButton, { backgroundColor: theme.colors.surfaceVariant }]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Image */}
        <Pressable onPress={() => setImageZoomed(true)}>
          <Surface style={styles.imageContainer} elevation={4}>
            <Image
              source={{ uri: card.imageUrl }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </Surface>
        </Pressable>

        {/* Card Title */}
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={[styles.cardName, { color: theme.colors.onSurface }]}>
            {card.isUnique && card.subtitle ? (
              <>
                {card.name}, <Text style={styles.italicSubtitle}>{card.subtitle}</Text>
              </>
            ) : (
              card.name
            )}
          </Text>
          {card.subtitle && !card.isUnique && (
            <Text
              variant="titleMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {card.subtitle}
            </Text>
          )}
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          <Chip
            mode="flat"
            style={[styles.infoChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.primary }}
          >
            {card.type}
          </Chip>
          <Chip
            mode="flat"
            style={[
              styles.infoChip,
              { backgroundColor: rarityColors[card.rarity] + '30' },
            ]}
            textStyle={{ color: rarityColors[card.rarity] }}
          >
            {card.rarity}
          </Chip>
          {card.cost !== undefined && card.type !== 'Leader' && card.type !== 'Base' && (
            <Chip
              mode="flat"
              style={[styles.infoChip, { backgroundColor: theme.colors.secondaryContainer }]}
              textStyle={{ color: theme.colors.secondary }}
              icon="flash"
            >
              Cost {card.cost}
            </Chip>
          )}
        </View>

        {/* Aspects */}
        {card.aspects && card.aspects.length > 0 && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Aspects
            </Text>
            <View style={styles.aspectsRow}>
              {card.aspects.map((aspect, index) => (
                <View key={index} style={styles.aspectItem}>
                  <View
                    style={[styles.aspectDot, { backgroundColor: aspectColors[aspect] || theme.colors.outline }]}
                  />
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {aspect}
                  </Text>
                </View>
              ))}
            </View>
          </Surface>
        )}

        {/* Stats (for Units) */}
        {card.power !== undefined && card.hp !== undefined && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Stats
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="sword" size={24} color={theme.colors.tertiary} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                  {card.power}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Power
                </Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="shield" size={24} color={theme.colors.secondary} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                  {card.hp}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  HP
                </Text>
              </View>
              {card.arenaType && (
                <>
                  <Divider style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name={card.arenaType === 'Ground' ? 'tank' : 'rocket'}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                      {card.arenaType}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Arena
                    </Text>
                  </View>
                </>
              )}
            </View>
          </Surface>
        )}

        {/* Card Text */}
        {card.frontText && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Card Text
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
              {card.frontText}
            </Text>
          </Surface>
        )}

        {/* Traits & Keywords */}
        {((card.traits && card.traits.length > 0) || (card.keywords && card.keywords.length > 0)) && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
            {card.traits && card.traits.length > 0 && (
              <View style={{ marginBottom: card.keywords && card.keywords.length > 0 ? 12 : 0 }}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                  Traits
                </Text>
                <View style={styles.traitsRow}>
                  {card.traits.map((trait, index) => (
                    <Chip key={`${trait}-${index}`} mode="outlined" style={styles.traitChip}>
                      {trait}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
            {card.keywords && card.keywords.length > 0 && (
              <View>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                  Keywords
                </Text>
                <View style={styles.traitsRow}>
                  {card.keywords.map((keyword, index) => (
                    <Chip
                      key={`${keyword}-${index}`}
                      mode="flat"
                      style={[styles.keywordChip, { backgroundColor: theme.colors.tertiaryContainer }]}
                      textStyle={{ color: theme.colors.tertiary }}
                    >
                      {keyword}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
          </Surface>
        )}

        {/* Price */}
        {price && price.market !== undefined && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Market Price
            </Text>
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  ${(price.market || 0).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Market
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  ${(price.low || 0).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Low
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  ${(price.high || 0).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  High
                </Text>
              </View>
            </View>
          </Surface>
        )}

        {/* Set Info */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            Set Information
          </Text>
          <View style={styles.setInfo}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {card.set}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {card.setCode} · #{card.cardNumber}
            </Text>
          </View>
        </Surface>

        {/* Collection Info */}
        {inCollection && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.primaryContainer }]} elevation={1}>
            <View style={styles.collectionInfo}>
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ color: theme.colors.primary, marginLeft: 8 }}>
                In your collection: {quantity}x
              </Text>
            </View>
          </Surface>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <View style={styles.collectionButtons}>
            <Button
              mode="contained"
              onPress={handleAddToCollection}
              icon="plus"
              style={[styles.actionButton, { flex: 1 }]}
            >
              Add to Collection
            </Button>
            {inCollection && (
              <Button
                mode="outlined"
                onPress={handleRemoveFromCollection}
                icon="minus"
                style={styles.removeButton}
              >
                Remove
              </Button>
            )}
          </View>

          <Menu
            visible={deckMenuVisible}
            onDismiss={() => setDeckMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setDeckMenuVisible(true)}
                icon="cards"
                style={styles.actionButton}
              >
                Add to Deck
              </Button>
            }
          >
            {decks.length === 0 ? (
              <Menu.Item title="No decks yet" disabled />
            ) : (
              decks.map((deck) => (
                <Menu.Item
                  key={deck.id}
                  onPress={() => handleAddToDeck(deck)}
                  title={deck.name}
                />
              ))
            )}
          </Menu>
        </View>
      </ScrollView>

      {/* Zoom Modal */}
      <Portal>
        <Modal
          visible={imageZoomed}
          onDismiss={() => setImageZoomed(false)}
          contentContainerStyle={styles.zoomModal}
        >
          <Pressable style={styles.zoomContainer} onPress={() => setImageZoomed(false)}>
            <Image
              source={{ uri: card.imageUrl }}
              style={styles.zoomedImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  closeButton: {
    borderRadius: 20,
  },
  wishlistButton: {
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardImage: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_WIDTH * 0.9,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  italicSubtitle: {
    fontStyle: 'italic',
  },
  cardName: {
    fontWeight: '700',
    textAlign: 'center',
  },
  italicSubtitle: {
    fontStyle: 'italic',
  },
  subtitle: {
    marginTop: 4,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  infoChip: {
    height: 32,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  aspectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aspectDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 50,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitChip: {
    height: 32,
  },
  keywordChip: {
    height: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priceItem: {
    alignItems: 'center',
    gap: 4,
  },
  setInfo: {
    gap: 4,
  },
  collectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  collectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  removeButton: {
    borderRadius: 12,
  },
  zoomModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});



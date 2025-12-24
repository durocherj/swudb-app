import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Dimensions, Modal } from 'react-native';
import { Text, Surface, useTheme, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../types';
import { rarityColors, rarityLetters, aspectColors } from '../utils/theme';
import { getMaxCopiesForCard } from '../utils/constants';

interface CardTileProps {
  card: Card;
  onPress?: (card: Card) => void; // Optional - if provided, will be called after showing modal
  size?: 'small' | 'medium' | 'large';
  showPrice?: boolean;
  quantity?: number;
  // Deck building props
  showDeckControls?: boolean;
  onAddCard?: (card: Card) => void;
  onRemoveCard?: (card: Card) => void;
  currentQuantity?: number;
  disableImageModal?: boolean; // Disable the image popup modal
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function CardTile({ 
  card, 
  onPress, 
  size = 'medium', 
  showPrice = false, 
  quantity,
  showDeckControls = false,
  onAddCard,
  onRemoveCard,
  currentQuantity = 0,
  disableImageModal = false,
}: CardTileProps) {
  const theme = useTheme();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  
  const maxCopies = getMaxCopiesForCard(card.name);
  const canAdd = currentQuantity < maxCopies;
  const canRemove = currentQuantity > 0;

  const dimensions = {
    small: { width: (SCREEN_WIDTH - 48) / 3, height: 160 },
    medium: { width: (SCREEN_WIDTH - 36) / 2, height: 220 },
    large: { width: SCREEN_WIDTH - 24, height: 320 },
  };

  const { width, height } = dimensions[size];
  const imageHeight = height - 60;

  return (
    <Surface style={[styles.container, { width, backgroundColor: theme.colors.surfaceVariant }]} elevation={2}>
      {/* Card Image - Only pressable when selecting Leader/Base */}
      {disableImageModal && onPress ? (
        <Pressable onPress={() => onPress(card)}>
          <View style={[styles.imageContainer, { height: imageHeight }]}>
            <Image
              source={{ uri: card.imageUrl }}
              style={[
                styles.image,
                card.type !== 'Leader' && card.type !== 'Base' && (
                  card.type === 'Event' ? styles.eventArtImage : styles.cardArtImage
                )
              ]}
              resizeMode="cover"
            />
            
            {/* Rarity badge with letter */}
            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: rarityColors[card.rarity] || '#808080' },
              ]}
            >
              <Text style={styles.rarityText}>
                {rarityLetters[card.rarity] || '?'}
              </Text>
            </View>

            {/* Cost badge */}
            {card.cost !== undefined && card.type !== 'Leader' && card.type !== 'Base' && (
              <View style={[styles.costBadge, { backgroundColor: theme.colors.primary }]}>
                <Text variant="labelMedium" style={styles.costText}>
                  {card.cost}
                </Text>
              </View>
            )}

            {/* Quantity badge */}
            {quantity !== undefined && quantity > 0 && (
              <View style={[styles.quantityBadge, { backgroundColor: theme.colors.secondary }]}>
                <Text variant="labelSmall" style={styles.quantityText}>
                  ×{quantity}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      ) : (
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: card.imageUrl }}
            style={[
              styles.image,
              card.type !== 'Leader' && card.type !== 'Base' && (
                card.type === 'Event' ? styles.eventArtImage : styles.cardArtImage
              )
            ]}
            resizeMode="cover"
          />
          
          {/* Rarity badge with letter */}
          <View
            style={[
              styles.rarityBadge,
              { backgroundColor: rarityColors[card.rarity] || '#808080' },
            ]}
          >
            <Text style={styles.rarityText}>
              {rarityLetters[card.rarity] || '?'}
            </Text>
          </View>

          {/* Cost badge */}
          {card.cost !== undefined && card.type !== 'Leader' && card.type !== 'Base' && (
            <View style={[styles.costBadge, { backgroundColor: theme.colors.primary }]}>
              <Text variant="labelMedium" style={styles.costText}>
                {card.cost}
              </Text>
            </View>
          )}

          {/* Quantity badge */}
          {quantity !== undefined && quantity > 0 && (
            <View style={[styles.quantityBadge, { backgroundColor: theme.colors.secondary }]}>
              <Text variant="labelSmall" style={styles.quantityText}>
                ×{quantity}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Card Info */}
      <View style={styles.infoContainer}>
          <Text
            variant="labelMedium"
            numberOfLines={1}
            style={[styles.cardName, { color: theme.colors.onSurface }]}
          >
            {card.isUnique && card.subtitle ? (
              <>
                {card.name}, <Text style={styles.italicSubtitle}>{card.subtitle}</Text>
              </>
            ) : (
              card.name
            )}
          </Text>
          
          <View style={styles.metaRow}>
            {/* Aspects - using index as key to allow duplicate aspects */}
            <View style={styles.aspectsContainer}>
              {card.aspects.slice(0, 2).map((aspect, index) => (
                <View
                  key={index}
                  style={[
                    styles.aspectDot,
                    { backgroundColor: aspectColors[aspect] || theme.colors.outline },
                  ]}
                />
              ))}
            </View>

            {/* Type */}
            <Text
              variant="bodySmall"
              style={[styles.typeText, { color: theme.colors.onSurfaceVariant }]}
            >
              {card.type}
            </Text>

            {/* Stats for units */}
            {card.power !== undefined && card.hp !== undefined && (
              <View style={styles.statsContainer}>
                <Text variant="labelSmall" style={{ color: theme.colors.tertiary }}>
                  {card.power}/{card.hp}
                </Text>
              </View>
            )}
          </View>

          {/* Price and View Image Button */}
          {(showPrice || !disableImageModal) && (
            <View style={styles.priceRow}>
              {showPrice && card.price && !(card.type === 'Base' && card.hp === 30) && (
                <Text variant="labelSmall" style={[styles.price, { color: theme.colors.primary }]}>
                  ${card.price.market.toFixed(2)}
                </Text>
              )}
              {!disableImageModal && (
                <Button
                  mode="text"
                  compact
                  onPress={() => setImageModalVisible(true)}
                  textColor={theme.colors.primary}
                  style={styles.viewImageButton}
                  labelStyle={styles.viewImageButtonLabel}
                >
                  View Image
                </Button>
              )}
            </View>
          )}

          {/* Deck Building Controls */}
          {showDeckControls && (
            <View style={styles.deckControls}>
              <IconButton
                icon="minus"
                size={20}
                iconColor={canRemove ? theme.colors.onSurface : theme.colors.disabled}
                style={[
                  styles.controlButton,
                  { backgroundColor: canRemove ? theme.colors.surfaceVariant : theme.colors.surface },
                ]}
                disabled={!canRemove}
                onPress={() => onRemoveCard?.(card)}
              />
              <Text 
                variant="labelMedium" 
                style={[styles.quantityText, { color: theme.colors.onSurface }]}
              >
                {currentQuantity}
              </Text>
              <IconButton
                icon="plus"
                size={20}
                iconColor={canAdd ? theme.colors.onSurface : theme.colors.disabled}
                style={[
                  styles.controlButton,
                  { backgroundColor: canAdd ? theme.colors.surfaceVariant : theme.colors.surface },
                ]}
                disabled={!canAdd}
                onPress={() => onAddCard?.(card)}
              />
            </View>
          )}
        </View>

          {/* Full Card Image Modal */}
          {!disableImageModal && (
            <Modal
              visible={imageModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setImageModalVisible(false)}
            >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setImageModalVisible(false)}
            >
              <Image
                source={{ uri: card.imageUrl }}
                style={styles.fullCardImage}
                resizeMode="contain"
              />
            </Pressable>
            </Modal>
          )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    margin: 4,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden', // Ensure image is cropped properly
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardArtImage: {
    // Crop to show only the art portion (middle/upper portion) for Units and Upgrades
    // Zoom in to exclude power/health and text areas and remove border
    width: '140%',
    height: '220%',
    marginLeft: '-20%', // Center horizontally with increased zoom
    marginTop: '-32%', // Adjusted to move image up about 15 more pixels
  },
  eventArtImage: {
    // Crop to show only the art portion (bottom portion) for Event cards
    // Event cards have art at the bottom
    width: '175%',
    height: '255%',
    marginLeft: '-37.5%', // Center horizontally with increased zoom
    marginTop: '-131%', // Moved up 1 more pixel
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  costBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  costText: {
    color: '#000',
    fontWeight: '700',
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  quantityText: {
    color: '#000',
    fontWeight: '700',
  },
  infoContainer: {
    padding: 8,
  },
  cardName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  italicSubtitle: {
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aspectsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  aspectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  typeText: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  price: {
    fontWeight: '600',
    flex: 1,
  },
  viewImageButton: {
    margin: 0,
    padding: 0,
    minWidth: 0,
  },
  viewImageButtonLabel: {
    fontSize: 12,
  },
  deckControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  controlButton: {
    margin: 0,
  },
  quantityText: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullCardImage: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.75,
  },
});


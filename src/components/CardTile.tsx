import React from 'react';
import { View, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../types';
import { rarityColors, aspectColors } from '../utils/theme';

interface CardTileProps {
  card: Card;
  onPress: (card: Card) => void;
  size?: 'small' | 'medium' | 'large';
  showPrice?: boolean;
  quantity?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CardTile({ card, onPress, size = 'medium', showPrice = false, quantity }: CardTileProps) {
  const theme = useTheme();

  const dimensions = {
    small: { width: (SCREEN_WIDTH - 48) / 3, height: 160 },
    medium: { width: (SCREEN_WIDTH - 36) / 2, height: 220 },
    large: { width: SCREEN_WIDTH - 24, height: 320 },
  };

  const { width, height } = dimensions[size];
  const imageHeight = height - 60;

  return (
    <Pressable onPress={() => onPress(card)}>
      <Surface style={[styles.container, { width, backgroundColor: theme.colors.surfaceVariant }]} elevation={2}>
        {/* Card Image */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: card.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Rarity indicator */}
          <View
            style={[
              styles.rarityBadge,
              { backgroundColor: rarityColors[card.rarity] || theme.colors.outline },
            ]}
          />

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

        {/* Card Info */}
        <View style={styles.infoContainer}>
          <Text
            variant="labelMedium"
            numberOfLines={1}
            style={[styles.cardName, { color: theme.colors.onSurface }]}
          >
            {card.name}
          </Text>
          
          <View style={styles.metaRow}>
            {/* Aspects */}
            <View style={styles.aspectsContainer}>
              {card.aspects.slice(0, 2).map((aspect, index) => (
                <View
                  key={aspect}
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

          {/* Price */}
          {showPrice && card.price && (
            <Text variant="labelSmall" style={[styles.price, { color: theme.colors.primary }]}>
              ${card.price.market.toFixed(2)}
            </Text>
          )}
        </View>
      </Surface>
    </Pressable>
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
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
  price: {
    marginTop: 4,
    fontWeight: '600',
  },
});


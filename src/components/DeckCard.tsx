import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Deck } from '../types';

interface DeckCardProps {
  deck: Deck;
  onPress: (deck: Deck) => void;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
  cardCount: number;
  showActions?: boolean;
}

export function DeckCard({
  deck,
  onPress,
  onEdit,
  onDelete,
  cardCount,
  showActions = true,
}: DeckCardProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onPress(deck)}>
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}
        elevation={1}
      >
        <View style={styles.content}>
          {/* Deck Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons
              name="cards"
              size={32}
              color={theme.colors.primary}
            />
          </View>

          {/* Deck Info */}
          <View style={styles.infoContainer}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{ color: theme.colors.onSurface }}
            >
              {deck.name}
            </Text>

            {deck.description && (
              <Text
                variant="bodySmall"
                numberOfLines={1}
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {deck.description}
              </Text>
            )}

            <View style={styles.metaRow}>
              {deck.leader && (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="account-star"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {deck.leader.name}
                  </Text>
                </View>
              )}

              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="card-multiple"
                  size={14}
                  color={theme.colors.secondary}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {cardCount}/50
                </Text>
              </View>

              {deck.author && (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="account"
                    size={14}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {deck.author}
                  </Text>
                </View>
              )}

              {deck.likes !== undefined && (
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="heart"
                    size={14}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {deck.likes}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          {showActions && (onEdit || onDelete) && (
            <View style={styles.actions}>
              {onEdit && (
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => onEdit(deck)}
                  iconColor={theme.colors.primary}
                />
              )}
              {onDelete && (
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => onDelete(deck)}
                  iconColor={theme.colors.error}
                />
              )}
            </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
  },
});



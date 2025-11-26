import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image, Pressable } from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Header, EmptyState } from '../components';
import { cardsApi } from '../api';
import { CardSet } from '../types';
import { MainStackParamList } from '../types/navigation';
import { useCollection } from '../context';

type SetsNavProp = NativeStackNavigationProp<MainStackParamList, 'Sets'>;

export function SetsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<SetsNavProp>();
  const { collection } = useCollection();

  const [sets, setSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSets = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await cardsApi.getSets();
      setSets(data);
    } catch (error) {
      console.error('Failed to load sets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const handleRefresh = () => {
    loadSets(true);
  };

  const handleSetPress = (set: CardSet) => {
    navigation.navigate('SetDetails', { setCode: set.code, setName: set.name });
  };

  // Calculate collection completion for each set
  const getSetCompletion = (setCode: string, totalCards: number): number => {
    const ownedInSet = collection.cards.filter(
      (c) => c.card.setCode === setCode && c.quantity > 0
    ).length;
    return totalCards > 0 ? ownedInSet / totalCards : 0;
  };

  const renderSet = ({ item }: { item: CardSet }) => {
    const completion = getSetCompletion(item.code, item.totalCards);
    const ownedCount = Math.round(completion * item.totalCards);

    return (
      <Pressable onPress={() => handleSetPress(item)}>
        <Surface style={[styles.setCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          {/* Set Icon/Image */}
          <View style={[styles.setIcon, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={40}
              color={theme.colors.primary}
            />
          </View>

          {/* Set Info */}
          <View style={styles.setInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.code} · {item.totalCards} cards
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Released: {new Date(item.releaseDate).toLocaleDateString()}
            </Text>

            {/* Collection Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                  Collection: {ownedCount}/{item.totalCards}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                  {(completion * 100).toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                progress={completion}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          </View>

          {/* Arrow */}
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </Surface>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Sets" showFilterButton={false} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}
          >
            Loading sets...
          </Text>
        </View>
      ) : sets.length === 0 ? (
        <EmptyState
          icon="package-variant-closed"
          title="No Sets Found"
          description="Unable to load expansion sets"
        />
      ) : (
        <FlatList
          data={sets}
          renderItem={renderSet}
          keyExtractor={(item) => item.code}
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
  listContent: {
    padding: 12,
  },
  setCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  setIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  setInfo: {
    flex: 1,
    gap: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});



import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Chip,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useFilters } from '../context';
import { CARD_TYPES, ASPECTS, RARITIES, SORT_OPTIONS } from '../utils/constants';
import { aspectColors, rarityColors } from '../utils/theme';

interface RightDrawerContentProps {
  closeDrawer: () => void;
}

export function RightDrawerContent({ closeDrawer }: RightDrawerContentProps) {
  const theme = useTheme();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters();

  const toggleArrayFilter = <T,>(key: 'types' | 'aspects' | 'rarities' | 'sets', value: T) => {
    const currentArray = filters[key] as T[];
    if (currentArray.includes(value)) {
      updateFilter(key, currentArray.filter((v) => v !== value) as any);
    } else {
      updateFilter(key, [...currentArray, value] as any);
    }
  };

  const handleApply = () => {
    closeDrawer();
  };

  const handleClear = () => {
    resetFilters();
  };

  // Cost filter buttons
  const costOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          Filters
        </Text>
        {hasActiveFilters && (
          <Button mode="text" onPress={handleClear} compact>
            Clear All
          </Button>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Search
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Card name or text..."
            value={filters.search}
            onChangeText={(text) => updateFilter('search', text)}
            left={<TextInput.Icon icon="magnify" />}
            right={
              filters.search ? (
                <TextInput.Icon icon="close" onPress={() => updateFilter('search', '')} />
              ) : null
            }
            style={styles.searchInput}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Card Type */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Card Type
          </Text>
          <View style={styles.chipContainer}>
            {CARD_TYPES.map((type) => (
              <Chip
                key={type}
                selected={filters.types.includes(type)}
                onPress={() => toggleArrayFilter('types', type)}
                style={styles.chip}
                mode="flat"
              >
                {type}
              </Chip>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Aspects */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Aspect
          </Text>
          <View style={styles.chipContainer}>
            {ASPECTS.map((aspect) => (
              <Chip
                key={aspect}
                selected={filters.aspects.includes(aspect)}
                onPress={() => toggleArrayFilter('aspects', aspect)}
                style={[
                  styles.chip,
                  filters.aspects.includes(aspect) && {
                    backgroundColor: aspectColors[aspect] + '40',
                  },
                ]}
                mode="flat"
                textStyle={
                  filters.aspects.includes(aspect)
                    ? { color: aspectColors[aspect] }
                    : undefined
                }
              >
                {aspect}
              </Chip>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Rarity */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Rarity
          </Text>
          <View style={styles.chipContainer}>
            {RARITIES.map((rarity) => (
              <Chip
                key={rarity}
                selected={filters.rarities.includes(rarity)}
                onPress={() => toggleArrayFilter('rarities', rarity)}
                style={[
                  styles.chip,
                  filters.rarities.includes(rarity) && {
                    backgroundColor: rarityColors[rarity] + '40',
                  },
                ]}
                mode="flat"
                textStyle={
                  filters.rarities.includes(rarity)
                    ? { color: rarityColors[rarity] }
                    : undefined
                }
              >
                {rarity}
              </Chip>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Cost Range */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Min Cost: {filters.costMin}
          </Text>
          <View style={styles.chipContainer}>
            {costOptions.map((cost) => (
              <Chip
                key={`min-${cost}`}
                selected={filters.costMin === cost}
                onPress={() => updateFilter('costMin', cost)}
                style={styles.costChip}
                mode="flat"
                compact
              >
                {cost}
              </Chip>
            ))}
          </View>
          
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant, marginTop: 12 }]}>
            Max Cost: {filters.costMax}
          </Text>
          <View style={styles.chipContainer}>
            {costOptions.map((cost) => (
              <Chip
                key={`max-${cost}`}
                selected={filters.costMax === cost}
                onPress={() => updateFilter('costMax', cost)}
                style={styles.costChip}
                mode="flat"
                compact
              >
                {cost}
              </Chip>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Sort */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Sort By
          </Text>
          <View style={styles.chipContainer}>
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={filters.sortBy === option.value}
                onPress={() => updateFilter('sortBy', option.value as any)}
                style={styles.chip}
                mode="flat"
              >
                {option.label}
              </Chip>
            ))}
          </View>
          <View style={styles.sortOrderContainer}>
            <Button
              mode={filters.sortOrder === 'asc' ? 'contained' : 'outlined'}
              onPress={() => updateFilter('sortOrder', 'asc')}
              compact
              icon="sort-ascending"
              style={styles.sortButton}
            >
              Asc
            </Button>
            <Button
              mode={filters.sortOrder === 'desc' ? 'contained' : 'outlined'}
              onPress={() => updateFilter('sortOrder', 'desc')}
              compact
              icon="sort-descending"
              style={styles.sortButton}
            >
              Desc
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <Button mode="contained" onPress={handleApply} style={styles.applyButton}>
          Apply Filters
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  costChip: {
    minWidth: 36,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 4,
  },
  sortOrderContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  sortButton: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  applyButton: {
    borderRadius: 8,
  },
});

import { Aspect, CardType, Rarity } from '../types';

export const API_BASE_URL = 'https://swudb.com/api';
export const IMAGE_BASE_URL = 'https://swudb.com';
export const WEBSITE_BASE_URL = 'https://swudb.com';

export const CARD_TYPES: CardType[] = [
  'Leader',
  'Base',
  'Unit',
  'Event',
  'Upgrade',
];

export const ASPECTS: Aspect[] = [
  'Vigilance',
  'Command',
  'Aggression',
  'Cunning',
  'Villainy',
  'Heroism',
];

export const RARITIES: Rarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Legendary',
  'Special',
];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'cost', label: 'Cost' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'price', label: 'Price' },
  { value: 'set', label: 'Set' },
];

export const DEFAULT_FILTERS = {
  search: '',
  sets: [],
  rarities: [],
  types: [],
  aspects: [],
  costMin: 0,
  costMax: 10,
  sortBy: 'name' as const,
  sortOrder: 'asc' as const,
};

export const DECK_LIMITS = {
  minCards: 50,
  maxCards: 50,
  maxCopiesPerCard: 3,
  requiresLeader: true,
  requiresBase: true,
};

// Special cards with different copy limits
const SPECIAL_CARD_LIMITS: Record<string, number> = {
  'Swarming Vulture Droid': 15,
};

/**
 * Get the maximum number of copies allowed for a card in a deck
 * @param cardName The name of the card
 * @returns The maximum number of copies allowed (default: 3)
 */
export const getMaxCopiesForCard = (cardName: string): number => {
  return SPECIAL_CARD_LIMITS[cardName] || DECK_LIMITS.maxCopiesPerCard;
};

export const STORAGE_KEYS = {
  COLLECTION: '@swudb/collection',
  DECKS: '@swudb/decks',
  FAVORITES: '@swudb/favorites',
  PREFERENCES: '@swudb/preferences',
  CARD_CACHE: '@swudb/cardCache',
};



// Card Types
export interface Card {
  id: string;
  name: string;
  subtitle?: string;
  type: CardType;
  aspects: Aspect[];
  traits: string[];
  cost: number;
  power?: number;
  hp?: number;
  arenaType?: 'Ground' | 'Space';
  rarity: Rarity;
  set: string;
  setCode: string;
  cardNumber: string;
  artist?: string;
  frontText?: string;
  backText?: string;
  epicAction?: string;
  keywords: string[];
  imageUrl: string;
  backImageUrl?: string;
  price?: PriceInfo;
  variants?: CardVariant[];
}

export type CardType = 
  | 'Leader'
  | 'Base'
  | 'Unit'
  | 'Event'
  | 'Upgrade';

export type Aspect = 
  | 'Vigilance'
  | 'Command'
  | 'Aggression'
  | 'Cunning'
  | 'Villainy'
  | 'Heroism';

export type Rarity = 
  | 'Starter'
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Legendary'
  | 'Special';

export interface CardVariant {
  id: string;
  type: string;
  imageUrl: string;
}

export interface PriceInfo {
  market: number;
  low: number;
  mid: number;
  high: number;
  currency: string;
  lastUpdated: string;
}

// Set Types
export interface CardSet {
  code: string;
  name: string;
  releaseDate: string;
  totalCards: number;
  imageUrl?: string;
}

// Deck Types
export interface Deck {
  id: string;
  name: string;
  description?: string;
  leader: Card | null;
  base: Card | null;
  cards: DeckCard[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  author?: string;
  likes?: number;
  views?: number;
  // SWUDB-specific properties
  leaderImageUrl?: string;
  baseImageUrl?: string;
  isSwudbDeck?: boolean;
  editable?: boolean;
  deckUrl?: string; // URL to view/edit deck on SWUDB website
}

export interface DeckCard {
  card: Card;
  quantity: number;
}

// Collection Types
export interface CollectionCard {
  card: Card;
  quantity: number;
  wishlisted: boolean;
}

export interface Collection {
  cards: CollectionCard[];
  totalValue: number;
}

// Filter Types
export interface CardFilters {
  search: string;
  sets: string[];
  rarities: Rarity[];
  types: CardType[];
  aspects: Aspect[];
  costMin: number;
  costMax: number;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 
  | 'name'
  | 'cost'
  | 'rarity'
  | 'price'
  | 'set';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}



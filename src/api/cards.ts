import { apiClient } from './client';
import { Card, CardFilters, PaginatedResponse, CardSet, Aspect, CardType, Rarity } from '../types';

const IMAGE_BASE_URL = 'https://swudb.com/images';

// SWUDB API response types
interface SwudbCardResponse {
  variantId: number;
  cardId: number;
  printingId: number;
  expansionAbbreviation: string;
  cardNumber: string;
  releaseDate: string;
  expansionType: number;
  ownedCount: number;
  groupOwnedCount: number;
  frontImagePath: string;
  backImagePath?: string;
  isFrontPortrait: boolean;
  isBackPortrait: boolean;
  foil: boolean;
  isNumberDoubleFoiled: boolean;
  isNumberDoubleStamped: boolean;
  stamp?: string;
  cardName: string;
  cardTitle?: string;
  isUnique: boolean;
  cost: number;
  arena: number; // 0 = Ground, 6 = Space
  power: number;
  hp: number;
  hpBonus?: number;
  powerBonus?: number;
  aspectIds: number[];
  frontsideAspectIds: number[];
  backsideAspectIds: number[];
  cardType: number;
  isToken: boolean;
  variantType: number;
  traits: string;
  rarity: number;
  artist: string;
  alternativeDeckMaximum?: number;
  priceChangeTime?: string;
  lowPrice: number;
  marketPrice: number;
  tcgpUrl?: string;
}

interface SwudbSetResponse {
  expansionId: number;
  expansionAbbreviation: string;
  expansionName: string;
  logoFilePath: string;
  expansionType: number;
  releaseDate: string;
  prereleaseDate: string;
  cardCount: number;
  previewedCount: number;
  formatLegality: number;
  children?: SwudbSetResponse[];
}

interface SwudbSearchResponse {
  explanation: string;
  validQuery: boolean;
  printings: SwudbCardResponse[];
}

// Aspect ID mapping (verified from SWUDB API)
const ASPECT_MAP: Record<number, Aspect> = {
  1: 'Aggression',  // Red
  2: 'Command',     // Green
  3: 'Cunning',     // Yellow
  4: 'Vigilance',   // Blue
  5: 'Heroism',     // White
  6: 'Villainy',    // Dark Gray
};

// Card type mapping (verified from API - 0=Leader, etc.)
const CARD_TYPE_MAP: Record<number, CardType> = {
  0: 'Leader',
  1: 'Base',
  2: 'Unit',
  3: 'Event',
  4: 'Upgrade',
};

// Rarity mapping (verified from API)
const RARITY_MAP: Record<number, Rarity> = {
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Legendary',
  5: 'Special',
};

// Convert image path from API format to full URL
function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return '';
  // Replace ~/ with /images/ prefix and prepend base URL
  // API returns: ~/cards/SOR/005.png
  // We need: https://swudb.com/images/cards/SOR/005.png
  const cleanPath = imagePath.replace('~/', '/');
  return `${IMAGE_BASE_URL}${cleanPath}`;
}

// Convert SWUDB card response to our Card type
function convertSwudbCard(swudbCard: SwudbCardResponse): Card {
  // Determine arena type
  let arenaType: 'Ground' | 'Space' | undefined;
  if (swudbCard.cardType === 2) { // Only units have arena
    arenaType = swudbCard.arena === 6 ? 'Space' : 'Ground';
  }
  
  return {
    id: `${swudbCard.expansionAbbreviation}_${swudbCard.cardNumber}`,
    name: swudbCard.cardName,
    subtitle: swudbCard.cardTitle || undefined,
    type: CARD_TYPE_MAP[swudbCard.cardType] || 'Unit',
    aspects: (swudbCard.aspectIds || []).map(id => ASPECT_MAP[id]).filter(Boolean),
    traits: swudbCard.traits ? swudbCard.traits.split(',').map(t => t.trim()).filter(Boolean) : [],
    cost: swudbCard.cost || 0,
    power: swudbCard.power > 0 ? swudbCard.power : undefined,
    hp: swudbCard.hp > 0 ? swudbCard.hp : undefined,
    arenaType,
    rarity: RARITY_MAP[swudbCard.rarity] || 'Common',
    set: swudbCard.expansionAbbreviation,
    setCode: swudbCard.expansionAbbreviation,
    cardNumber: swudbCard.cardNumber,
    artist: swudbCard.artist || undefined,
    frontText: '',
    keywords: [],
    imageUrl: getImageUrl(swudbCard.frontImagePath),
    backImageUrl: swudbCard.backImagePath ? getImageUrl(swudbCard.backImagePath) : undefined,
    price: swudbCard.marketPrice > 0 ? {
      market: swudbCard.marketPrice,
      low: swudbCard.lowPrice || 0,
      mid: swudbCard.marketPrice,
      high: swudbCard.marketPrice,
      currency: 'USD',
      lastUpdated: swudbCard.priceChangeTime || new Date().toISOString(),
    } : undefined,
  };
}

// Convert SWUDB set response to our CardSet type
function convertSwudbSet(swudbSet: SwudbSetResponse): CardSet {
  return {
    code: swudbSet.expansionAbbreviation,
    name: swudbSet.expansionName,
    releaseDate: swudbSet.releaseDate,
    totalCards: swudbSet.cardCount || swudbSet.previewedCount,
    imageUrl: swudbSet.logoFilePath ? `https://swudb.com/images/${swudbSet.logoFilePath}` : undefined,
  };
}

// Deduplicate cards by cardId (keep first printing of each unique card)
function deduplicateCards(cards: SwudbCardResponse[]): SwudbCardResponse[] {
  const seen = new Set<number>();
  return cards.filter(card => {
    if (seen.has(card.cardId)) {
      return false;
    }
    seen.add(card.cardId);
    return true;
  });
}

export const cardsApi = {
  // Search cards with filters
  async searchCards(filters: Partial<CardFilters>, page = 1, limit = 20): Promise<PaginatedResponse<Card>> {
    try {
      // Build search query for SWUDB syntax
      const queryParts: string[] = [];
      
      // Add search text
      if (filters.search && filters.search.trim()) {
        queryParts.push(filters.search.trim());
      }
      
      // Add type filter
      if (filters.types && filters.types.length > 0) {
        const typeQuery = filters.types.map(t => `type:${t.toLowerCase()}`).join(' OR ');
        queryParts.push(`(${typeQuery})`);
      }
      
      // Add aspect filter
      if (filters.aspects && filters.aspects.length > 0) {
        const aspectQuery = filters.aspects.map(a => `aspect:${a.toLowerCase()}`).join(' OR ');
        queryParts.push(`(${aspectQuery})`);
      }
      
      // Add rarity filter
      if (filters.rarities && filters.rarities.length > 0) {
        const rarityQuery = filters.rarities.map(r => `rarity:${r.toLowerCase()}`).join(' OR ');
        queryParts.push(`(${rarityQuery})`);
      }
      
      // Add set filter
      if (filters.sets && filters.sets.length > 0) {
        const setQuery = filters.sets.map(s => `set:${s}`).join(' OR ');
        queryParts.push(`(${setQuery})`);
      }
      
      // Build final query - if empty, search for all non-token cards
      let searchQuery = queryParts.length > 0 ? queryParts.join(' ') : 'type:unit OR type:leader OR type:base OR type:event OR type:upgrade';
      
      // Determine sort order
      const sortOrder = filters.sortBy === 'name' ? 'name' : 
                        filters.sortBy === 'cost' ? 'cost' :
                        filters.sortBy === 'rarity' ? 'rarity' : 'setno';
      const sortDir = filters.sortOrder || 'asc';
      
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await apiClient.getRaw<SwudbSearchResponse>(
        `/search/${encodedQuery}?grouping=cards&sortorder=${sortOrder}&sortdir=${sortDir}`
      );
      
      if (response.validQuery && response.printings && response.printings.length > 0) {
        // Deduplicate to show unique cards only
        const uniqueCards = deduplicateCards(response.printings);
        const allCards = uniqueCards.map(convertSwudbCard);
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedCards = allCards.slice(startIndex, startIndex + limit);
        
        return {
          data: paginatedCards,
          page,
          totalPages: Math.ceil(allCards.length / limit),
          totalItems: allCards.length,
        };
      }
      
      return {
        data: [],
        page,
        totalPages: 0,
        totalItems: 0,
      };
    } catch (error) {
      // Return empty results on error
      return {
        data: [],
        page,
        totalPages: 0,
        totalItems: 0,
      };
    }
  },

  // Get single card by ID (format: SET_NUMBER, e.g., SOR_005)
  async getCard(cardId: string): Promise<Card | null> {
    try {
      const [setCode, cardNumber] = cardId.split('_');
      const response = await apiClient.getRaw<SwudbSearchResponse>(
        `/search/set:${setCode} number:${cardNumber}?grouping=cards&sortorder=setno&sortdir=asc`
      );
      
      if (response.validQuery && response.printings?.length > 0) {
        return convertSwudbCard(response.printings[0]);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  },

  // Get all sets
  async getSets(): Promise<CardSet[]> {
    try {
      const response = await apiClient.getRaw<SwudbSetResponse[]>('/card/getAllSets');
      
      // Filter to main expansions (expansionType 1) and flatten children
      const sets: CardSet[] = [];
      
      for (const set of response) {
        // Add main set if it's a main expansion
        if (set.expansionType === 1 && set.cardCount > 0) {
          sets.push(convertSwudbSet(set));
        }
      }
      
      return sets;
    } catch (error) {
      return [];
    }
  },

  // Get cards by set
  async getCardsBySet(setCode: string, page = 1, limit = 20): Promise<PaginatedResponse<Card>> {
    return this.searchCards({ sets: [setCode] }, page, limit);
  },

  // Get featured cards (leaders)
  async getFeaturedCards(count = 6): Promise<Card[]> {
    try {
      const response = await apiClient.getRaw<SwudbSearchResponse>(
        `/search/type:leader?grouping=cards&sortorder=name&sortdir=asc`
      );
      
      if (response.validQuery && response.printings && response.printings.length > 0) {
        const uniqueCards = deduplicateCards(response.printings);
        const leaders = uniqueCards.map(convertSwudbCard);
        // Pick random leaders
        const shuffled = [...leaders].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },

  // Get random cards
  async getRandomCards(count = 10): Promise<Card[]> {
    try {
      const response = await apiClient.getRaw<SwudbSearchResponse>(
        `/search/type:unit?grouping=cards&sortorder=name&sortdir=asc`
      );
      
      if (response.validQuery && response.printings && response.printings.length > 0) {
        const uniqueCards = deduplicateCards(response.printings);
        const allCards = uniqueCards.map(convertSwudbCard);
        const shuffled = [...allCards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },
};

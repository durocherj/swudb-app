import { apiClient } from './client';
import { Deck, PaginatedResponse } from '../types';
import { IMAGE_BASE_URL } from '../utils/constants';

// SWUDB deck summary from user endpoint
export interface SwudbDeckSummary {
  deckId: string;
  deckDisplayStatus: number;
  deckName: string;
  authorName: string;
  leaderImagePath: string;
  secondLeaderImagePath: string | null;
  baseImagePath: string;
  deckFormat: number;
  editable: boolean;
  hidden: boolean;
  heartFill: boolean;
  deckLikeCount: number;
  commentCount: number;
}

// User profile response from SWUDB
interface SwudbUserProfile {
  found: boolean;
  userName: string;
  memberSince: string;
  newestDecks: SwudbDeckSummary[];
  topDecks: SwudbDeckSummary[];
}

// Helper to fix image paths from API (removes ~ prefix)
const fixImagePath = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  // Remove leading ~ if present and ensure proper URL format
  // Paths come as ~/cards/SET/NUMBER.png, need to become https://swudb.com/images/cards/SET/NUMBER.png
  const cleanPath = path.startsWith('~') ? path.substring(1) : path;
  return `${IMAGE_BASE_URL}/images${cleanPath}`;
};

// Transform SWUDB deck summary to app's Deck interface
const transformDeckSummary = (summary: SwudbDeckSummary): Deck => {
  // Construct image URLs (fix paths that start with ~)
  const leaderImageUrl = fixImagePath(summary.leaderImagePath);
  const baseImageUrl = fixImagePath(summary.baseImagePath);

  return {
    id: summary.deckId,
    name: summary.deckName,
    description: undefined,
    leader: null, // We don't have full card data, just the image
    base: null,
    cards: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: summary.deckDisplayStatus > 0,
    author: summary.authorName,
    likes: summary.deckLikeCount,
    views: undefined,
    // Store image URLs for display
    leaderImageUrl,
    baseImageUrl,
    isSwudbDeck: true, // Flag to indicate this is from SWUDB
    editable: summary.editable,
  };
};

export const decksApi = {
  // Get user's decks from SWUDB
  async getUserDecks(username: string): Promise<Deck[]> {
    try {
      const response = await apiClient.get<SwudbUserProfile>(`/user/${username}`);
      
      if (!response.found) {
        return [];
      }

      // Combine newest and top decks, removing duplicates
      const allDecks = [...response.newestDecks, ...response.topDecks];
      const uniqueDecks = allDecks.filter(
        (deck, index, self) => index === self.findIndex(d => d.deckId === deck.deckId)
      );

      return uniqueDecks.map(transformDeckSummary);
    } catch (error) {
      console.error('Failed to fetch user decks:', error);
      return [];
    }
  },

  // Get hot/trending decks (currently not working on SWUDB)
  async getHotDecks(page = 1, limit = 20): Promise<PaginatedResponse<Deck>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Deck>>('/decks/hot', {
        page,
        limit,
      });
      return response;
    } catch (error) {
      // API not available
      return {
        data: [],
        page,
        totalPages: 0,
        totalItems: 0,
      };
    }
  },

  // Get deck by ID (currently not working on SWUDB)
  async getDeck(deckId: string): Promise<Deck | null> {
    try {
      const response = await apiClient.get<Deck>(`/deck/${deckId}`);
      return response;
    } catch (error) {
      return null;
    }
  },

  // Search community decks (currently not working on SWUDB)
  async searchDecks(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Deck>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Deck>>('/decks/search', {
        q: query,
        page,
        limit,
      });
      return response;
    } catch (error) {
      return {
        data: [],
        page: 1,
        totalPages: 0,
        totalItems: 0,
      };
    }
  },

  // Like a deck
  async likeDeck(deckId: string): Promise<boolean> {
    try {
      await apiClient.post(`/decks/${deckId}/like`);
      return true;
    } catch (error) {
      return false;
    }
  },
};

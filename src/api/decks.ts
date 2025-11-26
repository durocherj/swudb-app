import { apiClient } from './client';
import { Deck, PaginatedResponse } from '../types';

// Mock hot decks for development
const MOCK_HOT_DECKS: Deck[] = [
  {
    id: 'deck_001',
    name: 'Luke Aggro',
    description: 'Fast aggro deck featuring Luke Skywalker as leader',
    leader: null,
    base: null,
    cards: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    isPublic: true,
    author: 'JediMaster42',
    likes: 156,
    views: 2340,
  },
  {
    id: 'deck_002',
    name: 'Vader Control',
    description: 'Control deck with Darth Vader leading the Empire',
    leader: null,
    base: null,
    cards: [],
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    isPublic: true,
    author: 'SithLord99',
    likes: 203,
    views: 3100,
  },
  {
    id: 'deck_003',
    name: 'Boba Bounty Hunters',
    description: 'Bounty Hunter tribal deck with Boba Fett',
    leader: null,
    base: null,
    cards: [],
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-25T12:45:00Z',
    isPublic: true,
    author: 'Mandalorian',
    likes: 178,
    views: 2890,
  },
];

export const decksApi = {
  // Get hot/trending decks
  async getHotDecks(page = 1, limit = 20): Promise<PaginatedResponse<Deck>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Deck>>('/decks/hot', {
        page,
        limit,
      });
      return response;
    } catch (error) {
      // Return mock data
      const startIndex = (page - 1) * limit;
      const paginatedDecks = MOCK_HOT_DECKS.slice(startIndex, startIndex + limit);
      return {
        data: paginatedDecks,
        page,
        totalPages: Math.ceil(MOCK_HOT_DECKS.length / limit),
        totalItems: MOCK_HOT_DECKS.length,
      };
    }
  },

  // Get deck by ID
  async getDeck(deckId: string): Promise<Deck | null> {
    try {
      const response = await apiClient.get<Deck>(`/decks/${deckId}`);
      return response;
    } catch (error) {
      return MOCK_HOT_DECKS.find((deck) => deck.id === deckId) || null;
    }
  },

  // Search community decks
  async searchDecks(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Deck>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Deck>>('/decks/search', {
        q: query,
        page,
        limit,
      });
      return response;
    } catch (error) {
      const filtered = MOCK_HOT_DECKS.filter(
        (deck) =>
          deck.name.toLowerCase().includes(query.toLowerCase()) ||
          deck.description?.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered,
        page: 1,
        totalPages: 1,
        totalItems: filtered.length,
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



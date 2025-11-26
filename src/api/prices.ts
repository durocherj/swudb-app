import { apiClient } from './client';
import { PriceInfo, Card } from '../types';

// Mock price data
const MOCK_PRICES: Record<string, PriceInfo> = {
  SOR_001: { market: 45.99, low: 38.00, mid: 44.50, high: 55.00, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_002: { market: 52.50, low: 45.00, mid: 51.00, high: 62.00, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_050: { market: 0.25, low: 0.10, mid: 0.20, high: 0.50, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_075: { market: 35.00, low: 28.00, mid: 33.50, high: 42.00, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_100: { market: 2.50, low: 1.75, mid: 2.25, high: 3.50, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_125: { market: 0.75, low: 0.50, mid: 0.70, high: 1.25, currency: 'USD', lastUpdated: '2024-01-25' },
  SOR_200: { market: 8.50, low: 6.00, mid: 8.00, high: 12.00, currency: 'USD', lastUpdated: '2024-01-25' },
  SHD_001: { market: 48.00, low: 40.00, mid: 46.50, high: 58.00, currency: 'USD', lastUpdated: '2024-01-25' },
};

export const pricesApi = {
  // Get price for a single card
  async getCardPrice(cardId: string): Promise<PriceInfo | null> {
    try {
      const response = await apiClient.get<PriceInfo>(`/prices/${cardId}`);
      return response;
    } catch (error) {
      return MOCK_PRICES[cardId] || null;
    }
  },

  // Get prices for multiple cards
  async getBulkPrices(cardIds: string[]): Promise<Record<string, PriceInfo>> {
    try {
      const response = await apiClient.post<Record<string, PriceInfo>>('/prices/bulk', {
        cardIds,
      });
      return response;
    } catch (error) {
      const prices: Record<string, PriceInfo> = {};
      cardIds.forEach((id) => {
        if (MOCK_PRICES[id]) {
          prices[id] = MOCK_PRICES[id];
        }
      });
      return prices;
    }
  },

  // Get market trends
  async getMarketTrends(): Promise<{ gainers: Card[]; losers: Card[]; mostTraded: Card[] }> {
    try {
      const response = await apiClient.get<{ gainers: Card[]; losers: Card[]; mostTraded: Card[] }>(
        '/prices/trends'
      );
      return response;
    } catch (error) {
      return {
        gainers: [],
        losers: [],
        mostTraded: [],
      };
    }
  },

  // Calculate collection value
  calculateCollectionValue(cards: { cardId: string; quantity: number }[]): number {
    let total = 0;
    cards.forEach(({ cardId, quantity }) => {
      const price = MOCK_PRICES[cardId];
      if (price) {
        total += price.market * quantity;
      }
    });
    return total;
  },
};



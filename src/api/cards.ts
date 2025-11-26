import { apiClient } from './client';
import { Card, CardFilters, PaginatedResponse, CardSet } from '../types';

// Card data with SWUDB image URLs
const MOCK_CARDS: Card[] = [
  {
    id: 'SOR_005',
    name: 'Luke Skywalker',
    subtitle: 'Faithful Friend',
    type: 'Leader',
    aspects: ['Vigilance', 'Heroism'],
    traits: ['Force', 'Rebel'],
    cost: 0,
    power: 4,
    hp: 7,
    rarity: 'Legendary',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '005',
    frontText: 'Action: If you control 3 or more resources, flip this leader.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/005.webp',
  },
  {
    id: 'SOR_010',
    name: 'Darth Vader',
    subtitle: 'Dark Lord of the Sith',
    type: 'Leader',
    aspects: ['Aggression', 'Villainy'],
    traits: ['Force', 'Imperial', 'Sith'],
    cost: 0,
    power: 5,
    hp: 8,
    rarity: 'Legendary',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '010',
    frontText: 'Action: If you have dealt 5 or more damage this phase, flip this leader.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/010.webp',
  },
  {
    id: 'SOR_060',
    name: 'Rebel Pathfinder',
    type: 'Unit',
    aspects: ['Command'],
    traits: ['Rebel', 'Trooper'],
    cost: 2,
    power: 2,
    hp: 3,
    arenaType: 'Ground',
    rarity: 'Common',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '060',
    frontText: 'When Played: You may give an Experience token to this unit.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/060.webp',
  },
  {
    id: 'SOR_079',
    name: 'Millennium Falcon',
    subtitle: 'Piece of Junk',
    type: 'Unit',
    aspects: ['Cunning', 'Heroism'],
    traits: ['Vehicle', 'Rebel'],
    cost: 6,
    power: 5,
    hp: 6,
    arenaType: 'Space',
    rarity: 'Legendary',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '079',
    frontText: 'Ambush. When Played: Ready another friendly unit.',
    keywords: ['Ambush'],
    imageUrl: 'https://swudb.com/cards/SOR/079.webp',
  },
  {
    id: 'SOR_139',
    name: 'Force Choke',
    type: 'Event',
    aspects: ['Aggression', 'Villainy'],
    traits: ['Force'],
    cost: 3,
    rarity: 'Rare',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '139',
    frontText: 'Deal 3 damage to a ground unit.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/139.webp',
  },
  {
    id: 'SOR_053',
    name: 'Luke\'s Lightsaber',
    type: 'Upgrade',
    aspects: ['Vigilance', 'Heroism'],
    traits: ['Weapon', 'Lightsaber'],
    cost: 2,
    rarity: 'Rare',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '053',
    frontText: 'Attached unit gets +3/+1.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/053.webp',
  },
  {
    id: 'SOR_023',
    name: 'Dagobah Swamp',
    type: 'Base',
    aspects: ['Vigilance'],
    traits: ['Location'],
    cost: 0,
    hp: 30,
    rarity: 'Rare',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '023',
    frontText: 'Epic Action: Give a unit +2/+2 for this phase.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/023.webp',
  },
  {
    id: 'SHD_009',
    name: 'Boba Fett',
    subtitle: 'Collecting the Bounty',
    type: 'Leader',
    aspects: ['Cunning', 'Villainy'],
    traits: ['Bounty Hunter', 'Mandalorian'],
    cost: 0,
    power: 4,
    hp: 7,
    rarity: 'Legendary',
    set: 'Shadows of the Galaxy',
    setCode: 'SHD',
    cardNumber: '009',
    frontText: 'When you play a Bounty Hunter unit, you may exhaust this leader to draw a card.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SHD/009.webp',
  },
  {
    id: 'SOR_035',
    name: 'Admiral Ackbar',
    subtitle: 'Brilliant Strategist',
    type: 'Unit',
    aspects: ['Command', 'Heroism'],
    traits: ['Rebel', 'Official'],
    cost: 5,
    power: 2,
    hp: 4,
    arenaType: 'Ground',
    rarity: 'Rare',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '035',
    frontText: 'When Played: Each friendly unit gets +1/+1 for this phase.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/035.webp',
  },
  {
    id: 'SOR_130',
    name: 'Overwhelming Barrage',
    type: 'Event',
    aspects: ['Command'],
    traits: ['Tactic'],
    cost: 5,
    rarity: 'Rare',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '130',
    frontText: 'Deal 2 damage to each enemy ground unit and each enemy space unit.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/130.webp',
  },
  {
    id: 'SOR_115',
    name: 'Superlaser Technician',
    type: 'Unit',
    aspects: ['Villainy'],
    traits: ['Imperial', 'Trooper'],
    cost: 1,
    power: 1,
    hp: 1,
    arenaType: 'Ground',
    rarity: 'Common',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '115',
    frontText: 'When Defeated: You may put Superlaser Technician into play as a resource.',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/115.webp',
  },
  {
    id: 'SOR_081',
    name: 'X-Wing',
    type: 'Unit',
    aspects: ['Heroism'],
    traits: ['Vehicle', 'Rebel', 'Fighter'],
    cost: 3,
    power: 2,
    hp: 3,
    arenaType: 'Space',
    rarity: 'Common',
    set: 'Spark of Rebellion',
    setCode: 'SOR',
    cardNumber: '081',
    frontText: '',
    keywords: [],
    imageUrl: 'https://swudb.com/cards/SOR/081.webp',
  },
];

const MOCK_SETS: CardSet[] = [
  {
    code: 'SOR',
    name: 'Spark of Rebellion',
    releaseDate: '2024-03-08',
    totalCards: 252,
    imageUrl: 'https://swudb.com/images/sets/SOR.png',
  },
  {
    code: 'SHD',
    name: 'Shadows of the Galaxy',
    releaseDate: '2024-07-12',
    totalCards: 262,
    imageUrl: 'https://swudb.com/images/sets/SHD.png',
  },
  {
    code: 'TWI',
    name: 'Twilight of the Republic',
    releaseDate: '2024-11-08',
    totalCards: 256,
    imageUrl: 'https://swudb.com/images/sets/TWI.png',
  },
];

export const cardsApi = {
  // Search cards with filters
  async searchCards(filters: Partial<CardFilters>, page = 1, limit = 20): Promise<PaginatedResponse<Card>> {
    try {
      // Try real API first
      const response = await apiClient.get<PaginatedResponse<Card>>('/cards', {
        ...filters,
        page,
        limit,
      });
      return response;
    } catch (error) {
      // Fallback to mock data for development
      console.log('Using mock card data');
      let filteredCards = [...MOCK_CARDS];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCards = filteredCards.filter(
          (card) =>
            card.name.toLowerCase().includes(searchLower) ||
            card.subtitle?.toLowerCase().includes(searchLower) ||
            card.frontText?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.types && filters.types.length > 0) {
        filteredCards = filteredCards.filter((card) => filters.types!.includes(card.type));
      }

      if (filters.aspects && filters.aspects.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          card.aspects.some((aspect) => filters.aspects!.includes(aspect))
        );
      }

      if (filters.rarities && filters.rarities.length > 0) {
        filteredCards = filteredCards.filter((card) => filters.rarities!.includes(card.rarity));
      }

      if (filters.sets && filters.sets.length > 0) {
        filteredCards = filteredCards.filter((card) => filters.sets!.includes(card.setCode));
      }

      if (filters.costMin !== undefined) {
        filteredCards = filteredCards.filter((card) => card.cost >= filters.costMin!);
      }

      if (filters.costMax !== undefined) {
        filteredCards = filteredCards.filter((card) => card.cost <= filters.costMax!);
      }

      // Sort
      if (filters.sortBy) {
        filteredCards.sort((a, b) => {
          let comparison = 0;
          switch (filters.sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'cost':
              comparison = a.cost - b.cost;
              break;
            case 'rarity':
              const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Special'];
              comparison = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
              break;
            default:
              comparison = 0;
          }
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      const startIndex = (page - 1) * limit;
      const paginatedCards = filteredCards.slice(startIndex, startIndex + limit);

      return {
        data: paginatedCards,
        page,
        totalPages: Math.ceil(filteredCards.length / limit),
        totalItems: filteredCards.length,
      };
    }
  },

  // Get single card by ID
  async getCard(cardId: string): Promise<Card | null> {
    try {
      const response = await apiClient.get<Card>(`/cards/${cardId}`);
      return response;
    } catch (error) {
      // Fallback to mock data
      return MOCK_CARDS.find((card) => card.id === cardId) || null;
    }
  },

  // Get all sets
  async getSets(): Promise<CardSet[]> {
    try {
      const response = await apiClient.get<CardSet[]>('/sets');
      return response;
    } catch (error) {
      return MOCK_SETS;
    }
  },

  // Get cards by set
  async getCardsBySet(setCode: string, page = 1, limit = 20): Promise<PaginatedResponse<Card>> {
    return this.searchCards({ sets: [setCode] }, page, limit);
  },

  // Get random cards (for featured/hot)
  async getRandomCards(count = 10): Promise<Card[]> {
    try {
      const response = await apiClient.get<Card[]>('/cards/random', { count });
      return response;
    } catch (error) {
      const shuffled = [...MOCK_CARDS].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }
  },
};

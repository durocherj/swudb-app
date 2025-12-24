import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, Card, DeckCard } from '../types';
import { STORAGE_KEYS, DECK_LIMITS, getMaxCopiesForCard } from '../utils/constants';

interface DeckContextType {
  decks: Deck[];
  currentDeck: Deck | null;
  isLoading: boolean;
  createDeck: (name: string, description?: string) => Deck;
  deleteDeck: (deckId: string) => void;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  setCurrentDeck: (deck: Deck | null) => void;
  addCardToDeck: (deckId: string, card: Card) => boolean;
  removeCardFromDeck: (deckId: string, cardId: string) => void;
  setLeader: (deckId: string, card: Card) => void;
  setBase: (deckId: string, card: Card) => void;
  getDeckCardCount: (deck: Deck) => number;
  isDeckValid: (deck: Deck) => { valid: boolean; errors: string[] };
  duplicateDeck: (deck: Deck, newName?: string) => Deck;
  exportDeck: (deck: Deck) => string;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDecks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveDecks();
    }
  }, [decks, isLoading]);

  const loadDecks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
      if (stored) {
        setDecks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDecks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    } catch (error) {
      console.error('Failed to save decks:', error);
    }
  };

  const createDeck = useCallback((name: string, description?: string): Deck => {
    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      name,
      description,
      leader: null,
      base: null,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
    };

    setDecks((prev) => [...prev, newDeck]);
    return newDeck;
  }, []);

  const deleteDeck = useCallback((deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    if (currentDeck?.id === deckId) {
      setCurrentDeck(null);
    }
  }, [currentDeck]);

  const updateDeck = useCallback((deckId: string, updates: Partial<Deck>) => {
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deckId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      )
    );

    if (currentDeck?.id === deckId) {
      setCurrentDeck((prev) =>
        prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null
      );
    }
  }, [currentDeck]);

  const addCardToDeck = useCallback((deckId: string, card: Card): boolean => {
    let success = false;

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;

        const existingCard = deck.cards.find((dc) => dc.card.id === card.id);
        const currentCount = existingCard?.quantity || 0;
        const maxCopies = getMaxCopiesForCard(card.name);

        if (currentCount >= maxCopies) {
          return deck;
        }

        success = true;
        let newCards: DeckCard[];

        if (existingCard) {
          newCards = deck.cards.map((dc) =>
            dc.card.id === card.id ? { ...dc, quantity: dc.quantity + 1 } : dc
          );
        } else {
          newCards = [...deck.cards, { card, quantity: 1 }];
        }

        return { ...deck, cards: newCards, updatedAt: new Date().toISOString() };
      })
    );

    return success;
  }, []);

  const removeCardFromDeck = useCallback((deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;

        const existingCard = deck.cards.find((dc) => dc.card.id === cardId);
        if (!existingCard) return deck;

        let newCards: DeckCard[];
        if (existingCard.quantity > 1) {
          newCards = deck.cards.map((dc) =>
            dc.card.id === cardId ? { ...dc, quantity: dc.quantity - 1 } : dc
          );
        } else {
          newCards = deck.cards.filter((dc) => dc.card.id !== cardId);
        }

        return { ...deck, cards: newCards, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const setLeader = useCallback((deckId: string, card: Card) => {
    if (card.type !== 'Leader') return;
    updateDeck(deckId, { leader: card });
  }, [updateDeck]);

  const setBase = useCallback((deckId: string, card: Card) => {
    if (card.type !== 'Base') return;
    updateDeck(deckId, { base: card });
  }, [updateDeck]);

  const getDeckCardCount = useCallback((deck: Deck): number => {
    return deck.cards.reduce((sum, dc) => sum + dc.quantity, 0);
  }, []);

  const isDeckValid = useCallback((deck: Deck): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const cardCount = getDeckCardCount(deck);

    if (DECK_LIMITS.requiresLeader && !deck.leader) {
      errors.push('Deck requires a Leader');
    }

    if (DECK_LIMITS.requiresBase && !deck.base) {
      errors.push('Deck requires a Base');
    }

    if (cardCount < DECK_LIMITS.minCards) {
      errors.push(`Deck needs at least ${DECK_LIMITS.minCards} cards (currently ${cardCount})`);
    }

    if (cardCount > DECK_LIMITS.maxCards) {
      errors.push(`Deck cannot exceed ${DECK_LIMITS.maxCards} cards (currently ${cardCount})`);
    }

    return { valid: errors.length === 0, errors };
  }, [getDeckCardCount]);

  const duplicateDeck = useCallback((deck: Deck, newName?: string): Deck => {
    const duplicate: Deck = {
      ...deck,
      id: `deck_${Date.now()}`,
      name: newName || `${deck.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      author: undefined,
      likes: undefined,
      views: undefined,
    };

    setDecks((prev) => [...prev, duplicate]);
    return duplicate;
  }, []);

  const exportDeck = useCallback((deck: Deck): string => {
    let output = `# ${deck.name}\n`;
    if (deck.description) {
      output += `${deck.description}\n`;
    }
    output += '\n';

    if (deck.leader) {
      output += `## Leader\n1x ${deck.leader.name}\n\n`;
    }

    if (deck.base) {
      output += `## Base\n1x ${deck.base.name}\n\n`;
    }

    output += `## Main Deck (${getDeckCardCount(deck)} cards)\n`;
    deck.cards
      .sort((a, b) => a.card.cost - b.card.cost)
      .forEach((dc) => {
        output += `${dc.quantity}x ${dc.card.name}\n`;
      });

    return output;
  }, [getDeckCardCount]);

  return (
    <DeckContext.Provider
      value={{
        decks,
        currentDeck,
        isLoading,
        createDeck,
        deleteDeck,
        updateDeck,
        setCurrentDeck,
        addCardToDeck,
        removeCardFromDeck,
        setLeader,
        setBase,
        getDeckCardCount,
        isDeckValid,
        duplicateDeck,
        exportDeck,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}

export function useDecks() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDecks must be used within a DeckProvider');
  }
  return context;
}



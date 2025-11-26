import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CollectionCard, Collection } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { pricesApi } from '../api';

interface CollectionContextType {
  collection: Collection;
  isLoading: boolean;
  addToCollection: (card: Card, quantity?: number) => void;
  removeFromCollection: (cardId: string, quantity?: number) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  toggleWishlist: (card: Card) => void;
  isInCollection: (cardId: string) => boolean;
  isWishlisted: (cardId: string) => boolean;
  getQuantity: (cardId: string) => number;
  clearCollection: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Collection>({ cards: [], totalValue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load collection from storage on mount
  useEffect(() => {
    loadCollection();
  }, []);

  // Save collection to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCollection();
    }
  }, [collection, isLoading]);

  const loadCollection = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTION);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCollection(parsed);
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCollection = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  };

  const calculateTotalValue = useCallback((cards: CollectionCard[]): number => {
    return pricesApi.calculateCollectionValue(
      cards.map((c) => ({ cardId: c.card.id, quantity: c.quantity }))
    );
  }, []);

  const addToCollection = useCallback((card: Card, quantity = 1) => {
    setCollection((prev) => {
      const existing = prev.cards.find((c) => c.card.id === card.id);
      let newCards: CollectionCard[];

      if (existing) {
        newCards = prev.cards.map((c) =>
          c.card.id === card.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      } else {
        newCards = [...prev.cards, { card, quantity, wishlisted: false }];
      }

      return { cards: newCards, totalValue: calculateTotalValue(newCards) };
    });
  }, [calculateTotalValue]);

  const removeFromCollection = useCallback((cardId: string, quantity?: number) => {
    setCollection((prev) => {
      let newCards: CollectionCard[];

      if (quantity) {
        newCards = prev.cards
          .map((c) =>
            c.card.id === cardId ? { ...c, quantity: Math.max(0, c.quantity - quantity) } : c
          )
          .filter((c) => c.quantity > 0);
      } else {
        newCards = prev.cards.filter((c) => c.card.id !== cardId);
      }

      return { cards: newCards, totalValue: calculateTotalValue(newCards) };
    });
  }, [calculateTotalValue]);

  const updateQuantity = useCallback((cardId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCollection(cardId);
      return;
    }

    setCollection((prev) => {
      const newCards = prev.cards.map((c) =>
        c.card.id === cardId ? { ...c, quantity } : c
      );
      return { cards: newCards, totalValue: calculateTotalValue(newCards) };
    });
  }, [removeFromCollection, calculateTotalValue]);

  const toggleWishlist = useCallback((card: Card) => {
    setCollection((prev) => {
      const existing = prev.cards.find((c) => c.card.id === card.id);

      if (existing) {
        const newCards = prev.cards.map((c) =>
          c.card.id === card.id ? { ...c, wishlisted: !c.wishlisted } : c
        );
        return { ...prev, cards: newCards };
      } else {
        // Add to wishlist without adding to collection
        const newCards = [...prev.cards, { card, quantity: 0, wishlisted: true }];
        return { ...prev, cards: newCards };
      }
    });
  }, []);

  const isInCollection = useCallback((cardId: string): boolean => {
    const item = collection.cards.find((c) => c.card.id === cardId);
    return item ? item.quantity > 0 : false;
  }, [collection.cards]);

  const isWishlisted = useCallback((cardId: string): boolean => {
    const item = collection.cards.find((c) => c.card.id === cardId);
    return item?.wishlisted || false;
  }, [collection.cards]);

  const getQuantity = useCallback((cardId: string): number => {
    const item = collection.cards.find((c) => c.card.id === cardId);
    return item?.quantity || 0;
  }, [collection.cards]);

  const clearCollection = useCallback(() => {
    setCollection({ cards: [], totalValue: 0 });
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        collection,
        isLoading,
        addToCollection,
        removeFromCollection,
        updateQuantity,
        toggleWishlist,
        isInCollection,
        isWishlisted,
        getQuantity,
        clearCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}



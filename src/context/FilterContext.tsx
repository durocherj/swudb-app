import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CardFilters } from '../types';
import { DEFAULT_FILTERS } from '../utils/constants';

interface FilterContextType {
  filters: CardFilters;
  setFilters: (filters: CardFilters) => void;
  updateFilter: <K extends keyof CardFilters>(key: K, value: CardFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);

  const updateFilter = useCallback(<K extends keyof CardFilters>(key: K, value: CardFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.sets.length > 0 ||
    filters.rarities.length > 0 ||
    filters.types.length > 0 ||
    filters.aspects.length > 0 ||
    filters.costMin !== DEFAULT_FILTERS.costMin ||
    filters.costMax !== DEFAULT_FILTERS.costMax;

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}



import React, { ReactNode } from 'react';
import { FilterProvider } from './FilterContext';
import { CollectionProvider } from './CollectionContext';
import { DeckProvider } from './DeckContext';

export { useFilters } from './FilterContext';
export { useCollection } from './CollectionContext';
export { useDecks } from './DeckContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <FilterProvider>
      <CollectionProvider>
        <DeckProvider>{children}</DeckProvider>
      </CollectionProvider>
    </FilterProvider>
  );
}



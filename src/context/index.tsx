import React, { ReactNode } from 'react';
import { FilterProvider } from './FilterContext';
import { CollectionProvider } from './CollectionContext';
import { DeckProvider } from './DeckContext';
import { AuthProvider } from './AuthContext';

export { useFilters } from './FilterContext';
export { useCollection } from './CollectionContext';
export { useDecks } from './DeckContext';
export { useAuth } from './AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <FilterProvider>
        <CollectionProvider>
          <DeckProvider>{children}</DeckProvider>
        </CollectionProvider>
      </FilterProvider>
    </AuthProvider>
  );
}



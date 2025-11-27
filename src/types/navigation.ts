import { Card, Deck } from './index';

export type RootDrawerParamList = {
  MainContent: undefined;
};

export type MainStackParamList = {
  Home: { 
    filterType?: 'Leader' | 'Base' | 'Unit' | 'Event' | 'Upgrade';
    selectForDeck?: string; // deck ID when selecting cards for a deck
  } | undefined;
  CardDetails: { card: Card };
  MyDecks: undefined;
  DeckEditor: { deck?: Deck };
  HotDecks: undefined;
  Collection: undefined;
  Markets: undefined;
  Sets: undefined;
  SetDetails: { setCode: string; setName: string };
  Rules: undefined;
  Login: undefined;
  Account: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}



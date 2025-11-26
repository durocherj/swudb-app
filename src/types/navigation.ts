import { Card, Deck } from './index';

export type RootDrawerParamList = {
  MainContent: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  CardDetails: { card: Card };
  MyDecks: undefined;
  DeckEditor: { deck?: Deck };
  HotDecks: undefined;
  Collection: undefined;
  Markets: undefined;
  Sets: undefined;
  SetDetails: { setCode: string; setName: string };
  Rules: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}



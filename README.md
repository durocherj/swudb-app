# SWUDB Mobile App

A React Native mobile application for the Star Wars: Unlimited card game database (swudb.com).

## Features

- **Card Browser**: Search and filter cards by type, aspect, rarity, cost, and more
- **Dual Drawer Navigation**: Swipe left for main menu, swipe right for filters
- **Deck Builder**: Create, edit, and manage your own decks
- **Hot Decks**: Browse popular community decks
- **Collection Tracker**: Track your card collection with quantities and wishlist
- **Market Prices**: View card prices and collection value
- **Set Browser**: Browse cards by expansion set with collection progress
- **Rules Reference**: Game rules and keyword glossary

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** with dual drawer support
- **React Native Paper** for Material Design components
- **AsyncStorage** for local data persistence
- **Axios** for API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the project directory:
   ```bash
   cd swudb-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
swudb-app/
├── src/
│   ├── api/           # API service layer
│   │   ├── client.ts  # Axios client setup
│   │   ├── cards.ts   # Card API endpoints
│   │   ├── decks.ts   # Deck API endpoints
│   │   └── prices.ts  # Price API endpoints
│   ├── components/    # Reusable UI components
│   │   ├── CardTile.tsx
│   │   ├── DeckCard.tsx
│   │   ├── Header.tsx
│   │   └── EmptyState.tsx
│   ├── context/       # React Context for state management
│   │   ├── FilterContext.tsx
│   │   ├── CollectionContext.tsx
│   │   └── DeckContext.tsx
│   ├── navigation/    # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/       # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── CardDetailsScreen.tsx
│   │   ├── MyDecksScreen.tsx
│   │   ├── DeckEditorScreen.tsx
│   │   ├── HotDecksScreen.tsx
│   │   ├── CollectionScreen.tsx
│   │   ├── MarketsScreen.tsx
│   │   ├── SetsScreen.tsx
│   │   ├── SetDetailsScreen.tsx
│   │   └── RulesScreen.tsx
│   ├── types/         # TypeScript interfaces
│   └── utils/         # Helper functions and constants
├── App.tsx            # App entry point
└── package.json
```

## Navigation

The app uses a dual-drawer navigation pattern:

- **Left Drawer** (swipe from left): Main navigation menu
  - SWUDB (Home)
  - My Decks
  - Hot Decks
  - Collection
  - Markets
  - Sets
  - Rules

- **Right Drawer** (swipe from right): Filter panel
  - Search input
  - Card type filter
  - Aspect filter
  - Rarity filter
  - Cost range slider
  - Sort options

## Data Persistence

The app uses AsyncStorage to persist:
- User's deck collection
- Card collection with quantities
- Wishlist items
- User preferences

## API Integration

The app is designed to integrate with the swudb.com API. Currently includes mock data for development/demonstration purposes. Update `src/utils/constants.ts` with the actual API base URL when available.

## Styling

The app uses a dark theme inspired by Star Wars aesthetics:
- Primary: Gold (#FFD700)
- Secondary: Lightsaber Blue (#00A8E8)
- Tertiary: Sith Red (#E63946)
- Background: Dark (#0A0A0A)

Aspect colors are used throughout for card filtering and display:
- Vigilance: Blue
- Command: Green
- Aggression: Red
- Cunning: Yellow
- Villainy: Purple
- Heroism: Light Blue

## License

This is a fan-made application. Star Wars: Unlimited is a trademark of Fantasy Flight Games and Lucasfilm Ltd.



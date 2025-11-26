import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  List,
  Divider,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Header } from '../components';

interface RuleSection {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  content: string[];
}

interface Keyword {
  name: string;
  description: string;
}

const RULE_SECTIONS: RuleSection[] = [
  {
    title: 'Game Setup',
    icon: 'play-circle',
    content: [
      'Each player needs a deck of exactly 50 cards, plus 1 Leader and 1 Base.',
      'Shuffle your deck and place it face down as your draw pile.',
      'Place your Leader and Base face up in their designated areas.',
      'Each player draws 6 cards as their starting hand.',
      'Determine who goes first (coin flip, dice roll, etc.).',
    ],
  },
  {
    title: 'Turn Structure',
    icon: 'refresh-circle',
    content: [
      'Action Phase: Players alternate taking actions until both pass.',
      'Actions include: Playing cards, attacking, using abilities.',
      'Regroup Phase: Ready exhausted cards, draw 2 cards, gain resources.',
      'The game continues until one player wins.',
    ],
  },
  {
    title: 'Playing Cards',
    icon: 'cards-playing',
    content: [
      'To play a card, you must pay its cost by exhausting resources.',
      'Units enter play ready unless otherwise stated.',
      'Events resolve immediately and go to the discard pile.',
      'Upgrades attach to units you control.',
    ],
  },
  {
    title: 'Combat',
    icon: 'sword-cross',
    content: [
      'Exhaust an attacking unit to attack.',
      'Ground units can attack ground units and the enemy base.',
      'Space units can attack space units and the enemy base.',
      'Damage is dealt simultaneously.',
      'Units with 0 or less HP are defeated.',
    ],
  },
  {
    title: 'Winning the Game',
    icon: 'trophy',
    content: [
      'Destroy your opponent\'s base (reduce it to 0 HP) to win.',
      'Some cards may provide alternative win conditions.',
      'If you need to draw but cannot, you lose the game.',
    ],
  },
  {
    title: 'Resources',
    icon: 'lightning-bolt',
    content: [
      'Resources are used to pay for cards.',
      'During Regroup, you may add 1 card from hand as a resource.',
      'Resources reset (ready) at the start of your Regroup phase.',
      'Each exhausted resource pays for 1 point of cost.',
    ],
  },
];

const KEYWORDS: Keyword[] = [
  {
    name: 'Ambush',
    description: 'This unit can attack the turn it enters play.',
  },
  {
    name: 'Overwhelm',
    description: 'When attacking a unit, deal excess damage to the enemy base.',
  },
  {
    name: 'Sentinel',
    description: 'Enemy units in this arena must attack this unit if able.',
  },
  {
    name: 'Shielded',
    description: 'When this unit would take damage, prevent that damage and remove Shielded.',
  },
  {
    name: 'Restore',
    description: 'When this unit attacks, heal damage from your base equal to the Restore value.',
  },
  {
    name: 'Raid',
    description: 'This unit gets +X power when attacking (where X is the Raid value).',
  },
  {
    name: 'Saboteur',
    description: 'When this unit attacks and deals combat damage to an enemy base, you may choose and defeat a non-leader unit the defending player controls.',
  },
  {
    name: 'Grit',
    description: 'This unit gets +1 power for each damage on it.',
  },
  {
    name: 'Bounty',
    description: 'When this unit is defeated, the opponent who dealt the damage claims the bounty reward.',
  },
];

export function RulesScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('Game Setup');

  const filteredKeywords = KEYWORDS.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Rules" showFilterButton={false} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Game Rules Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Game Rules
          </Text>
          <Surface style={[styles.rulesCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            {RULE_SECTIONS.map((section, index) => (
              <View key={section.title}>
                <List.Accordion
                  title={section.title}
                  left={(props) => (
                    <MaterialCommunityIcons
                      name={section.icon}
                      size={24}
                      color={theme.colors.primary}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                  expanded={expandedSection === section.title}
                  onPress={() => toggleSection(section.title)}
                  style={{ backgroundColor: 'transparent' }}
                  titleStyle={{ color: theme.colors.onSurface }}
                >
                  <View style={styles.ruleContent}>
                    {section.content.map((rule, ruleIndex) => (
                      <View key={ruleIndex} style={styles.ruleItem}>
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                          {ruleIndex + 1}.
                        </Text>
                        <Text
                          variant="bodyMedium"
                          style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
                        >
                          {rule}
                        </Text>
                      </View>
                    ))}
                  </View>
                </List.Accordion>
                {index < RULE_SECTIONS.length - 1 && <Divider />}
              </View>
            ))}
          </Surface>
        </View>

        {/* Keywords Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Keyword Glossary
          </Text>
          
          <Searchbar
            placeholder="Search keywords..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
            inputStyle={{ color: theme.colors.onSurface }}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <Surface style={[styles.keywordsCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            {filteredKeywords.map((keyword, index) => (
              <View key={keyword.name}>
                <View style={styles.keywordItem}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.primary, fontWeight: '600' }}
                  >
                    {keyword.name}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                  >
                    {keyword.description}
                  </Text>
                </View>
                {index < filteredKeywords.length - 1 && <Divider style={{ marginVertical: 8 }} />}
              </View>
            ))}
          </Surface>
        </View>

        {/* External Links */}
        <View style={styles.section}>
          <Surface style={[styles.linksCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="link-variant" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                Official Resources
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                Visit starwarsunlimited.com for complete rules and FAQs
              </Text>
            </View>
          </Surface>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  rulesCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ruleContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 8,
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
    marginBottom: 12,
  },
  keywordsCard: {
    borderRadius: 16,
    padding: 16,
  },
  keywordItem: {
    paddingVertical: 4,
  },
  linksCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});



import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const cheesecakeStyles = [
  {
    id: 'new-york',
    name: 'New York',
    emoji: '🗽',
    description: 'Dense, tall, and creamy. The classic American baked cheesecake with sour cream topping.',
    tags: ['Baked', 'Dense', 'Classic'],
    color: '#FFF8E1',
    accent: '#F9A825',
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🗼',
    description: 'Cotton-soft and jiggly. Made with whipped egg whites for an incredibly light, fluffy texture.',
    tags: ['Baked', 'Fluffy', 'Delicate'],
    color: '#E8F5E9',
    accent: '#388E3C',
  },
  {
    id: 'basque',
    name: 'Basque',
    emoji: '🔥',
    description: 'Intentionally burnt top, custardy center. Rustic, bold, deeply caramelized flavor.',
    tags: ['Baked', 'Caramelized', 'Rustic'],
    color: '#FBE9E7',
    accent: '#D84315',
  },
  {
    id: 'no-bake',
    name: 'No-Bake',
    emoji: '❄️',
    description: 'Light and mousse-like. Sets in the fridge — no oven needed. Perfect for warm weather.',
    tags: ['No oven', 'Light', 'Easy'],
    color: '#E3F2FD',
    accent: '#1565C0',
  },
];

export default function CheesecakeC1Style() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCheesecakeStyle = useCakeStore((state) => state.setCheesecakeStyle);

  return (
    <StepLayout
      step={1}
      totalSteps={4}
      title="Choose Your Style"
      subtitle="Each style is its own unique experience"
      onNext={() => router.push('/cheesecake/c2-size')}
      canProceed={!!cake.cheesecakeStyle}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {cheesecakeStyles.map((option) => {
          const isSelected = cake.cheesecakeStyle === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, isSelected && { borderColor: option.accent, backgroundColor: option.color }]}
              onPress={() => setCheesecakeStyle(option.id as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardEmoji}>{option.emoji}</Text>
                <View style={styles.cardMain}>
                  <Text style={[styles.cardName, isSelected && { color: option.accent }]}>{option.name}</Text>
                  <View style={styles.tagsRow}>
                    {option.tags.map((tag) => (
                      <View key={tag} style={[styles.tag, isSelected && { backgroundColor: option.accent + '22' }]}>
                        <Text style={[styles.tagText, isSelected && { color: option.accent }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />}
              </View>
              <Text style={styles.cardDesc}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20, gap: 12 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  cardEmoji: { fontSize: 32 },
  cardMain: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: '700', color: '#4A3F35', marginBottom: 6 },
  tagsRow: { flexDirection: 'row', gap: 6 },
  tag: {
    backgroundColor: '#F5EEE6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: '#8B7355' },
  cardDesc: { fontSize: 13, color: '#6B5B4F', lineHeight: 19 },
});

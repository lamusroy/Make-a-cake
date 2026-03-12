import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const browniePanOptions = [
  { id: 'small', name: '8×8 Pan', servings: '9–16', description: 'Thick, tall, fudgy squares', icon: 'square-outline', multiplier: 0.75 },
  { id: 'medium', name: '9×13 Pan', servings: '20–24', description: 'Classic batch, perfect for sharing', icon: 'stop-outline', multiplier: 1 },
  { id: 'large', name: 'Double Batch', servings: '40–48', description: 'Two 9×13 pans — great for events', icon: 'grid-outline', multiplier: 2 },
  { id: 'mini', name: 'Mini Muffin Tin', servings: '24–30', description: 'Bite-sized brownie cups', icon: 'ellipse-outline', multiplier: 0.75 },
];

export default function BrownieB1Size() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCakeSize = useCakeStore((state) => state.setCakeSize);

  return (
    <StepLayout
      step={1}
      totalSteps={4}
      title="Pick Your Pan"
      subtitle="How much brownie are we making?"
      onNext={() => router.push('/brownie/b2-constitution')}
      canProceed={!!cake.cakeSize}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {browniePanOptions.map((option) => {
          const isSelected = cake.cakeSize === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setCakeSize(option.id, option.multiplier)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                <Ionicons name={option.icon as any} size={28} color={isSelected ? '#FFF' : '#5D4037'} />
              </View>
              <View style={styles.info}>
                <View style={styles.row}>
                  <Text style={[styles.name, isSelected && styles.nameSelected]}>{option.name}</Text>
                  <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                    <Ionicons name="people" size={13} color={isSelected ? '#5D4037' : '#8B5A2B'} />
                    <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>{option.servings} servings</Text>
                  </View>
                </View>
                <Text style={styles.description}>{option.description}</Text>
              </View>
              {isSelected && <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 14,
  },
  cardSelected: { borderColor: '#5D4037', backgroundColor: '#FDF8F5' },
  iconBox: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#F5EEE6', alignItems: 'center', justifyContent: 'center' },
  iconBoxSelected: { backgroundColor: '#5D4037' },
  info: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#4A3F35' },
  nameSelected: { color: '#5D4037' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5EEE6', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeSelected: { backgroundColor: '#E8D5C8' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#8B5A2B' },
  badgeTextSelected: { color: '#5D4037' },
  description: { fontSize: 13, color: '#8B7355' },
});

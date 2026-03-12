import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const cheesecakeSizes = [
  { id: 'small', name: '6" Springform', servings: '6–8', description: 'Intimate dinner dessert', icon: 'ellipse-outline', multiplier: 0.75 },
  { id: 'medium', name: '9" Springform', servings: '10–12', description: 'The classic cheesecake size', icon: 'ellipse', multiplier: 1 },
  { id: 'large', name: '10" Springform', servings: '14–16', description: 'Great for a crowd', icon: 'radio-button-on', multiplier: 1.5 },
  { id: 'mini', name: 'Mini Cheesecakes', servings: '12–15', description: 'Individual portions in a muffin tin', icon: 'grid-outline', multiplier: 0.75 },
];

export default function CheesecakeC2Size() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCakeSize = useCakeStore((state) => state.setCakeSize);

  return (
    <StepLayout
      step={2}
      totalSteps={4}
      title="Choose Your Size"
      subtitle="How big should your cheesecake be?"
      onNext={() => router.push('/cheesecake/c3-crust')}
      canProceed={!!cake.cakeSize}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {cheesecakeSizes.map((option) => {
          const isSelected = cake.cakeSize === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setCakeSize(option.id, option.multiplier)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                <Ionicons name={option.icon as any} size={28} color={isSelected ? '#FFF' : '#8B5A2B'} />
              </View>
              <View style={styles.info}>
                <View style={styles.row}>
                  <Text style={[styles.name, isSelected && styles.nameSelected]}>{option.name}</Text>
                  <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                    <Ionicons name="people" size={13} color={isSelected ? '#8B5A2B' : '#8B5A2B'} />
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
  cardSelected: { borderColor: '#C4704F', backgroundColor: '#FDF9F6' },
  iconBox: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#F5EEE6', alignItems: 'center', justifyContent: 'center' },
  iconBoxSelected: { backgroundColor: '#C4704F' },
  info: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#4A3F35' },
  nameSelected: { color: '#C4704F' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5EEE6', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeSelected: { backgroundColor: '#FDEEE8' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#8B5A2B' },
  badgeTextSelected: { color: '#C4704F' },
  description: { fontSize: 13, color: '#8B7355' },
});

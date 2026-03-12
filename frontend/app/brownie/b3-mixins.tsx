import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore, mixInOptions } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 3;

export default function BrownieB3MixIns() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const toggleMixIn = useCakeStore((state) => state.toggleMixIn);
  const setMixIns = useCakeStore((state) => state.setMixIns);

  const hasMixIns = cake.mixIns.length > 0;

  return (
    <StepLayout
      step={3}
      totalSteps={4}
      title="Mix-ins"
      subtitle="Add texture and surprise to every bite"
      onNext={() => router.push('/recipe-result')}
      nextLabel={hasMixIns ? `Continue (${cake.mixIns.length} selected)` : 'Skip Mix-ins'}
      canProceed={true}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {hasMixIns && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setMixIns([])}>
            <Ionicons name="close-circle-outline" size={16} color="#8B7355" />
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
        <View style={styles.grid}>
          {mixInOptions.map((option) => {
            const isSelected = cake.mixIns.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.card, isSelected && styles.cardSelected, { width: CARD_SIZE }]}
                onPress={() => toggleMixIn(option.id)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={styles.check}>
                    <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  </View>
                )}
                <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                  <Ionicons name={option.icon as any} size={26} color={isSelected ? '#FFF' : '#5D4037'} />
                </View>
                <Text style={[styles.name, isSelected && styles.nameSelected]}>{option.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {hasMixIns && (
          <View style={styles.selectedBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#5D4037" />
            <Text style={styles.selectedBannerText}>
              {cake.mixIns.length} mix-in{cake.mixIns.length > 1 ? 's' : ''} selected
            </Text>
          </View>
        )}
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginBottom: 12,
  },
  clearText: { fontSize: 13, color: '#8B7355', fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardSelected: { borderColor: '#5D4037', backgroundColor: '#FDF8F5' },
  check: { position: 'absolute', top: 8, right: 8 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5EEE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconBoxSelected: { backgroundColor: '#5D4037' },
  name: { fontSize: 12, fontWeight: '600', color: '#6B5B4F', textAlign: 'center' },
  nameSelected: { color: '#5D4037' },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5EEE6',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  selectedBannerText: { fontSize: 14, fontWeight: '600', color: '#5D4037' },
});

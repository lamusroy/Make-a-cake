import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore, crustOptions } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

export default function CheesecakeC3Crust() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCrust = useCakeStore((state) => state.setCrust);

  return (
    <StepLayout
      step={3}
      totalSteps={4}
      title="Choose Your Crust"
      subtitle="The foundation of your cheesecake"
      onNext={() => router.push('/cheesecake/c4-topping')}
      canProceed={!!cake.crust}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {crustOptions.map((option) => {
            const isSelected = cake.crust === option.name;
            const iconColor = isLightColor(option.color) ? '#5D4037' : '#FFF';
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.card, { width: CARD_WIDTH }, isSelected && styles.cardSelected]}
                onPress={() => setCrust(option.name, option.color)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={styles.check}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
                <View style={[styles.iconBox, { backgroundColor: option.color }, option.color === '#FAFAFA' && styles.iconBoxLight]}>
                  <Ionicons name={option.icon as any} size={28} color={iconColor} />
                </View>
                <Text style={[styles.name, isSelected && styles.nameSelected]}>{option.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  cardSelected: { borderColor: '#C4704F', backgroundColor: '#FDF9F6' },
  check: { position: 'absolute', top: 10, right: 10 },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconBoxLight: { borderWidth: 1, borderColor: '#E0D8D0' },
  name: { fontSize: 14, fontWeight: '600', color: '#6B5B4F', textAlign: 'center' },
  nameSelected: { color: '#C4704F', fontWeight: '700' },
});

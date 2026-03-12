import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../../src/components/StepLayout';
import { useCakeStore } from '../../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const textureOptions = [
  {
    id: 'fudgy',
    name: 'Fudgy',
    description: 'Dense, gooey center. Uses melted chocolate — maximum richness.',
    icon: 'water',
    color: '#3E2723',
    emoji: '🍫',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Best of both. A mix of melted chocolate and cocoa powder.',
    icon: 'reorder-two',
    color: '#5D4037',
    emoji: '✨',
  },
  {
    id: 'cakey',
    name: 'Cakey',
    description: 'Light, fluffy texture. Built on cocoa powder — less dense.',
    icon: 'cloud',
    color: '#795548',
    emoji: '☁️',
  },
];

const intensityOptions = [
  { id: 'dark', name: 'Dark', description: '70%+ cacao — bold, complex, bittersweet', color: '#1A0A00', icon: 'moon' },
  { id: 'milk', name: 'Milk', description: 'Smooth and sweet — crowd favourite', color: '#8B4513', icon: 'sunny-outline' },
  { id: 'white', name: 'White', description: 'No cocoa solids — buttery, vanilla-forward', color: '#FFF8DC', icon: 'sunny' },
];

const flavorProfileOptions = [
  { id: 'espresso', name: 'Espresso', description: 'Deepens chocolate flavor', icon: 'cafe', color: '#4E342E' },
  { id: 'vanilla', name: 'Vanilla Extract', description: 'Rounds out and softens', icon: 'flower', color: '#FFF9C4' },
  { id: 'cardamom', name: 'Cardamom', description: 'Warm, floral, exotic', icon: 'leaf', color: '#A5D6A7' },
  { id: 'cinnamon', name: 'Cinnamon', description: 'Classic warmth', icon: 'flame', color: '#FFCC80' },
  { id: 'chili', name: 'Chili Pepper', description: 'Spicy chocolate kick', icon: 'flash', color: '#EF9A9A' },
  { id: 'sea-salt', name: 'Sea Salt', description: 'Contrast that elevates everything', icon: 'water', color: '#B0BEC5' },
];

export default function BrownieB2Constitution() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setBrownieTexture = useCakeStore((state) => state.setBrownieTexture);
  const setBrownieIntensity = useCakeStore((state) => state.setBrownieIntensity);
  const toggleBrownieFlavorProfile = useCakeStore((state) => state.toggleBrownieFlavorProfile);

  const canProceed = !!cake.brownieTexture && !!cake.brownieIntensity;

  return (
    <StepLayout
      step={2}
      totalSteps={4}
      title="Constitution"
      subtitle="Define the character of your brownie"
      onNext={() => router.push('/brownie/b3-mixins')}
      canProceed={canProceed}
      showPreview={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* TEXTURE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Texture</Text>
            <Text style={styles.sectionHint}>Required</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Determined by the type of chocolate used</Text>
          {textureOptions.map((option) => {
            const isSelected = cake.brownieTexture === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.card, isSelected && styles.cardSelectedBrown]}
                onPress={() => setBrownieTexture(option.id as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: option.color }, isSelected && styles.iconBoxSelected]}>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, isSelected && styles.cardNameSelected]}>{option.name}</Text>
                  <Text style={styles.cardDesc}>{option.description}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CHOCOLATE INTENSITY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chocolate Intensity</Text>
            <Text style={styles.sectionHint}>Required</Text>
          </View>
          <View style={styles.intensityRow}>
            {intensityOptions.map((option) => {
              const isSelected = cake.brownieIntensity === option.id;
              const isDark = option.id === 'dark';
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.intensityCard, isSelected && styles.intensityCardSelected]}
                  onPress={() => setBrownieIntensity(option.id as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.intensityIcon, { backgroundColor: option.color }, isDark && styles.intensityIconDark]}>
                    <Ionicons name={option.icon as any} size={22} color={isDark || option.id === 'milk' ? '#FFF' : '#5D4037'} />
                  </View>
                  <Text style={[styles.intensityName, isSelected && styles.intensityNameSelected]}>{option.name}</Text>
                  <Text style={styles.intensityDesc}>{option.description}</Text>
                  {isSelected && (
                    <View style={styles.intensityCheck}>
                      <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* FLAVOR PROFILE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flavor Profile</Text>
            <Text style={[styles.sectionHint, { color: '#8B7355' }]}>Optional — pick any</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Subtle additions that elevate your brownie</Text>
          <View style={styles.flavorGrid}>
            {flavorProfileOptions.map((option) => {
              const isSelected = cake.brownieFlavorProfile.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.flavorCard, isSelected && styles.flavorCardSelected]}
                  onPress={() => toggleBrownieFlavorProfile(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.flavorIcon, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as any} size={20} color="#5D4037" />
                  </View>
                  <Text style={[styles.flavorName, isSelected && styles.flavorNameSelected]}>{option.name}</Text>
                  <Text style={styles.flavorDesc}>{option.description}</Text>
                  {isSelected && (
                    <View style={styles.flavorCheck}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#4A3F35' },
  sectionHint: { fontSize: 12, fontWeight: '600', color: '#E85A4F' },
  sectionSubtitle: { fontSize: 13, color: '#8B7355', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  cardSelectedBrown: { borderColor: '#5D4037', backgroundColor: '#FDF8F5' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: { opacity: 1 },
  emoji: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#4A3F35', marginBottom: 2 },
  cardNameSelected: { color: '#5D4037' },
  cardDesc: { fontSize: 12, color: '#8B7355', lineHeight: 17 },
  intensityRow: { flexDirection: 'row', gap: 10 },
  intensityCard: {
    flex: 1,
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
  intensityCardSelected: { borderColor: '#5D4037', backgroundColor: '#FDF8F5' },
  intensityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  intensityIconDark: { borderColor: 'rgba(255,255,255,0.2)' },
  intensityName: { fontSize: 14, fontWeight: '700', color: '#4A3F35', marginBottom: 4, textAlign: 'center' },
  intensityNameSelected: { color: '#5D4037' },
  intensityDesc: { fontSize: 11, color: '#8B7355', textAlign: 'center', lineHeight: 15 },
  intensityCheck: { position: 'absolute', top: 8, right: 8 },
  flavorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  flavorCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  flavorCardSelected: { borderColor: '#5D4037', backgroundColor: '#FDF8F5' },
  flavorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  flavorName: { fontSize: 13, fontWeight: '700', color: '#4A3F35', marginBottom: 2 },
  flavorNameSelected: { color: '#5D4037' },
  flavorDesc: { fontSize: 11, color: '#8B7355', lineHeight: 15 },
  flavorCheck: { position: 'absolute', top: 8, right: 8 },
});

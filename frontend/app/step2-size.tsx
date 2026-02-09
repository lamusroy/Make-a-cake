import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const sizeOptions = [
  { 
    id: 'small', 
    name: 'Small', 
    servings: '6-8',
    volume: '4 cups batter',
    examples: '6" round, 8" square, 12 cupcakes',
    icon: 'ellipse-outline',
    multiplier: 0.75,
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    servings: '10-14',
    volume: '6 cups batter',
    examples: '8" round, 9" square, 9x13" pan',
    icon: 'ellipse',
    multiplier: 1,
  },
  { 
    id: 'large', 
    name: 'Large', 
    servings: '16-20',
    volume: '8 cups batter',
    examples: '10" round, 2x 8" layers, bundt pan',
    icon: 'radio-button-on',
    multiplier: 1.5,
  },
  { 
    id: 'party', 
    name: 'Party Size', 
    servings: '24-30',
    volume: '12 cups batter',
    examples: 'Sheet cake, 3x 8" layers, 24 cupcakes',
    icon: 'apps',
    multiplier: 2,
  },
];

export default function Step2Size() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCakeSize = useCakeStore((state) => state.setCakeSize);

  const handleNext = () => {
    // Route based on dessert type
    if (cake.dessertType === 'brownie') {
      router.push('/step-brownie-mixins');
    } else if (cake.dessertType === 'cheesecake') {
      router.push('/step-cheesecake-crust');
    } else {
      router.push('/step3-frosting');
    }
  };

  // Calculate total steps based on dessert type
  const getTotalSteps = () => {
    if (cake.dessertType === 'brownie') return 4; // Flavor, Size, Mix-ins, Fine-tune
    if (cake.dessertType === 'cheesecake') return 5; // Flavor, Size, Crust, Toppings, Fine-tune
    return 6; // Regular cake flow
  };

  const selectedSize = sizeOptions.find(s => s.id === cake.cakeSize) || sizeOptions[1];

  return (
    <StepLayout
      step={2}
      totalSteps={6}
      title="Choose Your Size"
      subtitle="How much cake do you need?"
      onNext={handleNext}
      canProceed={!!cake.cakeSize}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {sizeOptions.map((option) => {
            const isSelected = cake.cakeSize === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.sizeCard, isSelected && styles.sizeCardSelected]}
                onPress={() => setCakeSize(option.id, option.multiplier)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={32} 
                    color={isSelected ? '#FFF' : '#8B5A2B'} 
                  />
                </View>
                
                <View style={styles.sizeInfo}>
                  <View style={styles.sizeHeader}>
                    <Text style={[styles.sizeName, isSelected && styles.sizeNameSelected]}>
                      {option.name}
                    </Text>
                    <View style={[styles.servingsBadge, isSelected && styles.servingsBadgeSelected]}>
                      <Ionicons name="people" size={14} color={isSelected ? '#E85A4F' : '#8B5A2B'} />
                      <Text style={[styles.servingsText, isSelected && styles.servingsTextSelected]}>
                        {option.servings} servings
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.volumeRow}>
                    <Ionicons name="beaker-outline" size={16} color="#A0785C" />
                    <Text style={styles.volumeText}>{option.volume}</Text>
                  </View>
                  
                  <Text style={styles.examplesText}>
                    <Text style={styles.examplesLabel}>Works for: </Text>
                    {option.examples}
                  </Text>
                </View>
                
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Flexible Molds</Text>
            <Text style={styles.infoText}>
              The recipe will adjust for your chosen volume. Use any mold shape - round, square, bundt, or even cupcakes!
            </Text>
          </View>
        </View>
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    gap: 12,
  },
  sizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeCardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: '#E85A4F',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sizeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  sizeNameSelected: {
    color: '#E85A4F',
  },
  servingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0D4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  servingsBadgeSelected: {
    backgroundColor: '#FFEBE9',
  },
  servingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  servingsTextSelected: {
    color: '#E85A4F',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  volumeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0785C',
  },
  examplesText: {
    fontSize: 13,
    color: '#A0785C',
    lineHeight: 18,
  },
  examplesLabel: {
    fontWeight: '600',
    color: '#8B5A2B',
  },
  checkmark: {
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
});

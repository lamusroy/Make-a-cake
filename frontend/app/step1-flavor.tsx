import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { OptionCard } from '../src/components/OptionCard';
import { useCakeStore, flavorOptions } from '../src/store/cakeStore';

export default function Step1Flavor() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setFlavor = useCakeStore((state) => state.setFlavor);

  const handleSelect = (id: string, color?: string) => {
    const option = flavorOptions.find(o => o.id === id);
    if (option) {
      setFlavor(option.name, option.color, option.type as 'cake' | 'brownie' | 'cheesecake');
    }
  };

  const handleNext = () => {
    router.push('/step2-size');
  };

  // Group options by type
  const cakeOptions = flavorOptions.filter(o => o.type === 'cake');
  const specialOptions = flavorOptions.filter(o => o.type !== 'cake');

  return (
    <StepLayout
      step={1}
      totalSteps={6}
      title="Choose Your Dessert"
      subtitle="Pick your base flavor or dessert type"
      onNext={handleNext}
      canProceed={!!cake.flavor}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Classic Cakes */}
        <Text style={styles.sectionTitle}>Classic Cakes</Text>
        <View style={styles.optionsGrid}>
          {cakeOptions.map((option) => (
            <OptionCard
              key={option.id}
              id={option.id}
              name={option.name}
              color={option.color}
              icon={option.icon}
              selected={cake.flavor === option.name}
              onSelect={handleSelect}
            />
          ))}
        </View>

        {/* Special Desserts */}
        <Text style={styles.sectionTitle}>Special Desserts</Text>
        <View style={styles.optionsGrid}>
          {specialOptions.map((option) => (
            <OptionCard
              key={option.id}
              id={option.id}
              name={option.name}
              color={option.color}
              icon={option.icon}
              selected={cake.flavor === option.name}
              onSelect={handleSelect}
            />
          ))}
        </View>
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

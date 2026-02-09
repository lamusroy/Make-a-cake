import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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
      setFlavor(option.name, option.color);
    }
  };

  const handleNext = () => {
    router.push('/step2-size');
  };

  return (
    <StepLayout
      step={1}
      totalSteps={6}
      title="Choose Your Flavor"
      subtitle="Pick the base flavor for your cake"
      onNext={handleNext}
      canProceed={!!cake.flavor}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.optionsGrid}>
          {flavorOptions.map((option) => (
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

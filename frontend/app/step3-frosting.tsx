import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { OptionCard } from '../src/components/OptionCard';
import { useCakeStore, frostingOptions } from '../src/store/cakeStore';

export default function Step3Frosting() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setFrosting = useCakeStore((state) => state.setFrosting);

  const handleSelect = (id: string, color?: string) => {
    const option = frostingOptions.find(o => o.id === id);
    if (option) {
      setFrosting(option.name, option.color);
    }
  };

  const handleNext = () => {
    router.push('/step4-filling');
  };

  return (
    <StepLayout
      step={3}
      totalSteps={6}
      title="Pick Your Frosting"
      subtitle="The creamy coating for your cake"
      onNext={handleNext}
      canProceed={!!cake.frosting}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.optionsGrid}>
          {frostingOptions.map((option) => (
            <OptionCard
              key={option.id}
              id={option.id}
              name={option.name}
              color={option.color}
              icon={option.icon}
              selected={cake.frosting === option.name}
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

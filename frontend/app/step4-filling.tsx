import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { OptionCard } from '../src/components/OptionCard';
import { useCakeStore, fillingOptions } from '../src/store/cakeStore';

export default function Step4Filling() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setFilling = useCakeStore((state) => state.setFilling);

  const handleSelect = (id: string, color?: string) => {
    const option = fillingOptions.find(o => o.id === id);
    if (option) {
      setFilling(option.name, option.color);
    }
  };

  const handleNext = () => {
    router.push('/step5-decorations');
  };

  return (
    <StepLayout
      step={4}
      totalSteps={5}
      title="Select Your Filling"
      subtitle="The delicious surprise inside"
      onNext={handleNext}
      canProceed={!!cake.filling}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.optionsGrid}>
          {fillingOptions.map((option) => (
            <OptionCard
              key={option.id}
              id={option.id}
              name={option.name}
              color={option.color}
              icon={option.icon}
              selected={cake.filling === option.name}
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

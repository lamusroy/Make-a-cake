import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const layerOptions = [
  { count: 1, name: 'Single', description: 'Simple & Classic' },
  { count: 2, name: 'Double', description: 'Perfect Balance' },
  { count: 3, name: 'Triple', description: 'Towering Delight' },
];

export default function Step2Layers() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setLayers = useCakeStore((state) => state.setLayers);

  const handleNext = () => {
    router.push('/step3-frosting');
  };

  return (
    <StepLayout
      step={2}
      totalSteps={6}
      title="How Many Layers?"
      subtitle="Build your cake height"
      onNext={handleNext}
      canProceed={true}
    >
      <View style={styles.container}>
        {layerOptions.map((option) => (
          <LayerOption
            key={option.count}
            count={option.count}
            name={option.name}
            description={option.description}
            selected={cake.layers === option.count}
            onSelect={() => setLayers(option.count)}
            flavorColor={cake.flavorColor || '#D4A574'}
          />
        ))}
      </View>
    </StepLayout>
  );
}

interface LayerOptionProps {
  count: number;
  name: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  flavorColor: string;
}

const LayerOption: React.FC<LayerOptionProps> = ({
  count,
  name,
  description,
  selected,
  onSelect,
  flavorColor,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onSelect();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.optionCard, selected && styles.optionCardSelected]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.layersPreview}>
          {Array.from({ length: count }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.layerBlock,
                { backgroundColor: flavorColor },
                { width: 50 + (i * 8), marginTop: i > 0 ? 3 : 0 }
              ]}
            />
          ))}
        </View>
        <View style={styles.optionInfo}>
          <Text style={[styles.optionName, selected && styles.optionNameSelected]}>
            {name}
          </Text>
          <Text style={styles.optionDesc}>{description}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count} Layer{count > 1 ? 's' : ''}</Text>
          </View>
        </View>
        {selected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  layersPreview: {
    alignItems: 'center',
    marginRight: 20,
  },
  layerBlock: {
    height: 18,
    borderRadius: 4,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  optionNameSelected: {
    color: '#E85A4F',
  },
  optionDesc: {
    fontSize: 14,
    color: '#A0785C',
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: '#FFF0D4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  checkmark: {
    marginLeft: 10,
  },
});

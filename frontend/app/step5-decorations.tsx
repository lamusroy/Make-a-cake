import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore, decorationOptions } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

export default function Step5Decorations() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const toggleDecoration = useCakeStore((state) => state.toggleDecoration);

  const handleNext = () => {
    router.push('/step6-finetune');
  };

  return (
    <StepLayout
      step={5}
      totalSteps={6}
      title="Add Decorations"
      subtitle="Make it extra special (optional)"
      onNext={handleNext}
      nextLabel="Get Recipe!"
      canProceed={true}
    >
      <View style={styles.container}>
        <Text style={styles.hint}>
          <Ionicons name="information-circle" size={16} color="#A0785C" />
          {' '}Tap to select multiple decorations
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.optionsGrid}>
            {decorationOptions.map((option) => (
              <DecorationCard
                key={option.id}
                id={option.id}
                name={option.name}
                icon={option.icon}
                selected={cake.decorations.includes(option.id)}
                onToggle={() => toggleDecoration(option.id)}
              />
            ))}
          </View>
        </ScrollView>
        
        {cake.decorations.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected: </Text>
            <Text style={styles.selectedText}>
              {cake.decorations.map(id => 
                decorationOptions.find(d => d.id === id)?.name
              ).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </StepLayout>
  );
}

interface DecorationCardProps {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
  onToggle: () => void;
}

const DecorationCard: React.FC<DecorationCardProps> = ({
  id,
  name,
  icon,
  selected,
  onToggle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.decorationCard,
          selected && styles.decorationCardSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
          <Ionicons 
            name={icon as any} 
            size={28} 
            color={selected ? '#FFF' : '#8B5A2B'} 
          />
        </View>
        <Text style={[styles.decorationName, selected && styles.decorationNameSelected]}>
          {name}
        </Text>
        {selected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hint: {
    fontSize: 14,
    color: '#A0785C',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  decorationCard: {
    width: CARD_SIZE,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  decorationCardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainerSelected: {
    backgroundColor: '#E85A4F',
  },
  decorationName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5A2B',
    textAlign: 'center',
  },
  decorationNameSelected: {
    color: '#E85A4F',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  selectedText: {
    fontSize: 14,
    color: '#E85A4F',
    fontWeight: '500',
    flex: 1,
  },
});

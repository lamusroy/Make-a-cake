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
  const setDecorations = useCakeStore((state) => state.setDecorations);

  const handleNext = () => {
    router.push('/step6-finetune');
  };

  const handleSkip = () => {
    setDecorations([]);
    router.push('/step6-finetune');
  };

  const hasDecorations = cake.decorations.length > 0;

  return (
    <StepLayout
      step={5}
      totalSteps={6}
      title="Add Toppings"
      subtitle="Make it extra special (optional)"
      onNext={handleNext}
      nextLabel="Next"
      canProceed={true}
    >
      <View style={styles.container}>
        {/* Skip Option */}
        <TouchableOpacity
          style={[styles.skipCard, !hasDecorations && styles.skipCardSelected]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <View style={[styles.skipIconContainer, !hasDecorations && styles.skipIconContainerSelected]}>
            <Ionicons 
              name="close-circle-outline" 
              size={28} 
              color={!hasDecorations ? '#FFF' : '#8B5A2B'} 
            />
          </View>
          <View style={styles.skipContent}>
            <Text style={[styles.skipTitle, !hasDecorations && styles.skipTitleSelected]}>
              Keep it Plain
            </Text>
            <Text style={styles.skipSubtitle}>No toppings, just the beautiful cake</Text>
          </View>
          {!hasDecorations && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or add toppings</Text>
          <View style={styles.dividerLine} />
        </View>
        
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
        
        {hasDecorations && (
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
  skipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipCardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  skipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  skipIconContainerSelected: {
    backgroundColor: '#E85A4F',
  },
  skipContent: {
    flex: 1,
  },
  skipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  skipTitleSelected: {
    color: '#E85A4F',
  },
  skipSubtitle: {
    fontSize: 13,
    color: '#A0785C',
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8DDD4',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#A0785C',
    fontWeight: '500',
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

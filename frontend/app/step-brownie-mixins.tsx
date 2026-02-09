import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore, mixInOptions } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

export default function StepBrownieMixins() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const toggleMixIn = useCakeStore((state) => state.toggleMixIn);
  const setMixIns = useCakeStore((state) => state.setMixIns);

  const handleNext = () => {
    router.push('/step6-finetune');
  };

  const handleSkip = () => {
    setMixIns([]);
    router.push('/step6-finetune');
  };

  const hasMixIns = cake.mixIns.length > 0;

  return (
    <StepLayout
      step={3}
      totalSteps={4}
      title="Add Mix-ins"
      subtitle="Make your brownies extra special"
      onNext={handleNext}
      nextLabel="Next"
      canProceed={true}
    >
      <View style={styles.container}>
        {/* Skip Option */}
        <TouchableOpacity
          style={[styles.skipCard, !hasMixIns && styles.skipCardSelected]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <View style={[styles.skipIconContainer, !hasMixIns && styles.skipIconContainerSelected]}>
            <Ionicons 
              name="close-circle-outline" 
              size={28} 
              color={!hasMixIns ? '#FFF' : '#5D4037'} 
            />
          </View>
          <View style={styles.skipContent}>
            <Text style={[styles.skipTitle, !hasMixIns && styles.skipTitleSelected]}>
              Classic Brownie
            </Text>
            <Text style={styles.skipSubtitle}>Pure chocolate perfection, no mix-ins</Text>
          </View>
          {!hasMixIns && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or add mix-ins</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.optionsGrid}>
            {mixInOptions.map((option) => (
              <MixInCard
                key={option.id}
                id={option.id}
                name={option.name}
                icon={option.icon}
                selected={cake.mixIns.includes(option.id)}
                onToggle={() => toggleMixIn(option.id)}
              />
            ))}
          </View>
        </ScrollView>
        
        {hasMixIns && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected: </Text>
            <Text style={styles.selectedText}>
              {cake.mixIns.map(id => 
                mixInOptions.find(m => m.id === id)?.name
              ).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </StepLayout>
  );
}

interface MixInCardProps {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
  onToggle: () => void;
}

const MixInCard: React.FC<MixInCardProps> = ({
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
        style={[styles.mixInCard, selected && styles.mixInCardSelected]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
          <Ionicons 
            name={icon as any} 
            size={28} 
            color={selected ? '#FFF' : '#5D4037'} 
          />
        </View>
        <Text style={[styles.mixInName, selected && styles.mixInNameSelected]}>
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
    borderColor: '#5D4037',
    backgroundColor: '#EFEBE9',
  },
  skipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D7CCC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  skipIconContainerSelected: {
    backgroundColor: '#5D4037',
  },
  skipContent: {
    flex: 1,
  },
  skipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D4037',
  },
  skipTitleSelected: {
    color: '#3E2723',
  },
  skipSubtitle: {
    fontSize: 13,
    color: '#8D6E63',
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
    backgroundColor: '#D7CCC8',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#8D6E63',
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
  mixInCard: {
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
  mixInCardSelected: {
    borderColor: '#5D4037',
    backgroundColor: '#EFEBE9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D7CCC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainerSelected: {
    backgroundColor: '#5D4037',
  },
  mixInName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5D4037',
    textAlign: 'center',
  },
  mixInNameSelected: {
    color: '#3E2723',
    fontWeight: '700',
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
    backgroundColor: '#EFEBE9',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5D4037',
  },
  selectedText: {
    fontSize: 14,
    color: '#3E2723',
    fontWeight: '500',
    flex: 1,
  },
});

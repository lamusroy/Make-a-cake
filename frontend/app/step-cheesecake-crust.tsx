import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore, crustOptions } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function StepCheesecakeCrust() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setCrust = useCakeStore((state) => state.setCrust);

  const handleSelect = (id: string) => {
    const option = crustOptions.find(o => o.id === id);
    if (option) {
      setCrust(option.name, option.color);
    }
  };

  const handleNext = () => {
    router.push('/step5-decorations');
  };

  return (
    <StepLayout
      step={3}
      totalSteps={5}
      title="Choose Your Crust"
      subtitle="The perfect base for your cheesecake"
      onNext={handleNext}
      canProceed={!!cake.crust}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.optionsGrid}>
          {crustOptions.map((option) => (
            <CrustCard
              key={option.id}
              id={option.id}
              name={option.name}
              color={option.color}
              icon={option.icon}
              selected={cake.crust === option.name}
              onSelect={() => handleSelect(option.id)}
            />
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#FFB300" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Crust Tips</Text>
            <Text style={styles.infoText}>
              Graham cracker is classic, Oreo adds chocolate depth, and pretzel brings a sweet-salty contrast!
            </Text>
          </View>
        </View>
      </ScrollView>
    </StepLayout>
  );
}

interface CrustCardProps {
  id: string;
  name: string;
  color: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
}

const CrustCard: React.FC<CrustCardProps> = ({
  id,
  name,
  color,
  icon,
  selected,
  onSelect,
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

  const isLight = (c: string): boolean => {
    const hex = c.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 155;
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.crustCard, selected && styles.crustCardSelected]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.crustPreview, { backgroundColor: color }]}>
          <Ionicons 
            name={icon as any} 
            size={32} 
            color={isLight(color) ? '#8D6E63' : '#FFF'} 
          />
        </View>
        <Text style={[styles.crustName, selected && styles.crustNameSelected]}>
          {name}
        </Text>
        {selected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  crustCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  crustCardSelected: {
    borderColor: '#FFB300',
    backgroundColor: '#FFF8E1',
  },
  crustPreview: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  crustName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8D6E63',
    textAlign: 'center',
  },
  crustNameSelected: {
    color: '#FF8F00',
    fontWeight: '700',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF8F00',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#8D6E63',
    lineHeight: 18,
  },
});

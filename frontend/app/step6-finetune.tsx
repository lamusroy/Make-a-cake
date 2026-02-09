import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StepLayout } from '../src/components/StepLayout';
import { useCakeStore, moistureBoostOptions } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ToggleSwitchProps {
  title: string;
  description: string;
  optionA: { label: string; icon: string; tip: string };
  optionB: { label: string; icon: string; tip: string };
  value: boolean; // false = A, true = B
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  title,
  description,
  optionA,
  optionB,
  value,
  onToggle,
}) => {
  const selectedOption = value ? optionB : optionA;

  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleHeader}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleOption, !value && styles.toggleOptionSelected]}
          onPress={() => onToggle(false)}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleIconContainer, !value && styles.toggleIconContainerSelected]}>
            <Ionicons 
              name={optionA.icon as any} 
              size={24} 
              color={!value ? '#FFF' : '#8B5A2B'} 
            />
          </View>
          <Text style={[styles.toggleLabel, !value && styles.toggleLabelSelected]}>
            {optionA.label}
          </Text>
          {!value && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark" size={14} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.toggleDivider}>
          <Text style={styles.toggleOr}>or</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.toggleOption, value && styles.toggleOptionSelected]}
          onPress={() => onToggle(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleIconContainer, value && styles.toggleIconContainerSelected]}>
            <Ionicons 
              name={optionB.icon as any} 
              size={24} 
              color={value ? '#FFF' : '#8B5A2B'} 
            />
          </View>
          <Text style={[styles.toggleLabel, value && styles.toggleLabelSelected]}>
            {optionB.label}
          </Text>
          {value && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark" size={14} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.tipContainer}>
        <Ionicons name="information-circle" size={16} color="#A0785C" />
        <Text style={styles.tipText}>{selectedOption.tip}</Text>
      </View>
    </View>
  );
};

interface MoistureOptionProps {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const MoistureOption: React.FC<MoistureOptionProps> = ({
  id,
  name,
  description,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.moistureCard, selected && styles.moistureCardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <Text style={[styles.moistureName, selected && styles.moistureNameSelected]}>
        {name}
      </Text>
      <Text style={styles.moistureDesc}>{description}</Text>
      {selected && (
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.moistureCheck} />
      )}
    </TouchableOpacity>
  );
};

export default function Step6FineTune() {
  const router = useRouter();
  const cake = useCakeStore((state) => state.cake);
  const setFatType = useCakeStore((state) => state.setFatType);
  const setFluffiness = useCakeStore((state) => state.setFluffiness);
  const setSweetness = useCakeStore((state) => state.setSweetness);
  const setRichness = useCakeStore((state) => state.setRichness);
  const setMoistureBoost = useCakeStore((state) => state.setMoistureBoost);
  const setRiseIntensity = useCakeStore((state) => state.setRiseIntensity);

  const handleNext = () => {
    router.push('/recipe-result');
  };

  // Convert numeric values to boolean (0 = false/A, 100 = true/B)
  const fatTypeIsOil = cake.fatType > 50;
  const fluffinessIsWhipped = cake.fluffiness > 50;
  const sweetnessIsExtra = cake.sweetness > 50;
  const richnessIsExtra = cake.richness > 50;
  const riseIsHigh = cake.riseIntensity > 50;

  // Calculate step number based on dessert type
  const getStepInfo = () => {
    if (cake.dessertType === 'brownie') return { step: 4, total: 4 };
    if (cake.dessertType === 'cheesecake') return { step: 5, total: 5 };
    return { step: 6, total: 6 };
  };
  const stepInfo = getStepInfo();

  const getTitle = () => {
    if (cake.dessertType === 'brownie') return 'Fine-Tune Your Brownie';
    if (cake.dessertType === 'cheesecake') return 'Fine-Tune Your Cheesecake';
    return 'Fine-Tune Your Cake';
  };

  return (
    <StepLayout
      step={stepInfo.step}
      totalSteps={stepInfo.total}
      title={getTitle()}
      subtitle="Adjust the texture and taste"
      onNext={handleNext}
      nextLabel="Get Recipe!"
      canProceed={true}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Fat Type Toggle */}
        <ToggleSwitch
          title="Fat Type"
          description="Choose your base fat"
          optionA={{
            label: 'Butter',
            icon: 'cube',
            tip: 'Rich & flavorful - perfect for vanilla, milky cakes',
          }}
          optionB={{
            label: 'Oil',
            icon: 'water',
            tip: 'Extra moist - ideal for carrot cake, stays fresh longer',
          }}
          value={fatTypeIsOil}
          onToggle={(v) => setFatType(v ? 100 : 0)}
        />
        
        {/* Fluffiness Toggle */}
        <ToggleSwitch
          title="Fluffiness"
          description="Egg preparation method"
          optionA={{
            label: 'Whole Eggs',
            icon: 'ellipse',
            tip: 'Dense, fudgy texture - classic pound cake style',
          }}
          optionB={{
            label: 'Whipped Whites',
            icon: 'cloud',
            tip: 'Light & airy - angel food cake texture',
          }}
          value={fluffinessIsWhipped}
          onToggle={(v) => setFluffiness(v ? 100 : 0)}
        />
        
        {/* Sweetness Toggle */}
        <ToggleSwitch
          title="Sweetness"
          description="Sugar level"
          optionA={{
            label: 'Standard',
            icon: 'remove-circle',
            tip: 'Balanced sweetness - lets other flavors shine',
          }}
          optionB={{
            label: 'Extra Sweet',
            icon: 'add-circle',
            tip: 'Decadent & indulgent - perfect for celebrations',
          }}
          value={sweetnessIsExtra}
          onToggle={(v) => setSweetness(v ? 100 : 0)}
        />
        
        {/* Richness Toggle */}
        <ToggleSwitch
          title="Richness"
          description="Egg yolk content"
          optionA={{
            label: 'Standard',
            icon: 'sunny-outline',
            tip: 'Classic recipe - balanced texture',
          }}
          optionB={{
            label: 'Extra Rich',
            icon: 'sunny',
            tip: 'Extra egg yolks - denser, more luxurious crumb',
          }}
          value={richnessIsExtra}
          onToggle={(v) => setRichness(v ? 100 : 0)}
        />
        
        {/* Rise Toggle */}
        <ToggleSwitch
          title="Rise Height"
          description="Leavening amount"
          optionA={{
            label: 'Low Rise',
            icon: 'arrow-down',
            tip: 'Denser cake - great for layered desserts',
          }}
          optionB={{
            label: 'High Rise',
            icon: 'arrow-up',
            tip: 'Tall & fluffy - impressive presentation',
          }}
          value={riseIsHigh}
          onToggle={(v) => setRiseIntensity(v ? 100 : 0)}
        />
        
        {/* Moisture Boost Options */}
        <View style={styles.moistureSection}>
          <Text style={styles.sectionTitle}>Moisture Boost</Text>
          <Text style={styles.sectionSubtitle}>Add extra moisture to your cake</Text>
          <View style={styles.moistureGrid}>
            {moistureBoostOptions.map((option) => (
              <MoistureOption
                key={option.id}
                id={option.id}
                name={option.name}
                description={option.description}
                selected={cake.moistureBoost === option.id}
                onSelect={() => setMoistureBoost(option.id)}
              />
            ))}
          </View>
        </View>
        
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Ionicons name="restaurant" size={24} color="#E85A4F" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Your Cake Style</Text>
            <Text style={styles.summaryText}>
              {fatTypeIsOil ? 'Oil-based' : 'Butter-based'} • {' '}
              {fluffinessIsWhipped ? 'Light & Airy' : 'Dense & Fudgy'} • {' '}
              {sweetnessIsExtra ? 'Extra Sweet' : 'Balanced'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  toggleContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleHeader: {
    marginBottom: 14,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#A0785C',
    marginTop: 2,
  },
  toggleButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleOption: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  toggleOptionSelected: {
    backgroundColor: '#FFF5F4',
    borderColor: '#E85A4F',
  },
  toggleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8DDD4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toggleIconContainerSelected: {
    backgroundColor: '#E85A4F',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
    textAlign: 'center',
  },
  toggleLabelSelected: {
    color: '#E85A4F',
    fontWeight: '700',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleDivider: {
    paddingHorizontal: 12,
  },
  toggleOr: {
    fontSize: 12,
    color: '#A0785C',
    fontWeight: '500',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E8E0',
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#A0785C',
    lineHeight: 18,
  },
  moistureSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A2B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A0785C',
    marginBottom: 12,
  },
  moistureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moistureCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    width: (width - 60) / 2 - 5,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  moistureCardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  moistureName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  moistureNameSelected: {
    color: '#E85A4F',
  },
  moistureDesc: {
    fontSize: 12,
    color: '#A0785C',
    marginTop: 2,
  },
  moistureCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  summaryCard: {
    backgroundColor: '#FFF5F4',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E85A4F',
    gap: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E85A4F',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    color: '#8B5A2B',
    lineHeight: 18,
  },
});

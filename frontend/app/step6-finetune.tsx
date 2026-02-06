import React, { useState } from 'react';
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
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  middleLabel?: string;
  leftIcon: string;
  rightIcon: string;
  leftColor: string;
  rightColor: string;
  description: string;
  title: string;
}

const CustomSlider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  leftLabel,
  rightLabel,
  middleLabel,
  leftIcon,
  rightIcon,
  leftColor,
  rightColor,
  description,
  title,
}) => {
  const sliderWidth = width - 80;
  const thumbPosition = (value / 100) * (sliderWidth - 30);

  const handleSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const newValue = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
    onValueChange(Math.round(newValue));
  };

  const getThumbColor = () => {
    if (value < 33) return leftColor;
    if (value > 66) return rightColor;
    return '#FFB74D';
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderTitle}>{title}</Text>
        <Text style={styles.sliderDescription}>{description}</Text>
      </View>
      
      <View style={styles.sliderLabels}>
        <View style={styles.labelContainer}>
          <Ionicons name={leftIcon as any} size={20} color={leftColor} />
          <Text style={[styles.labelText, { color: leftColor }]}>{leftLabel}</Text>
        </View>
        {middleLabel && (
          <View style={styles.labelContainer}>
            <Text style={styles.middleLabelText}>{middleLabel}</Text>
          </View>
        )}
        <View style={styles.labelContainer}>
          <Ionicons name={rightIcon as any} size={20} color={rightColor} />
          <Text style={[styles.labelText, { color: rightColor }]}>{rightLabel}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        activeOpacity={1}
        onPress={handleSliderPress}
        style={[styles.sliderTrack, { width: sliderWidth }]}
      >
        <View style={styles.sliderTrackBg}>
          <View 
            style={[
              styles.sliderFill, 
              { width: `${value}%`, backgroundColor: getThumbColor() }
            ]} 
          />
        </View>
        <View 
          style={[
            styles.sliderThumb, 
            { 
              left: thumbPosition,
              backgroundColor: getThumbColor(),
            }
          ]}
        >
          <Text style={styles.thumbValue}>{value}</Text>
        </View>
        {/* Tick marks */}
        <View style={styles.tickContainer}>
          <View style={styles.tick} />
          <View style={styles.tick} />
          <View style={styles.tick} />
        </View>
      </TouchableOpacity>
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

  const getFatTypeLabel = () => {
    if (cake.fatType < 33) return 'Rich & Flavorful';
    if (cake.fatType > 66) return 'Moist & Light';
    return 'Balanced';
  };

  const getFluffinessLabel = () => {
    if (cake.fluffiness < 33) return 'Dense & Fudgy';
    if (cake.fluffiness > 66) return 'Light & Airy';
    return 'Classic';
  };

  return (
    <StepLayout
      step={6}
      totalSteps={6}
      title="Fine-Tune Your Cake"
      subtitle="Adjust the texture and taste"
      onNext={handleNext}
      nextLabel="Get Recipe!"
      canProceed={true}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Fat Type Slider */}
        <CustomSlider
          value={cake.fatType}
          onValueChange={setFatType}
          title="Fat Type"
          description={getFatTypeLabel()}
          leftLabel="Butter"
          middleLabel="Lard"
          rightLabel="Oil"
          leftIcon="cube"
          rightIcon="water"
          leftColor="#FFB74D"
          rightColor="#81D4FA"
        />
        
        {/* Fluffiness Slider */}
        <CustomSlider
          value={cake.fluffiness}
          onValueChange={setFluffiness}
          title="Fluffiness"
          description={getFluffinessLabel()}
          leftLabel="Whole Eggs"
          rightLabel="Whipped Whites"
          leftIcon="ellipse"
          rightIcon="cloud"
          leftColor="#8D6E63"
          rightColor="#E1F5FE"
        />
        
        {/* Sweetness Slider */}
        <CustomSlider
          value={cake.sweetness}
          onValueChange={setSweetness}
          title="Sweetness"
          description={cake.sweetness < 33 ? 'Subtle' : cake.sweetness > 66 ? 'Decadent' : 'Balanced'}
          leftLabel="Less Sweet"
          rightLabel="Extra Sweet"
          leftIcon="remove-circle"
          rightIcon="add-circle"
          leftColor="#A5D6A7"
          rightColor="#F48FB1"
        />
        
        {/* Richness Slider */}
        <CustomSlider
          value={cake.richness}
          onValueChange={setRichness}
          title="Richness"
          description={cake.richness < 33 ? 'Light' : cake.richness > 66 ? 'Extra Yolks' : 'Standard'}
          leftLabel="Standard"
          rightLabel="Rich"
          leftIcon="sunny-outline"
          rightIcon="sunny"
          leftColor="#FFF9C4"
          rightColor="#FFD54F"
        />
        
        {/* Rise Intensity Slider */}
        <CustomSlider
          value={cake.riseIntensity}
          onValueChange={setRiseIntensity}
          title="Rise Intensity"
          description={cake.riseIntensity < 33 ? 'Low & Dense' : cake.riseIntensity > 66 ? 'High & Fluffy' : 'Medium'}
          leftLabel="Low Rise"
          rightLabel="High Rise"
          leftIcon="arrow-down"
          rightIcon="arrow-up"
          leftColor="#BCAAA4"
          rightColor="#90CAF9"
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
        
        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Ionicons name="bulb" size={24} color="#FFB74D" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Pro Tips</Text>
            <Text style={styles.tipsText}>
              • Butter = Best for vanilla, milky cakes{"\n"}
              • Oil = Great for carrot, keeps moist longer{"\n"}
              • Whipped whites = Lighter, angel food texture{"\n"}
              • Sour cream = Tangy & incredibly moist
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
  sliderContainer: {
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
  sliderHeader: {
    marginBottom: 12,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  sliderDescription: {
    fontSize: 14,
    color: '#E85A4F',
    fontWeight: '600',
    marginTop: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  middleLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A0785C',
  },
  sliderTrack: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrackBg: {
    height: 8,
    backgroundColor: '#E8DDD4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    top: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbValue: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  tickContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tick: {
    width: 2,
    height: 8,
    backgroundColor: '#D0C4BC',
    borderRadius: 1,
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
  tipsCard: {
    backgroundColor: '#FFF9E8',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#FFE082',
    gap: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A2B',
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 20,
  },
});

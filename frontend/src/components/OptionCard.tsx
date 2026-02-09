import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface OptionCardProps {
  id: string;
  name: string;
  color?: string;
  icon: string;
  selected: boolean;
  onSelect: (id: string, color?: string) => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
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
    scale.value = withSpring(0.97, {}, () => {
      scale.value = withSpring(1);
    });
    onSelect(id, color);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View 
          style={[
            styles.iconContainer, 
            { backgroundColor: color || '#F5EEE6' },
            selected && styles.iconContainerSelected,
          ]}
        >
          <Ionicons 
            name={icon as any} 
            size={28} 
            color={color && isLightColor(color) ? '#6B5B4F' : '#FFF'} 
          />
        </View>
        <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
        {selected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={22} color="#7CB07F" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper function to determine if a color is light
const isLightColor = (color: string): boolean => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#C4704F',
    backgroundColor: '#FDF9F6',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconContainerSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5B4F',
    textAlign: 'center',
  },
  nameSelected: {
    color: '#C4704F',
    fontWeight: '700',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

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
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onSelect(id, color);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.cardSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View 
          style={[
            styles.iconContainer, 
            { backgroundColor: color || '#FFF' },
            selected && styles.iconContainerSelected,
          ]}
        >
          <Ionicons 
            name={icon as any} 
            size={32} 
            color={color && isLightColor(color) ? '#8B5A2B' : '#FFF'} 
          />
        </View>
        <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
        {selected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
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
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#E85A4F',
    backgroundColor: '#FFF8F7',
  },
  iconContainer: {
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
  iconContainerSelected: {
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5A2B',
    textAlign: 'center',
  },
  nameSelected: {
    color: '#E85A4F',
    fontWeight: '700',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCakeStore, decorationOptions } from '../store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

interface CakePreviewProps {
  size?: 'small' | 'medium' | 'large';
}

export const CakePreview: React.FC<CakePreviewProps> = ({ size = 'medium' }) => {
  const cake = useCakeStore((state) => state.cake);
  
  const scale = size === 'small' ? 0.5 : size === 'large' ? 1.2 : 1;
  const baseWidth = 150 * scale;
  
  const getLayerStyle = (index: number) => {
    const layerWidth = baseWidth + (index * 10 * scale);
    const layerHeight = 40 * scale;
    return {
      width: layerWidth,
      height: layerHeight,
      backgroundColor: cake.flavorColor || '#D4A574',
      borderRadius: 8 * scale,
      marginTop: index > 0 ? 2 * scale : -5 * scale,
    };
  };
  
  const renderDecorations = () => {
    return cake.decorations.map((decId, index) => {
      const decoration = decorationOptions.find(d => d.id === decId);
      if (!decoration) return null;
      
      const positions = [
        { top: -30 * scale, left: 20 * scale },
        { top: -25 * scale, right: 20 * scale },
        { top: -35 * scale, left: 50 * scale },
        { top: -20 * scale, right: 50 * scale },
      ];
      
      const pos = positions[index % positions.length];
      
      return (
        <View key={decId} style={[styles.decoration, pos]}>
          <Ionicons 
            name={decoration.icon as any} 
            size={18 * scale} 
            color="#E85A4F" 
          />
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      {/* Decorations */}
      <View style={styles.decorationsContainer}>
        {renderDecorations()}
      </View>
      
      {/* Candle */}
      <View style={styles.cakeTop}>
        <View style={[styles.candle, { height: 30 * scale, width: 8 * scale }]}>
          <View style={[styles.flame, { width: 12 * scale, height: 16 * scale }]} />
        </View>
      </View>
      
      {/* Frosting */}
      <View style={[
        styles.frosting, 
        { 
          width: baseWidth, 
          height: 22 * scale,
          backgroundColor: cake.frostingColor || '#FAFAFA',
        }
      ]}>
        <View style={[
          styles.frostingDrip, 
          { 
            width: 12 * scale, 
            height: 18 * scale,
            backgroundColor: cake.frostingColor || '#FAFAFA',
          }
        ]} />
        <View style={[
          styles.frostingDrip, 
          { 
            width: 10 * scale, 
            height: 24 * scale,
            backgroundColor: cake.frostingColor || '#FAFAFA',
          }
        ]} />
        <View style={[
          styles.frostingDrip, 
          { 
            width: 12 * scale, 
            height: 15 * scale,
            backgroundColor: cake.frostingColor || '#FAFAFA',
          }
        ]} />
      </View>
      
      {/* Cake Layers */}
      {Array.from({ length: cake.layers }).map((_, index) => (
        <View key={index}>
          <View style={getLayerStyle(index)} />
          {/* Filling between layers */}
          {index < cake.layers - 1 && (
            <View style={[
              styles.filling,
              {
                width: baseWidth + (index * 10 * scale) + (5 * scale),
                height: 6 * scale,
                backgroundColor: cake.fillingColor || '#F8B4B4',
              }
            ]} />
          )}
        </View>
      ))}
      
      {/* Plate */}
      <View style={[
        styles.plate, 
        { 
          width: baseWidth + (cake.layers * 15 * scale), 
          height: 12 * scale 
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  decorationsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  decoration: {
    position: 'absolute',
  },
  cakeTop: {
    alignItems: 'center',
    marginBottom: -5,
    zIndex: 10,
  },
  candle: {
    backgroundColor: '#FFD93D',
    borderRadius: 4,
    alignItems: 'center',
  },
  flame: {
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    marginTop: -8,
  },
  frosting: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    zIndex: 5,
  },
  frostingDrip: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  filling: {
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 1,
  },
  plate: {
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 4,
  },
});

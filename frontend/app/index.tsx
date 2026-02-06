import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useCakeStore } from '../src/store/cakeStore';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const resetCake = useCakeStore((state) => state.resetCake);

  // Animations
  const cakeScale = useSharedValue(1);
  const cakeBounce = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  useEffect(() => {
    // Cake bounce animation
    cakeBounce.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Sparkle animations
    sparkle1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      true
    );
    
    setTimeout(() => {
      sparkle2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700 }),
          withTiming(0, { duration: 700 })
        ),
        -1,
        true
      );
    }, 300);
    
    setTimeout(() => {
      sparkle3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        true
      );
    }, 600);
  }, []);

  const cakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cakeScale.value },
      { translateY: cakeBounce.value }
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [{ scale: 0.5 + sparkle1.value * 0.5 }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [{ scale: 0.5 + sparkle2.value * 0.5 }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [{ scale: 0.5 + sparkle3.value * 0.5 }],
  }));

  const handleStartBaking = () => {
    buttonScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
    resetCake();
    setTimeout(() => {
      router.push('/step1-flavor');
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background decorations */}
      <View style={styles.bgDecoration1} />
      <View style={styles.bgDecoration2} />
      <View style={styles.bgDecoration3} />

      {/* Sparkles */}
      <Animated.View style={[styles.sparkle, styles.sparkle1, sparkle1Style]}>
        <Ionicons name="sparkles" size={32} color="#FFD93D" />
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkle2, sparkle2Style]}>
        <Ionicons name="star" size={24} color="#FF6B9D" />
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkle3, sparkle3Style]}>
        <Ionicons name="sparkles" size={28} color="#95E1D3" />
      </Animated.View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleTop}>Make a</Text>
        <Text style={styles.titleMain}>CAKE!</Text>
        <Text style={styles.subtitle}>Create your dream cake & get the recipe</Text>
      </View>

      {/* Animated Cake */}
      <Animated.View style={[styles.cakeContainer, cakeAnimatedStyle]}>
        <View style={styles.cakeEmoji}>
          {/* Cake illustration using views */}
          <View style={styles.cakeTop}>
            <View style={styles.cherry} />
            <View style={styles.candle}>
              <View style={styles.flame} />
            </View>
          </View>
          <View style={styles.cakeFrosting}>
            <View style={styles.frostingDrip1} />
            <View style={styles.frostingDrip2} />
            <View style={styles.frostingDrip3} />
          </View>
          <View style={styles.cakeLayer1} />
          <View style={styles.cakeLayer2} />
          <View style={styles.cakeLayer3} />
          <View style={styles.cakePlate} />
        </View>
      </Animated.View>

      {/* Start Button */}
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartBaking}
          activeOpacity={0.8}
        >
          <Ionicons name="restaurant" size={28} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.startButtonText}>Start Baking!</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer decoration */}
      <View style={styles.footer}>
        <View style={styles.footerDot} />
        <View style={styles.footerDot} />
        <View style={styles.footerDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bgDecoration1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFE5EC',
  },
  bgDecoration2: {
    position: 'absolute',
    bottom: -50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8F6F3',
  },
  bgDecoration3: {
    position: 'absolute',
    top: height * 0.4,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0D4',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.15,
    right: 40,
  },
  sparkle2: {
    top: height * 0.25,
    left: 30,
  },
  sparkle3: {
    bottom: height * 0.25,
    right: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleTop: {
    fontSize: 28,
    fontWeight: '600',
    color: '#8B5A2B',
    letterSpacing: 2,
  },
  titleMain: {
    fontSize: 64,
    fontWeight: '900',
    color: '#E85A4F',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0785C',
    marginTop: 8,
    fontWeight: '500',
  },
  cakeContainer: {
    marginVertical: 30,
  },
  cakeEmoji: {
    alignItems: 'center',
  },
  cakeTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -5,
    zIndex: 10,
  },
  cherry: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E53E3E',
    marginRight: 10,
  },
  candle: {
    width: 8,
    height: 35,
    backgroundColor: '#FFD93D',
    borderRadius: 4,
    alignItems: 'center',
  },
  flame: {
    width: 12,
    height: 18,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    marginTop: -10,
  },
  cakeFrosting: {
    width: 160,
    height: 25,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    zIndex: 5,
  },
  frostingDrip1: {
    width: 15,
    height: 20,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  frostingDrip2: {
    width: 12,
    height: 28,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  frostingDrip3: {
    width: 15,
    height: 18,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cakeLayer1: {
    width: 150,
    height: 45,
    backgroundColor: '#F8B4B4',
    borderRadius: 8,
    marginTop: -5,
  },
  cakeLayer2: {
    width: 160,
    height: 45,
    backgroundColor: '#D4A574',
    borderRadius: 8,
    marginTop: 2,
  },
  cakeLayer3: {
    width: 170,
    height: 45,
    backgroundColor: '#B87333',
    borderRadius: 8,
    marginTop: 2,
  },
  cakePlate: {
    width: 200,
    height: 15,
    backgroundColor: '#DDD',
    borderRadius: 8,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#E85A4F',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#E85A4F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 8,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
});

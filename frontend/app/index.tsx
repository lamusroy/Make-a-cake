import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
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

  // Subtle animations
  const cakeBounce = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const steamOpacity = useSharedValue(0);

  useEffect(() => {
    // Gentle float animation
    cakeBounce.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Steam effect
    steamOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.2, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const cakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cakeBounce.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const steamStyle = useAnimatedStyle(() => ({
    opacity: steamOpacity.value,
  }));

  const handleStartBaking = () => {
    buttonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    resetCake();
    setTimeout(() => {
      router.push('/step1-flavor');
    }, 150);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Subtle background elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleTop}>Make a</Text>
        <Text style={styles.titleMain}>Cake</Text>
        <View style={styles.subtitleContainer}>
          <View style={styles.subtitleLine} />
          <Text style={styles.subtitle}>Recipe Builder</Text>
          <View style={styles.subtitleLine} />
        </View>
      </View>

      {/* Cake Illustration */}
      <Animated.View style={[styles.cakeContainer, cakeAnimatedStyle]}>
        {/* Steam */}
        <Animated.View style={[styles.steamContainer, steamStyle]}>
          <View style={styles.steam1} />
          <View style={styles.steam2} />
          <View style={styles.steam3} />
        </Animated.View>
        
        {/* Cake */}
        <View style={styles.cakeIllustration}>
          <View style={styles.cakeFrosting}>
            <View style={styles.frostingDrip1} />
            <View style={styles.frostingDrip2} />
            <View style={styles.frostingDrip3} />
          </View>
          <View style={styles.cakeLayer1} />
          <View style={styles.cakeLayer2} />
          <View style={styles.cakePlate} />
        </View>
      </Animated.View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="options-outline" size={20} color="#8B7355" />
          <Text style={styles.featureText}>Customize every layer</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="document-text-outline" size={20} color="#8B7355" />
          <Text style={styles.featureText}>Get precise recipes</Text>
        </View>
      </View>

      {/* Start Button */}
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartBaking}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Building</Text>
          <Ionicons name="arrow-forward" size={22} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footerText}>Cakes • Brownies • Cheesecakes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F5EEE6',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F0E8DE',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleTop: {
    fontSize: 24,
    fontWeight: '500',
    color: '#6B5B4F',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  titleMain: {
    fontSize: 56,
    fontWeight: '700',
    color: '#C4704F',
    letterSpacing: 2,
    marginTop: -4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  subtitleLine: {
    width: 40,
    height: 1,
    backgroundColor: '#D4C4B5',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
    letterSpacing: 1,
  },
  cakeContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  steamContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  steam1: {
    width: 3,
    height: 20,
    backgroundColor: '#D4C4B5',
    borderRadius: 2,
  },
  steam2: {
    width: 3,
    height: 28,
    backgroundColor: '#D4C4B5',
    borderRadius: 2,
    marginTop: -8,
  },
  steam3: {
    width: 3,
    height: 16,
    backgroundColor: '#D4C4B5',
    borderRadius: 2,
  },
  cakeIllustration: {
    alignItems: 'center',
  },
  cakeFrosting: {
    width: 140,
    height: 24,
    backgroundColor: '#F5F0EB',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  frostingDrip1: {
    width: 12,
    height: 16,
    backgroundColor: '#F5F0EB',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  frostingDrip2: {
    width: 10,
    height: 22,
    backgroundColor: '#F5F0EB',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  frostingDrip3: {
    width: 12,
    height: 14,
    backgroundColor: '#F5F0EB',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  cakeLayer1: {
    width: 130,
    height: 50,
    backgroundColor: '#D4A574',
    borderRadius: 8,
    marginTop: -4,
  },
  cakeLayer2: {
    width: 140,
    height: 50,
    backgroundColor: '#C4956A',
    borderRadius: 8,
    marginTop: 2,
  },
  cakePlate: {
    width: 170,
    height: 12,
    backgroundColor: '#E8E0D8',
    borderRadius: 6,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  startButton: {
    backgroundColor: '#C4704F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#C4704F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    gap: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 13,
    color: '#B8A89A',
    fontWeight: '500',
    letterSpacing: 1,
  },
});

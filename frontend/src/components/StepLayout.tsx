import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CakePreview } from './CakePreview';

const { width } = Dimensions.get('window');

interface StepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  showPreview?: boolean;
  canProceed?: boolean;
}

export const StepLayout: React.FC<StepLayoutProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Next',
  showPreview = true,
  canProceed = true,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8B5A2B" />
        </TouchableOpacity>
        
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step {step}/{totalSteps}</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(step / totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {/* Cake Preview */}
      {showPreview && (
        <View style={styles.previewContainer}>
          <CakePreview size="small" />
        </View>
      )}
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
      
      {/* Next Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={onNext}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>{nextLabel}</Text>
          <Ionicons name="arrow-forward" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIndicator: {
    backgroundColor: '#E85A4F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8DDD4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E85A4F',
    borderRadius: 4,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B5A2B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0785C',
    marginTop: 6,
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: '#E85A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#E85A4F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
    shadowColor: '#999',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

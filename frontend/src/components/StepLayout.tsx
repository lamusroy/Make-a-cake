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
  nextLabel = 'Continue',
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

  const progress = (step / totalSteps) * 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#6B5B4F" />
        </TouchableOpacity>
        
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{step} of {totalSteps}</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
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
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>{nextLabel}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
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
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  stepBadge: {
    backgroundColor: '#F5EEE6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepText: {
    color: '#8B7355',
    fontWeight: '600',
    fontSize: 14,
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EDE6DC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C4704F',
    borderRadius: 2,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A3F35',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8B7355',
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
    backgroundColor: '#C4704F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#C4704F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#D4C4B5',
    shadowColor: '#D4C4B5',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

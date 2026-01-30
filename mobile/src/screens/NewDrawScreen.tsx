import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MainNavigationProp, SupportedPlatform, ImportedData } from '../types/navigation';

// Theme colors
const THEME = {
  background: '#0a0a0f',
  elevated: '#12121a',
  card: '#1a1a24',
  accent: '#7c3aed',
  accentPink: '#ec4899',
  accentLight: '#a855f7',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  border: '#27272a',
};

// Platform detection regex patterns
const PLATFORM_PATTERNS: Record<SupportedPlatform, RegExp[]> = {
  instagram: [
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?instagr\.am\//i,
  ],
  tiktok: [
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\//i,
    /(?:https?:\/\/)?(?:vm\.)?tiktok\.com\//i,
  ],
  facebook: [
    /(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?fb\.com\//i,
    /(?:https?:\/\/)?(?:m\.)?facebook\.com\//i,
  ],
  youtube: [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\//i,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\//i,
  ],
};

const PLATFORM_CONFIG: Record<SupportedPlatform, {
  name: string;
  icon: string;
  colors: [string, string];
}> = {
  instagram: {
    name: 'Instagram',
    icon: 'logo-instagram',
    colors: ['#E1306C', '#C13584'],
  },
  tiktok: {
    name: 'TikTok',
    icon: 'musical-notes',
    colors: ['#00f2ea', '#ff0050'],
  },
  facebook: {
    name: 'Facebook',
    icon: 'logo-facebook',
    colors: ['#1877F2', '#0C63D4'],
  },
  youtube: {
    name: 'YouTube',
    icon: 'logo-youtube',
    colors: ['#FF0000', '#CC0000'],
  },
};

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <View style={styles.stepIndicator}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <View key={i} style={styles.stepRow}>
        <View
          style={[
            styles.stepDot,
            i + 1 <= currentStep ? styles.stepDotActive : styles.stepDotInactive,
          ]}
        >
          {i + 1 < currentStep ? (
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          ) : (
            <Text style={[
              styles.stepNumber,
              i + 1 <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive,
            ]}>
              {i + 1}
            </Text>
          )}
        </View>
        {i < totalSteps - 1 && (
          <View
            style={[
              styles.stepLine,
              i + 1 < currentStep ? styles.stepLineActive : styles.stepLineInactive,
            ]}
          />
        )}
      </View>
    ))}
  </View>
);

const PlatformBadge: React.FC<{ platform: SupportedPlatform }> = ({ platform }) => {
  const config = PLATFORM_CONFIG[platform];
  return (
    <LinearGradient
      colors={config.colors}
      style={styles.platformBadge}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Ionicons name={config.icon as any} size={16} color="#FFFFFF" />
      <Text style={styles.platformBadgeText}>{config.name} detected</Text>
    </LinearGradient>
  );
};

export const NewDrawScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<SupportedPlatform | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'url' | 'csv'>('url');

  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Auto-detect platform from URL
  useEffect(() => {
    if (!url.trim()) {
      setDetectedPlatform(null);
      return;
    }

    for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(url)) {
          setDetectedPlatform(platform as SupportedPlatform);
          return;
        }
      }
    }
    setDetectedPlatform(null);
  }, [url]);

  // Animated progress bar
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: importProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [importProgress]);

  const detectPlatformFromUrl = (inputUrl: string): SupportedPlatform | null => {
    for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(inputUrl)) {
          return platform as SupportedPlatform;
        }
      }
    }
    return null;
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setUrl(clipboardContent);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Clipboard may not be available
    }
  };

  const handlePickCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setCsvFileName(file.name);
        setImportMode('csv');
        setUrl(''); // Clear URL when CSV is selected
        setDetectedPlatform(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick CSV file. Please try again.');
    }
  };

  const clearCSV = () => {
    setCsvFileName(null);
    setImportMode('url');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const simulateImport = async (): Promise<ImportedData> => {
    // Simulate import progress
    setIsImporting(true);
    setImportProgress(0);

    const steps = [10, 25, 45, 65, 80, 95, 100];
    for (const progress of steps) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setImportProgress(progress);
    }

    // Simulated import result
    const platform = detectedPlatform || 'instagram';
    const fakeParticipantCount = Math.floor(Math.random() * 500) + 100;

    return {
      platform,
      sourceUrl: importMode === 'url' ? url : undefined,
      sourceType: importMode,
      totalParticipants: fakeParticipantCount,
    };
  };

  const handleContinue = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a draw title');
      return;
    }

    if (importMode === 'url') {
      if (!url.trim()) {
        Alert.alert('Error', 'Please enter a post URL');
        return;
      }
      if (!detectedPlatform) {
        Alert.alert(
          'Invalid URL',
          'Please enter a valid Instagram, TikTok, Facebook, or YouTube URL'
        );
        return;
      }
    } else if (importMode === 'csv' && !csvFileName) {
      Alert.alert('Error', 'Please select a CSV file');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simulate import
      const importedData = await simulateImport();

      setIsImporting(false);

      // Navigate to Step 2 with imported data
      navigation.navigate('DrawConfig', {
        importedData,
        title: title.trim(),
        description: description.trim(),
      });
    } catch (error) {
      setIsImporting(false);
      Alert.alert('Error', 'Failed to import participants. Please try again.');
    }
  };

  const isValidInput = () => {
    if (!title.trim()) return false;
    if (importMode === 'url') {
      return url.trim() && detectedPlatform;
    }
    return csvFileName !== null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={THEME.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Draw</Text>
          <View style={styles.headerSpacer} />
        </View>

        <StepIndicator currentStep={1} totalSteps={3} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>Step 1: Import Participants</Text>
            <Text style={styles.stepSubtitle}>
              Enter a post URL or upload a CSV file to import participants
            </Text>
          </View>

          {/* Draw Info Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Draw Title*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Summer Giveaway 2024"
              placeholderTextColor={THEME.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              editable={!isImporting}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about your draw..."
              placeholderTextColor={THEME.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
              editable={!isImporting}
            />
          </View>

          {/* Import Mode Tabs */}
          <View style={styles.importTabs}>
            <TouchableOpacity
              style={[
                styles.importTab,
                importMode === 'url' && styles.importTabActive,
              ]}
              onPress={() => {
                setImportMode('url');
                setCsvFileName(null);
              }}
              disabled={isImporting}
            >
              <Ionicons
                name="link"
                size={18}
                color={importMode === 'url' ? THEME.accent : THEME.textMuted}
              />
              <Text
                style={[
                  styles.importTabText,
                  importMode === 'url' && styles.importTabTextActive,
                ]}
              >
                URL Import
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.importTab,
                importMode === 'csv' && styles.importTabActive,
              ]}
              onPress={() => setImportMode('csv')}
              disabled={isImporting}
            >
              <Ionicons
                name="document-text"
                size={18}
                color={importMode === 'csv' ? THEME.accent : THEME.textMuted}
              />
              <Text
                style={[
                  styles.importTabText,
                  importMode === 'csv' && styles.importTabTextActive,
                ]}
              >
                CSV Upload
              </Text>
            </TouchableOpacity>
          </View>

          {/* URL Import Section */}
          {importMode === 'url' && (
            <View style={styles.section}>
              <Text style={styles.label}>Post URL*</Text>
              <View style={styles.urlInputContainer}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="Paste Instagram/TikTok/Facebook post URL"
                  placeholderTextColor={THEME.textMuted}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  editable={!isImporting}
                />
                <TouchableOpacity
                  style={styles.pasteButton}
                  onPress={handlePasteFromClipboard}
                  disabled={isImporting}
                >
                  <Ionicons name="clipboard-outline" size={20} color={THEME.accent} />
                </TouchableOpacity>
              </View>

              {detectedPlatform && <PlatformBadge platform={detectedPlatform} />}

              {url && !detectedPlatform && (
                <View style={styles.warningBadge}>
                  <Ionicons name="warning" size={16} color="#f59e0b" />
                  <Text style={styles.warningText}>
                    Could not detect platform. Please check the URL.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* CSV Import Section */}
          {importMode === 'csv' && (
            <View style={styles.section}>
              <Text style={styles.label}>CSV File*</Text>
              {csvFileName ? (
                <View style={styles.csvFileCard}>
                  <View style={styles.csvFileInfo}>
                    <View style={styles.csvIconContainer}>
                      <Ionicons name="document-text" size={24} color={THEME.accent} />
                    </View>
                    <View style={styles.csvFileDetails}>
                      <Text style={styles.csvFileName} numberOfLines={1}>
                        {csvFileName}
                      </Text>
                      <Text style={styles.csvFileHint}>Ready to import</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={clearCSV}
                    style={styles.csvRemoveButton}
                    disabled={isImporting}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.csvUploadButton}
                  onPress={handlePickCSV}
                  disabled={isImporting}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color={THEME.accent} />
                  <Text style={styles.csvUploadText}>Tap to select CSV file</Text>
                  <Text style={styles.csvUploadHint}>
                    CSV should contain username column
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Import Progress */}
          {isImporting && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Ionicons name="sync" size={20} color={THEME.accent} />
                <Text style={styles.progressText}>
                  Importing participants... {importProgress}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={THEME.accent} />
            <Text style={styles.infoText}>
              We'll import all participants from the post. You can configure
              filters like follower count and engagement in the next step.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isValidInput() || isImporting) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValidInput() || isImporting}
          >
            <LinearGradient
              colors={[THEME.accent, THEME.accentPink]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>
                {isImporting ? 'Importing...' : 'Continue to Filters'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    backgroundColor: THEME.elevated,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: THEME.background,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: THEME.accent,
  },
  stepDotInactive: {
    backgroundColor: THEME.border,
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepNumberInactive: {
    color: THEME.textMuted,
  },
  stepLine: {
    width: 60,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: THEME.accent,
  },
  stepLineInactive: {
    backgroundColor: THEME.border,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.elevated,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.textPrimary,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  importTabs: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  importTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  importTabActive: {
    backgroundColor: THEME.elevated,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  importTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.textMuted,
  },
  importTabTextActive: {
    color: THEME.accent,
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  urlInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.textPrimary,
  },
  pasteButton: {
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: THEME.border,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  platformBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  warningText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#f59e0b',
  },
  csvUploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.elevated,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    borderStyle: 'dashed',
    padding: 32,
    gap: 8,
  },
  csvUploadText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: THEME.textPrimary,
  },
  csvUploadHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.textMuted,
  },
  csvFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  csvFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  csvIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  csvFileDetails: {
    flex: 1,
  },
  csvFileName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.textPrimary,
    marginBottom: 2,
  },
  csvFileHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
  },
  csvRemoveButton: {
    padding: 4,
  },
  progressSection: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.accent,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: THEME.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.accent,
    borderRadius: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    backgroundColor: THEME.elevated,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButtonGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

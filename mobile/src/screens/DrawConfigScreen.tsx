import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useDrawStore } from '../services/drawStore';
import { FilterConfigComponent } from '../components/FilterConfigComponent';
import { DrawFilters } from '../types';
import { MainNavigationProp, MainStackParamList, SupportedPlatform } from '../types/navigation';

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

type DrawConfigRouteProp = RouteProp<MainStackParamList, 'DrawConfig'>;

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

interface AnalysisPanelProps {
  totalParticipants: number;
  qualifiedParticipants: number;
  platform: SupportedPlatform;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  totalParticipants,
  qualifiedParticipants,
  platform,
}) => {
  const config = PLATFORM_CONFIG[platform];
  const successRate = totalParticipants > 0
    ? Math.round((qualifiedParticipants / totalParticipants) * 100)
    : 100;

  return (
    <View style={styles.analysisPanel}>
      <View style={styles.analysisPanelHeader}>
        <LinearGradient
          colors={config.colors}
          style={styles.platformIconBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name={config.icon as any} size={16} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.analysisPanelTitle}>Real-time Analysis</Text>
      </View>

      <View style={styles.analysisStats}>
        <View style={styles.analysisStat}>
          <View style={styles.analysisStatIconContainer}>
            <Ionicons name="people" size={20} color={THEME.accent} />
          </View>
          <View style={styles.analysisStatContent}>
            <Text style={styles.analysisStatValue}>{totalParticipants.toLocaleString()}</Text>
            <Text style={styles.analysisStatLabel}>Total Imported</Text>
          </View>
        </View>

        <View style={styles.analysisStatDivider} />

        <View style={styles.analysisStat}>
          <View style={[styles.analysisStatIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <View style={styles.analysisStatContent}>
            <Text style={[styles.analysisStatValue, { color: '#10B981' }]}>
              {qualifiedParticipants.toLocaleString()}
            </Text>
            <Text style={styles.analysisStatLabel}>Qualified</Text>
          </View>
        </View>

        <View style={styles.analysisStatDivider} />

        <View style={styles.analysisStat}>
          <View style={[styles.analysisStatIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
            <Ionicons name="analytics" size={20} color="#f59e0b" />
          </View>
          <View style={styles.analysisStatContent}>
            <Text style={[styles.analysisStatValue, { color: '#f59e0b' }]}>{successRate}%</Text>
            <Text style={styles.analysisStatLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      {successRate < 50 && (
        <View style={styles.analysisWarning}>
          <Ionicons name="warning" size={16} color="#f59e0b" />
          <Text style={styles.analysisWarningText}>
            Low qualification rate. Consider adjusting your filters.
          </Text>
        </View>
      )}
    </View>
  );
};

export const DrawConfigScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute<DrawConfigRouteProp>();
  const { drawId, importedData, title, description } = route.params || {};
  const { currentDraw, fetchDraw, createDraw, updateDraw, isLoading } = useDrawStore();

  const [filters, setFilters] = useState<DrawFilters>({});
  const [useFilters, setUseFilters] = useState(false);
  const [winnersCount, setWinnersCount] = useState('1');

  // Calculate qualified participants based on filters (simulated)
  const qualifiedParticipants = useMemo(() => {
    if (!importedData) return currentDraw?.totalEntries || 0;

    const total = importedData.totalParticipants;

    if (!useFilters) return total;

    // Simulate filter effects
    let qualified = total;

    if (filters.followersMin) {
      qualified = Math.floor(qualified * 0.7); // ~30% filtered out
    }
    if (filters.followersMax) {
      qualified = Math.floor(qualified * 0.9); // ~10% filtered out
    }
    if (filters.engagementRate) {
      qualified = Math.floor(qualified * 0.6); // ~40% filtered out
    }
    if (filters.hashtags && filters.hashtags.length > 0) {
      qualified = Math.floor(qualified * 0.8); // ~20% filtered out
    }
    if (filters.mentions && filters.mentions.length > 0) {
      qualified = Math.floor(qualified * 0.75); // ~25% filtered out
    }
    if (filters.location && filters.location.length > 0) {
      qualified = Math.floor(qualified * 0.5); // ~50% filtered out
    }
    if (filters.excludeUsers && filters.excludeUsers.length > 0) {
      qualified = Math.max(0, qualified - filters.excludeUsers.length);
    }

    return Math.max(0, qualified);
  }, [importedData, currentDraw, useFilters, filters]);

  const totalParticipants = importedData?.totalParticipants || currentDraw?.totalEntries || 0;
  const platform = importedData?.platform || currentDraw?.filters?.platform || 'instagram';

  useEffect(() => {
    if (drawId) {
      fetchDraw(drawId);
    }
  }, [drawId]);

  useEffect(() => {
    if (currentDraw?.filters) {
      setFilters(currentDraw.filters);
      setUseFilters(true);
    }
    if (currentDraw?.winnersCount) {
      setWinnersCount(currentDraw.winnersCount.toString());
    }
  }, [currentDraw]);

  const handleSaveAndContinue = async () => {
    const winners = parseInt(winnersCount);
    if (isNaN(winners) || winners < 1) {
      Alert.alert('Error', 'Please enter a valid number of winners (minimum 1)');
      return;
    }

    if (winners > qualifiedParticipants) {
      Alert.alert(
        'Too Many Winners',
        `You can select at most ${qualifiedParticipants} winners based on qualified participants.`
      );
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      let targetDrawId = drawId;

      // If coming from Step 1 (new flow), create the draw first
      if (!drawId && importedData) {
        const newDraw = await createDraw({
          title: title || 'Untitled Draw',
          description: description,
          winnersCount: winners,
          totalEntries: totalParticipants,
          filters: useFilters ? { ...filters, platform } : { platform },
          status: 'active',
        });
        targetDrawId = newDraw.id;
      } else if (drawId) {
        // Update existing draw
        await updateDraw(drawId, {
          winnersCount: winners,
          filters: useFilters ? { ...filters, platform } : { platform },
          status: 'active',
        });
      }

      if (targetDrawId) {
        navigation.navigate('DrawAnimation', { drawId: targetDrawId });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration. Please try again.');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Filters?',
      'All entries will be eligible for the draw without any filtering.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: async () => {
            try {
              const winners = parseInt(winnersCount) || 1;
              let targetDrawId = drawId;

              if (!drawId && importedData) {
                const newDraw = await createDraw({
                  title: title || 'Untitled Draw',
                  description: description,
                  winnersCount: winners,
                  totalEntries: totalParticipants,
                  filters: { platform },
                  status: 'active',
                });
                targetDrawId = newDraw.id;
              } else if (drawId) {
                await updateDraw(drawId, {
                  winnersCount: winners,
                  status: 'active',
                });
              }

              if (targetDrawId) {
                navigation.navigate('DrawAnimation', { drawId: targetDrawId });
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to proceed. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configure Draw</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <StepIndicator currentStep={2} totalSteps={3} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Step 2: Configure Filters</Text>
          <Text style={styles.stepSubtitle}>
            Set up filters to refine your participant pool and configure draw settings
          </Text>
        </View>

        {/* Analysis Panel */}
        <AnalysisPanel
          totalParticipants={totalParticipants}
          qualifiedParticipants={qualifiedParticipants}
          platform={platform as SupportedPlatform}
        />

        {/* Winners Count Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Winners*</Text>
          <View style={styles.winnersInputContainer}>
            <TouchableOpacity
              style={styles.winnersButton}
              onPress={() => {
                const current = parseInt(winnersCount) || 1;
                if (current > 1) {
                  setWinnersCount((current - 1).toString());
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <Ionicons name="remove" size={20} color={THEME.accent} />
            </TouchableOpacity>
            <TextInput
              style={styles.winnersInput}
              value={winnersCount}
              onChangeText={setWinnersCount}
              keyboardType="number-pad"
              maxLength={3}
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.winnersButton}
              onPress={() => {
                const current = parseInt(winnersCount) || 1;
                if (current < qualifiedParticipants) {
                  setWinnersCount((current + 1).toString());
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <Ionicons name="add" size={20} color={THEME.accent} />
            </TouchableOpacity>
          </View>
          <Text style={styles.winnersHint}>
            Select between 1 and {qualifiedParticipants.toLocaleString()} winners
          </Text>
        </View>

        {/* Filter Toggle */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleContent}>
            <Ionicons name="filter" size={24} color={THEME.accent} />
            <View style={styles.toggleText}>
              <Text style={styles.toggleTitle}>Use Advanced Filters</Text>
              <Text style={styles.toggleSubtitle}>
                Filter entries by followers, engagement, location, and more
              </Text>
            </View>
          </View>
          <Switch
            value={useFilters}
            onValueChange={(value) => {
              setUseFilters(value);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: THEME.border, true: 'rgba(124, 58, 237, 0.5)' }}
            thumbColor={useFilters ? THEME.accent : THEME.textMuted}
          />
        </View>

        {useFilters && (
          <FilterConfigComponent
            filters={filters}
            onChange={setFilters}
            platform={platform as 'instagram' | 'tiktok' | 'facebook'}
          />
        )}

        {!useFilters && (
          <View style={styles.noFiltersCard}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text style={styles.noFiltersTitle}>All Entries Eligible</Text>
            <Text style={styles.noFiltersText}>
              Without filters, all {totalParticipants.toLocaleString()} entries will be included in
              the draw.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleSaveAndContinue}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[THEME.accent, THEME.accentPink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Saving...' : 'Continue to Draw'}
            </Text>
            <Ionicons name="play" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
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
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: THEME.accent,
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
  analysisPanel: {
    backgroundColor: THEME.elevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  analysisPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  platformIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisPanelTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
  },
  analysisStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analysisStat: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  analysisStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisStatContent: {
    alignItems: 'center',
  },
  analysisStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: THEME.accent,
  },
  analysisStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
  },
  analysisStatDivider: {
    width: 1,
    height: 50,
    backgroundColor: THEME.border,
  },
  analysisWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  analysisWarningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#f59e0b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
    marginBottom: 12,
  },
  winnersInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: 'hidden',
  },
  winnersButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.card,
  },
  winnersInput: {
    flex: 1,
    height: 56,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
  },
  winnersHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
    marginTop: 8,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  toggleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
  },
  noFiltersCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 32,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  noFiltersTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  noFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
    textAlign: 'center',
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

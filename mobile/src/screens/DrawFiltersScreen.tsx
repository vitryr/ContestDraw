/**
 * DrawFiltersScreen
 * Advanced filters configuration screen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { AdvancedFiltersPanel } from '../components/AdvancedFiltersPanel';
import { useFilters } from '../hooks/useFilters';
import { TIER_COLORS, TIER_LABELS } from '../types/filters';
import { MainStackParamList } from '../types/navigation';

type DrawFiltersScreenRouteProp = RouteProp<MainStackParamList, 'DrawFilters'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function DrawFiltersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DrawFiltersScreenRouteProp>();
  const { drawId, postUrl } = route.params || {};

  const {
    filters,
    capabilities,
    availableFilters,
    userTier,
    platform,
    preScanResult,
    isLoadingCapabilities,
    isLoadingFilters,
    isSaving,
    isPreviewing,
    updateFilter,
    loadCapabilities,
    saveFilters,
    previewFilters,
    resetFilters,
    isFilterAvailable,
    getUnavailableReason,
  } = useFilters({ drawId });

  const [previewResults, setPreviewResults] = useState<{
    qualified: number;
    excluded: number;
    total: number;
  } | null>(null);

  // Load capabilities when we have a URL
  useEffect(() => {
    if (postUrl && !capabilities) {
      loadCapabilities(postUrl);
    }
  }, [postUrl, capabilities, loadCapabilities]);

  const handlePreview = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await previewFilters();
    if (result) {
      setPreviewResults({
        qualified: result.qualified,
        excluded: result.excluded,
        total: result.totalParticipants,
      });
    }
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await saveFilters();
    if (success) {
      Alert.alert('Succès', 'Filtres sauvegardés !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const success = await saveFilters();
    if (success) {
      // Navigate to draw execution
      navigation.navigate('DrawExecution' as any, { drawId });
    }
  };

  const isLoading = isLoadingCapabilities || isLoadingFilters;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Chargement des filtres...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Filtres Avancés</Text>
          {platform && (
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.tierBadge, { backgroundColor: `${TIER_COLORS[userTier]}20` }]}>
          <Ionicons name="diamond" size={14} color={TIER_COLORS[userTier]} />
          <Text style={[styles.tierBadgeText, { color: TIER_COLORS[userTier] }]}>
            {TIER_LABELS[userTier]}
          </Text>
        </View>
      </View>

      {/* Pre-scan warning */}
      {preScanResult && !preScanResult.withinLimit && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color="#fbbf24" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>
              Ce post dépasse votre limite ({preScanResult.totalComments.toLocaleString()} commentaires)
            </Text>
            <Text style={styles.warningSubtitle}>
              Votre plan permet {preScanResult.userLimit.toLocaleString()} commentaires max.
            </Text>
          </View>
        </View>
      )}

      {/* Preview Results */}
      {previewResults && (
        <View style={styles.previewBanner}>
          <Ionicons name="analytics" size={20} color="#22c55e" />
          <Text style={styles.previewText}>
            {previewResults.qualified.toLocaleString()} qualifiés / {previewResults.excluded.toLocaleString()} exclus
          </Text>
        </View>
      )}

      {/* Filters Panel */}
      <View style={styles.content}>
        <AdvancedFiltersPanel
          filters={filters}
          onUpdateFilter={updateFilter}
          capabilities={capabilities}
          availableFilters={availableFilters}
          userTier={userTier}
          isFilterAvailable={isFilterAvailable}
          getUnavailableReason={getUnavailableReason}
        />
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreview}
          disabled={isPreviewing}
        >
          {isPreviewing ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : (
            <>
              <Ionicons name="eye-outline" size={20} color="#7c3aed" />
              <Text style={styles.previewButtonText}>Prévisualiser</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={isSaving || (preScanResult !== null && !preScanResult.withinLimit)}
        >
          <LinearGradient
            colors={['#7c3aed', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continuer</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#71717a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  platformBadge: {
    backgroundColor: '#27272a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  platformBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tierBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fbbf24',
  },
  warningSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#fbbf24',
    opacity: 0.8,
    marginTop: 2,
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    marginBottom: 0,
    padding: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22c55e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  previewButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#7c3aed',
  },
  continueButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});

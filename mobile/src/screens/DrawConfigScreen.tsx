import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useDrawStore } from '../services/drawStore';
import { FilterConfigComponent } from '../components/FilterConfigComponent';
import { DrawFilters } from '../types';
import { MainNavigationProp } from '../types/navigation';

export const DrawConfigScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute();
  const { drawId } = route.params as { drawId: string };
  const { currentDraw, fetchDraw, updateDraw, isLoading } = useDrawStore();

  const [filters, setFilters] = useState<DrawFilters>({});
  const [useFilters, setUseFilters] = useState(false);

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
  }, [currentDraw]);

  const handleSaveAndContinue = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await updateDraw(drawId, {
        filters: useFilters ? filters : undefined,
        status: 'active',
      });

      navigation.navigate('DrawAnimation', { drawId });
    } catch (error) {
      Alert.alert('Error', 'Failed to save filters. Please try again.');
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
            await updateDraw(drawId, { status: 'active' });
            navigation.navigate('DrawAnimation', { drawId });
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
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configure Filters</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toggleSection}>
          <View style={styles.toggleContent}>
            <Ionicons name="filter" size={24} color="#6366F1" />
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
            trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
            thumbColor={useFilters ? '#6366F1' : '#F3F4F6'}
          />
        </View>

        {useFilters && (
          <FilterConfigComponent
            filters={filters}
            onChange={setFilters}
            platform={currentDraw?.filters?.platform || 'instagram'}
          />
        )}

        {!useFilters && (
          <View style={styles.noFiltersCard}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text style={styles.noFiltersTitle}>All Entries Eligible</Text>
            <Text style={styles.noFiltersText}>
              Without filters, all entries from your connected social account
              will be included in the draw.
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
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving...' : 'Save & Run Draw'}
          </Text>
          <Ionicons name="play" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
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
    color: '#111827',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  noFiltersCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 32,
    marginTop: 40,
  },
  noFiltersTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
    marginTop: 16,
    marginBottom: 8,
  },
  noFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
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

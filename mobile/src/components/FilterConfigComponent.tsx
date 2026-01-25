import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DrawFilters } from '../types';

interface FilterConfigComponentProps {
  filters: DrawFilters;
  onChange: (filters: DrawFilters) => void;
  platform: 'instagram' | 'tiktok' | 'facebook';
}

export const FilterConfigComponent: React.FC<FilterConfigComponentProps> = ({
  filters,
  onChange,
  platform,
}) => {
  const handleChange = (key: keyof DrawFilters, value: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange({ ...filters, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follower Count</Text>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Minimum</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              value={filters.followersMin?.toString() || ''}
              onChangeText={(text) => handleChange('followersMin', parseInt(text) || undefined)}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Maximum</Text>
            <TextInput
              style={styles.input}
              placeholder="Unlimited"
              placeholderTextColor="#9CA3AF"
              value={filters.followersMax?.toString() || ''}
              onChangeText={(text) => handleChange('followersMax', parseInt(text) || undefined)}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Engagement Rate</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Minimum % (e.g., 3.5)"
            placeholderTextColor="#9CA3AF"
            value={filters.engagementRate?.toString() || ''}
            onChangeText={(text) => handleChange('engagementRate', parseFloat(text) || undefined)}
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputHint}>
            Filter users with at least this engagement rate
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Hashtags</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="#giveaway #contest (one per line)"
          placeholderTextColor="#9CA3AF"
          value={filters.hashtags?.join('\n') || ''}
          onChangeText={(text) =>
            handleChange('hashtags', text.split('\n').filter((h) => h.trim()))
          }
          multiline
          numberOfLines={3}
        />
        <Text style={styles.inputHint}>
          Users must use these hashtags in their post
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Mentions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="@yourpage @sponsor (one per line)"
          placeholderTextColor="#9CA3AF"
          value={filters.mentions?.join('\n') || ''}
          onChangeText={(text) =>
            handleChange('mentions', text.split('\n').filter((m) => m.trim()))
          }
          multiline
          numberOfLines={3}
        />
        <Text style={styles.inputHint}>
          Users must mention these accounts
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Filter</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="United States, Canada, UK (one per line)"
          placeholderTextColor="#9CA3AF"
          value={filters.location?.join('\n') || ''}
          onChangeText={(text) =>
            handleChange('location', text.split('\n').filter((l) => l.trim()))
          }
          multiline
          numberOfLines={3}
        />
        <Text style={styles.inputHint}>
          Only include users from these locations
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exclude Users</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="@user1 @user2 (one per line)"
          placeholderTextColor="#9CA3AF"
          value={filters.excludeUsers?.join('\n') || ''}
          onChangeText={(text) =>
            handleChange('excludeUsers', text.split('\n').filter((u) => u.trim()))
          }
          multiline
          numberOfLines={3}
        />
        <Text style={styles.inputHint}>
          Exclude specific users from the draw
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#6366F1" />
        <Text style={styles.infoText}>
          All filters are optional. Leave fields empty to include all entries.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4F46E5',
  },
});

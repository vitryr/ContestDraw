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
              placeholderTextColor="#71717a"
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
              placeholderTextColor="#71717a"
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
            placeholderTextColor="#71717a"
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
          placeholderTextColor="#71717a"
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
          placeholderTextColor="#71717a"
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
          placeholderTextColor="#71717a"
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
          placeholderTextColor="#71717a"
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
        <Ionicons name="information-circle" size={20} color="#a855f7" />
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
    color: '#ffffff',
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
    color: '#a1a1aa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#12121a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a855f7',
  },
});

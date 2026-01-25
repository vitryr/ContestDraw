import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useDrawStore } from '../services/drawStore';
import { SocialConnectButton } from '../components/SocialConnectButton';
import { MainNavigationProp } from '../types/navigation';

export const NewDrawScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const { createDraw, isLoading } = useDrawStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [winnersCount, setWinnersCount] = useState('1');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'facebook' | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a draw title');
      return;
    }

    if (!platform) {
      Alert.alert('Error', 'Please connect a social platform');
      return;
    }

    const winners = parseInt(winnersCount);
    if (isNaN(winners) || winners < 1) {
      Alert.alert('Error', 'Please enter a valid number of winners');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const draw = await createDraw({
        title: title.trim(),
        description: description.trim(),
        winnersCount: winners,
        filters: { platform },
        status: 'draft',
      });

      navigation.navigate('DrawConfig', { drawId: draw.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to create draw. Please try again.');
    }
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
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Draw</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Draw Title*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Summer Giveaway 2024"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about your draw..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Number of Winners*</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              value={winnersCount}
              onChangeText={setWinnersCount}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Connect Social Platform*</Text>
            <Text style={styles.hint}>
              Connect your account to import entries
            </Text>

            <View style={styles.socialButtons}>
              <SocialConnectButton
                platform="instagram"
                isConnected={platform === 'instagram'}
                onPress={() => setPlatform('instagram')}
              />
              <SocialConnectButton
                platform="tiktok"
                isConnected={platform === 'tiktok'}
                onPress={() => setPlatform('tiktok')}
              />
              <SocialConnectButton
                platform="facebook"
                isConnected={platform === 'facebook'}
                onPress={() => setPlatform('facebook')}
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#6366F1" />
            <Text style={styles.infoText}>
              You can configure advanced filters like follower count, engagement
              rate, and location in the next step.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Continue to Filters'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  socialButtons: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4F46E5',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  createButton: {
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
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

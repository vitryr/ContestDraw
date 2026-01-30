import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../services/authStore';
import { apiService } from '../services/apiService';

interface SettingsState {
  pushNotifications: boolean;
  emailNotifications: boolean;
  drawCompleted: boolean;
  newEntries: boolean;
  creditLow: boolean;
  marketing: boolean;
  dataCollection: boolean;
  analytics: boolean;
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuthStore();
  const [deleting, setDeleting] = useState(false);

  const [settings, setSettings] = useState<SettingsState>({
    pushNotifications: true,
    emailNotifications: true,
    drawCompleted: true,
    newEntries: false,
    creditLow: true,
    marketing: false,
    dataCollection: true,
    analytics: true,
  });

  const toggleSetting = (key: keyof SettingsState) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'This will permanently delete your account, all draws, and purchase history. Type "DELETE" to confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: performDeleteAccount,
        },
      ]
    );
  };

  const performDeleteAccount = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setDeleting(true);

      await apiService.delete('/users/me');

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Account Deleted',
        'Your account has been successfully deleted.',
        [{ text: 'OK', onPress: () => logout() }]
      );
    } catch (error: any) {
      console.error('Delete account error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to delete account. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const openPrivacyPolicy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://cleack.io/privacy');
  };

  const openTermsOfService = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://cleack.io/terms');
  };

  const SettingToggle: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
  }> = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={20} color="#6366F1" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
        thumbColor={value ? '#6366F1' : '#9CA3AF'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive push notifications on your device"
              value={settings.pushNotifications}
              onToggle={() => toggleSetting('pushNotifications')}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="mail"
              title="Email Notifications"
              subtitle="Receive updates via email"
              value={settings.emailNotifications}
              onToggle={() => toggleSetting('emailNotifications')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="checkmark-circle"
              title="Draw Completed"
              subtitle="When your draw finishes"
              value={settings.drawCompleted}
              onToggle={() => toggleSetting('drawCompleted')}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="people"
              title="New Entries"
              subtitle="When new participants join"
              value={settings.newEntries}
              onToggle={() => toggleSetting('newEntries')}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="wallet"
              title="Low Credit Alert"
              subtitle="When credits are running low"
              value={settings.creditLow}
              onToggle={() => toggleSetting('creditLow')}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="megaphone"
              title="Marketing"
              subtitle="Tips, offers, and updates"
              value={settings.marketing}
              onToggle={() => toggleSetting('marketing')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="analytics"
              title="Analytics"
              subtitle="Help us improve with usage data"
              value={settings.analytics}
              onToggle={() => toggleSetting('analytics')}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="server"
              title="Data Collection"
              subtitle="Allow data collection for improvements"
              value={settings.dataCollection}
              onToggle={() => toggleSetting('dataCollection')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.linkItem} onPress={openPrivacyPolicy}>
              <View style={styles.settingIcon}>
                <Ionicons name="document-text" size={20} color="#6366F1" />
              </View>
              <Text style={styles.linkTitle}>Privacy Policy</Text>
              <Ionicons name="open-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkItem} onPress={openTermsOfService}>
              <View style={styles.settingIcon}>
                <Ionicons name="clipboard" size={20} color="#6366F1" />
              </View>
              <Text style={styles.linkTitle}>Terms of Service</Text>
              <Ionicons name="open-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#EF4444" />
                <Text style={styles.deleteText}>Delete Account</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.deleteHint}>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 64,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  deleteHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

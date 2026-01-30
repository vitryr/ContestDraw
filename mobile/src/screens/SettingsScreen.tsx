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
        <Ionicons name={icon as any} size={20} color="#7c3aed" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#27272a', true: 'rgba(124, 58, 237, 0.4)' }}
        thumbColor={value ? '#7c3aed' : '#71717a'}
        ios_backgroundColor="#27272a"
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
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
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
                <Ionicons name="document-text" size={20} color="#7c3aed" />
              </View>
              <Text style={styles.linkTitle}>Privacy Policy</Text>
              <Ionicons name="open-outline" size={20} color="#71717a" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkItem} onPress={openTermsOfService}>
              <View style={styles.settingIcon}>
                <Ionicons name="clipboard" size={20} color="#7c3aed" />
              </View>
              <Text style={styles.linkTitle}>Terms of Service</Text>
              <Ionicons name="open-outline" size={20} color="#71717a" />
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
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#ffffff" />
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
    backgroundColor: '#0a0a0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12121a',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
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
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
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
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
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
    color: '#ffffff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  deleteText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  deleteHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

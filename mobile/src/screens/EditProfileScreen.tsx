import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../services/authStore';
import { apiService } from '../services/apiService';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();

  // Parse name into first and last name
  const nameParts = user?.name?.split(' ') || [];
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [newEmail, setNewEmail] = useState('');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requestingEmailChange, setRequestingEmailChange] = useState(false);

  const hasChanges = firstName !== initialFirstName || lastName !== initialLastName;

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSaving(true);

      await apiService.patch('/users/me', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      updateUser({ name: fullName });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Save profile error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim()) {
      Alert.alert('Error', 'Please enter a new email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setRequestingEmailChange(true);

      await apiService.post('/users/me/request-email-change', {
        newEmail: newEmail.trim(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Verification Email Sent',
        'Please check your new email address for a verification link.',
        [{ text: 'OK', onPress: () => setShowEmailChange(false) }]
      );
      setNewEmail('');
    } catch (error: any) {
      console.error('Request email change error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to request email change. Please try again.'
      );
    } finally {
      setRequestingEmailChange(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges || saving}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#7c3aed" />
            ) : (
              <Text
                style={[
                  styles.saveText,
                  !hasChanges && styles.saveTextDisabled,
                ]}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={['#7c3aed', '#ec4899']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {firstName.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Ionicons name="camera" size={20} color="#7c3aed" />
              <Text style={styles.changeAvatarText}>Change Photo</Text>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Profile photo (coming soon)</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#71717a"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#71717a"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Email Address</Text>

            <View style={styles.emailCard}>
              <View style={styles.emailInfo}>
                <Ionicons name="mail" size={20} color="#7c3aed" />
                <Text style={styles.currentEmail}>{user?.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.changeEmailButton}
                onPress={() => setShowEmailChange(!showEmailChange)}
              >
                <Text style={styles.changeEmailText}>
                  {showEmailChange ? 'Cancel' : 'Change'}
                </Text>
              </TouchableOpacity>
            </View>

            {showEmailChange && (
              <View style={styles.emailChangeSection}>
                <TextInput
                  style={styles.input}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Enter new email address"
                  placeholderTextColor="#71717a"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.requestChangeButton}
                  onPress={handleRequestEmailChange}
                  disabled={requestingEmailChange}
                >
                  {requestingEmailChange ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.requestChangeText}>
                      Request Email Change
                    </Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.emailChangeHint}>
                  A verification link will be sent to your new email address.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#a855f7" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Profile Changes</Text>
              <Text style={styles.infoText}>
                Name changes take effect immediately. Email changes require
                verification through a link sent to your new email address.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
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
  saveButton: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#7c3aed',
  },
  saveTextDisabled: {
    color: '#71717a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarText: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  changeAvatarText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a855f7',
  },
  avatarHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    marginTop: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
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
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a24',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  currentEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    flex: 1,
  },
  changeEmailButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  changeEmailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#7c3aed',
  },
  emailChangeSection: {
    marginTop: 16,
  },
  requestChangeButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  requestChangeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emailChangeHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#a855f7',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 18,
  },
});

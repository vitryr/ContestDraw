import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../services/authStore';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type EmailVerificationRouteProp = RouteProp<AuthStackParamList, 'EmailVerification'>;
type EmailVerificationNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'EmailVerification'>;

const AUTO_CHECK_INTERVAL = 5000; // Check every 5 seconds

export const EmailVerificationScreen: React.FC = () => {
  const navigation = useNavigation<EmailVerificationNavigationProp>();
  const route = useRoute<EmailVerificationRouteProp>();
  const { email } = route.params;
  const { user, loadUser } = useAuthStore();

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const autoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle deep links for email verification
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      const parsedUrl = Linking.parse(url);

      if (parsedUrl.path === 'verify-email' && parsedUrl.queryParams?.token) {
        const token = parsedUrl.queryParams.token as string;
        await verifyEmailWithToken(token);
      }
    };

    // Get initial URL if app was opened via deep link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };

    getInitialURL();

    // Listen for deep link events while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // Auto-check verification status every 5 seconds
  useEffect(() => {
    autoCheckIntervalRef.current = setInterval(() => {
      checkVerificationStatus(true);
    }, AUTO_CHECK_INTERVAL);

    return () => {
      if (autoCheckIntervalRef.current) {
        clearInterval(autoCheckIntervalRef.current);
      }
    };
  }, []);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) {
              clearInterval(cooldownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [resendCooldown]);

  const verifyEmailWithToken = async (token: string) => {
    try {
      setIsChecking(true);
      await apiService.post('/auth/verify-email', { token });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setVerificationSuccess(true);

      // Reload user to get updated verification status
      await loadUser();

      // Navigate to main app after brief success message
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 2000);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Verification Failed',
        error.response?.data?.message || 'The verification link is invalid or expired. Please request a new one.'
      );
    } finally {
      setIsChecking(false);
    }
  };

  const checkVerificationStatus = async (silent: boolean = false) => {
    if (isChecking) return;

    try {
      if (!silent) {
        setIsChecking(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const response = await apiService.get('/auth/me');
      const userData = response.data.data;

      if (userData?.emailVerified) {
        // Stop auto-check
        if (autoCheckIntervalRef.current) {
          clearInterval(autoCheckIntervalRef.current);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setVerificationSuccess(true);

        // Reload user state
        await loadUser();

        // Navigate to main app
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);
      } else if (!silent) {
        Alert.alert(
          'Not Verified Yet',
          'Your email has not been verified yet. Please check your inbox and click the verification link.'
        );
      }
    } catch (error: any) {
      if (!silent) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to check verification status. Please try again.'
        );
      }
    } finally {
      if (!silent) {
        setIsChecking(false);
      }
    }
  };

  const handleResendEmail = async () => {
    if (isResending || resendCooldown > 0) return;

    try {
      setIsResending(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await apiService.post('/auth/resend-verification', { email });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Email Sent',
        'A new verification email has been sent. Please check your inbox.'
      );

      // Start 60 second cooldown
      setResendCooldown(60);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend verification email. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  if (verificationSuccess) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContent}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.iconGradient}
          >
            <Ionicons name="checkmark-circle" size={50} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Email Verified!</Text>
          <Text style={styles.subtitle}>
            Your email has been successfully verified. Redirecting you to login...
          </Text>
          <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.iconGradient}
          >
            <Ionicons name="mail" size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color="#6366F1" />
            <Text style={styles.infoText}>
              Click the link in the email to verify your account. The link expires in 24 hours.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, isChecking && styles.buttonDisabled]}
            onPress={() => checkVerificationStatus(false)}
            disabled={isChecking}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.buttonGradient}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  I've Verified My Email
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (isResending || resendCooldown > 0) && styles.secondaryButtonDisabled,
            ]}
            onPress={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
          >
            {isResending ? (
              <ActivityIndicator size="small" color="#6366F1" />
            ) : (
              <Text style={styles.secondaryButtonText}>
                {resendCooldown > 0
                  ? `Resend Email (${resendCooldown}s)`
                  : 'Resend Verification Email'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Didn't receive the email?</Text>
          <View style={styles.helpItem}>
            <Ionicons name="folder-outline" size={16} color="#6B7280" />
            <Text style={styles.helpText}>Check your spam or junk folder</Text>
          </View>
          <View style={styles.helpItem}>
            <Ionicons name="at-outline" size={16} color="#6B7280" />
            <Text style={styles.helpText}>Make sure {email} is correct</Text>
          </View>
          <View style={styles.helpItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.helpText}>Wait a few minutes and check again</Text>
          </View>
        </View>

        <View style={styles.autoCheckInfo}>
          <ActivityIndicator size="small" color="#9CA3AF" />
          <Text style={styles.autoCheckText}>
            Automatically checking verification status...
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4338CA',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  helpSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  autoCheckInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  autoCheckText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  loader: {
    marginTop: 24,
  },
});

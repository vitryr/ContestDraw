import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SocialConnectButtonProps {
  platform: 'instagram' | 'tiktok' | 'facebook';
  isConnected: boolean;
  onPress: () => void;
}

const PLATFORM_CONFIG = {
  instagram: {
    name: 'Instagram',
    icon: 'logo-instagram',
    colors: ['#E1306C', '#C13584'],
  },
  tiktok: {
    name: 'TikTok',
    icon: 'musical-notes',
    colors: ['#000000', '#333333'],
  },
  facebook: {
    name: 'Facebook',
    icon: 'logo-facebook',
    colors: ['#1877F2', '#0C63D4'],
  },
};

export const SocialConnectButton: React.FC<SocialConnectButtonProps> = ({
  platform,
  isConnected,
  onPress,
}) => {
  const config = PLATFORM_CONFIG[platform];

  return (
    <TouchableOpacity
      style={[styles.container, isConnected && styles.containerConnected]}
      onPress={onPress}
    >
      {isConnected ? (
        <LinearGradient
          colors={config.colors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name={config.icon as any} size={24} color="#FFFFFF" />
          <View style={styles.content}>
            <Text style={styles.connectedText}>{config.name}</Text>
            <Text style={styles.connectedSubtext}>Connected</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
        </LinearGradient>
      ) : (
        <View style={styles.disconnected}>
          <View style={[styles.iconCircle, { backgroundColor: `${config.colors[0]}20` }]}>
            <Ionicons name={config.icon as any} size={24} color={config.colors[0]} />
          </View>
          <View style={styles.content}>
            <Text style={styles.disconnectedText}>{config.name}</Text>
            <Text style={styles.disconnectedSubtext}>Tap to connect</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  containerConnected: {
    borderColor: 'transparent',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  disconnected: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  connectedText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  connectedSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disconnectedText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  disconnectedSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});

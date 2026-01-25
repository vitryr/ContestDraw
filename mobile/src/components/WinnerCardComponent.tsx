import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Winner } from '../types';

interface WinnerCardComponentProps {
  winner: Winner;
  position: number;
}

export const WinnerCardComponent: React.FC<WinnerCardComponentProps> = ({
  winner,
  position,
}) => {
  const getBadgeColor = (pos: number): string[] => {
    switch (pos) {
      case 1:
        return ['#FFD700', '#FFA500'];
      case 2:
        return ['#C0C0C0', '#A9A9A9'];
      case 3:
        return ['#CD7F32', '#8B4513'];
      default:
        return ['#6366F1', '#8B5CF6'];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getBadgeColor(position)}
        style={styles.badge}
      >
        <Text style={styles.badgeText}>#{position}</Text>
      </LinearGradient>

      <View style={styles.avatarContainer}>
        {winner.profilePicture ? (
          <Image
            source={{ uri: winner.profilePicture }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#6B7280" />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.username}>@{winner.username}</Text>
        <View style={styles.stats}>
          {winner.followers && (
            <View style={styles.stat}>
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text style={styles.statText}>
                {winner.followers >= 1000
                  ? `${(winner.followers / 1000).toFixed(1)}K`
                  : winner.followers}
              </Text>
            </View>
          )}
          {winner.engagementRate && (
            <View style={styles.stat}>
              <Ionicons name="heart" size={14} color="#6B7280" />
              <Text style={styles.statText}>{winner.engagementRate}%</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.platformBadge}>
        <Ionicons
          name={
            winner.platform === 'instagram'
              ? 'logo-instagram'
              : winner.platform === 'tiktok'
              ? 'musical-notes'
              : 'logo-facebook'
          }
          size={16}
          color="#6366F1"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  platformBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

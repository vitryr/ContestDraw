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
        return ['#7c3aed', '#ec4899'];
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
            <Ionicons name="person" size={24} color="#a1a1aa" />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.username}>@{winner.username}</Text>
        <View style={styles.stats}>
          {winner.followers && (
            <View style={styles.stat}>
              <Ionicons name="people" size={14} color="#a1a1aa" />
              <Text style={styles.statText}>
                {winner.followers >= 1000
                  ? `${(winner.followers / 1000).toFixed(1)}K`
                  : winner.followers}
              </Text>
            </View>
          )}
          {winner.engagementRate && (
            <View style={styles.stat}>
              <Ionicons name="heart" size={14} color="#a1a1aa" />
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
          color="#a855f7"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
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
    color: '#ffffff',
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
    backgroundColor: '#12121a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
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
    color: '#a1a1aa',
  },
  platformBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
});

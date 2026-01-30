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
import { format } from 'date-fns';
import { Draw } from '../types';

interface DrawCardComponentProps {
  draw: Draw;
  onPress: () => void;
}

export const DrawCardComponent: React.FC<DrawCardComponentProps> = ({
  draw,
  onPress,
}) => {
  const statusConfig = {
    draft: { color: '#71717a', text: 'Draft', icon: 'document-text' },
    active: { color: '#10B981', text: 'Active', icon: 'play-circle' },
    completed: { color: '#a855f7', text: 'Completed', icon: 'checkmark-circle' },
  };

  const status = statusConfig[draw.status];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {draw.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
          <Ionicons name={status.icon as any} size={14} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>
      </View>

      {draw.description && (
        <Text style={styles.description} numberOfLines={2}>
          {draw.description}
        </Text>
      )}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="people" size={16} color="#a1a1aa" />
          <Text style={styles.statText}>{draw.totalEntries} entries</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="trophy" size={16} color="#a1a1aa" />
          <Text style={styles.statText}>
            {draw.winnersCount} winner{draw.winnersCount > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {draw.completedAt
            ? `Completed ${format(new Date(draw.completedAt), 'MMM d, yyyy')}`
            : `Created ${format(new Date(draw.createdAt), 'MMM d, yyyy')}`}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#71717a" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  date: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
});

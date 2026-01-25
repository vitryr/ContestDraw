import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CreditBalanceComponentProps {
  credits: number;
}

export const CreditBalanceComponent: React.FC<CreditBalanceComponentProps> = ({
  credits,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F3F4F6']}
        style={styles.gradient}
      >
        <Ionicons name="wallet" size={20} color="#6366F1" />
        <View style={styles.content}>
          <Text style={styles.amount}>{credits}</Text>
          <Text style={styles.label}>Credits</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  content: {
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    lineHeight: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 12,
  },
});

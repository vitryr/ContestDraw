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
        colors={['#7c3aed', '#ec4899']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Ionicons name="wallet" size={20} color="#ffffff" />
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
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
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
    color: '#ffffff',
    lineHeight: 20,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 12,
  },
});

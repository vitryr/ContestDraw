import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useDrawStore } from '../services/drawStore';
import { DrawAnimationComponent } from '../components/DrawAnimationComponent';
import { MainNavigationProp } from '../types/navigation';

// Theme colors
const THEME = {
  background: '#0a0a0f',
  elevated: '#12121a',
  card: '#1a1a24',
  accent: '#7c3aed',
  accentPink: '#ec4899',
  accentLight: '#a855f7',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  border: '#27272a',
};

const { width, height } = Dimensions.get('window');

export const DrawAnimationScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const route = useRoute();
  const { drawId } = route.params as { drawId: string };
  const { currentDraw, fetchDraw, executeDraw } = useDrawStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);

  useEffect(() => {
    fetchDraw(drawId);
  }, [drawId]);

  const handleStartDraw = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowStartButton(false);
      setIsAnimating(true);

      await executeDraw(drawId);

      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Results', params: { drawId } }],
          })
        );
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to execute draw. Please try again.');
      setShowStartButton(true);
      setIsAnimating(false);
    }
  };

  const handleClose = () => {
    if (isAnimating) {
      Alert.alert(
        'Cancel Draw?',
        'The draw is in progress. Are you sure you want to cancel?',
        [
          { text: 'Continue Drawing', style: 'cancel' },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[THEME.elevated, THEME.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Ionicons name="close" size={28} color={THEME.textPrimary} />
          </TouchableOpacity>

          {currentDraw && (
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{currentDraw.title}</Text>
                <Text style={styles.subtitle}>
                  Drawing {currentDraw.winnersCount} winner{currentDraw.winnersCount > 1 ? 's' : ''} from{' '}
                  {currentDraw.totalEntries} entries
                </Text>
              </View>

              <DrawAnimationComponent
                isAnimating={isAnimating}
                winners={currentDraw.winners || []}
                totalEntries={currentDraw.totalEntries}
              />

              {showStartButton && (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartDraw}
                >
                  <LinearGradient
                    colors={[THEME.accent, THEME.accentPink]}
                    style={styles.startGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="play" size={32} color="#FFFFFF" />
                    <Text style={styles.startText}>Start Draw</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: THEME.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.textSecondary,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  startText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

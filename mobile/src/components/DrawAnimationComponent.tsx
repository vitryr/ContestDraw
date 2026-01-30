import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Winner } from '../types';

const { width, height } = Dimensions.get('window');

interface DrawAnimationComponentProps {
  isAnimating: boolean;
  winners: Winner[];
  totalEntries: number;
}

export const DrawAnimationComponent: React.FC<DrawAnimationComponentProps> = ({
  isAnimating,
  winners,
  totalEntries,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    }
  }, [isAnimating]);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const rotateValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <View style={styles.animationArea}>
          {isAnimating && (
            <>
              <Animated.View
                style={[
                  styles.spinningCircle,
                  {
                    transform: [
                      { rotate: rotateValue },
                      { scale: scaleValue },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7', '#ec4899']}
                  style={styles.gradientCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>

              <Animated.View style={[styles.centerContent, { opacity: opacityValue }]}>
                <Text style={styles.animationText}>Drawing</Text>
                <Text style={styles.animationSubtext}>
                  {totalEntries} entries
                </Text>
              </Animated.View>
            </>
          )}

          {!isAnimating && winners.length > 0 && (
            <View style={styles.winnersPreview}>
              {winners.slice(0, 3).map((winner, index) => (
                <Animated.View
                  key={winner.id}
                  style={[
                    styles.winnerItem,
                    {
                      opacity: opacityValue,
                      transform: [
                        {
                          translateY: opacityValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#7c3aed', '#ec4899']}
                    style={styles.winnerBadge}
                  >
                    <Text style={styles.winnerPosition}>#{index + 1}</Text>
                  </LinearGradient>
                  <Text style={styles.winnerUsername}>{winner.username}</Text>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    width: width - 40,
    height: height * 0.5,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  animationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 10, 15, 0.5)',
  },
  spinningCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  gradientCircle: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  animationText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  animationSubtext: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  winnersPreview: {
    alignItems: 'center',
    gap: 16,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a24',
    borderRadius: 12,
    padding: 16,
    width: width - 80,
    gap: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  winnerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerPosition: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  winnerUsername: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});

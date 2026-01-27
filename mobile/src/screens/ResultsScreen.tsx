import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Share from 'react-native-share';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { useDrawStore } from '../services/drawStore';
import { WinnerCardComponent } from '../components/WinnerCardComponent';

export const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { drawId } = route.params as { drawId: string };
  const { currentDraw, fetchDraw } = useDrawStore();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    fetchDraw(drawId);
  }, [drawId]);

  const handleShare = async () => {
    if (!currentDraw) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const winners = currentDraw.winners?.map((w) => w.username).join(', ') || '';
      const message = `🎉 ${currentDraw.title}\n\nWinners: ${winners}\n\nDrawn with Cleack`;

      await Share.open({
        title: 'Share Results',
        message,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleExportVideo = async () => {
    try {
      if (!permissionResponse?.granted) {
        const permission = await requestPermission();
        if (!permission.granted) {
          Alert.alert(
            'Permission Required',
            'Please grant media library access to save videos.'
          );
          return;
        }
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert('Coming Soon', 'Video export feature will be available soon!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export video. Please try again.');
    }
  };

  const handleDone = () => {
    navigation.navigate('HomeTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="trophy" size={48} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Draw Complete!</Text>
          <Text style={styles.headerSubtitle}>
            {currentDraw?.winnersCount} winner{(currentDraw?.winnersCount || 0) > 1 ? 's' : ''} selected
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.drawInfo}>
          <Text style={styles.drawTitle}>{currentDraw?.title}</Text>
          {currentDraw?.description && (
            <Text style={styles.drawDescription}>{currentDraw.description}</Text>
          )}
          <Text style={styles.drawStats}>
            Drawn from {currentDraw?.totalEntries} entries
          </Text>
        </View>

        <View style={styles.winnersSection}>
          <Text style={styles.sectionTitle}>Winners</Text>
          {currentDraw?.winners?.map((winner, index) => (
            <WinnerCardComponent
              key={winner.id}
              winner={winner}
              position={index + 1}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={24} color="#6366F1" />
            <Text style={styles.actionText}>Share Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportVideo}
          >
            <Ionicons name="videocam" size={24} color="#6366F1" />
            <Text style={styles.actionText}>Export Video</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  drawInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  drawTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  drawDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  drawStats: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  winnersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
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
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

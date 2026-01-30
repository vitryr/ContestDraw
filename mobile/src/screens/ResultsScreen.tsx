import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Share from 'react-native-share';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDrawStore } from '../services/drawStore';
import { WinnerCardComponent } from '../components/WinnerCardComponent';
import { apiService } from '../services/apiService';

// Video generation types
type VideoStatus = 'IDLE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface VideoGenerateResponse {
  data: {
    jobId: string;
  };
}

interface VideoStatusResponse {
  data: {
    status: VideoStatus;
    videoUrl?: string;
    errorMessage?: string;
    progress?: number;
  };
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 60; // 5 minutes max polling time

export const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { drawId } = route.params as { drawId: string };
  const { currentDraw, fetchDraw } = useDrawStore();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Video generation state
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('IDLE');
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Certificate download state
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);

  // CSV export state
  const [isExporting, setIsExporting] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollAttemptsRef = useRef<number>(0);

  useEffect(() => {
    fetchDraw(drawId);
  }, [drawId]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollAttemptsRef.current = 0;
  }, []);

  const pollVideoStatus = useCallback(async (jobId: string) => {
    try {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling();
        setVideoStatus('FAILED');
        Alert.alert(
          'Timeout',
          'Video generation is taking longer than expected. Please try again later.'
        );
        return;
      }

      const response = await apiService.get<VideoStatusResponse>(
        `/api/draws/${drawId}/video/status/${jobId}`
      );

      const { status, videoUrl: url, errorMessage, progress } = response.data.data;

      setVideoStatus(status);
      if (progress !== undefined) {
        setVideoProgress(progress);
      }

      if (status === 'COMPLETED' && url) {
        stopPolling();
        setVideoUrl(url);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (status === 'FAILED') {
        stopPolling();
        Alert.alert(
          'Video Generation Failed',
          errorMessage || 'An error occurred while generating the video. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error polling video status:', error);
      // Don't stop polling on network errors, let it retry
    }
  }, [drawId, stopPolling]);

  const startPolling = useCallback((jobId: string) => {
    // Clear any existing polling
    stopPolling();

    // Start polling immediately, then every POLL_INTERVAL_MS
    pollVideoStatus(jobId);
    pollIntervalRef.current = setInterval(() => {
      pollVideoStatus(jobId);
    }, POLL_INTERVAL_MS);
  }, [pollVideoStatus, stopPolling]);

  const initiateVideoGeneration = async () => {
    try {
      setVideoStatus('PENDING');
      setVideoProgress(0);
      setVideoUrl(null);

      const response = await apiService.post<VideoGenerateResponse>(
        `/api/draws/${drawId}/video/generate`
      );

      const { jobId } = response.data.data;
      setVideoJobId(jobId);
      startPolling(jobId);
    } catch (error: any) {
      setVideoStatus('FAILED');
      const errorMessage = error.response?.data?.message || 'Failed to start video generation.';
      Alert.alert('Error', errorMessage);
    }
  };

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

      // Start video generation
      await initiateVideoGeneration();
    } catch (error) {
      Alert.alert('Error', 'Failed to start video generation. Please try again.');
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;

    try {
      setIsDownloading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Download the video to local filesystem
      const filename = `cleack_draw_${drawId}_${Date.now()}.mp4`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error('Download failed');
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);

      // Optionally save to a specific album
      const album = await MediaLibrary.getAlbumAsync('Cleack');
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Cleack', asset, false);
      }

      // Clean up cache file
      await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Video saved to your gallery!');
    } catch (error) {
      console.error('Error downloading video:', error);
      Alert.alert('Error', 'Failed to save video. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePlayVideo = () => {
    if (!videoUrl) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(videoUrl).catch(() => {
      Alert.alert('Error', 'Unable to open video. Please try downloading instead.');
    });
  };

  const handleCancelVideoGeneration = () => {
    stopPolling();
    setVideoStatus('IDLE');
    setVideoJobId(null);
    setVideoProgress(0);
  };

  const getVideoStatusMessage = (): string => {
    switch (videoStatus) {
      case 'PENDING':
        return 'Queuing video generation...';
      case 'PROCESSING':
        return videoProgress > 0
          ? `Generating video... ${Math.round(videoProgress)}%`
          : 'Generating video...';
      default:
        return '';
    }
  };

  const isVideoGenerating = videoStatus === 'PENDING' || videoStatus === 'PROCESSING';

  const handleDownloadCertificate = async () => {
    if (!currentDraw || isDownloadingCertificate) return;

    try {
      setIsDownloadingCertificate(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Check if sharing is available on this device
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert(
          'Not Available',
          'Sharing is not available on this device.'
        );
        setIsDownloadingCertificate(false);
        return;
      }

      // Define the local file path for the certificate
      const fileName = `certificate_${drawId}_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Download the certificate PDF from the API
      const downloadResult = await FileSystem.downloadAsync(
        `${apiService.getBaseUrl()}/draws/${drawId}/certificate`,
        fileUri,
        {
          headers: {
            Authorization: await apiService.getAuthHeader(),
          },
        }
      );

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }

      // Share the downloaded PDF
      await Sharing.shareAsync(downloadResult.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Certificate',
        UTI: 'com.adobe.pdf',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Certificate download error:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to download certificate. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  const handleExportResults = async () => {
    if (!currentDraw || isExporting) return;

    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Check if sharing is available on this device
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert(
          'Not Available',
          'Sharing is not available on this device.'
        );
        setIsExporting(false);
        return;
      }

      // Generate CSV content from winners data
      const csvHeaders = 'Position,Username,Followers,Platform\n';
      const csvRows = currentDraw.winners
        ?.map((winner, index) => {
          const position = index + 1;
          const username = winner.username || '';
          const followers = winner.followers || 0;
          const platform = currentDraw.platform || 'unknown';
          return `${position},${username},${followers},${platform}`;
        })
        .join('\n') || '';

      const csvContent = csvHeaders + csvRows;

      // Define the local file path for the CSV
      const fileName = `draw_results_${drawId}_${Date.now()}.csv`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Write CSV content to file
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the CSV file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Draw Results',
        UTI: 'public.comma-separated-values-text',
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Export results error:', error);
      Alert.alert('Error', 'Failed to export results. Please try again.');
    } finally {
      setIsExporting(false);
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

          {/* Video Export Button - only show when idle */}
          {videoStatus === 'IDLE' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExportVideo}
            >
              <Ionicons name="videocam" size={24} color="#6366F1" />
              <Text style={styles.actionText}>Export Video</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, isDownloadingCertificate && styles.actionButtonDisabled]}
            onPress={handleDownloadCertificate}
            disabled={isDownloadingCertificate}
          >
            {isDownloadingCertificate ? (
              <ActivityIndicator size="small" color="#6366F1" />
            ) : (
              <Ionicons name="document-text" size={24} color="#6366F1" />
            )}
            <Text style={styles.actionText}>
              {isDownloadingCertificate ? 'Downloading...' : 'Certificate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isExporting && styles.actionButtonDisabled]}
            onPress={handleExportResults}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#6366F1" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#6366F1" />
            )}
            <Text style={styles.actionText}>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Video Generation Status */}
        {isVideoGenerating && (
          <View style={styles.videoStatusContainer}>
            <View style={styles.videoStatusContent}>
              <ActivityIndicator size="small" color="#6366F1" />
              <Text style={styles.videoStatusText}>{getVideoStatusMessage()}</Text>
            </View>
            {videoProgress > 0 && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${videoProgress}%` }]} />
              </View>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelVideoGeneration}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Video Ready Actions */}
        {videoStatus === 'COMPLETED' && videoUrl && (
          <View style={styles.videoReadyContainer}>
            <View style={styles.videoReadyHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.videoReadyTitle}>Video Ready!</Text>
            </View>
            <View style={styles.videoActions}>
              <TouchableOpacity
                style={[styles.videoActionButton, styles.playButton]}
                onPress={handlePlayVideo}
              >
                <Ionicons name="play-circle" size={20} color="#FFFFFF" />
                <Text style={styles.videoActionButtonText}>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.videoActionButton, styles.downloadButton]}
                onPress={handleDownloadVideo}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="download" size={20} color="#FFFFFF" />
                    <Text style={styles.videoActionButtonText}>Save to Gallery</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Video Failed - Retry Option */}
        {videoStatus === 'FAILED' && (
          <View style={styles.videoFailedContainer}>
            <View style={styles.videoFailedHeader}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <Text style={styles.videoFailedTitle}>Video generation failed</Text>
            </View>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleExportVideo}
            >
              <Ionicons name="refresh" size={20} color="#6366F1" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
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
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
    textAlign: 'center',
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
  // Video Status Styles
  videoStatusContainer: {
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
  videoStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  videoStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    flex: 1,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  cancelButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  // Video Ready Styles
  videoReadyContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  videoReadyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  videoReadyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
  },
  videoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  videoActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  playButton: {
    backgroundColor: '#6366F1',
  },
  downloadButton: {
    backgroundColor: '#10B981',
  },
  videoActionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  // Video Failed Styles
  videoFailedContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  videoFailedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  videoFailedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#991B1B',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
});

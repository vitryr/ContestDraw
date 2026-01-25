import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../services/authStore';
import { useDrawStore } from '../services/drawStore';
import { CreditBalanceComponent } from '../components/CreditBalanceComponent';
import { DrawCardComponent } from '../components/DrawCardComponent';
import { MainNavigationProp } from '../types/navigation';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const { user } = useAuthStore();
  const { draws, fetchDraws, isLoading } = useDrawStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchDraws();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDraws();
    setRefreshing(false);
  }, []);

  const activeDraws = draws.filter((draw) => draw.status === 'active');
  const completedDraws = draws.filter((draw) => draw.status === 'completed');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name}!</Text>
            <Text style={styles.subtitle}>Ready to run a draw?</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Credits')}
          >
            <CreditBalanceComponent credits={user?.credits || 0} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('NewDraw')}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle" size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>New Draw</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DrawHistory')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionGradient}
              >
                <Ionicons name="time" size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {activeDraws.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Draws</Text>
              <Text style={styles.sectionCount}>{activeDraws.length}</Text>
            </View>
            {activeDraws.map((draw) => (
              <DrawCardComponent
                key={draw.id}
                draw={draw}
                onPress={() => {
                  navigation.navigate('DrawAnimation', { drawId: draw.id });
                }}
              />
            ))}
          </View>
        )}

        {completedDraws.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Completed</Text>
            </View>
            {completedDraws.slice(0, 3).map((draw) => (
              <DrawCardComponent
                key={draw.id}
                draw={draw}
                onPress={() => {
                  navigation.navigate('Results', { drawId: draw.id });
                }}
              />
            ))}
          </View>
        )}

        {draws.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Draws Yet</Text>
            <Text style={styles.emptyText}>
              Create your first draw to get started!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('NewDraw')}
            >
              <Text style={styles.emptyButtonText}>Create Draw</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

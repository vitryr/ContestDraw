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
import { colors, spacing, borderRadius, shadows, fonts } from '../theme';

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
        colors={colors.gradients.primary}
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
          />
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
                colors={colors.gradients.primary}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle" size={32} color={colors.text.primary} />
                <Text style={styles.actionText}>New Draw</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DrawHistory')}
            >
              <LinearGradient
                colors={colors.gradients.success}
                style={styles.actionGradient}
              >
                <Ionicons name="time" size={32} color={colors.text.primary} />
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
            <Ionicons name="trophy-outline" size={64} color={colors.text.muted} />
            <Text style={styles.emptyTitle}>No Draws Yet</Text>
            <Text style={styles.emptyText}>
              Create your first draw to get started!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('NewDraw')}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>Create Draw</Text>
              </LinearGradient>
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
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text.secondary,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: shadows.md,
      android: {
        elevation: shadows.md.elevation,
      },
    }),
  },
  actionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionText: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
});

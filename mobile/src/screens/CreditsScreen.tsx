import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../services/authStore';
import { paymentService } from '../services/paymentService';
import { CreditPackage } from '../types';
import { colors, spacing, borderRadius, shadows, fonts } from '../theme';

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'credits_10', name: 'Starter', credits: 10, price: 9.99 },
  { id: 'credits_25', name: 'Basic', credits: 25, price: 19.99, popular: true },
  { id: 'credits_50', name: 'Pro', credits: 50, price: 34.99, bonus: 5 },
  { id: 'credits_100', name: 'Premium', credits: 100, price: 59.99, bonus: 15 },
];

export const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuthStore();
  const [products, setProducts] = useState<CreditPackage[]>(CREDIT_PACKAGES);
  const [loading, setLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const iapProducts = await paymentService.getProducts();

      const updatedPackages = CREDIT_PACKAGES.map((pkg) => {
        const iapProduct = iapProducts.find((p) => p.productId === pkg.id);
        return {
          ...pkg,
          price: iapProduct ? parseFloat(iapProduct.price) : pkg.price,
        };
      });

      setProducts(updatedPackages);
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: CreditPackage) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setPurchasingId(pkg.id);

      const success = await paymentService.purchaseCredits(pkg.id);

      if (success) {
        const totalCredits = pkg.credits + (pkg.bonus || 0);
        updateUser({ credits: (user?.credits || 0) + totalCredits });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
          'Purchase Successful!',
          `${totalCredits} credits have been added to your account.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // User canceled the payment (Android Stripe flow)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Provide more specific error messages
      let errorMessage = 'Please try again later.';
      if (error.message) {
        if (error.message.includes('network') || error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('canceled') || error.message.includes('Canceled')) {
          // User canceled - no need to show error
          return;
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert('Purchase Failed', errorMessage);
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRestore = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLoading(true);

      const purchases = await paymentService.restorePurchases();

      if (purchases.length > 0) {
        Alert.alert('Success', 'Your purchases have been restored!');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Credits</Text>
        {Platform.OS === 'ios' && (
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.gradients.primary}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>{user?.credits || 0} Credits</Text>
          <Text style={styles.balanceHint}>1 credit = 1 draw execution</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Choose a Package</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.primary} />
          </View>
        ) : (
          <View style={styles.packages}>
            {products.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  pkg.popular && styles.packageCardPopular,
                ]}
                onPress={() => handlePurchase(pkg)}
                disabled={purchasingId === pkg.id}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}

                <Text style={styles.packageName}>{pkg.name}</Text>
                <View style={styles.packageCredits}>
                  <Text style={styles.packageCreditsAmount}>{pkg.credits}</Text>
                  <Text style={styles.packageCreditsLabel}>credits</Text>
                  {pkg.bonus && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusText}>+{pkg.bonus} Bonus</Text>
                    </View>
                  )}
                </View>

                <View style={styles.packagePrice}>
                  <Text style={styles.packagePriceAmount}>
                    ${pkg.price.toFixed(2)}
                  </Text>
                  <Text style={styles.packagePriceUnit}>
                    ${(pkg.price / pkg.credits).toFixed(2)}/credit
                  </Text>
                </View>

                {purchasingId === pkg.id ? (
                  <ActivityIndicator color={colors.accent.primary} style={styles.purchaseLoader} />
                ) : (
                  <LinearGradient
                    colors={colors.gradients.primary}
                    style={styles.packageButton}
                  >
                    <Text style={styles.packageButtonText}>Purchase</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.accent.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Credits Work</Text>
            <Text style={styles.infoText}>
              - 1 credit = 1 draw execution{'\n'}
              - Credits never expire{'\n'}
              - Use for unlimited entries per draw{'\n'}
              - Safe and secure payment
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  restoreText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.accent.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  balanceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    fontSize: 48,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  balanceHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  packages: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  packageCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border.default,
    ...shadows.md,
  },
  packageCardPopular: {
    borderColor: colors.accent.primary,
  },
  popularBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  popularText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  packageName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  packageCredits: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  packageCreditsAmount: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.accent.primary,
    marginRight: spacing.sm,
  },
  packageCreditsLabel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
  },
  bonusBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  bonusText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  packagePrice: {
    marginBottom: spacing.md,
  },
  packagePriceAmount: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  packagePriceUnit: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
  },
  packageButton: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  packageButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  purchaseLoader: {
    paddingVertical: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.xl,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.accent.tertiary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

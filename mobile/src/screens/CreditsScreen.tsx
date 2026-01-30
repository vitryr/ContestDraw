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
          <Ionicons name="arrow-back" size={24} color="#111827" />
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
          colors={['#6366F1', '#8B5CF6']}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>{user?.credits || 0} Credits</Text>
          <Text style={styles.balanceHint}>1 credit = 1 draw execution</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Choose a Package</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
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
                  <ActivityIndicator color="#6366F1" style={styles.purchaseLoader} />
                ) : (
                  <View style={styles.packageButton}>
                    <Text style={styles.packageButtonText}>Purchase</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366F1" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Credits Work</Text>
            <Text style={styles.infoText}>
              • 1 credit = 1 draw execution{'\n'}
              • Credits never expire{'\n'}
              • Use for unlimited entries per draw{'\n'}
              • Safe and secure payment
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  restoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceHint: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#C7D2FE',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  packages: {
    gap: 16,
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
  packageCardPopular: {
    borderColor: '#6366F1',
  },
  popularBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  packageName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  packageCredits: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  packageCreditsAmount: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
    marginRight: 8,
  },
  packageCreditsLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bonusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  bonusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  packagePrice: {
    marginBottom: 16,
  },
  packagePriceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  packagePriceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  packageButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  packageButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  purchaseLoader: {
    paddingVertical: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6366F1',
    lineHeight: 20,
  },
});

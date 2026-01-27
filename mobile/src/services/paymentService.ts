import { Platform } from 'react-native';
import RNIap, {
  Product,
  Purchase,
  PurchaseError,
  requestPurchase,
  useIAP,
} from 'react-native-iap';
// import { useStripeTerminal } from '@stripe/stripe-react-native'; // Not available in this version
import ENV from '../config/environment';
import { apiService } from './apiService';

const productIds = Platform.select({
  ios: [
    'com.cleack.credits.10',
    'com.cleack.credits.25',
    'com.cleack.credits.50',
    'com.cleack.credits.100',
  ],
  android: [
    'credits_10',
    'credits_25',
    'credits_50',
    'credits_100',
  ],
}) || [];

class PaymentService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      if (Platform.OS === 'ios') {
        await RNIap.initConnection();
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      await this.initialize();

      if (Platform.OS === 'ios') {
        const products = await RNIap.getProducts({ skus: productIds });
        return products;
      } else {
        return this.getAndroidProducts();
      }
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  }

  private async getAndroidProducts() {
    try {
      const response = await apiService.get('/payments/packages');
      return response.data.packages;
    } catch (error) {
      console.error('Get Android products error:', error);
      return [];
    }
  }

  async purchaseCredits(productId: string): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return await this.purchaseIOS(productId);
      } else {
        return await this.purchaseAndroid(productId);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }

  private async purchaseIOS(productId: string): Promise<boolean> {
    try {
      const purchase = await requestPurchase({ sku: productId });

      if (purchase) {
        // Handle both single purchase and array of purchases
        const actualPurchase = Array.isArray(purchase) ? purchase[0] : purchase;
        if (actualPurchase) {
          const receipt = actualPurchase.transactionReceipt;
          if (receipt) {
            await this.verifyPurchase(receipt, 'ios');
          }
          await RNIap.finishTransaction({ purchase: actualPurchase, isConsumable: true });
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.error('Purchase error:', error.code, error.message);
      }
      throw error;
    }
  }

  private async purchaseAndroid(productId: string): Promise<boolean> {
    try {
      const response = await apiService.post('/payments/create-intent', {
        productId,
        platform: 'android',
      });

      const { clientSecret } = response.data;

      return true;
    } catch (error) {
      console.error('Android purchase error:', error);
      throw error;
    }
  }

  private async verifyPurchase(receipt: string, platform: 'ios' | 'android') {
    try {
      const response = await apiService.post('/payments/verify', {
        receipt,
        platform,
      });
      return response.data;
    } catch (error) {
      console.error('Verify purchase error:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<Purchase[]> {
    try {
      if (Platform.OS === 'ios') {
        const purchases = await RNIap.getAvailablePurchases();

        for (const purchase of purchases) {
          if (purchase.transactionReceipt) {
            await this.verifyPurchase(purchase.transactionReceipt, 'ios');
          }
        }

        return purchases;
      }

      return [];
    } catch (error) {
      console.error('Restore purchases error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (Platform.OS === 'ios') {
        await RNIap.endConnection();
      }
      this.initialized = false;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }
}

export const paymentService = new PaymentService();

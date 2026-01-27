import Constants from 'expo-constants';
import { API_URL, WS_URL, STRIPE_PUBLISHABLE_KEY_IOS } from '@env';

const ENV = {
  dev: {
    apiUrl: API_URL || 'http://localhost:8000/api',
    wsUrl: WS_URL || 'ws://localhost:8000',
    stripePublishableKey: STRIPE_PUBLISHABLE_KEY_IOS || 'pk_test_...',
    enableDebugLogs: true,
  },
  staging: {
    apiUrl: 'https://staging-api.cleack.io/api',
    wsUrl: 'wss://staging-api.cleack.io',
    stripePublishableKey: 'pk_test_...',
    enableDebugLogs: true,
  },
  prod: {
    apiUrl: 'https://api.cleack.io/api',
    wsUrl: 'wss://api.cleack.io',
    stripePublishableKey: 'pk_live_...',
    enableDebugLogs: false,
  },
};

const getEnvVars = (env = (Constants.expoConfig as any)?.releaseChannel) => {
  if (__DEV__) return ENV.dev;
  if (env === 'staging') return ENV.staging;
  if (env === 'production') return ENV.prod;
  return ENV.dev;
};

export default getEnvVars();

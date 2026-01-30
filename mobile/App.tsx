import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { StripeProvider } from '@stripe/stripe-react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NotificationHandler } from './src/components/NotificationHandler';
import ENV from './src/config/environment';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts - temporarily disabled to debug other issues
        // await Font.loadAsync({
        //   'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        //   'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
        //   'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        // });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  // Only wrap with StripeProvider on Android (iOS uses native IAP)
  const renderApp = () => (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NotificationHandler />
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );

  return (
    <ErrorBoundary>
      {Platform.OS === 'android' ? (
        <StripeProvider
          publishableKey={ENV.stripePublishableKey}
          urlScheme="cleack"
          merchantIdentifier="merchant.com.cleack"
        >
          {renderApp()}
        </StripeProvider>
      ) : (
        renderApp()
      )}
    </ErrorBoundary>
  );
}

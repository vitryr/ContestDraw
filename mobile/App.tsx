import React, { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { StripeProvider } from '@stripe/stripe-react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NotificationHandler } from './src/components/NotificationHandler';
import { ConsentModal } from './src/components/ConsentModal';
import ENV from './src/config/environment';

// Import services for consent-based initialization
import { analytics } from './src/services/analytics';
import { errorTracking } from './src/services/errorTracking';
import { consentService, ConsentState, ConsentCategory } from './src/services/consent';

// Note: Analytics and error tracking are now initialized only after GDPR consent

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts - temporarily disabled to debug other issues
        // await Font.loadAsync({
        //   'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        //   'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
        //   'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        // });

        // Initialize consent service and check if consent is needed
        await consentService.init();
        const hasConsent = consentService.isConsentGiven();

        if (!hasConsent) {
          // Show consent modal for first-time users
          setShowConsentModal(true);
        } else {
          // User already gave consent, initialize services based on preferences
          const consent = await consentService.getConsent();
          if (consent && consent[ConsentCategory.ANALYTICS]) {
            await analytics.init(true);
            errorTracking.init(true);
          }
        }
        setConsentChecked(true);
      } catch (e) {
        console.warn(e);
        setConsentChecked(true);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Handle consent from modal
  const handleConsent = useCallback(async (consent: ConsentState) => {
    setShowConsentModal(false);

    // Initialize tracking services if analytics consent was given
    if (consent[ConsentCategory.ANALYTICS]) {
      await analytics.init(true);
      errorTracking.init(true);
    }
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
      {/* GDPR Consent Modal - shown on first launch */}
      <ConsentModal
        visible={showConsentModal && consentChecked}
        onConsent={handleConsent}
      />
    </ErrorBoundary>
  );
}

/**
 * GDPR-Compliant Consent Modal Component
 * Full-screen modal for managing user privacy preferences
 * Compliant with RGPD (French GDPR implementation)
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import {
  ConsentState,
  ConsentCategory,
  DEFAULT_CONSENT_STATE,
  consentService,
} from '../services/consent';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Privacy policy URL
const PRIVACY_POLICY_URL = 'https://cleack.io/privacy';

// Props interface
interface ConsentModalProps {
  visible: boolean;
  onConsent: (consent: ConsentState) => void;
}

// Consent category configuration
interface CategoryConfig {
  key: ConsentCategory;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  disabled: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: ConsentCategory.ESSENTIAL,
    icon: 'shield-checkmark',
    title: 'Essentiel',
    description:
      'Requis pour le fonctionnement de l\'application. Authentification, securite et preferences de base.',
    disabled: true,
  },
  {
    key: ConsentCategory.ANALYTICS,
    icon: 'analytics',
    title: 'Analyse',
    description:
      'Mixpanel et Sentry pour le suivi des performances et la detection des erreurs. Nous aide a ameliorer l\'application.',
    disabled: false,
  },
  {
    key: ConsentCategory.MARKETING,
    icon: 'megaphone',
    title: 'Marketing',
    description:
      'Communications personnalisees et offres promotionnelles basees sur votre utilisation.',
    disabled: false,
  },
  {
    key: ConsentCategory.PREFERENCES,
    icon: 'options',
    title: 'Preferences',
    description:
      'Memorisation de vos preferences d\'affichage et parametres personnalises.',
    disabled: false,
  },
];

export const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  onConsent,
}) => {
  // State for consent toggles
  const [consent, setConsent] = useState<ConsentState>({
    ...DEFAULT_CONSENT_STATE,
  });

  // State for showing detailed options
  const [showDetails, setShowDetails] = useState(false);

  // Toggle a specific category
  const toggleCategory = useCallback((category: ConsentCategory) => {
    if (category === ConsentCategory.ESSENTIAL) return; // Essential cannot be toggled

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Accept all
  const handleAcceptAll = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const fullConsent: ConsentState = {
      [ConsentCategory.ESSENTIAL]: true,
      [ConsentCategory.ANALYTICS]: true,
      [ConsentCategory.MARKETING]: true,
      [ConsentCategory.PREFERENCES]: true,
    };
    await consentService.setConsent(fullConsent);
    onConsent(fullConsent);
  }, [onConsent]);

  // Reject all non-essential
  const handleRejectAll = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const minimalConsent: ConsentState = {
      [ConsentCategory.ESSENTIAL]: true,
      [ConsentCategory.ANALYTICS]: false,
      [ConsentCategory.MARKETING]: false,
      [ConsentCategory.PREFERENCES]: false,
    };
    await consentService.setConsent(minimalConsent);
    onConsent(minimalConsent);
  }, [onConsent]);

  // Save custom preferences
  const handleSavePreferences = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const finalConsent: ConsentState = {
      ...consent,
      [ConsentCategory.ESSENTIAL]: true, // Always true
    };
    await consentService.setConsent(finalConsent);
    onConsent(finalConsent);
  }, [consent, onConsent]);

  // Show detailed options
  const handleCustomize = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDetails(true);
  }, []);

  // Open privacy policy
  const openPrivacyPolicy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(PRIVACY_POLICY_URL);
  }, []);

  // Render a single category toggle
  const renderCategory = (config: CategoryConfig) => (
    <View key={config.key} style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={config.icon} size={20} color="#7c3aed" />
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>{config.title}</Text>
          {config.disabled && (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredBadgeText}>Requis</Text>
            </View>
          )}
        </View>
        <Switch
          value={consent[config.key]}
          onValueChange={() => toggleCategory(config.key)}
          disabled={config.disabled}
          trackColor={{ false: '#27272a', true: 'rgba(124, 58, 237, 0.4)' }}
          thumbColor={consent[config.key] ? '#7c3aed' : '#71717a'}
          ios_backgroundColor="#27272a"
        />
      </View>
      <Text style={styles.categoryDescription}>{config.description}</Text>
    </View>
  );

  // Initial view with quick actions
  const renderInitialView = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Ionicons name="shield-checkmark" size={48} color="#7c3aed" />
      </View>

      <Text style={styles.title}>Protection de vos donnees</Text>

      <Text style={styles.description}>
        Nous respectons votre vie privee. Conformement au RGPD, nous vous
        demandons votre consentement pour utiliser des cookies et technologies
        similaires pour ameliorer votre experience.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAcceptAll}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Tout accepter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleCustomize}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={20} color="#7c3aed" />
          <Text style={styles.secondaryButtonText}>Personnaliser</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={handleRejectAll}
          activeOpacity={0.8}
        >
          <Text style={styles.tertiaryButtonText}>Refuser tout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.privacyLink}
        onPress={openPrivacyPolicy}
        activeOpacity={0.7}
      >
        <Ionicons name="document-text-outline" size={16} color="#a1a1aa" />
        <Text style={styles.privacyLinkText}>
          Consulter notre politique de confidentialite
        </Text>
        <Ionicons name="open-outline" size={14} color="#a1a1aa" />
      </TouchableOpacity>
    </View>
  );

  // Detailed view with all categories
  const renderDetailedView = () => (
    <View style={styles.content}>
      <View style={styles.detailedHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowDetails(false)}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.detailedTitle}>Gerer vos preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.detailedDescription}>
        Selectionnez les categories de donnees que vous acceptez de partager
        avec nous.
      </Text>

      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(renderCategory)}
      </ScrollView>

      <View style={styles.detailedButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePreferences}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Enregistrer mes choix</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.privacyLink}
          onPress={openPrivacyPolicy}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={16} color="#a1a1aa" />
          <Text style={styles.privacyLinkText}>Politique de confidentialite</Text>
          <Ionicons name="open-outline" size={14} color="#a1a1aa" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.androidOverlay} />
        )}
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.modalContainer}>
            {showDetails ? renderDetailedView() : renderInitialView()}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#12121a',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#7c3aed',
  },
  tertiaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tertiaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#71717a',
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    marginTop: 8,
  },
  privacyLinkText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  // Detailed view styles
  detailedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  detailedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 32,
  },
  detailedDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  categoriesContainer: {
    maxHeight: 320,
  },
  categoriesContent: {
    gap: 12,
    paddingBottom: 8,
  },
  categoryItem: {
    backgroundColor: '#1a1a24',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  requiredBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  requiredBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#7c3aed',
  },
  categoryDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 18,
    marginLeft: 48,
  },
  detailedButtonContainer: {
    marginTop: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});

export default ConsentModal;

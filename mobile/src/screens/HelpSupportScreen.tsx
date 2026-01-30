import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'How do credits work?',
    answer:
      'Each credit allows you to run one draw. Credits are consumed when you execute a draw to select winners. Credits never expire, so you can use them whenever you need.',
  },
  {
    id: '2',
    question: 'How are winners selected?',
    answer:
      'Winners are selected using a cryptographically secure random algorithm. This ensures fair and unbiased selection from all eligible participants.',
  },
  {
    id: '3',
    question: 'Can I filter participants?',
    answer:
      'Yes! You can filter participants based on various criteria including minimum followers, engagement rate, location, and more. Filters help ensure quality participants.',
  },
  {
    id: '4',
    question: 'Which platforms are supported?',
    answer:
      'We currently support Instagram, TikTok, Facebook, and YouTube. You can import participants from posts, videos, or upload a CSV file with participant data.',
  },
  {
    id: '5',
    question: 'How do I import participants?',
    answer:
      'You can import participants by entering a post URL or uploading a CSV file. Our system will automatically extract usernames and relevant data from the content.',
  },
  {
    id: '6',
    question: 'Can I export draw results?',
    answer:
      'Yes, you can export your draw results including winner details. Results can be shared or downloaded for your records.',
  },
  {
    id: '7',
    question: 'What happens if I run out of credits?',
    answer:
      'You can purchase more credits at any time from the Credits screen. We offer various packages to suit different needs.',
  },
  {
    id: '8',
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption and security practices to protect your data. We never share your information with third parties.',
  },
];

export const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ||
    Constants.expoConfig?.android?.versionCode?.toString() || '1';

  const toggleFAQ = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('mailto:support@cleack.io?subject=Support Request');
  };

  const handleOpenDocumentation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://cleack.io/docs');
  };

  const handleOpenTwitter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://twitter.com/cleackapp');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleContactSupport}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="mail" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.actionTitle}>Contact Us</Text>
              <Text style={styles.actionSubtitle}>Email support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleOpenDocumentation}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="book" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.actionTitle}>Documentation</Text>
              <Text style={styles.actionSubtitle}>Learn more</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleOpenTwitter}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="logo-twitter" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.actionTitle}>Twitter</Text>
              <Text style={styles.actionSubtitle}>Updates</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {FAQ_DATA.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Ionicons
                      name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                  {expandedId === item.id && (
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  )}
                </TouchableOpacity>
                {index < FAQ_DATA.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleContactSupport}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="headset" size={32} color="#7c3aed" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Need More Help?</Text>
              <Text style={styles.contactSubtitle}>
                Our support team is here to help you with any questions or issues.
              </Text>
              <LinearGradient
                colors={['#7c3aed', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactButton}
              >
                <Text style={styles.contactButtonText}>Send Email</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name</Text>
              <Text style={styles.infoValue}>Cleack</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>{appVersion}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>{buildNumber}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>
                {Platform.OS === 'ios' ? 'iOS' : 'Android'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with love by the Cleack team
          </Text>
          <Text style={styles.copyrightText}>
            2024 Cleack. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12121a',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 2,
  },
  faqContainer: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    paddingRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginTop: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginHorizontal: 16,
  },
  contactCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
});

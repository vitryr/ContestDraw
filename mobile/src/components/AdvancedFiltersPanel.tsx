/**
 * AdvancedFiltersPanel Component
 * Complete filters panel for mobile with all filter sections
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  AdvancedDrawFilters,
  FilterTier,
  FilterAvailability,
  SourceCapabilities,
  FILTER_SECTIONS,
  TIER_COLORS,
  TIER_LABELS,
} from '../types/filters';

interface AdvancedFiltersPanelProps {
  filters: AdvancedDrawFilters;
  onUpdateFilter: <K extends keyof AdvancedDrawFilters>(
    category: K,
    values: Partial<AdvancedDrawFilters[K]>
  ) => void;
  capabilities: SourceCapabilities | null;
  availableFilters: FilterAvailability[];
  userTier: FilterTier;
  isFilterAvailable: (filterId: string) => boolean;
  getUnavailableReason: (filterId: string) => string | null;
}

interface FilterSectionProps {
  id: string;
  title: string;
  icon: string;
  description: string;
  tier: FilterTier;
  userTier: FilterTier;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  id,
  title,
  icon,
  description,
  tier,
  userTier,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tierOrder: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
  const needsUpgrade = tierOrder.indexOf(tier) > tierOrder.indexOf(userTier);

  const toggleSection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.section, needsUpgrade && styles.sectionLocked]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${TIER_COLORS[tier]}20` }]}>
            <Ionicons name={icon as any} size={20} color={TIER_COLORS[tier]} />
          </View>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>{title}</Text>
              {tier !== 'free' && (
                <View style={[styles.tierBadge, { backgroundColor: `${TIER_COLORS[tier]}20` }]}>
                  <Text style={[styles.tierBadgeText, { color: TIER_COLORS[tier] }]}>
                    {TIER_LABELS[tier]}
                  </Text>
                </View>
              )}
              {needsUpgrade && (
                <Ionicons name="lock-closed" size={14} color="#71717a" />
              )}
            </View>
            <Text style={styles.sectionDescription}>{description}</Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#71717a"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.sectionContent}>
          {needsUpgrade ? (
            <View style={styles.upgradePrompt}>
              <Ionicons name="diamond" size={24} color="#a855f7" />
              <Text style={styles.upgradeText}>
                Passez à {TIER_LABELS[tier]} pour débloquer ces filtres
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Voir les plans</Text>
              </TouchableOpacity>
            </View>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
};

// === Filter Input Components ===

interface FilterToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  unavailableReason?: string | null;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
  unavailableReason,
}) => {
  const handleChange = (newValue: boolean) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(newValue);
    }
  };

  return (
    <View style={[styles.filterItem, disabled && styles.filterItemDisabled]}>
      <View style={styles.filterItemLeft}>
        <Text style={styles.filterLabel}>{label}</Text>
        {description && <Text style={styles.filterDescription}>{description}</Text>}
        {unavailableReason && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableBadgeText}>{unavailableReason}</Text>
          </View>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
        trackColor={{ false: '#27272a', true: '#7c3aed' }}
        thumbColor={value ? '#ffffff' : '#71717a'}
      />
    </View>
  );
};

interface FilterSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  unavailableReason?: string | null;
}

const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  unavailableReason,
}) => {
  const handleDecrement = () => {
    if (!disabled && value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (!disabled && value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(Math.min(max, value + step));
    }
  };

  return (
    <View style={[styles.filterItem, disabled && styles.filterItemDisabled]}>
      <View style={styles.filterSliderHeader}>
        <View>
          <Text style={styles.filterLabel}>{label}</Text>
          {description && <Text style={styles.filterDescription}>{description}</Text>}
        </View>
      </View>
      {unavailableReason && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableBadgeText}>{unavailableReason}</Text>
        </View>
      )}
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[styles.stepperButton, value <= min && styles.stepperButtonDisabled]}
          onPress={handleDecrement}
          disabled={disabled || value <= min}
        >
          <Ionicons name="remove" size={20} color={value <= min ? '#71717a' : '#ffffff'} />
        </TouchableOpacity>
        <View style={styles.stepperValue}>
          <Text style={styles.stepperValueText}>{value}{unit}</Text>
        </View>
        <TouchableOpacity
          style={[styles.stepperButton, value >= max && styles.stepperButtonDisabled]}
          onPress={handleIncrement}
          disabled={disabled || value >= max}
        >
          <Ionicons name="add" size={20} color={value >= max ? '#71717a' : '#ffffff'} />
        </TouchableOpacity>
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>Min: {min}{unit}</Text>
        <Text style={styles.sliderLabel}>Max: {max}{unit}</Text>
      </View>
    </View>
  );
};

interface FilterSelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  unavailableReason?: string | null;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  description,
  value,
  onChange,
  options,
  disabled = false,
  unavailableReason,
}) => {
  return (
    <View style={[styles.filterItem, disabled && styles.filterItemDisabled]}>
      <Text style={styles.filterLabel}>{label}</Text>
      {description && <Text style={styles.filterDescription}>{description}</Text>}
      {unavailableReason && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableBadgeText}>{unavailableReason}</Text>
        </View>
      )}
      <View style={styles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectOption,
              value === option.value && styles.selectOptionActive,
            ]}
            onPress={() => {
              if (!disabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(option.value);
              }
            }}
            disabled={disabled}
          >
            <Text
              style={[
                styles.selectOptionText,
                value === option.value && styles.selectOptionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

interface FilterTagInputProps {
  label: string;
  description?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  unavailableReason?: string | null;
}

const FilterTagInput: React.FC<FilterTagInputProps> = ({
  label,
  description,
  value,
  onChange,
  placeholder = 'Ajouter...',
  disabled = false,
  unavailableReason,
}) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (item: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(value.filter(v => v !== item));
  };

  return (
    <View style={[styles.filterItem, disabled && styles.filterItemDisabled]}>
      <Text style={styles.filterLabel}>{label}</Text>
      {description && <Text style={styles.filterDescription}>{description}</Text>}
      {unavailableReason && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableBadgeText}>{unavailableReason}</Text>
        </View>
      )}
      
      {value.length > 0 && (
        <View style={styles.tagsContainer}>
          {value.map((item) => (
            <View key={item} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                disabled={disabled}
              >
                <Ionicons name="close" size={14} color="#a1a1aa" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          placeholder={placeholder}
          placeholderTextColor="#71717a"
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.tagAddButton, (!input.trim() || disabled) && styles.tagAddButtonDisabled]}
          onPress={handleAdd}
          disabled={!input.trim() || disabled}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// === Main Component ===

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  filters,
  onUpdateFilter,
  capabilities,
  availableFilters,
  userTier,
  isFilterAvailable,
  getUnavailableReason,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Participation */}
      <FilterSection
        id="participation"
        title="Conditions de Participation"
        icon="checkmark-circle"
        description="Filtres de base pour la participation"
        tier="free"
        userTier={userTier}
        defaultOpen={true}
      >
        <FilterToggle
          label="Commentaire requis"
          description="Exclure les entrées sans commentaire"
          value={filters.participation.requireComment}
          onChange={(v) => onUpdateFilter('participation', { requireComment: v })}
        />

        <FilterSelect
          label="Gestion des réponses"
          description="Comment traiter les réponses aux commentaires"
          value={filters.participation.replyHandling}
          onChange={(v) => onUpdateFilter('participation', { replyHandling: v as any })}
          options={[
            { value: 'include', label: 'Inclure' },
            { value: 'exclude', label: 'Exclure' },
            { value: 'only_replies', label: 'Réponses seules' },
          ]}
        />
      </FilterSection>

      {/* Mentions */}
      <FilterSection
        id="mentions"
        title="Mentions"
        icon="at"
        description="Exiger des @mentions dans les commentaires"
        tier="free"
        userTier={userTier}
      >
        <FilterSlider
          label="Minimum de @mentions"
          description="Nombre minimum de personnes à taguer"
          value={filters.mentions.minMentions}
          onChange={(v) => onUpdateFilter('mentions', { minMentions: Math.round(v) })}
          min={0}
          max={5}
        />

        <FilterToggle
          label="Mentions uniques uniquement"
          description="Ne compter que les @mentions différentes"
          value={filters.mentions.uniqueMentionsOnly}
          onChange={(v) => onUpdateFilter('mentions', { uniqueMentionsOnly: v })}
          disabled={!isFilterAvailable('mentions.uniqueMentionsOnly')}
          unavailableReason={getUnavailableReason('mentions.uniqueMentionsOnly')}
        />

        <FilterToggle
          label="Exclure auto-mention"
          description="Exclure si le participant se tague lui-même"
          value={filters.mentions.excludeAutoMention}
          onChange={(v) => onUpdateFilter('mentions', { excludeAutoMention: v })}
          disabled={!isFilterAvailable('mentions.excludeAutoMention')}
          unavailableReason={getUnavailableReason('mentions.excludeAutoMention')}
        />
      </FilterSection>

      {/* Keywords */}
      <FilterSection
        id="keywords"
        title="Mots-clés / Hashtags"
        icon="pricetag"
        description="Exiger ou interdire des mots-clés"
        tier="free"
        userTier={userTier}
      >
        <FilterTagInput
          label="Mots-clés requis"
          description="Le commentaire doit contenir ces mots ou hashtags"
          value={filters.keywords.required}
          onChange={(v) => onUpdateFilter('keywords', { required: v })}
          placeholder="#concours, merci"
        />

        <FilterSelect
          label="Mode de correspondance"
          value={filters.keywords.requiredMode}
          onChange={(v) => onUpdateFilter('keywords', { requiredMode: v as any })}
          options={[
            { value: 'any', label: 'Au moins un (OU)' },
            { value: 'all', label: 'Tous requis (ET)' },
          ]}
        />

        <FilterTagInput
          label="Mots interdits"
          description="Exclure les commentaires contenant ces mots"
          value={filters.keywords.forbidden}
          onChange={(v) => onUpdateFilter('keywords', { forbidden: v })}
          placeholder="spam, bot"
          disabled={!isFilterAvailable('keywords.forbidden')}
          unavailableReason={getUnavailableReason('keywords.forbidden')}
        />
      </FilterSection>

      {/* Multi-comment */}
      <FilterSection
        id="multiComment"
        title="Multi-commentaires"
        icon="people"
        description="Gérer les participations multiples"
        tier="free"
        userTier={userTier}
      >
        <FilterSelect
          label="Max. participations par personne"
          value={String(filters.multiComment.maxEntriesPerUser ?? 'unlimited')}
          onChange={(v) => onUpdateFilter('multiComment', {
            maxEntriesPerUser: v === 'unlimited' ? null : Number(v),
          })}
          options={[
            { value: '1', label: '1 seule' },
            { value: '2', label: '2 max' },
            { value: '3', label: '3 max' },
            { value: '5', label: '5 max' },
            { value: 'unlimited', label: 'Illimité' },
          ]}
        />

        <FilterSelect
          label="Commentaire retenu"
          description="Quel commentaire garder si limite atteinte"
          value={filters.multiComment.commentSelection}
          onChange={(v) => onUpdateFilter('multiComment', { commentSelection: v as any })}
          options={[
            { value: 'first', label: 'Premier' },
            { value: 'last', label: 'Dernier' },
            { value: 'random', label: 'Aléatoire' },
          ]}
        />

        <FilterToggle
          label="Supprimer doublons exacts"
          description="Ignorer les commentaires identiques"
          value={filters.multiComment.removeDuplicateComments}
          onChange={(v) => onUpdateFilter('multiComment', { removeDuplicateComments: v })}
        />
      </FilterSection>

      {/* Profile */}
      <FilterSection
        id="profile"
        title="Filtres Profil"
        icon="person"
        description="Filtrer par données de profil"
        tier="premium"
        userTier={userTier}
      >
        <FilterToggle
          label="Bio obligatoire"
          description="Exiger une biographie de profil"
          value={filters.profile.requireBio.enabled}
          onChange={(v) => onUpdateFilter('profile', {
            requireBio: { ...filters.profile.requireBio, enabled: v },
          })}
          disabled={!isFilterAvailable('profile.requireBio')}
          unavailableReason={getUnavailableReason('profile.requireBio')}
        />

        <FilterToggle
          label="Photo de profil obligatoire"
          description="Exclure les comptes sans photo"
          value={filters.profile.requireProfilePicture}
          onChange={(v) => onUpdateFilter('profile', { requireProfilePicture: v })}
          disabled={!isFilterAvailable('profile.requireProfilePicture')}
          unavailableReason={getUnavailableReason('profile.requireProfilePicture')}
        />

        <FilterSlider
          label="Ancienneté minimum (jours)"
          description="Exclure les comptes trop récents"
          value={filters.profile.minAccountAge || 0}
          onChange={(v) => onUpdateFilter('profile', { minAccountAge: Math.round(v) || null })}
          min={0}
          max={365}
          unit=" j"
          disabled={!isFilterAvailable('profile.minAccountAge')}
          unavailableReason={getUnavailableReason('profile.minAccountAge')}
        />
      </FilterSection>

      {/* Anti-bot */}
      <FilterSection
        id="antiBot"
        title="Anti-Bots"
        icon="shield-checkmark"
        description="Exclure les comptes suspects"
        tier="premium"
        userTier={userTier}
      >
        <FilterToggle
          label="Exclure pseudos similaires"
          description="Détecter les comptes avec des noms trop proches"
          value={filters.antiBot.excludeSimilarUsernames.enabled}
          onChange={(v) => onUpdateFilter('antiBot', {
            excludeSimilarUsernames: { ...filters.antiBot.excludeSimilarUsernames, enabled: v },
          })}
          disabled={!isFilterAvailable('antiBot.excludeSimilarUsernames')}
          unavailableReason={getUnavailableReason('antiBot.excludeSimilarUsernames')}
        />

        <FilterTagInput
          label="Blacklist"
          description="Comptes à exclure systématiquement"
          value={filters.antiBot.blacklist}
          onChange={(v) => onUpdateFilter('antiBot', { blacklist: v })}
          placeholder="@compte_spam"
        />
      </FilterSection>

      {/* Follow Verification */}
      <FilterSection
        id="followVerification"
        title="Vérification Follow"
        icon="person-add"
        description="Vérifier les abonnements"
        tier="premium"
        userTier={userTier}
      >
        <FilterTagInput
          label="Comptes à suivre"
          description="Vérifier que les participants suivent ces comptes"
          value={filters.followVerification.requiredFollows.accounts}
          onChange={(v) => onUpdateFilter('followVerification', {
            requiredFollows: { ...filters.followVerification.requiredFollows, accounts: v },
          })}
          placeholder="@votre_compte"
          disabled={!isFilterAvailable('followVerification.requiredFollows')}
          unavailableReason={getUnavailableReason('followVerification.requiredFollows')}
        />

        <FilterToggle
          label="Bonus Story"
          description="Multiplier les chances pour interaction story"
          value={filters.followVerification.storyBonus.enabled}
          onChange={(v) => onUpdateFilter('followVerification', {
            storyBonus: { ...filters.followVerification.storyBonus, enabled: v },
          })}
          disabled={!isFilterAvailable('followVerification.storyBonus')}
          unavailableReason={getUnavailableReason('followVerification.storyBonus')}
        />
      </FilterSection>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  sectionLocked: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  sectionDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tierBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  upgradePrompt: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
    gap: 12,
  },
  upgradeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a855f7',
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  filterItem: {
    gap: 8,
  },
  filterItemDisabled: {
    opacity: 0.5,
  },
  filterItemLeft: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  filterDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  unavailableBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#fbbf24',
  },
  filterSliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterSliderValue: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#7c3aed',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    backgroundColor: '#27272a',
  },
  stepperValue: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#12121a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  stepperValueText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#7c3aed',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  selectOptionActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderColor: '#7c3aed',
  },
  selectOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  selectOptionTextActive: {
    color: '#7c3aed',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#27272a',
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#12121a',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  tagAddButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagAddButtonDisabled: {
    backgroundColor: '#27272a',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default AdvancedFiltersPanel;

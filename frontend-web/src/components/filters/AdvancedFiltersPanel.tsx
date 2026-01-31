/**
 * AdvancedFiltersPanel Component
 * Complete filters panel with all filter sections
 */

import { useMemo } from 'react';
import {
  AdvancedFilterSection,
  FilterToggle,
  FilterSlider,
  FilterSelect,
  FilterTagInput,
  FilterDateRange,
} from './AdvancedFilterSection';
import {
  AdvancedDrawFilters,
  FilterTier,
  FilterAvailability,
  SourceCapabilities,
  FILTER_SECTIONS,
} from '../../types/filters';

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

export function AdvancedFiltersPanel({
  filters,
  onUpdateFilter,
  capabilities,
  availableFilters,
  userTier,
  isFilterAvailable,
  getUnavailableReason,
}: AdvancedFiltersPanelProps) {
  // Check if section has any available filters
  const isSectionAvailable = (sectionId: string) => {
    const section = FILTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return false;
    return section.filters.some(filterId => isFilterAvailable(filterId));
  };

  return (
    <div className="space-y-4">
      {/* Participation Filters */}
      <AdvancedFilterSection
        id="participation"
        title="Conditions de Participation"
        description="Filtres de base pour valider les participations"
        icon="CheckCircle"
        tier="free"
        userTier={userTier}
        isAvailable={isSectionAvailable('participation')}
        defaultOpen={true}
      >
        <FilterToggle
          label="Commentaire requis"
          description="Exclure les entrées sans commentaire valide"
          value={filters.participation.requireComment}
          onChange={(v) => onUpdateFilter('participation', { requireComment: v })}
        />

        <FilterSelect
          label="Gestion des réponses"
          description="Comment traiter les réponses aux commentaires"
          value={filters.participation.replyHandling}
          onChange={(v) => onUpdateFilter('participation', { replyHandling: v as any })}
          options={[
            { value: 'include', label: 'Inclure les réponses' },
            { value: 'exclude', label: 'Exclure les réponses' },
            { value: 'only_replies', label: 'Uniquement les réponses' },
          ]}
          disabled={!isFilterAvailable('participation.replyHandling')}
          unavailableReason={getUnavailableReason('participation.replyHandling')}
        />

        <FilterDateRange
          label="Fenêtre de dates"
          description="Filtrer par date de commentaire"
          from={filters.participation.dateRange?.from}
          to={filters.participation.dateRange?.to}
          onChangeFrom={(v) => onUpdateFilter('participation', {
            dateRange: { ...filters.participation.dateRange, from: v },
          })}
          onChangeTo={(v) => onUpdateFilter('participation', {
            dateRange: { ...filters.participation.dateRange, to: v },
          })}
          disabled={!isFilterAvailable('participation.dateRange')}
          unavailableReason={getUnavailableReason('participation.dateRange')}
        />
      </AdvancedFilterSection>

      {/* Mentions Filters */}
      <AdvancedFilterSection
        id="mentions"
        title="Mentions / Identifications"
        description="Exiger des @mentions dans les commentaires"
        icon="AtSign"
        tier="free"
        userTier={userTier}
        isAvailable={isSectionAvailable('mentions')}
      >
        <FilterSlider
          label="Minimum de @mentions"
          description="Nombre minimum de personnes à taguer"
          value={filters.mentions.minMentions}
          onChange={(v) => onUpdateFilter('mentions', { minMentions: v })}
          min={0}
          max={5}
          disabled={!isFilterAvailable('mentions.minMentions')}
          unavailableReason={getUnavailableReason('mentions.minMentions')}
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

        <FilterTagInput
          label="Mentions requises"
          description="Comptes spécifiques qui doivent être mentionnés"
          value={filters.mentions.requiredMentions || []}
          onChange={(v) => onUpdateFilter('mentions', { requiredMentions: v })}
          placeholder="@compte"
        />
      </AdvancedFilterSection>

      {/* Keywords Filters */}
      <AdvancedFilterSection
        id="keywords"
        title="Mots-clés / Hashtags"
        description="Exiger ou interdire des mots-clés"
        icon="Hash"
        tier="free"
        userTier={userTier}
        isAvailable={isSectionAvailable('keywords')}
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
          description="Comment vérifier les mots-clés requis"
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

        <FilterToggle
          label="Sensible à la casse"
          description="Différencier majuscules et minuscules"
          value={filters.keywords.caseSensitive}
          onChange={(v) => onUpdateFilter('keywords', { caseSensitive: v })}
        />
      </AdvancedFilterSection>

      {/* Multi-comment Filters */}
      <AdvancedFilterSection
        id="multiComment"
        title="Multi-commentaires / Équité"
        description="Gérer les participations multiples"
        icon="Users"
        tier="free"
        userTier={userTier}
        isAvailable={isSectionAvailable('multiComment')}
      >
        <FilterSelect
          label="Max. participations par personne"
          description="Limiter le nombre de chances par utilisateur"
          value={String(filters.multiComment.maxEntriesPerUser ?? 'unlimited')}
          onChange={(v) => onUpdateFilter('multiComment', {
            maxEntriesPerUser: v === 'unlimited' ? null : Number(v),
          })}
          options={[
            { value: '1', label: '1 seule participation' },
            { value: '2', label: '2 participations max' },
            { value: '3', label: '3 participations max' },
            { value: '5', label: '5 participations max' },
            { value: '10', label: '10 participations max' },
            { value: 'unlimited', label: 'Illimité' },
          ]}
        />

        <FilterToggle
          label="Multiple si mentions différentes"
          description="Autoriser plusieurs participations si les personnes taguées sont différentes"
          value={filters.multiComment.allowIfDifferentMentions}
          onChange={(v) => onUpdateFilter('multiComment', { allowIfDifferentMentions: v })}
          disabled={!isFilterAvailable('multiComment.allowIfDifferentMentions')}
          unavailableReason={getUnavailableReason('multiComment.allowIfDifferentMentions')}
        />

        <FilterSelect
          label="Commentaire retenu"
          description="Quel commentaire garder si limite atteinte"
          value={filters.multiComment.commentSelection}
          onChange={(v) => onUpdateFilter('multiComment', { commentSelection: v as any })}
          options={[
            { value: 'first', label: 'Premier commentaire' },
            { value: 'last', label: 'Dernier commentaire' },
            { value: 'random', label: 'Aléatoire' },
          ]}
        />

        <FilterToggle
          label="Supprimer doublons exacts"
          description="Ignorer les commentaires identiques du même utilisateur"
          value={filters.multiComment.removeDuplicateComments}
          onChange={(v) => onUpdateFilter('multiComment', { removeDuplicateComments: v })}
        />
      </AdvancedFilterSection>

      {/* Profile Filters */}
      <AdvancedFilterSection
        id="profile"
        title="Filtres Profil"
        description="Filtrer par données de profil (compte vérifié, ancienneté...)"
        icon="User"
        tier="premium"
        userTier={userTier}
        isAvailable={isSectionAvailable('profile')}
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

        {filters.profile.requireBio.enabled && (
          <FilterSlider
            label="Longueur minimum de bio"
            value={filters.profile.requireBio.minLength}
            onChange={(v) => onUpdateFilter('profile', {
              requireBio: { ...filters.profile.requireBio, minLength: v },
            })}
            min={0}
            max={100}
            unit=" car."
          />
        )}

        <FilterToggle
          label="Photo de profil obligatoire"
          description="Exclure les comptes sans photo"
          value={filters.profile.requireProfilePicture}
          onChange={(v) => onUpdateFilter('profile', { requireProfilePicture: v })}
          disabled={!isFilterAvailable('profile.requireProfilePicture')}
          unavailableReason={getUnavailableReason('profile.requireProfilePicture')}
        />

        <FilterSlider
          label="Ancienneté minimum du compte"
          description="Exclure les comptes trop récents"
          value={filters.profile.minAccountAge || 0}
          onChange={(v) => onUpdateFilter('profile', { minAccountAge: v || null })}
          min={0}
          max={365}
          unit=" jours"
          disabled={!isFilterAvailable('profile.minAccountAge')}
          unavailableReason={getUnavailableReason('profile.minAccountAge')}
        />

        <FilterSlider
          label="Minimum de publications"
          description="Exiger un nombre minimum de posts"
          value={filters.profile.minPosts || 0}
          onChange={(v) => onUpdateFilter('profile', { minPosts: v || null })}
          min={0}
          max={100}
          disabled={!isFilterAvailable('profile.minPosts')}
          unavailableReason={getUnavailableReason('profile.minPosts')}
        />

        <FilterSlider
          label="Maximum d'abonnements"
          description="Exclure les comptes qui suivent trop de monde (bots)"
          value={filters.profile.maxFollowings || 10000}
          onChange={(v) => onUpdateFilter('profile', { maxFollowings: v || null })}
          min={500}
          max={10000}
          step={500}
          disabled={!isFilterAvailable('profile.maxFollowings')}
          unavailableReason={getUnavailableReason('profile.maxFollowings')}
        />

        <FilterTagInput
          label="Mots interdits dans la bio"
          description="Exclure si la bio contient ces mots"
          value={filters.profile.bioForbiddenWords}
          onChange={(v) => onUpdateFilter('profile', { bioForbiddenWords: v })}
          placeholder="concours, giveaway"
        />
      </AdvancedFilterSection>

      {/* Anti-bot Filters */}
      <AdvancedFilterSection
        id="antiBot"
        title="Anti-Bots / Concouristes"
        description="Exclure les comptes suspects"
        icon="Shield"
        tier="premium"
        userTier={userTier}
        isAvailable={isSectionAvailable('antiBot')}
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

        {filters.antiBot.excludeSimilarUsernames.enabled && (
          <FilterSelect
            label="Mode de détection"
            value={filters.antiBot.excludeSimilarUsernames.mode}
            onChange={(v) => onUpdateFilter('antiBot', {
              excludeSimilarUsernames: { ...filters.antiBot.excludeSimilarUsernames, mode: v as any },
            })}
            options={[
              { value: 'standard', label: 'Standard (préfixes similaires)' },
              { value: 'strict', label: 'Strict (analyse Levenshtein)' },
            ]}
          />
        )}

        <FilterTagInput
          label="Blacklist"
          description="Comptes à exclure systématiquement"
          value={filters.antiBot.blacklist}
          onChange={(v) => onUpdateFilter('antiBot', { blacklist: v })}
          placeholder="@compte_spam"
        />

        <FilterTagInput
          label="Patterns à exclure (regex)"
          description="Expressions régulières pour détecter les bots"
          value={filters.antiBot.excludePatterns}
          onChange={(v) => onUpdateFilter('antiBot', { excludePatterns: v })}
          placeholder=".*_giveaway.*"
        />
      </AdvancedFilterSection>

      {/* Follow Verification */}
      <AdvancedFilterSection
        id="followVerification"
        title="Vérification Follow / Story"
        description="Vérifier les abonnements et interactions story"
        icon="UserPlus"
        tier="premium"
        userTier={userTier}
        isAvailable={isSectionAvailable('followVerification')}
      >
        <FilterTagInput
          label="Comptes à suivre obligatoirement"
          description="Vérifier que les participants suivent ces comptes"
          value={filters.followVerification.requiredFollows.accounts}
          onChange={(v) => onUpdateFilter('followVerification', {
            requiredFollows: { ...filters.followVerification.requiredFollows, accounts: v },
          })}
          placeholder="@votre_compte"
          disabled={!isFilterAvailable('followVerification.requiredFollows')}
          unavailableReason={getUnavailableReason('followVerification.requiredFollows')}
        />

        {filters.followVerification.requiredFollows.accounts.length > 0 && (
          <FilterSelect
            label="Mode de vérification"
            value={filters.followVerification.requiredFollows.mode}
            onChange={(v) => onUpdateFilter('followVerification', {
              requiredFollows: { ...filters.followVerification.requiredFollows, mode: v as any },
            })}
            options={[
              { value: 'verified', label: 'Vérifié (API)' },
              { value: 'declarative', label: 'Déclaratif (confiance)' },
            ]}
          />
        )}

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

        {filters.followVerification.storyBonus.enabled && (
          <>
            <FilterSlider
              label="Multiplicateur de chances"
              value={filters.followVerification.storyBonus.multiplier}
              onChange={(v) => onUpdateFilter('followVerification', {
                storyBonus: { ...filters.followVerification.storyBonus, multiplier: v },
              })}
              min={2}
              max={5}
              unit="x"
            />
            <FilterSelect
              label="Méthode de vérification"
              value={filters.followVerification.storyBonus.verificationMethod}
              onChange={(v) => onUpdateFilter('followVerification', {
                storyBonus: { ...filters.followVerification.storyBonus, verificationMethod: v as any },
              })}
              options={[
                { value: 'declarative', label: 'Déclaratif' },
                { value: 'code', label: 'Code secret en story' },
              ]}
            />
          </>
        )}
      </AdvancedFilterSection>
    </div>
  );
}

export default AdvancedFiltersPanel;

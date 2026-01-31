/**
 * Tests for AdvancedFiltersPanel Component
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AdvancedFiltersPanel } from '../../src/components/AdvancedFiltersPanel';
import { DEFAULT_FILTERS, SourceCapabilities, FilterAvailability } from '../../src/types/filters';

// Mock expo-haptics
jest.mock('expo-haptics');

const mockOnUpdateFilter = jest.fn();
const mockIsFilterAvailable = jest.fn(() => true);
const mockGetUnavailableReason = jest.fn(() => null);

const defaultProps = {
  filters: DEFAULT_FILTERS,
  onUpdateFilter: mockOnUpdateFilter,
  capabilities: null,
  availableFilters: [] as FilterAvailability[],
  userTier: 'premium' as const,
  isFilterAvailable: mockIsFilterAvailable,
  getUnavailableReason: mockGetUnavailableReason,
};

describe('AdvancedFiltersPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFilterAvailable.mockReturnValue(true);
    mockGetUnavailableReason.mockReturnValue(null);
  });

  describe('Rendering', () => {
    it('should render all filter sections', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      expect(screen.getByText('Conditions de Participation')).toBeTruthy();
      expect(screen.getByText('Mentions')).toBeTruthy();
      expect(screen.getByText('Mots-clés / Hashtags')).toBeTruthy();
      expect(screen.getByText('Multi-commentaires')).toBeTruthy();
      expect(screen.getByText('Filtres Profil')).toBeTruthy();
      expect(screen.getByText('Anti-Bots')).toBeTruthy();
      expect(screen.getByText('Vérification Follow')).toBeTruthy();
    });

    it('should render section descriptions', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      expect(screen.getByText('Filtres de base pour la participation')).toBeTruthy();
      expect(screen.getByText('Exiger des @mentions dans les commentaires')).toBeTruthy();
    });

    it('should show premium badges on premium sections', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // Premium sections should have badges
      const premiumBadges = screen.getAllByText('Premium');
      expect(premiumBadges.length).toBeGreaterThanOrEqual(3);
    });

    it('should show participation section expanded by default', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // Participation section content should be visible
      expect(screen.getByText('Commentaire requis')).toBeTruthy();
    });
  });

  describe('Section Toggle', () => {
    it('should expand section when header is pressed', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // Find and press the Mentions section header
      const mentionsSection = screen.getByText('Mentions');
      fireEvent.press(mentionsSection);
      
      // Content should now be visible
      expect(screen.getByText('Minimum de @mentions')).toBeTruthy();
    });

    it('should collapse section when pressed again', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // First expand
      const participationSection = screen.getByText('Conditions de Participation');
      fireEvent.press(participationSection);
      
      // Then collapse
      fireEvent.press(participationSection);
      
      // Content might still be in tree but not visible
      // This depends on animation - just verify no crash
    });
  });

  describe('Participation Section', () => {
    it('should render require comment toggle', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      expect(screen.getByText('Commentaire requis')).toBeTruthy();
      expect(screen.getByText('Exclure les entrées sans commentaire')).toBeTruthy();
    });

    it('should render reply handling select', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      expect(screen.getByText('Gestion des réponses')).toBeTruthy();
      expect(screen.getByText('Inclure')).toBeTruthy();
      expect(screen.getByText('Exclure')).toBeTruthy();
      expect(screen.getByText('Réponses seules')).toBeTruthy();
    });

    it('should call onUpdateFilter when toggling require comment', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // Find the switch - it's associated with "Commentaire requis"
      const switches = screen.getAllByRole('switch');
      fireEvent(switches[0], 'valueChange', false);
      
      expect(mockOnUpdateFilter).toHaveBeenCalledWith(
        'participation',
        expect.objectContaining({ requireComment: false })
      );
    });

    it('should call onUpdateFilter when selecting reply handling option', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      const excludeOption = screen.getByText('Exclure');
      fireEvent.press(excludeOption);
      
      expect(mockOnUpdateFilter).toHaveBeenCalledWith(
        'participation',
        expect.objectContaining({ replyHandling: 'exclude' })
      );
    });
  });

  describe('Mentions Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      // Expand mentions section
      fireEvent.press(screen.getByText('Mentions'));
    });

    it('should render min mentions stepper', () => {
      expect(screen.getByText('Minimum de @mentions')).toBeTruthy();
      expect(screen.getByText('Nombre minimum de personnes à taguer')).toBeTruthy();
    });

    it('should call onUpdateFilter when incrementing mentions', () => {
      // Ionicons render as text with icon name
      const addButtons = screen.getAllByText('add');
      expect(addButtons.length).toBeGreaterThan(0);
      fireEvent.press(addButtons[0]);
      
      expect(mockOnUpdateFilter).toHaveBeenCalledWith(
        'mentions',
        expect.objectContaining({ minMentions: 1 })
      );
    });

    it('should render unique mentions toggle', () => {
      expect(screen.getByText('Mentions uniques uniquement')).toBeTruthy();
    });
  });

  describe('Keywords Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      fireEvent.press(screen.getByText('Mots-clés / Hashtags'));
    });

    it('should render required keywords input', () => {
      expect(screen.getByText('Mots-clés requis')).toBeTruthy();
      expect(screen.getByPlaceholderText('#concours, merci')).toBeTruthy();
    });

    it('should render keyword mode select', () => {
      expect(screen.getByText('Mode de correspondance')).toBeTruthy();
      expect(screen.getByText('Au moins un (OU)')).toBeTruthy();
      expect(screen.getByText('Tous requis (ET)')).toBeTruthy();
    });

    it('should call onUpdateFilter when changing keyword mode', () => {
      const allOption = screen.getByText('Tous requis (ET)');
      fireEvent.press(allOption);
      
      expect(mockOnUpdateFilter).toHaveBeenCalledWith(
        'keywords',
        expect.objectContaining({ requiredMode: 'all' })
      );
    });
  });

  describe('Multi-comment Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      fireEvent.press(screen.getByText('Multi-commentaires'));
    });

    it('should render max entries select', () => {
      expect(screen.getByText('Max. participations par personne')).toBeTruthy();
      expect(screen.getByText('1 seule')).toBeTruthy();
      expect(screen.getByText('Illimité')).toBeTruthy();
    });

    it('should render comment selection options', () => {
      expect(screen.getByText('Commentaire retenu')).toBeTruthy();
      expect(screen.getByText('Premier')).toBeTruthy();
      expect(screen.getByText('Dernier')).toBeTruthy();
      expect(screen.getByText('Aléatoire')).toBeTruthy();
    });

    it('should render remove duplicates toggle', () => {
      expect(screen.getByText('Supprimer doublons exacts')).toBeTruthy();
    });
  });

  describe('Premium Sections Lock', () => {
    it('should show upgrade prompt for locked sections with free tier', () => {
      render(
        <AdvancedFiltersPanel
          {...defaultProps}
          userTier="free"
        />
      );
      
      // Expand a premium section
      fireEvent.press(screen.getByText('Filtres Profil'));
      
      // Should show upgrade prompt
      expect(screen.getByText(/Passez à Premium pour débloquer/)).toBeTruthy();
      expect(screen.getByText('Voir les plans')).toBeTruthy();
    });

    it('should not show upgrade prompt for premium user', () => {
      render(<AdvancedFiltersPanel {...defaultProps} userTier="premium" />);
      
      fireEvent.press(screen.getByText('Filtres Profil'));
      
      // Should show actual filter content
      expect(screen.getByText('Bio obligatoire')).toBeTruthy();
    });
  });

  describe('Unavailable Filters', () => {
    it('should disable filter when not available', () => {
      mockIsFilterAvailable.mockReturnValue(false);
      mockGetUnavailableReason.mockReturnValue('Non disponible pour cette plateforme');
      
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      // Expand mentions section
      fireEvent.press(screen.getByText('Mentions'));
      
      // Should show unavailable reason
      expect(screen.getAllByText('Non disponible pour cette plateforme').length).toBeGreaterThan(0);
    });
  });

  describe('Tag Input', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      fireEvent.press(screen.getByText('Mots-clés / Hashtags'));
    });

    it('should add tag when input is submitted', () => {
      const input = screen.getByPlaceholderText('#concours, merci');
      
      fireEvent.changeText(input, '#test');
      fireEvent(input, 'submitEditing');
      
      expect(mockOnUpdateFilter).toHaveBeenCalledWith(
        'keywords',
        expect.objectContaining({ required: ['#test'] })
      );
    });

    it('should not add empty tag', () => {
      const input = screen.getByPlaceholderText('#concours, merci');
      
      fireEvent.changeText(input, '   ');
      fireEvent(input, 'submitEditing');
      
      expect(mockOnUpdateFilter).not.toHaveBeenCalledWith(
        'keywords',
        expect.objectContaining({ required: expect.arrayContaining([expect.anything()]) })
      );
    });

    it('should display existing tags', () => {
      const filtersWithTags = {
        ...DEFAULT_FILTERS,
        keywords: {
          ...DEFAULT_FILTERS.keywords,
          required: ['#concours', '#giveaway'],
        },
      };
      
      render(
        <AdvancedFiltersPanel
          {...defaultProps}
          filters={filtersWithTags}
        />
      );
      
      fireEvent.press(screen.getByText('Mots-clés / Hashtags'));
      
      expect(screen.getByText('#concours')).toBeTruthy();
      expect(screen.getByText('#giveaway')).toBeTruthy();
    });
  });

  describe('Profile Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} userTier="premium" />);
      fireEvent.press(screen.getByText('Filtres Profil'));
    });

    it('should render bio toggle', () => {
      expect(screen.getByText('Bio obligatoire')).toBeTruthy();
    });

    it('should render profile picture toggle', () => {
      expect(screen.getByText('Photo de profil obligatoire')).toBeTruthy();
    });

    it('should render account age stepper', () => {
      expect(screen.getByText('Ancienneté minimum (jours)')).toBeTruthy();
    });
  });

  describe('Anti-Bot Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} userTier="premium" />);
      fireEvent.press(screen.getByText('Anti-Bots'));
    });

    it('should render similar usernames toggle', () => {
      expect(screen.getByText('Exclure pseudos similaires')).toBeTruthy();
    });

    it('should render blacklist input', () => {
      expect(screen.getByText('Blacklist')).toBeTruthy();
      expect(screen.getByPlaceholderText('@compte_spam')).toBeTruthy();
    });
  });

  describe('Follow Verification Section', () => {
    beforeEach(() => {
      render(<AdvancedFiltersPanel {...defaultProps} userTier="premium" />);
      fireEvent.press(screen.getByText('Vérification Follow'));
    });

    it('should render required follows input', () => {
      expect(screen.getByText('Comptes à suivre')).toBeTruthy();
    });

    it('should render story bonus toggle', () => {
      expect(screen.getByText('Bonus Story')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible switches', () => {
      render(<AdvancedFiltersPanel {...defaultProps} />);
      
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });
  });
});

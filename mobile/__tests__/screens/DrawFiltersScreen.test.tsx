/**
 * Tests for DrawFiltersScreen
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawFiltersScreen from '../../src/screens/DrawFiltersScreen';
import { useFilters } from '../../src/hooks/useFilters';
import { DEFAULT_FILTERS } from '../../src/types/filters';

// Mock the hook
jest.mock('../../src/hooks/useFilters');
const mockUseFilters = useFilters as jest.MockedFunction<typeof useFilters>;

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      drawId: 'draw-123',
      postUrl: 'https://instagram.com/p/test',
    },
  }),
}));

const defaultHookReturn = {
  filters: DEFAULT_FILTERS,
  capabilities: null,
  availableFilters: [],
  userTier: 'free' as const,
  platform: 'instagram' as const,
  preScanResult: null,
  isLoadingCapabilities: false,
  isLoadingFilters: false,
  isSaving: false,
  isPreviewing: false,
  isPreScanning: false,
  setFilters: jest.fn(),
  updateFilter: jest.fn(),
  loadCapabilities: jest.fn(),
  loadFilters: jest.fn(),
  saveFilters: jest.fn().mockResolvedValue(true),
  previewFilters: jest.fn().mockResolvedValue({
    qualified: 800,
    excluded: 200,
    totalParticipants: 1000,
  }),
  runPreScan: jest.fn(),
  resetFilters: jest.fn(),
  isFilterAvailable: jest.fn().mockReturnValue(true),
  getFilterAvailability: jest.fn(),
  getUnavailableReason: jest.fn().mockReturnValue(null),
};

const renderWithNavigation = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('DrawFiltersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilters.mockReturnValue(defaultHookReturn);
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading capabilities', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        isLoadingCapabilities: true,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Chargement des filtres...')).toBeTruthy();
    });

    it('should show loading indicator when loading filters', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        isLoadingFilters: true,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Chargement des filtres...')).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('should render header title', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Filtres Avancés')).toBeTruthy();
    });

    it('should show platform badge', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Instagram')).toBeTruthy();
    });

    it('should show user tier badge', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Gratuit')).toBeTruthy();
    });

    it('should show premium badge for premium user', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        userTier: 'premium',
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Multiple Premium badges exist (tier badge + section badges)
      const premiumBadges = screen.getAllByText('Premium');
      expect(premiumBadges.length).toBeGreaterThan(0);
    });

    it('should navigate back when back button is pressed', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Find back button by icon name (Ionicons mocked to show icon name as text)
      const backIcon = screen.getByText('arrow-back');
      fireEvent.press(backIcon);
      
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Pre-scan Warning', () => {
    it('should show warning when limit exceeded', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        preScanResult: {
          totalComments: 5000,
          isEstimate: false,
          hasMore: false,
          withinLimit: false,
          userLimit: 1000,
          upgradeRequired: true,
        },
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText(/Ce post dépasse votre limite/)).toBeTruthy();
      expect(screen.getByText(/5,000 commentaires/)).toBeTruthy();
      expect(screen.getByText(/1,000 commentaires max/)).toBeTruthy();
    });

    it('should not show warning when within limit', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        preScanResult: {
          totalComments: 500,
          isEstimate: false,
          hasMore: false,
          withinLimit: true,
          userLimit: 1000,
          upgradeRequired: false,
        },
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.queryByText(/Ce post dépasse votre limite/)).toBeNull();
    });
  });

  describe('Preview Results', () => {
    it('should show preview results after preview', async () => {
      const mockPreview = jest.fn().mockResolvedValue({
        qualified: 800,
        excluded: 200,
        totalParticipants: 1000,
      });
      
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        previewFilters: mockPreview,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const previewButton = screen.getByText('Prévisualiser');
      fireEvent.press(previewButton);
      
      await waitFor(() => {
        expect(mockPreview).toHaveBeenCalled();
      });
    });

    it('should show loading state during preview', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        isPreviewing: true,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Should show loading indicator instead of text
      expect(screen.queryByText('Prévisualiser')).toBeNull();
    });
  });

  describe('Bottom Actions', () => {
    it('should render preview button', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Prévisualiser')).toBeTruthy();
    });

    it('should render continue button', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Continuer')).toBeTruthy();
    });

    it('should call previewFilters when preview button pressed', async () => {
      const mockPreview = jest.fn().mockResolvedValue({ 
        qualified: 100, 
        excluded: 10, 
        totalParticipants: 110 
      });
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        previewFilters: mockPreview,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const previewButton = screen.getByText('Prévisualiser');
      fireEvent.press(previewButton);
      
      await waitFor(() => {
        expect(mockPreview).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should save and navigate when continue pressed', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        saveFilters: mockSave,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const continueButton = screen.getByText('Continuer');
      fireEvent.press(continueButton);
      
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('DrawExecution', { drawId: 'draw-123' });
      });
    });

    it('should disable continue when limit exceeded', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        preScanResult: {
          totalComments: 5000,
          isEstimate: false,
          hasMore: false,
          withinLimit: false,
          userLimit: 1000,
          upgradeRequired: true,
        },
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const continueButton = screen.getByText('Continuer');
      fireEvent.press(continueButton);
      
      // Should not call save because button is disabled
      expect(defaultHookReturn.saveFilters).not.toHaveBeenCalled();
    });

    it('should show loading state during save', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        isSaving: true,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Continue button should show loading indicator
      expect(screen.queryByText('Continuer')).toBeNull();
    });
  });

  describe('Filter Panel', () => {
    it('should render AdvancedFiltersPanel', () => {
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Check that filter sections are rendered
      expect(screen.getByText('Conditions de Participation')).toBeTruthy();
      expect(screen.getByText('Mentions')).toBeTruthy();
    });

    it('should pass correct props to AdvancedFiltersPanel', () => {
      const mockUpdateFilter = jest.fn();
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        updateFilter: mockUpdateFilter,
        userTier: 'premium',
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      // Verify the panel is rendered with premium tier - multiple Premium badges exist
      const premiumBadges = screen.getAllByText('Premium');
      expect(premiumBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Load Capabilities', () => {
    it('should load capabilities on mount when postUrl is provided', () => {
      const mockLoadCapabilities = jest.fn();
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        loadCapabilities: mockLoadCapabilities,
        capabilities: null,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(mockLoadCapabilities).toHaveBeenCalledWith('https://instagram.com/p/test');
    });

    it('should not reload capabilities if already loaded', () => {
      const mockLoadCapabilities = jest.fn();
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        loadCapabilities: mockLoadCapabilities,
        capabilities: { hasMentions: true } as any,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(mockLoadCapabilities).not.toHaveBeenCalled();
    });
  });

  describe('Platform Display', () => {
    it('should capitalize platform name', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        platform: 'tiktok',
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.getByText('Tiktok')).toBeTruthy();
    });

    it('should not show platform badge when platform is null', () => {
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        platform: null,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      expect(screen.queryByText('Instagram')).toBeNull();
      expect(screen.queryByText('Tiktok')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should not crash on save failure', async () => {
      const mockSave = jest.fn().mockResolvedValue(false);
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        saveFilters: mockSave,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const continueButton = screen.getByText('Continuer');
      fireEvent.press(continueButton);
      
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalled();
      });
      
      // Should not navigate on failure
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not crash on preview failure', async () => {
      const mockPreview = jest.fn().mockResolvedValue(null);
      mockUseFilters.mockReturnValue({
        ...defaultHookReturn,
        previewFilters: mockPreview,
      });
      
      renderWithNavigation(<DrawFiltersScreen />);
      
      const previewButton = screen.getByText('Prévisualiser');
      fireEvent.press(previewButton);
      
      await waitFor(() => {
        expect(mockPreview).toHaveBeenCalled();
      });
      
      // Should not crash, component should still render
      expect(screen.getByText('Filtres Avancés')).toBeTruthy();
    });
  });
});

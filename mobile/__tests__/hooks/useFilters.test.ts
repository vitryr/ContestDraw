/**
 * Tests for useFilters Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useFilters } from '../../src/hooks/useFilters';
import { apiService } from '../../src/services/apiService';
import { DEFAULT_FILTERS, AdvancedDrawFilters } from '../../src/types/filters';

// Mock apiService
jest.mock('../../src/services/apiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('useFilters Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default filters', () => {
      const { result } = renderHook(() => useFilters());
      
      expect(result.current.filters).toEqual(DEFAULT_FILTERS);
      expect(result.current.capabilities).toBeNull();
      expect(result.current.availableFilters).toEqual([]);
      expect(result.current.userTier).toBe('free');
      expect(result.current.platform).toBeNull();
      expect(result.current.preScanResult).toBeNull();
    });

    it('should initialize with all loading states as false', () => {
      const { result } = renderHook(() => useFilters());
      
      expect(result.current.isLoadingCapabilities).toBe(false);
      expect(result.current.isLoadingFilters).toBe(false);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.isPreviewing).toBe(false);
      expect(result.current.isPreScanning).toBe(false);
    });
  });

  describe('setFilters', () => {
    it('should update filters partially', () => {
      const { result } = renderHook(() => useFilters());
      
      act(() => {
        result.current.setFilters({
          mentions: {
            ...DEFAULT_FILTERS.mentions,
            minMentions: 3,
          },
        });
      });
      
      expect(result.current.filters.mentions.minMentions).toBe(3);
      // Other fields should remain unchanged
      expect(result.current.filters.participation).toEqual(DEFAULT_FILTERS.participation);
    });
  });

  describe('updateFilter', () => {
    it('should update a specific filter category', () => {
      const { result } = renderHook(() => useFilters());
      
      act(() => {
        result.current.updateFilter('mentions', { minMentions: 5 });
      });
      
      expect(result.current.filters.mentions.minMentions).toBe(5);
      // Other mentions fields should remain unchanged
      expect(result.current.filters.mentions.uniqueMentionsOnly).toBe(false);
    });

    it('should update nested filter values', () => {
      const { result } = renderHook(() => useFilters());
      
      act(() => {
        result.current.updateFilter('profile', {
          requireBio: { enabled: true, minLength: 50 },
        });
      });
      
      expect(result.current.filters.profile.requireBio.enabled).toBe(true);
      expect(result.current.filters.profile.requireBio.minLength).toBe(50);
    });

    it('should handle keywords array updates', () => {
      const { result } = renderHook(() => useFilters());
      
      act(() => {
        result.current.updateFilter('keywords', {
          required: ['#concours', '#giveaway'],
        });
      });
      
      expect(result.current.filters.keywords.required).toEqual(['#concours', '#giveaway']);
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to defaults', () => {
      const { result } = renderHook(() => useFilters());
      
      // First modify filters
      act(() => {
        result.current.updateFilter('mentions', { minMentions: 10 });
        result.current.updateFilter('keywords', { required: ['test'] });
      });
      
      // Then reset
      act(() => {
        result.current.resetFilters();
      });
      
      expect(result.current.filters).toEqual(DEFAULT_FILTERS);
    });
  });

  describe('loadCapabilities', () => {
    it('should load capabilities successfully', async () => {
      const mockResponse = {
        data: {
          capabilities: {
            hasCommentText: true,
            hasMentions: true,
            platformId: 'instagram',
          },
          availableFilters: [
            { filterId: 'mentions.minMentions', available: true },
          ],
          userTier: 'premium',
          platform: { platform: 'instagram' },
        },
      };
      
      mockApiService.post.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters());
      
      await act(async () => {
        await result.current.loadCapabilities('https://instagram.com/p/123');
      });
      
      expect(result.current.capabilities).toEqual(mockResponse.data.capabilities);
      expect(result.current.availableFilters).toEqual(mockResponse.data.availableFilters);
      expect(result.current.userTier).toBe('premium');
      expect(result.current.platform).toBe('instagram');
    });

    it('should handle capabilities error', async () => {
      mockApiService.post.mockRejectedValueOnce(new Error('Network error'));
      
      const { result } = renderHook(() => useFilters());
      
      await act(async () => {
        await result.current.loadCapabilities('https://instagram.com/p/123');
      });
      
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Network error');
      expect(result.current.isLoadingCapabilities).toBe(false);
    });

    it('should set loading state during request', async () => {
      let resolvePromise: Function;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockApiService.post.mockReturnValueOnce(promise as any);
      
      const { result } = renderHook(() => useFilters());
      
      act(() => {
        result.current.loadCapabilities('https://instagram.com/p/123');
      });
      
      expect(result.current.isLoadingCapabilities).toBe(true);
      
      await act(async () => {
        resolvePromise!({ data: { capabilities: {}, availableFilters: [], userTier: 'free', platform: { platform: 'unknown' } } });
      });
      
      expect(result.current.isLoadingCapabilities).toBe(false);
    });
  });

  describe('loadFilters', () => {
    it('should load saved filters for a draw', async () => {
      const mockResponse = {
        data: {
          filters: {
            ...DEFAULT_FILTERS,
            mentions: { ...DEFAULT_FILTERS.mentions, minMentions: 2 },
          },
          capabilities: { hasMentions: true },
          availableFilters: [],
          userTier: 'basic',
          platform: 'tiktok',
        },
      };
      
      mockApiService.get.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters({ drawId: 'draw-123' }));
      
      await waitFor(() => {
        expect(result.current.filters.mentions.minMentions).toBe(2);
      });
      
      expect(result.current.platform).toBe('tiktok');
    });

    it('should not load filters without drawId', async () => {
      const { result } = renderHook(() => useFilters());
      
      await act(async () => {
        await result.current.loadFilters();
      });
      
      expect(mockApiService.get).not.toHaveBeenCalled();
    });
  });

  describe('saveFilters', () => {
    it('should save filters successfully', async () => {
      mockApiService.put.mockResolvedValueOnce({ data: { success: true } });
      
      const { result } = renderHook(() => useFilters({ drawId: 'draw-123' }));
      
      let success: boolean = false;
      await act(async () => {
        success = await result.current.saveFilters();
      });
      
      expect(success).toBe(true);
      expect(mockApiService.put).toHaveBeenCalledWith(
        '/filters/draw-123',
        { filters: DEFAULT_FILTERS }
      );
    });

    it('should return false without drawId', async () => {
      const { result } = renderHook(() => useFilters());
      
      let success: boolean = true;
      await act(async () => {
        success = await result.current.saveFilters();
      });
      
      expect(success).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'No draw ID');
    });

    it('should handle upgrade required error', async () => {
      mockApiService.put.mockRejectedValueOnce({
        response: { data: { unavailableFilters: ['profile.minFollowers'] } },
      });
      
      const { result } = renderHook(() => useFilters({ drawId: 'draw-123' }));
      
      await act(async () => {
        await result.current.saveFilters();
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Upgrade requis',
        'Certains filtres nécessitent une mise à niveau'
      );
    });
  });

  describe('previewFilters', () => {
    it('should preview filters successfully', async () => {
      const mockResponse = {
        data: {
          totalParticipants: 1000,
          qualified: 800,
          excluded: 200,
          summary: {},
          processingTimeMs: 150,
          sampleExcluded: [],
        },
      };
      
      mockApiService.post.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters({ drawId: 'draw-123' }));
      
      let preview: any;
      await act(async () => {
        preview = await result.current.previewFilters();
      });
      
      expect(preview).toEqual(mockResponse.data);
      expect(preview.qualified).toBe(800);
    });

    it('should return null without drawId', async () => {
      const { result } = renderHook(() => useFilters());
      
      let preview: any;
      await act(async () => {
        preview = await result.current.previewFilters();
      });
      
      expect(preview).toBeNull();
    });
  });

  describe('runPreScan', () => {
    it('should run pre-scan successfully', async () => {
      const mockResponse = {
        data: {
          preScan: {
            totalComments: 500,
            isEstimate: false,
            hasMore: false,
            withinLimit: true,
            userLimit: 1000,
            upgradeRequired: false,
          },
          validation: { valid: true, errors: [], warnings: [] },
          platform: { platform: 'instagram' },
        },
      };
      
      mockApiService.post.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters({ drawId: 'draw-123' }));
      
      let preScan: any;
      await act(async () => {
        preScan = await result.current.runPreScan('https://instagram.com/p/123');
      });
      
      expect(preScan.preScan.totalComments).toBe(500);
      expect(result.current.preScanResult).toEqual(mockResponse.data.preScan);
      expect(result.current.platform).toBe('instagram');
    });

    it('should show validation errors', async () => {
      const mockResponse = {
        data: {
          preScan: { totalComments: 0, withinLimit: false },
          validation: { valid: false, errors: ['Invalid URL'], warnings: [] },
          platform: { platform: 'unknown' },
        },
      };
      
      mockApiService.post.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters());
      
      await act(async () => {
        await result.current.runPreScan('invalid-url');
      });
      
      expect(Alert.alert).toHaveBeenCalledWith('Erreur de validation', 'Invalid URL');
    });

    it('should show warnings', async () => {
      const mockResponse = {
        data: {
          preScan: { totalComments: 100, withinLimit: true },
          validation: { valid: true, errors: [], warnings: ['Rate limit approaching'] },
          platform: { platform: 'tiktok' },
        },
      };
      
      mockApiService.post.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useFilters());
      
      await act(async () => {
        await result.current.runPreScan('https://tiktok.com/123');
      });
      
      expect(Alert.alert).toHaveBeenCalledWith('Attention', 'Rate limit approaching');
    });
  });

  describe('Helper Functions', () => {
    describe('isFilterAvailable', () => {
      it('should return true for available filter', async () => {
        const mockResponse = {
          data: {
            capabilities: {},
            availableFilters: [
              { filterId: 'mentions.minMentions', available: true },
            ],
            userTier: 'premium',
            platform: { platform: 'instagram' },
          },
        };
        
        mockApiService.post.mockResolvedValueOnce(mockResponse);
        
        const { result } = renderHook(() => useFilters());
        
        await act(async () => {
          await result.current.loadCapabilities('test');
        });
        
        expect(result.current.isFilterAvailable('mentions.minMentions')).toBe(true);
      });

      it('should return false for unavailable filter', async () => {
        const mockResponse = {
          data: {
            capabilities: {},
            availableFilters: [
              { filterId: 'profile.minFollowers', available: false, reason: 'tier_required' },
            ],
            userTier: 'free',
            platform: { platform: 'instagram' },
          },
        };
        
        mockApiService.post.mockResolvedValueOnce(mockResponse);
        
        const { result } = renderHook(() => useFilters());
        
        await act(async () => {
          await result.current.loadCapabilities('test');
        });
        
        expect(result.current.isFilterAvailable('profile.minFollowers')).toBe(false);
      });

      it('should return false for unknown filter', () => {
        const { result } = renderHook(() => useFilters());
        expect(result.current.isFilterAvailable('unknown.filter')).toBe(false);
      });
    });

    describe('getUnavailableReason', () => {
      it('should return tier message for tier_required', async () => {
        const mockResponse = {
          data: {
            capabilities: {},
            availableFilters: [
              { filterId: 'profile.minFollowers', available: false, reason: 'tier_required', requiredTier: 'premium' },
            ],
            userTier: 'free',
            platform: { platform: 'instagram' },
          },
        };
        
        mockApiService.post.mockResolvedValueOnce(mockResponse);
        
        const { result } = renderHook(() => useFilters());
        
        await act(async () => {
          await result.current.loadCapabilities('test');
        });
        
        expect(result.current.getUnavailableReason('profile.minFollowers')).toBe('Requiert premium');
      });

      it('should return capability message for capability_missing', async () => {
        const mockResponse = {
          data: {
            capabilities: {},
            availableFilters: [
              { filterId: 'profile.minFollowers', available: false, reason: 'capability_missing' },
            ],
            userTier: 'premium',
            platform: { platform: 'csv' },
          },
        };
        
        mockApiService.post.mockResolvedValueOnce(mockResponse);
        
        const { result } = renderHook(() => useFilters());
        
        await act(async () => {
          await result.current.loadCapabilities('test');
        });
        
        expect(result.current.getUnavailableReason('profile.minFollowers')).toBe('Non disponible pour cette plateforme');
      });

      it('should return null for available filter', () => {
        const { result } = renderHook(() => useFilters());
        expect(result.current.getUnavailableReason('mentions.minMentions')).toBeNull();
      });
    });
  });
});

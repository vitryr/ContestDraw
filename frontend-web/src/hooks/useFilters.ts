/**
 * useFilters Hook
 * Manages filter state, capabilities, and API calls
 * Simple version without react-query
 */

import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import {
  AdvancedDrawFilters,
  DEFAULT_FILTERS,
  SourceCapabilities,
  FilterAvailability,
  FilterTier,
  PreScanResult,
  CapabilitiesResponse,
  PreScanResponse,
  FilterPreviewResponse,
  SupportedPlatform,
} from '../types/filters';
import toast from 'react-hot-toast';

interface UseFiltersOptions {
  drawId?: string;
}

interface UseFiltersReturn {
  // State
  filters: AdvancedDrawFilters;
  capabilities: SourceCapabilities | null;
  availableFilters: FilterAvailability[];
  userTier: FilterTier;
  platform: SupportedPlatform | null;
  preScanResult: PreScanResult | null;
  
  // Loading states
  isLoadingCapabilities: boolean;
  isLoadingFilters: boolean;
  isSaving: boolean;
  isPreviewing: boolean;
  isPreScanning: boolean;
  
  // Actions
  setFilters: (filters: Partial<AdvancedDrawFilters>) => void;
  updateFilter: <K extends keyof AdvancedDrawFilters>(
    category: K,
    values: Partial<AdvancedDrawFilters[K]>
  ) => void;
  loadCapabilities: (url?: string, csvColumns?: string[]) => Promise<void>;
  loadFilters: () => Promise<void>;
  saveFilters: () => Promise<void>;
  previewFilters: () => Promise<FilterPreviewResponse | null>;
  runPreScan: (url: string) => Promise<PreScanResponse | null>;
  resetFilters: () => void;
  
  // Helpers
  isFilterAvailable: (filterId: string) => boolean;
  getFilterAvailability: (filterId: string) => FilterAvailability | undefined;
  getUnavailableReason: (filterId: string) => string | null;
}

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { drawId } = options;

  // State
  const [filters, setFiltersState] = useState<AdvancedDrawFilters>(DEFAULT_FILTERS);
  const [capabilities, setCapabilities] = useState<SourceCapabilities | null>(null);
  const [availableFilters, setAvailableFilters] = useState<FilterAvailability[]>([]);
  const [userTier, setUserTier] = useState<FilterTier>('free');
  const [platform, setPlatform] = useState<SupportedPlatform | null>(null);
  const [preScanResult, setPreScanResult] = useState<PreScanResult | null>(null);

  // Loading states
  const [isLoadingCapabilities, setIsLoadingCapabilities] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPreScanning, setIsPreScanning] = useState(false);

  // Load saved filters for draw
  const loadFilters = useCallback(async () => {
    if (!drawId) return;
    
    setIsLoadingFilters(true);
    try {
      const response = await api.get(`/filters/${drawId}`);
      const data = response.data.data;
      
      if (data) {
        setFiltersState(data.filters || DEFAULT_FILTERS);
        setCapabilities(data.capabilities);
        setAvailableFilters(data.availableFilters || []);
        setUserTier(data.userTier || 'free');
        setPlatform(data.platform);
        setPreScanResult(data.preScanResult);
      }
    } catch (error: any) {
      console.error('Error loading filters:', error);
      // Don't show error toast - filters might not exist yet
    } finally {
      setIsLoadingFilters(false);
    }
  }, [drawId]);

  // Load filters on mount
  useEffect(() => {
    if (drawId) {
      loadFilters();
    }
  }, [drawId, loadFilters]);

  // Load capabilities
  const loadCapabilities = useCallback(async (url?: string, csvColumns?: string[]) => {
    setIsLoadingCapabilities(true);
    try {
      const response = await api.post('/filters/capabilities', { url, csvColumns });
      const data = response.data.data as CapabilitiesResponse;
      
      setCapabilities(data.capabilities);
      setAvailableFilters(data.availableFilters);
      setUserTier(data.userTier);
      setPlatform(data.platform.platform);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load capabilities');
    } finally {
      setIsLoadingCapabilities(false);
    }
  }, []);

  // Run pre-scan
  const runPreScan = useCallback(async (url: string): Promise<PreScanResponse | null> => {
    setIsPreScanning(true);
    try {
      const response = await api.post('/filters/prescan', { url, drawId });
      const data = response.data.data as PreScanResponse;
      
      setPreScanResult(data.preScan);
      setPlatform(data.platform.platform);
      
      if (!data.validation.valid) {
        data.validation.errors.forEach((err: string) => toast.error(err));
      }
      if (data.validation.warnings.length > 0) {
        data.validation.warnings.forEach((warn: string) => toast(warn, { icon: '⚠️' }));
      }
      
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Pre-scan failed');
      return null;
    } finally {
      setIsPreScanning(false);
    }
  }, [drawId]);

  // Save filters
  const saveFilters = useCallback(async () => {
    if (!drawId) {
      toast.error('No draw ID');
      return;
    }
    
    setIsSaving(true);
    try {
      await api.put(`/filters/${drawId}`, { filters });
      toast.success('Filtres sauvegardés');
    } catch (error: any) {
      if (error.response?.data?.unavailableFilters) {
        toast.error('Certains filtres nécessitent une mise à niveau');
      } else {
        toast.error(error.response?.data?.error || 'Failed to save filters');
      }
    } finally {
      setIsSaving(false);
    }
  }, [drawId, filters]);

  // Preview filters
  const previewFilters = useCallback(async (): Promise<FilterPreviewResponse | null> => {
    if (!drawId) {
      toast.error('No draw ID');
      return null;
    }
    
    setIsPreviewing(true);
    try {
      const response = await api.post(`/filters/${drawId}/preview`, { filters });
      return response.data.data as FilterPreviewResponse;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Preview failed');
      return null;
    } finally {
      setIsPreviewing(false);
    }
  }, [drawId, filters]);

  // Update filters
  const setFilters = useCallback((newFilters: Partial<AdvancedDrawFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const updateFilter = useCallback(<K extends keyof AdvancedDrawFilters>(
    category: K,
    values: Partial<AdvancedDrawFilters[K]>
  ) => {
    setFiltersState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...values,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Helpers
  const isFilterAvailable = useCallback((filterId: string): boolean => {
    const filter = availableFilters.find(f => f.filterId === filterId);
    return filter?.available ?? false;
  }, [availableFilters]);

  const getFilterAvailability = useCallback((filterId: string): FilterAvailability | undefined => {
    return availableFilters.find(f => f.filterId === filterId);
  }, [availableFilters]);

  const getUnavailableReason = useCallback((filterId: string): string | null => {
    const filter = availableFilters.find(f => f.filterId === filterId);
    if (!filter || filter.available) return null;

    switch (filter.reason) {
      case 'tier_required':
        return `Requiert ${filter.requiredTier}`;
      case 'capability_missing':
        return 'Non disponible pour cette plateforme';
      case 'platform_unsupported':
        return 'Plateforme non supportée';
      default:
        return 'Non disponible';
    }
  }, [availableFilters]);

  return {
    filters,
    capabilities,
    availableFilters,
    userTier,
    platform,
    preScanResult,
    
    isLoadingCapabilities,
    isLoadingFilters,
    isSaving,
    isPreviewing,
    isPreScanning,
    
    setFilters,
    updateFilter,
    loadCapabilities,
    loadFilters,
    saveFilters,
    previewFilters,
    runPreScan,
    resetFilters,
    
    isFilterAvailable,
    getFilterAvailability,
    getUnavailableReason,
  };
}

export default useFilters;

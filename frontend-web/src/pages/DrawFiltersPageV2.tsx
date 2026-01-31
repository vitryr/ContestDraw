/**
 * DrawFiltersPage V2
 * Uses the new Advanced Filters system
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Filter,
  Sparkles,
  Users,
  AlertCircle,
  Check,
  RefreshCw,
  Eye,
  Save,
  Zap,
  Crown,
  Loader2,
} from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import { useFilters } from "../hooks/useFilters";
import { AdvancedFiltersPanel } from "../components/filters";
import { TIER_COLORS, TIER_LABELS } from "../types/filters";
import toast from "react-hot-toast";

export default function DrawFiltersPageV2() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDraw, fetchDraw, isLoading: drawLoading } = useDrawStore();

  // Advanced filters hook
  const {
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
    updateFilter,
    loadCapabilities,
    saveFilters,
    previewFilters,
    runPreScan,
    resetFilters,
    isFilterAvailable,
    getUnavailableReason,
  } = useFilters({ drawId: id });

  // Preview results
  const [previewResults, setPreviewResults] = useState<{
    qualified: number;
    excluded: number;
    total: number;
  } | null>(null);

  // Load draw data and capabilities on mount
  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  // Load capabilities when draw has a URL
  useEffect(() => {
    if (currentDraw?.postUrl && !capabilities) {
      loadCapabilities(currentDraw.postUrl);
    }
  }, [currentDraw?.postUrl, capabilities, loadCapabilities]);

  // Run pre-scan on first load
  useEffect(() => {
    if (currentDraw?.postUrl && !preScanResult) {
      runPreScan(currentDraw.postUrl);
    }
  }, [currentDraw?.postUrl, preScanResult, runPreScan]);

  const handlePreview = async () => {
    const result = await previewFilters();
    if (result) {
      setPreviewResults({
        qualified: result.qualified,
        excluded: result.excluded,
        total: result.totalParticipants,
      });
    }
  };

  const handleSave = async () => {
    await saveFilters();
    toast.success("Filtres sauvegardés !");
  };

  const handleContinue = async () => {
    await saveFilters();
    navigate(`/draws/${id}/execute`);
  };

  const isLoading = drawLoading || isLoadingFilters || isLoadingCapabilities;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg-base/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/draws/${id}`)}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-ink-secondary" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-accent-secondary" />
                  Filtres Avancés
                </h1>
                <p className="text-sm text-ink-muted">
                  {currentDraw?.title || "Tirage"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* User Tier Badge */}
              <span className={`text-xs px-3 py-1.5 rounded-full ${TIER_COLORS[userTier]}`}>
                <Crown className="w-3.5 h-3.5 inline mr-1" />
                {TIER_LABELS[userTier]}
              </span>

              {/* Preview Button */}
              <button
                onClick={handlePreview}
                disabled={isPreviewing}
                className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-white/10 rounded-lg hover:bg-bg-card transition-colors disabled:opacity-50"
              >
                {isPreviewing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                Prévisualiser
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-accent-secondary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Detection */}
            {platform && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-bg-card border border-white/[0.06] rounded-xl"
              >
                <div className="p-2 bg-accent-secondary/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Plateforme détectée : {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Les filtres disponibles ont été adaptés automatiquement
                  </p>
                </div>
              </motion.div>
            )}

            {/* Pre-scan Warning */}
            {preScanResult && !preScanResult.withinLimit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning">
                    Ce post dépasse votre limite ({preScanResult.totalComments.toLocaleString()} commentaires)
                  </p>
                  <p className="text-sm text-warning/80 mt-1">
                    Votre plan {TIER_LABELS[userTier]} permet {preScanResult.userLimit.toLocaleString()} commentaires max.
                    {preScanResult.suggestedPlan && (
                      <button className="ml-2 underline">
                        Passer à {preScanResult.suggestedPlan}
                      </button>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Advanced Filters Panel */}
            <AdvancedFiltersPanel
              filters={filters}
              onUpdateFilter={updateFilter}
              capabilities={capabilities}
              availableFilters={availableFilters}
              userTier={userTier}
              isFilterAvailable={isFilterAvailable}
              getUnavailableReason={getUnavailableReason}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="sticky top-24 space-y-6">
              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-secondary" />
                  Résumé
                </h3>

                <div className="space-y-4">
                  {/* Pre-scan stats */}
                  {preScanResult && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-ink-secondary">Total commentaires</span>
                        <span className="font-semibold text-white">
                          {preScanResult.totalComments.toLocaleString()}
                          {preScanResult.isEstimate && " (estimé)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ink-secondary">Votre limite</span>
                        <span className="font-semibold text-white">
                          {preScanResult.userLimit.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Preview results */}
                  {previewResults && (
                    <>
                      <div className="h-px bg-white/10 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-ink-secondary">Après filtres</span>
                        <span className="font-semibold text-accent-secondary">
                          {previewResults.qualified.toLocaleString()} qualifiés
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ink-secondary">Exclus</span>
                        <span className="font-semibold text-error">
                          {previewResults.excluded.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-accent-secondary h-full rounded-full transition-all"
                          style={{
                            width: `${(previewResults.qualified / previewResults.total) * 100}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleContinue}
                    disabled={isSaving || (preScanResult !== null && !preScanResult.withinLimit)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-5 h-5" />
                    Continuer vers le tirage
                  </button>

                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-elevated text-ink-secondary rounded-xl hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
                <h4 className="font-medium text-white mb-2">💡 Conseil</h4>
                <p className="text-sm text-ink-muted">
                  Utilisez les filtres de profil pour exclure les comptes bots et
                  améliorer la qualité de votre tirage. Les filtres{" "}
                  <span className="text-accent-secondary">Premium</span> offrent
                  une détection avancée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

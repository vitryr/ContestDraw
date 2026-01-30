import React, { useState, useCallback } from 'react';
import api from '../../services/api';

interface PromoCodeData {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

interface Props {
  purchaseType: 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H';
  amount: number;
  planId?: string;
  onApply: (data: PromoCodeData) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const PromoCodeInput: React.FC<Props> = ({
  purchaseType,
  amount,
  planId,
  onApply,
  onClear,
  disabled = false,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<PromoCodeData | null>(null);

  const handleApply = useCallback(async () => {
    if (!code.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/payments/promo/validate', {
        code: code.trim(),
        purchaseType,
        amount,
        planId,
      });

      if (res.data.valid) {
        const promoData: PromoCodeData = {
          code: res.data.code,
          discountType: res.data.discountType,
          discountValue: res.data.discountValue,
          discountAmount: res.data.discountAmount,
          finalAmount: res.data.finalAmount,
        };
        setApplied(promoData);
        onApply(promoData);
      } else {
        setError(res.data.error || 'Code invalide');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Code invalide';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [code, purchaseType, amount, planId, onApply]);

  const handleClear = useCallback(() => {
    setCode('');
    setApplied(null);
    setError('');
    onClear();
  }, [onClear]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  // Applied state - show success badge
  if (applied) {
    return (
      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-xl">🎫</span>
          <div>
            <span className="font-mono font-bold text-emerald-400">{applied.code}</span>
            <p className="text-sm text-emerald-400/80">
              -{applied.discountAmount.toFixed(2)}€ de réduction
              {applied.discountType === 'PERCENTAGE' && (
                <span className="text-emerald-400/60"> ({applied.discountValue}%)</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          disabled={disabled}
          className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-400 disabled:opacity-50"
          title="Retirer le code"
        >
          ✕
        </button>
      </div>
    );
  }

  // Input state
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Code promo"
            disabled={disabled || loading}
            className={`w-full px-4 py-3 bg-bg-card border rounded-xl font-mono uppercase text-ink-primary placeholder-ink-muted focus:outline-none transition-colors disabled:opacity-50 ${
              error
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-bg-hover focus:border-accent-primary'
            }`}
          />
          {code && !loading && (
            <button
              onClick={() => {
                setCode('');
                setError('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim() || disabled}
          className={`px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${
            code.trim()
              ? 'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30'
              : 'bg-bg-hover text-ink-muted'
          }`}
        >
          {loading ? (
            <span className="animate-pulse">⏳</span>
          ) : (
            'Appliquer'
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput;

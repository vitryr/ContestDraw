import React, { useState } from 'react';
import api from '../../services/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreatePromoCodeModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    discountValue: 10,
    maxUses: '',
    maxUsesPerUser: 1,
    validUntil: '',
    minPurchaseAmount: '',
    applicableTo: 'ALL',
    allowedPlans: [] as string[],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.code.trim()) {
      setError('Le code est requis');
      return;
    }

    if (form.discountValue <= 0) {
      setError('La valeur de réduction doit être positive');
      return;
    }

    if (form.discountType === 'PERCENTAGE' && form.discountValue > 100) {
      setError('Le pourcentage ne peut pas dépasser 100%');
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/promo-codes', {
        code: form.code.toUpperCase().trim(),
        discountType: form.discountType,
        discountValue: form.discountValue,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        maxUsesPerUser: form.maxUsesPerUser,
        validUntil: form.validUntil || null,
        minPurchaseAmount: form.minPurchaseAmount ? parseFloat(form.minPurchaseAmount) : null,
        applicableTo: form.applicableTo,
        allowedPlans: form.allowedPlans.length > 0 ? form.allowedPlans : undefined,
        description: form.description || undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, code });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-bg-hover rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-bg-hover flex justify-between items-center">
          <h2 className="text-xl font-bold text-ink-primary">🎫 Nouveau Code Promo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-ink-muted hover:text-ink-primary"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Code promo *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER24"
                className="flex-1 px-4 py-3 bg-bg-base border border-bg-hover rounded-xl font-mono uppercase text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
                maxLength={30}
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-3 bg-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary transition-colors"
                title="Générer un code aléatoire"
              >
                🎲
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Lettres, chiffres, tirets et underscores uniquement
            </p>
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Type de réduction
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })
                }
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary focus:outline-none focus:border-accent-primary transition-colors"
              >
                <option value="PERCENTAGE">Pourcentage (%)</option>
                <option value="FIXED_AMOUNT">Montant fixe (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Valeur *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
                  min={1}
                  max={form.discountType === 'PERCENTAGE' ? 100 : 9999}
                  step={form.discountType === 'PERCENTAGE' ? 1 : 0.01}
                  className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary focus:outline-none focus:border-accent-primary transition-colors pr-10"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
                  {form.discountType === 'PERCENTAGE' ? '%' : '€'}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Utilisations max (total)
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Illimité"
                min={1}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Max par utilisateur
              </label>
              <input
                type="number"
                value={form.maxUsesPerUser}
                onChange={(e) => setForm({ ...form, maxUsesPerUser: parseInt(e.target.value) || 1 })}
                min={1}
                max={100}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
          </div>

          {/* Validity & Min Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Date d'expiration
              </label>
              <input
                type="datetime-local"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary focus:outline-none focus:border-accent-primary transition-colors"
              />
              <p className="text-xs text-ink-muted mt-1">Laisser vide = jamais</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Montant min. d'achat (€)
              </label>
              <input
                type="number"
                value={form.minPurchaseAmount}
                onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })}
                placeholder="Aucun"
                min={0}
                step={0.01}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
          </div>

          {/* Applicable To */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Applicable à
            </label>
            <select
              value={form.applicableTo}
              onChange={(e) => setForm({ ...form, applicableTo: e.target.value })}
              className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary focus:outline-none focus:border-accent-primary transition-colors"
            >
              <option value="ALL">🌐 Tout (abonnements + crédits)</option>
              <option value="SUBSCRIPTION">📅 Abonnements uniquement</option>
              <option value="CREDITS">💳 Packs de crédits uniquement</option>
              <option value="PASS_48H">⏱️ Pass 48h uniquement</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Description (interne)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Campagne influenceur @username, Black Friday 2024..."
              maxLength={500}
              className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Preview */}
          {form.code && form.discountValue > 0 && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-sm text-emerald-400">
                Aperçu: Code <span className="font-mono font-bold">{form.code.toUpperCase()}</span> →{' '}
                <span className="font-bold">
                  -{form.discountValue}
                  {form.discountType === 'PERCENTAGE' ? '%' : '€'}
                </span>
                {form.applicableTo !== 'ALL' && (
                  <span className="text-emerald-400/70">
                    {' '}
                    (
                    {form.applicableTo === 'SUBSCRIPTION'
                      ? 'abonnements'
                      : form.applicableTo === 'CREDITS'
                      ? 'crédits'
                      : 'pass 48h'}
                    )
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !form.code || form.discountValue <= 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> Création...
                </>
              ) : (
                <>✅ Créer le code</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromoCodeModal;

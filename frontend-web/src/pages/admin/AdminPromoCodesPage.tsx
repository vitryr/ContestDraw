import React, { useEffect, useState, useCallback } from 'react';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';
import { CreatePromoCodeModal } from '../../components/admin/CreatePromoCodeModal';
import api from '../../services/api';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses: number | null;
  maxUsesPerUser: number;
  currentUses: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  applicableTo: string;
  description: string | null;
  createdAt: string;
  _count: { usages: number };
}

interface Stats {
  totalCodes: number;
  activeCodes: number;
  totalUsages: number;
  totalDiscount: number;
}

export const AdminPromoCodesPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Stats>({
    totalCodes: 0,
    activeCodes: 0,
    totalUsages: 0,
    totalDiscount: 0,
  });

  const loadPromoCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/promo-codes', {
        params: {
          page,
          limit: 20,
          active: filter === 'active' ? true : filter === 'inactive' ? false : undefined,
          search: search || undefined,
        },
      });

      setPromoCodes(res.data.promoCodes);
      setTotalPages(res.data.totalPages);

      // Calculate stats from response
      const codes = res.data.promoCodes;
      setStats({
        totalCodes: res.data.total,
        activeCodes: codes.filter((p: PromoCode) => p.isActive).length,
        totalUsages: codes.reduce((sum: number, p: PromoCode) => sum + (p._count?.usages || 0), 0),
        totalDiscount: 0, // Would need separate API call for accurate total
      });
    } catch (error) {
      console.error('Failed to load promo codes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const handleDeactivate = async (id: string) => {
    if (!confirm('Désactiver ce code promo ?')) return;
    try {
      await api.post(`/admin/promo-codes/${id}/deactivate`);
      loadPromoCodes();
    } catch (error) {
      console.error('Failed to deactivate:', error);
      alert('Erreur lors de la désactivation');
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await api.post(`/admin/promo-codes/${id}/reactivate`);
      loadPromoCodes();
    } catch (error) {
      console.error('Failed to reactivate:', error);
      alert('Erreur lors de la réactivation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce code promo ? Cette action est irréversible.')) return;
    try {
      await api.delete(`/admin/promo-codes/${id}`);
      loadPromoCodes();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could show a toast notification here
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === 'PERCENTAGE') {
      return `${code.discountValue}%`;
    }
    return `${code.discountValue}€`;
  };

  const getCodeStatus = (code: PromoCode) => {
    const now = new Date();
    const isExpired = code.validUntil && new Date(code.validUntil) < now;
    const isMaxed = code.maxUses && code.currentUses >= code.maxUses;
    const notStarted = new Date(code.validFrom) > now;

    if (!code.isActive) return { label: '❌ Inactif', color: 'bg-red-500/20 text-red-400' };
    if (isExpired) return { label: '⏰ Expiré', color: 'bg-orange-500/20 text-orange-400' };
    if (isMaxed) return { label: '🚫 Épuisé', color: 'bg-yellow-500/20 text-yellow-400' };
    if (notStarted) return { label: '📅 Planifié', color: 'bg-blue-500/20 text-blue-400' };
    return { label: '✅ Actif', color: 'bg-emerald-500/20 text-emerald-400' };
  };

  const applicableToLabels: Record<string, string> = {
    ALL: '🌐 Tout',
    SUBSCRIPTION: '📅 Abonnements',
    CREDITS: '💳 Crédits',
    PASS_48H: '⏱️ Pass 48h',
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (code: PromoCode) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-accent-primary bg-accent-primary/10 px-3 py-1 rounded">
            {code.code}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(code.code);
            }}
            className="p-1 hover:bg-bg-hover rounded transition-colors text-ink-muted hover:text-ink-primary"
            title="Copier"
          >
            📋
          </button>
        </div>
      ),
    },
    {
      key: 'discount',
      label: 'Réduction',
      render: (code: PromoCode) => (
        <span className="font-semibold text-emerald-400">-{formatDiscount(code)}</span>
      ),
    },
    {
      key: 'applicableTo',
      label: 'Applicable à',
      render: (code: PromoCode) => (
        <span className="text-ink-secondary text-sm">
          {applicableToLabels[code.applicableTo] || code.applicableTo}
        </span>
      ),
    },
    {
      key: 'usage',
      label: 'Utilisations',
      render: (code: PromoCode) => (
        <div className="text-ink-primary">
          <span className="font-medium">{code.currentUses}</span>
          <span className="text-ink-muted">
            {code.maxUses ? ` / ${code.maxUses}` : ' / ∞'}
          </span>
        </div>
      ),
    },
    {
      key: 'validUntil',
      label: 'Expire',
      render: (code: PromoCode) => (
        <span className="text-ink-muted text-sm">
          {code.validUntil
            ? new Date(code.validUntil).toLocaleDateString('fr-FR')
            : '♾️ Jamais'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (code: PromoCode) => {
        const status = getCodeStatus(code);
        return (
          <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (code: PromoCode) => (
        <div className="flex gap-1">
          {code.isActive ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeactivate(code.id);
              }}
              className="p-2 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors"
              title="Désactiver"
            >
              ⏸️
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReactivate(code.id);
              }}
              className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
              title="Réactiver"
            >
              ▶️
            </button>
          )}
          {code._count.usages === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(code.id);
              }}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              title="Supprimer"
            >
              🗑️
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total codes"
          value={stats.totalCodes.toString()}
          icon="🎫"
          gradient="purple"
        />
        <AdminStatsCard
          title="Actifs"
          value={stats.activeCodes.toString()}
          icon="✅"
          gradient="green"
        />
        <AdminStatsCard
          title="Utilisations"
          value={stats.totalUsages.toString()}
          icon="📊"
          gradient="pink"
        />
        <AdminStatsCard
          title="Économies générées"
          value={`${stats.totalDiscount}€`}
          icon="💰"
          gradient="blue"
        />
      </div>

      {/* Header + Create button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-ink-primary">Codes Promo</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          ➕ Nouveau code
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher un code..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                  : 'bg-bg-card border border-bg-hover text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Inactifs'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={promoCodes}
        loading={loading}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="Aucun code promo"
      />

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePromoCodeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadPromoCodes();
          }}
        />
      )}
    </div>
  );
};

export default AdminPromoCodesPage;

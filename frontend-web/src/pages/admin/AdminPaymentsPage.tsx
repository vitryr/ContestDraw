import React, { useEffect, useState } from 'react';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';
import api from '../../services/api';

interface Payment {
  id: string;
  stripeId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  plan: string;
  createdAt: string;
}

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed' | 'refunded'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalRevenue: 28450,
    monthRevenue: 8920,
    avgTransaction: 24.5,
    refundRate: 2.3,
  });

  useEffect(() => {
    loadPayments();
  }, [page, filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payments', {
        params: { page, filter, limit: 20 },
      });
      setPayments(res.data.payments);
      setTotalPages(res.data.totalPages);
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to load payments:', error);
      // Mock data
      setPayments([
        { id: '1', stripeId: 'pi_1234567890', userEmail: 'jean@example.com', amount: 2900, currency: 'eur', status: 'succeeded', plan: 'Pro Mensuel', createdAt: '2024-01-28T14:32:00Z' },
        { id: '2', stripeId: 'pi_1234567891', userEmail: 'marie@example.com', amount: 9900, currency: 'eur', status: 'succeeded', plan: 'Pro Annuel', createdAt: '2024-01-28T12:15:00Z' },
        { id: '3', stripeId: 'pi_1234567892', userEmail: 'paul@example.com', amount: 2900, currency: 'eur', status: 'pending', plan: 'Pro Mensuel', createdAt: '2024-01-28T10:45:00Z' },
        { id: '4', stripeId: 'pi_1234567893', userEmail: 'sophie@example.com', amount: 2900, currency: 'eur', status: 'refunded', plan: 'Pro Mensuel', createdAt: '2024-01-27T16:20:00Z' },
        { id: '5', stripeId: 'pi_1234567894', userEmail: 'lucas@example.com', amount: 2900, currency: 'eur', status: 'failed', plan: 'Pro Mensuel', createdAt: '2024-01-27T09:00:00Z' },
      ]);
      setTotalPages(15);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const statusColors: Record<string, string> = {
    succeeded: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    failed: 'bg-red-500/20 text-red-400',
    refunded: 'bg-blue-500/20 text-blue-400',
  };

  const statusLabels: Record<string, string> = {
    succeeded: '✅ Réussi',
    pending: '⏳ En attente',
    failed: '❌ Échoué',
    refunded: '↩️ Remboursé',
  };

  const columns = [
    {
      key: 'stripeId',
      label: 'ID Stripe',
      render: (payment: Payment) => (
        <span className="font-mono text-sm text-ink-muted">
          {payment.stripeId.substring(0, 15)}...
        </span>
      ),
    },
    {
      key: 'userEmail',
      label: 'Client',
      render: (payment: Payment) => (
        <span className="text-ink-primary">{payment.userEmail}</span>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (payment: Payment) => (
        <span className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-sm">
          {payment.plan}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (payment: Payment) => (
        <span className="text-ink-primary font-semibold">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (payment: Payment) => (
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[payment.status]}`}>
          {statusLabels[payment.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (payment: Payment) => (
        <span className="text-ink-muted text-sm">
          {new Date(payment.createdAt).toLocaleString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (payment: Payment) => (
        <a
          href={`https://dashboard.stripe.com/payments/${payment.stripeId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 bg-bg-hover rounded-lg text-ink-secondary hover:text-ink-primary transition-colors inline-flex items-center gap-2"
        >
          Stripe ↗
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Revenus total"
          value={formatCurrency(stats.totalRevenue * 100, 'eur')}
          icon="💰"
          gradient="green"
        />
        <AdminStatsCard
          title="Ce mois"
          value={formatCurrency(stats.monthRevenue * 100, 'eur')}
          change={18}
          icon="📈"
          gradient="purple"
        />
        <AdminStatsCard
          title="Panier moyen"
          value={formatCurrency(stats.avgTransaction * 100, 'eur')}
          icon="🛒"
          gradient="pink"
        />
        <AdminStatsCard
          title="Taux remboursement"
          value={`${stats.refundRate}%`}
          icon="↩️"
          gradient="blue"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'succeeded', 'pending', 'failed', 'refunded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                : 'bg-bg-card border border-bg-hover text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {f === 'all' && 'Tous'}
            {f === 'succeeded' && '✅ Réussis'}
            {f === 'pending' && '⏳ En attente'}
            {f === 'failed' && '❌ Échoués'}
            {f === 'refunded' && '↩️ Remboursés'}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <AdminTable
        columns={columns}
        data={payments}
        loading={loading}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="Aucun paiement trouvé"
      />

      {/* Export button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary hover:border-accent-primary/50 transition-all flex items-center gap-2">
          📥 Exporter CSV
        </button>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;

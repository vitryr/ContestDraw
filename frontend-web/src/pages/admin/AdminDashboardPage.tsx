import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';
import { AdminTable } from '../../components/admin/AdminTable';
import api from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalDraws: number;
  totalRevenue: number;
  conversionRate: number;
  usersChange: number;
  drawsChange: number;
  revenueChange: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'draw' | 'payment';
  description: string;
  timestamp: string;
  user?: string;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/admin/stats/overview'),
        api.get('/admin/activities/recent'),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use mock data for now
      setStats({
        totalUsers: 1247,
        totalDraws: 3891,
        totalRevenue: 28450,
        conversionRate: 12.5,
        usersChange: 15,
        drawsChange: 23,
        revenueChange: 18,
      });
      setActivities([
        { id: '1', type: 'user', description: 'Nouvel utilisateur inscrit', timestamp: new Date().toISOString(), user: 'jean@example.com' },
        { id: '2', type: 'draw', description: 'Tirage effectué', timestamp: new Date().toISOString(), user: 'marie@example.com' },
        { id: '3', type: 'payment', description: 'Paiement reçu - Pro (29€)', timestamp: new Date().toISOString(), user: 'paul@example.com' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const activityColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (item: RecentActivity) => (
        <span className="text-xl">
          {item.type === 'user' && '👤'}
          {item.type === 'draw' && '🎲'}
          {item.type === 'payment' && '💳'}
        </span>
      ),
    },
    { key: 'description', label: 'Description' },
    { key: 'user', label: 'Utilisateur' },
    {
      key: 'timestamp',
      label: 'Date',
      render: (item: RecentActivity) =>
        new Date(item.timestamp).toLocaleString('fr-FR'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Utilisateurs"
          value={stats?.totalUsers.toLocaleString() || '-'}
          change={stats?.usersChange}
          icon="👥"
          gradient="purple"
        />
        <AdminStatsCard
          title="Tirages"
          value={stats?.totalDraws.toLocaleString() || '-'}
          change={stats?.drawsChange}
          icon="🎲"
          gradient="pink"
        />
        <AdminStatsCard
          title="Revenus"
          value={stats ? formatCurrency(stats.totalRevenue) : '-'}
          change={stats?.revenueChange}
          icon="💰"
          gradient="green"
        />
        <AdminStatsCard
          title="Taux conversion"
          value={stats ? `${stats.conversionRate}%` : '-'}
          icon="📈"
          gradient="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-bg-card border border-bg-hover rounded-xl p-6 hover:border-accent-primary/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-secondary to-accent-tertiary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👥
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">Gérer les utilisateurs</h3>
              <p className="text-ink-muted text-sm">Voir, modifier, bannir</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/draws"
          className="bg-bg-card border border-bg-hover rounded-xl p-6 hover:border-accent-primary/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-primary to-pink-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🎲
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">Voir les tirages</h3>
              <p className="text-ink-muted text-sm">Participants, gagnants</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/payments"
          className="bg-bg-card border border-bg-hover rounded-xl p-6 hover:border-accent-primary/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">Paiements</h3>
              <p className="text-ink-muted text-sm">Transactions Stripe</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ink-primary">Activité récente</h2>
          <span className="text-ink-muted text-sm">Dernières 24h</span>
        </div>
        <AdminTable
          columns={activityColumns}
          data={activities}
          loading={loading}
          emptyMessage="Aucune activité récente"
        />
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-semibold text-ink-primary mb-4">Inscriptions par jour</h3>
          <div className="h-64 flex items-center justify-center text-ink-muted">
            📊 Graphique à venir
          </div>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-semibold text-ink-primary mb-4">Revenus par mois</h3>
          <div className="h-64 flex items-center justify-center text-ink-muted">
            📈 Graphique à venir
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

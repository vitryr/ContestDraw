import React, { useState } from 'react';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export const AdminStatsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Mock data - replace with API calls
  const stats = {
    users: {
      total: 12847,
      new: 1523,
      active: 8934,
      churn: 234,
    },
    revenue: {
      total: 284500,
      mrr: 28920,
      arr: 347040,
      ltv: 156,
    },
    draws: {
      total: 38910,
      completed: 35280,
      avgParticipants: 847,
    },
    conversion: {
      signupToTrial: 45.2,
      trialToPaid: 12.5,
      freeToProRate: 8.3,
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink-primary">Vue d'ensemble</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                  : 'bg-bg-card border border-bg-hover text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {range === '7d' && '7 jours'}
              {range === '30d' && '30 jours'}
              {range === '90d' && '90 jours'}
              {range === '1y' && '1 an'}
              {range === 'all' && 'Tout'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Stats */}
      <section>
        <h3 className="text-lg font-medium text-ink-primary mb-4">👥 Utilisateurs</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total utilisateurs"
            value={stats.users.total.toLocaleString()}
            change={15}
            icon="👥"
            gradient="purple"
          />
          <AdminStatsCard
            title="Nouveaux"
            value={stats.users.new.toLocaleString()}
            change={23}
            icon="✨"
            gradient="pink"
          />
          <AdminStatsCard
            title="Actifs (30j)"
            value={stats.users.active.toLocaleString()}
            icon="🟢"
            gradient="green"
          />
          <AdminStatsCard
            title="Churn"
            value={stats.users.churn.toLocaleString()}
            change={-5}
            icon="📉"
            gradient="blue"
          />
        </div>
      </section>

      {/* Revenue Stats */}
      <section>
        <h3 className="text-lg font-medium text-ink-primary mb-4">💰 Revenus</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Revenus total"
            value={formatCurrency(stats.revenue.total)}
            change={18}
            icon="💰"
            gradient="green"
          />
          <AdminStatsCard
            title="MRR"
            value={formatCurrency(stats.revenue.mrr)}
            change={12}
            icon="📊"
            gradient="purple"
          />
          <AdminStatsCard
            title="ARR"
            value={formatCurrency(stats.revenue.arr)}
            icon="📈"
            gradient="pink"
          />
          <AdminStatsCard
            title="LTV moyen"
            value={formatCurrency(stats.revenue.ltv)}
            icon="💎"
            gradient="gold"
          />
        </div>
      </section>

      {/* Draws Stats */}
      <section>
        <h3 className="text-lg font-medium text-ink-primary mb-4">🎲 Tirages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Total tirages"
            value={stats.draws.total.toLocaleString()}
            change={28}
            icon="🎲"
            gradient="pink"
          />
          <AdminStatsCard
            title="Complétés"
            value={stats.draws.completed.toLocaleString()}
            icon="✅"
            gradient="green"
          />
          <AdminStatsCard
            title="Participants moyen"
            value={stats.draws.avgParticipants.toLocaleString()}
            icon="👥"
            gradient="purple"
          />
        </div>
      </section>

      {/* Conversion Stats */}
      <section>
        <h3 className="text-lg font-medium text-ink-primary mb-4">📈 Conversion</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Signup → Trial"
            value={`${stats.conversion.signupToTrial}%`}
            icon="🎯"
            gradient="purple"
          />
          <AdminStatsCard
            title="Trial → Paid"
            value={`${stats.conversion.trialToPaid}%`}
            icon="💳"
            gradient="green"
          />
          <AdminStatsCard
            title="Free → Pro"
            value={`${stats.conversion.freeToProRate}%`}
            icon="⭐"
            gradient="gold"
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-medium text-ink-primary mb-4">📊 Inscriptions par jour</h3>
          <div className="h-80 flex items-center justify-center text-ink-muted border border-dashed border-bg-hover rounded-lg">
            <div className="text-center">
              <p className="text-4xl mb-2">📈</p>
              <p>Graphique Recharts à intégrer</p>
              <p className="text-sm mt-2">LineChart avec données quotidiennes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-medium text-ink-primary mb-4">💰 Revenus mensuels</h3>
          <div className="h-80 flex items-center justify-center text-ink-muted border border-dashed border-bg-hover rounded-lg">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p>Graphique Recharts à intégrer</p>
              <p className="text-sm mt-2">BarChart avec données mensuelles</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-medium text-ink-primary mb-4">🎲 Tirages par plateforme</h3>
          <div className="h-80 flex items-center justify-center text-ink-muted border border-dashed border-bg-hover rounded-lg">
            <div className="text-center">
              <p className="text-4xl mb-2">🥧</p>
              <p>Graphique Recharts à intégrer</p>
              <p className="text-sm mt-2">PieChart par source (Instagram, TikTok, etc.)</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-bg-hover rounded-xl p-6">
          <h3 className="text-lg font-medium text-ink-primary mb-4">📉 Cohort retention</h3>
          <div className="h-80 flex items-center justify-center text-ink-muted border border-dashed border-bg-hover rounded-lg">
            <div className="text-center">
              <p className="text-4xl mb-2">📋</p>
              <p>Tableau de cohort à intégrer</p>
              <p className="text-sm mt-2">Retention par semaine/mois</p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Section */}
      <section className="flex gap-4 justify-end">
        <button className="px-6 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary hover:border-accent-primary/50 transition-all flex items-center gap-2">
          📥 Exporter CSV
        </button>
        <button className="px-6 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary hover:border-accent-primary/50 transition-all flex items-center gap-2">
          📄 Exporter PDF
        </button>
      </section>
    </div>
  );
};

export default AdminStatsPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTable } from '../../components/admin/AdminTable';
import api from '../../services/api';

interface Draw {
  id: string;
  title: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'completed' | 'cancelled';
  participantsCount: number;
  winnersCount: number;
  platform: string;
  createdAt: string;
  completedAt?: string;
}

export const AdminDrawsPage: React.FC = () => {
  const navigate = useNavigate();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDraws();
  }, [page, filter, search]);

  const loadDraws = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/draws', {
        params: { page, filter, search, limit: 20 },
      });
      setDraws(res.data.draws);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load draws:', error);
      // Mock data
      setDraws([
        { id: '1', title: 'Giveaway iPhone 15', userId: '1', userEmail: 'jean@example.com', status: 'completed', participantsCount: 1523, winnersCount: 3, platform: 'instagram', createdAt: '2024-01-28', completedAt: '2024-01-28' },
        { id: '2', title: 'Concours Été 2024', userId: '2', userEmail: 'marie@example.com', status: 'pending', participantsCount: 456, winnersCount: 1, platform: 'tiktok', createdAt: '2024-01-27' },
        { id: '3', title: 'Tirage Noël', userId: '3', userEmail: 'paul@example.com', status: 'completed', participantsCount: 2891, winnersCount: 5, platform: 'instagram', createdAt: '2024-01-25', completedAt: '2024-01-26' },
        { id: '4', title: 'Test tirage', userId: '1', userEmail: 'jean@example.com', status: 'cancelled', participantsCount: 12, winnersCount: 0, platform: 'csv', createdAt: '2024-01-20' },
      ]);
      setTotalPages(10);
    } finally {
      setLoading(false);
    }
  };

  const platformIcons: Record<string, string> = {
    instagram: '📸',
    tiktok: '🎵',
    facebook: '👤',
    youtube: '📺',
    twitter: '🐦',
    csv: '📄',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const statusLabels: Record<string, string> = {
    pending: '⏳ En cours',
    completed: '✅ Terminé',
    cancelled: '❌ Annulé',
  };

  const columns = [
    {
      key: 'title',
      label: 'Tirage',
      render: (draw: Draw) => (
        <div>
          <p className="font-medium text-ink-primary">{draw.title}</p>
          <p className="text-ink-muted text-sm">{draw.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'platform',
      label: 'Source',
      render: (draw: Draw) => (
        <span className="flex items-center gap-2">
          <span className="text-xl">{platformIcons[draw.platform] || '📋'}</span>
          <span className="text-ink-secondary capitalize">{draw.platform}</span>
        </span>
      ),
    },
    {
      key: 'participants',
      label: 'Participants',
      render: (draw: Draw) => (
        <span className="text-ink-primary font-medium">
          {draw.participantsCount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'winners',
      label: 'Gagnants',
      render: (draw: Draw) => (
        <span className="text-accent-primary font-medium">
          🏆 {draw.winnersCount}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (draw: Draw) => (
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[draw.status]}`}>
          {statusLabels[draw.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (draw: Draw) => (
        <span className="text-ink-muted text-sm">
          {new Date(draw.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (draw: Draw) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/draws/${draw.id}`);
          }}
          className="px-4 py-2 bg-bg-hover rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-accent-primary/20 transition-colors"
        >
          Détails →
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
          <p className="text-ink-muted text-sm">Total tirages</p>
          <p className="text-2xl font-bold text-ink-primary">3,891</p>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
          <p className="text-ink-muted text-sm">Aujourd'hui</p>
          <p className="text-2xl font-bold text-accent-primary">47</p>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
          <p className="text-ink-muted text-sm">Participants total</p>
          <p className="text-2xl font-bold text-ink-primary">1.2M</p>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
          <p className="text-ink-muted text-sm">Gagnants</p>
          <p className="text-2xl font-bold text-emerald-400">12,458</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par titre ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'completed', 'cancelled'] as const).map((f) => (
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
              {f === 'pending' && 'En cours'}
              {f === 'completed' && 'Terminés'}
              {f === 'cancelled' && 'Annulés'}
            </button>
          ))}
        </div>
      </div>

      {/* Draws Table */}
      <AdminTable
        columns={columns}
        data={draws}
        loading={loading}
        onRowClick={(draw) => navigate(`/admin/draws/${draw.id}`)}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="Aucun tirage trouvé"
      />
    </div>
  );
};

export default AdminDrawsPage;

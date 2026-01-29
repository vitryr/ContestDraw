import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTable } from '../../components/admin/AdminTable';
import api from '../../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  plan: string;
  drawsCount: number;
  createdAt: string;
  lastLoginAt: string;
  isBanned: boolean;
}

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'pro' | 'banned'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, filter, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', {
        params: { page, filter, search, limit: 20 },
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Mock data
      setUsers([
        { id: '1', email: 'jean@example.com', firstName: 'Jean', lastName: 'Dupont', role: 'user', plan: 'pro', drawsCount: 15, createdAt: '2024-01-15', lastLoginAt: '2024-01-28', isBanned: false },
        { id: '2', email: 'marie@example.com', firstName: 'Marie', lastName: 'Martin', role: 'user', plan: 'free', drawsCount: 3, createdAt: '2024-01-20', lastLoginAt: '2024-01-27', isBanned: false },
        { id: '3', email: 'paul@example.com', firstName: 'Paul', lastName: 'Bernard', role: 'user', plan: 'pro', drawsCount: 28, createdAt: '2024-01-10', lastLoginAt: '2024-01-28', isBanned: false },
        { id: '4', email: 'sophie@example.com', firstName: 'Sophie', lastName: 'Petit', role: 'user', plan: 'free', drawsCount: 1, createdAt: '2024-01-25', lastLoginAt: '2024-01-26', isBanned: true },
      ]);
      setTotalPages(5);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Utilisateur',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-ink-muted text-sm">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (user: User) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          user.plan === 'pro' 
            ? 'bg-accent-primary/20 text-accent-primary'
            : 'bg-bg-hover text-ink-muted'
        }`}>
          {user.plan === 'pro' ? '⭐ Pro' : 'Free'}
        </span>
      ),
    },
    {
      key: 'drawsCount',
      label: 'Tirages',
      render: (user: User) => (
        <span className="text-ink-secondary">{user.drawsCount}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Inscription',
      render: (user: User) => (
        <span className="text-ink-muted text-sm">
          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (user: User) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          user.isBanned 
            ? 'bg-red-500/20 text-red-400'
            : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {user.isBanned ? '🚫 Banni' : '✓ Actif'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/users/${user.id}`);
          }}
          className="px-4 py-2 bg-bg-hover rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-accent-primary/20 transition-colors"
        >
          Voir →
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par email ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-primary placeholder-ink-muted focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'free', 'pro', 'banned'] as const).map((f) => (
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
              {f === 'free' && 'Free'}
              {f === 'pro' && 'Pro'}
              {f === 'banned' && 'Bannis'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="Aucun utilisateur trouvé"
      />
    </div>
  );
};

export default AdminUsersPage;

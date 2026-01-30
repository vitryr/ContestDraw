import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
  { path: '/admin/draws', label: 'Tirages', icon: '🎲' },
  { path: '/admin/payments', label: 'Paiements', icon: '💳' },
  { path: '/admin/promo-codes', label: 'Codes Promo', icon: '🎫' },
  { path: '/admin/stats', label: 'Statistiques', icon: '📈' },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-void flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-bg-primary border-r border-bg-hover transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-bg-hover">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            {sidebarOpen && (
              <span className="text-xl font-bold text-ink-primary">
                Cleack <span className="text-accent-primary">Admin</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/admin' && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-ink-primary border-l-4 border-accent-primary'
                        : 'text-ink-secondary hover:bg-bg-hover hover:text-ink-primary'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-bg-hover text-ink-muted hover:text-ink-primary transition-colors"
        >
          {sidebarOpen ? '◀️' : '▶️'}
        </button>

        {/* User info */}
        <div className="p-4 border-t border-bg-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-ink-primary font-medium">{user?.firstName || 'Admin'}</p>
                <p className="text-ink-muted text-sm">Administrateur</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-bg-primary border-b border-bg-hover px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-ink-primary">
            {navItems.find((item) => 
              location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            )?.label || 'Admin'}
          </h1>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-ink-secondary hover:text-ink-primary transition-colors"
            >
              ← Retour à l'app
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

import React from 'react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  gradient?: 'pink' | 'purple' | 'green' | 'blue' | 'gold';
}

const gradients = {
  pink: 'from-accent-primary to-pink-600',
  purple: 'from-accent-secondary to-accent-tertiary',
  green: 'from-emerald-500 to-green-600',
  blue: 'from-blue-500 to-indigo-600',
  gold: 'from-amber-400 to-yellow-500',
};

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs mois dernier',
  icon,
  gradient = 'purple',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-bg-card border border-bg-hover rounded-xl p-6 hover:border-accent-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-emerald-500/20 text-emerald-400'
                : isNegative
                ? 'bg-red-500/20 text-red-400'
                : 'bg-bg-hover text-ink-muted'
            }`}
          >
            {isPositive && '+'}
            {change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-ink-muted text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-ink-primary">{value}</p>
        {change !== undefined && (
          <p className="text-ink-muted text-xs mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;

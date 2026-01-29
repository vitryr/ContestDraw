import React from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée',
  onRowClick,
  pagination,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-bg-card border border-bg-hover rounded-xl overflow-hidden">
        <div className="animate-pulse p-8">
          <div className="h-8 bg-bg-hover rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-hover rounded mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-bg-hover rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-hover">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-4 text-left text-sm font-medium text-ink-muted uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-ink-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-bg-hover last:border-0 ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-bg-hover transition-colors'
                      : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-6 py-4 text-ink-primary"
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-bg-hover flex items-center justify-between">
          <p className="text-ink-muted text-sm">
            Page {pagination.page} sur {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 rounded-lg bg-bg-hover text-ink-secondary hover:text-ink-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 rounded-lg bg-bg-hover text-ink-secondary hover:text-ink-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;

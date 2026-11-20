import { Search, X } from 'lucide-react';
import { Priority, PriorityFilter } from '../types';

interface ActivityFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
}

const PRIORITY_OPTIONS: Array<{ id: PriorityFilter; label: string }> = [
  { id: 'todas', label: 'Todas' },
  { id: 'alta', label: 'Alta' },
  { id: 'media', label: 'Media' },
  { id: 'baja', label: 'Baja' },
];

export function formatPriorityLabel(priority: Priority): string {
  if (priority === 'alta') return 'Prioridad alta';
  if (priority === 'media') return 'Prioridad media';
  return 'Prioridad baja';
}

export function getPriorityTextClass(priority: Priority): string {
  if (priority === 'alta') return 'text-red-700';
  if (priority === 'media') return 'text-amber-800';
  return 'text-slate-600';
}

export function ActivityFilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
}: ActivityFilterBarProps) {
  return (
    <section
      aria-label="Buscar y filtrar actividades"
      className="bg-white rounded-2xl border border-slate-200 p-3 space-y-2.5"
    >
      <div className="relative flex items-center">
        <Search
          className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar actividades por nombre o tema..."
          aria-label="Buscar actividades"
          className="w-full min-h-[46px] pl-10 pr-10 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-blue-600"
        />
        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-1 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div>
        <span className="block text-[11px] font-semibold text-slate-500 mb-1.5 px-0.5">
          Filtrar por prioridad
        </span>
        <div
          role="tablist"
          aria-label="Filtrar actividades por prioridad"
          className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl"
        >
          {PRIORITY_OPTIONS.map((opt) => {
            const isActive = priorityFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onPriorityChange(opt.id)}
                className={`min-h-[40px] px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

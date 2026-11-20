import { Plus } from 'lucide-react';
import { TabId } from '../types';

interface TopBarProps {
  activeTab: TabId;
  onPrimaryAction: () => void;
}

const TAB_TITLES: Record<TabId, string> = {
  inicio: 'Mi Agenda',
  calendario: 'Calendario',
  tareas: 'Mis Tareas',
  notas: 'Mis Notas',
  progreso: 'Mi Progreso',
};

function getActionLabel(tab: TabId): string {
  if (tab === 'calendario') return 'Nueva clase';
  if (tab === 'notas') return 'Nueva nota';
  return 'Nueva tarea';
}

export function TopBar({ activeTab, onPrimaryAction }: TopBarProps) {
  return (
    <header className="shrink-0 z-30 bg-white border-b border-slate-200">
      <div className="h-13 px-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-blue-700 leading-none truncate">
            Curso Google AI Studio
          </p>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight truncate mt-0.5">
            {TAB_TITLES[activeTab]}
          </h1>
        </div>

        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{getActionLabel(activeTab)}</span>
        </button>
      </div>
    </header>
  );
}

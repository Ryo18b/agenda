import { BarChart3, Calendar, CheckSquare, FileText, Home } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const TABS: Array<{ id: TabId; label: string; icon: typeof Home }> = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'notas', label: 'Notas', icon: FileText },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="shrink-0 z-40 bg-white border-t border-slate-200"
    >
      <div className="grid grid-cols-5 items-center h-15 px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[48px] w-full rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer ${
                isActive ? 'text-blue-700 bg-blue-50/70' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon
                className="w-5 h-5 shrink-0"
                strokeWidth={isActive ? 2.4 : 1.9}
                aria-hidden="true"
              />
              <span
                className={`text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-blue-700' : 'font-medium text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div aria-hidden="true" className="pb-2 pt-0.5 flex justify-center">
        <div className="w-28 h-1 rounded-full bg-slate-300" />
      </div>
    </nav>
  );
}

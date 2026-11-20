import { useState } from 'react';
import { CheckCircle2, Clock, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { CourseTask, PriorityFilter } from '../types';
import { formatDateShortES } from '../utils/dateUtils';
import {
  ActivityFilterBar,
  formatPriorityLabel,
  getPriorityTextClass,
} from './ActivityFilterBar';

interface TasksViewProps {
  tasks: CourseTask[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  onResetFilters: () => void;
  onAddTask: () => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

type TaskFilter = 'todas' | 'pendientes' | 'completadas';

export function TasksView({
  tasks,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  onResetFilters,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TasksViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('todas');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilter = normalizedQuery.length > 0 || priorityFilter !== 'todas';

  const matchesSearchAndPriority = (t: CourseTask) => {
    const priorityOk = priorityFilter === 'todas' || t.priority === priorityFilter;
    if (!priorityOk) return false;
    if (!normalizedQuery) return true;
    return (
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.module.toLowerCase().includes(normalizedQuery) ||
      t.description.toLowerCase().includes(normalizedQuery)
    );
  };

  const baseTasks = tasks.filter(matchesSearchAndPriority);
  const pendingCount = baseTasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = baseTasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...baseTasks]
    .filter((t) => {
      if (filter === 'pendientes') return t.status === 'pendiente';
      if (filter === 'completadas') return t.status === 'completada';
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pendiente' ? -1 : 1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onAddTask}
        className="min-h-[50px] w-full px-4 py-3 rounded-xl bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>Agregar nueva tarea</span>
      </button>

      <ActivityFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        priorityFilter={priorityFilter}
        onPriorityChange={onPriorityChange}
      />

      <div
        role="tablist"
        aria-label="Filtrar tareas por estado"
        className="grid grid-cols-3 p-1 bg-slate-200/80 rounded-xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'todas'}
          onClick={() => setFilter('todas')}
          className={`min-h-[44px] px-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
            filter === 'todas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todas ({baseTasks.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'pendientes'}
          onClick={() => setFilter('pendientes')}
          className={`min-h-[44px] px-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
            filter === 'pendientes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'completadas'}
          onClick={() => setFilter('completadas')}
          className={`min-h-[44px] px-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
            filter === 'completadas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hechas ({completedCount})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
          <p className="text-base font-semibold text-slate-800">
            {hasActiveFilter
              ? 'No hay actividades que coincidan con el filtro'
              : filter === 'pendientes'
                ? 'No tienes tareas pendientes'
                : filter === 'completadas'
                  ? 'Aún no has completado tareas'
                  : 'No hay tareas registradas'}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {hasActiveFilter
              ? 'Cambia la prioridad o borra el texto de búsqueda para ver más tareas.'
              : 'Agrega una actividad de tu curso de Google AI Studio.'}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 min-h-[44px] w-full px-4 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completada';
            return (
              <article
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-semibold tabular-nums ${
                    isDone ? 'text-emerald-800' : 'text-amber-800'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {isDone ? 'Completada' : 'Pendiente'} · {formatDateShortES(task.dueDate)} ·{' '}
                    <span className={getPriorityTextClass(task.priority)}>
                      {formatPriorityLabel(task.priority)}
                    </span>
                  </span>
                </div>

                <h2
                  className={`text-base font-bold mt-1.5 leading-snug ${
                    isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.name}
                </h2>

                <p className="text-xs font-medium text-slate-500 mt-1">{task.module}</p>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {task.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`min-h-[48px] w-full px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer ${
                      isDone
                        ? 'border border-slate-300 bg-white text-slate-800'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Marcar como pendiente</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Marcar como completada</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-red-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

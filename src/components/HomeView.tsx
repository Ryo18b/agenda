import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask, PriorityFilter, TabId } from '../types';
import { formatDateLongES, formatRelativeDayES, getTodayISO } from '../utils/dateUtils';
import {
  ActivityFilterBar,
  formatPriorityLabel,
  getPriorityTextClass,
} from './ActivityFilterBar';

interface HomeViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  onResetFilters: () => void;
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: () => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function HomeView({
  classes,
  tasks,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  onResetFilters,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: HomeViewProps) {
  const today = getTodayISO();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilter = normalizedQuery.length > 0 || priorityFilter !== 'todas';

  const matchesClass = (cls: CourseClass) => {
    const priorityOk = priorityFilter === 'todas' || cls.priority === priorityFilter;
    if (!priorityOk) return false;
    if (!normalizedQuery) return true;
    return (
      cls.title.toLowerCase().includes(normalizedQuery) ||
      cls.module.toLowerCase().includes(normalizedQuery) ||
      cls.instructorNote.toLowerCase().includes(normalizedQuery)
    );
  };

  const matchesTask = (task: CourseTask) => {
    const priorityOk = priorityFilter === 'todas' || task.priority === priorityFilter;
    if (!priorityOk) return false;
    if (!normalizedQuery) return true;
    return (
      task.name.toLowerCase().includes(normalizedQuery) ||
      task.module.toLowerCase().includes(normalizedQuery) ||
      task.description.toLowerCase().includes(normalizedQuery)
    );
  };

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today && matchesClass(c))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente' && matchesTask(t))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const totalUpcomingCount = classes.filter((c) => c.date >= today).length;
  const totalPendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  return (
    <div className="space-y-5">
      <ActivityFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        priorityFilter={priorityFilter}
        onPriorityChange={onPriorityChange}
      />

      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-blue-700">{formatDateLongES(today)}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
          Tu resumen de estudio
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('calendario')}
            className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors cursor-pointer min-h-[84px]"
          >
            <span className="block text-xs font-medium text-slate-600">Próximas clases</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {totalUpcomingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors cursor-pointer min-h-[84px]"
          >
            <span className="block text-xs font-medium text-slate-600">Tareas pendientes</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {totalPendingCount}
            </span>
            <span className="block text-[11px] text-slate-500 tabular-nums mt-0.5">
              {completedCount} completadas
            </span>
          </button>
        </div>

        <div className="mt-3.5 space-y-2.5">
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] w-full px-4 py-3 rounded-xl bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Agregar nueva tarea</span>
          </button>
          <button
            type="button"
            onClick={onAddClass}
            className="min-h-[48px] w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-base font-semibold hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarPlus className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Agregar nueva clase</span>
          </button>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="home-upcoming-classes">
        <div className="flex items-center justify-between gap-2">
          <h2 id="home-upcoming-classes" className="text-lg font-bold text-slate-900">
            Próximas clases
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('calendario')}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 cursor-pointer whitespace-nowrap"
          >
            <span>Ver calendario</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {upcomingClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-base font-semibold text-slate-800">
              {hasActiveFilter
                ? 'No hay clases que coincidan con el filtro'
                : 'No tienes clases próximas'}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {hasActiveFilter
                ? 'Prueba cambiando la búsqueda o la prioridad seleccionada.'
                : 'Agrega una sesión de Google AI Studio para organizarla aquí.'}
            </p>
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 min-h-[44px] w-full px-4 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold cursor-pointer"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={onAddClass}
                className="mt-4 min-h-[48px] w-full px-4 rounded-xl bg-blue-700 text-white text-sm font-semibold cursor-pointer"
              >
                Agregar clase
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <article
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <p className="text-xs font-semibold text-blue-700 tabular-nums">
                  {formatRelativeDayES(cls.date)} · {cls.startTime} – {cls.endTime} ·{' '}
                  <span className={getPriorityTextClass(cls.priority)}>
                    {formatPriorityLabel(cls.priority)}
                  </span>
                </p>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {cls.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {cls.module} · {cls.format}
                </p>
                {cls.instructorNote && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {cls.instructorNote}
                  </p>
                )}

                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onEditClass(cls)}
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClass(cls)}
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-red-700 hover:bg-red-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="home-pending-tasks">
        <div className="flex items-center justify-between gap-2">
          <h2 id="home-pending-tasks" className="text-lg font-bold text-slate-900">
            Tareas pendientes
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 cursor-pointer whitespace-nowrap"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-base font-semibold text-slate-800">
              {hasActiveFilter
                ? 'No hay tareas pendientes con ese filtro'
                : 'Todas tus tareas están completadas'}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {hasActiveFilter
                ? 'Cambia la prioridad o borra el texto de búsqueda para ver más tareas.'
                : 'Buen trabajo. Puedes agregar una nueva tarea cuando quieras.'}
            </p>
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 min-h-[44px] w-full px-4 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold cursor-pointer"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={onAddTask}
                className="mt-4 min-h-[48px] w-full px-4 rounded-xl bg-blue-700 text-white text-sm font-semibold cursor-pointer"
              >
                Crear nueva tarea
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <article
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 tabular-nums">
                  <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    Pendiente · Entrega: {formatRelativeDayES(task.dueDate)} ·{' '}
                    <span className={getPriorityTextClass(task.priority)}>
                      {formatPriorityLabel(task.priority)}
                    </span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                  {task.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {task.description}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="min-h-[48px] w-full px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Marcar completada</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-red-700 hover:bg-red-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

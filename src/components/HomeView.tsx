import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask, TabId } from '../types';
import { formatDateLongES, formatRelativeDayES, getTodayISO } from '../utils/dateUtils';

interface HomeViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
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

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  return (
    <div className="space-y-6">
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
              {upcomingClasses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors cursor-pointer min-h-[84px]"
          >
            <span className="block text-xs font-medium text-slate-600">Tareas pendientes</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {pendingTasks.length}
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
              No tienes clases próximas
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Agrega una sesión de Google AI Studio para organizarla aquí.
            </p>
            <button
              type="button"
              onClick={onAddClass}
              className="mt-4 min-h-[48px] w-full px-4 rounded-xl bg-blue-700 text-white text-sm font-semibold cursor-pointer"
            >
              Agregar clase
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <article
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <p className="text-xs font-semibold text-blue-700 tabular-nums">
                  {formatRelativeDayES(cls.date)} · {cls.startTime} – {cls.endTime} · {cls.format}
                </p>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {cls.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{cls.module}</p>
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
            <p className="text-base font-semibold text-emerald-800">
              Todas tus tareas están completadas
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Buen trabajo. Puedes agregar una nueva tarea cuando quieras.
            </p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-4 min-h-[48px] w-full px-4 rounded-xl bg-blue-700 text-white text-sm font-semibold cursor-pointer"
            >
              Crear nueva tarea
            </button>
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
                  <span>Pendiente · Entrega: {formatRelativeDayES(task.dueDate)}</span>
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

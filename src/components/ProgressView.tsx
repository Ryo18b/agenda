import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { CourseClass, CourseNote, CourseTask, TabId } from '../types';
import { formatDateShortES } from '../utils/dateUtils';

interface ProgressViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
  onToggleTaskStatus: (taskId: string) => void;
  onNavigate: (tab: TabId) => void;
  onRequestResetSample: () => void;
}

export function ProgressView({
  classes,
  tasks,
  notes,
  onToggleTaskStatus,
  onNavigate,
  onRequestResetSample,
}: ProgressViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');

  const percentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-xl font-bold text-slate-900 tabular-nums">
              {percentage}%
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 tabular-nums leading-snug">
              {completedTasks.length} de {totalTasks}{' '}
              {totalTasks === 1 ? 'tarea completada' : 'tareas completadas'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {totalTasks === 0
                ? 'Agrega tareas para medir tu avance.'
                : pendingTasks.length === 0
                  ? 'Has completado todas tus tareas.'
                  : `Te ${pendingTasks.length === 1 ? 'queda' : 'quedan'} ${pendingTasks.length} por entregar.`}
            </p>
          </div>
        </div>

        <div className="mt-4 w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-700 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-semibold text-emerald-800">Completadas</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
              {completedTasks.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-semibold text-amber-800">Pendientes</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
              {pendingTasks.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-semibold text-slate-600">Clases</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
              {classes.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-semibold text-slate-600">Notas</span>
            <span className="block text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
              {notes.length}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" aria-hidden="true" />
            <span>Pendientes ({pendingTasks.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="min-h-[44px] px-2 text-sm font-semibold text-blue-700 cursor-pointer"
          >
            Ver tareas
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <p className="text-sm text-slate-600 pt-3">No tienes tareas pendientes.</p>
        ) : (
          <ul className="divide-y divide-slate-100 mt-1">
            {pendingTasks.map((task) => (
              <li key={task.id} className="py-3 space-y-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.name}</p>
                  <p className="text-xs text-slate-600 tabular-nums mt-0.5">
                    Entrega: {formatDateShortES(task.dueDate)} · {task.module}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleTaskStatus(task.id)}
                  className="min-h-[44px] w-full px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  Marcar como completada
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="pb-2.5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
            <span>Completadas ({completedTasks.length})</span>
          </h2>
        </div>

        {completedTasks.length === 0 ? (
          <p className="text-sm text-slate-600 pt-3">
            Todavía no has completado ninguna tarea.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 mt-1">
            {completedTasks.map((task) => (
              <li key={task.id} className="py-3 space-y-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{task.name}</p>
                  <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                    Fecha límite: {formatDateShortES(task.dueDate)} · Completada
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleTaskStatus(task.id)}
                  className="min-h-[44px] w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold cursor-pointer"
                >
                  Volver a pendiente
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Datos de ejemplo del curso</h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Restaura las clases, tareas y apuntes iniciales de Google AI Studio si deseas reiniciar
            tu agenda.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestResetSample}
          className="min-h-[48px] w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Restaurar datos de ejemplo</span>
        </button>
      </section>
    </div>
  );
}

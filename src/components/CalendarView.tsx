import { useState } from 'react';
import {
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask } from '../types';
import {
  addDaysISO,
  formatDateLongES,
  formatWeekRangeES,
  getTodayISO,
  getWeekDaysISO,
} from '../utils/dateUtils';

interface CalendarViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClassForDate: (dateISO: string) => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTaskForDate: (dateISO: string) => void;
  onEditTask: (item: CourseTask) => void;
  onDeleteTask: (item: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

type CalendarMode = 'dia' | 'semana';

export function CalendarView({
  classes,
  tasks,
  onAddClassForDate,
  onEditClass,
  onDeleteClass,
  onAddTaskForDate,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarViewProps) {
  const today = getTodayISO();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [mode, setMode] = useState<CalendarMode>('dia');

  const weekDays = getWeekDaysISO(selectedDate);

  const countForDate = (iso: string) => {
    const classCount = classes.filter((c) => c.date === iso).length;
    const taskCount = tasks.filter((t) => t.dueDate === iso).length;
    return classCount + taskCount;
  };

  const dayClasses = classes
    .filter((c) => c.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Modo de calendario"
        className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'dia'}
          onClick={() => setMode('dia')}
          className={`min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            mode === 'dia'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Por día
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'semana'}
          onClick={() => setMode('semana')}
          className={`min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            mode === 'semana'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Por semana
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate(addDaysISO(selectedDate, -7))}
            aria-label="Semana anterior"
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white text-slate-700 active:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="text-center min-w-0">
            <p className="text-sm font-bold text-slate-900 tabular-nums truncate">
              {formatWeekRangeES(selectedDate)}
            </p>
            {selectedDate !== today && (
              <button
                type="button"
                onClick={() => setSelectedDate(today)}
                className="text-xs font-semibold text-blue-700 hover:underline py-0.5 px-2 cursor-pointer"
              >
                Volver a hoy
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(addDaysISO(selectedDate, 7))}
            aria-label="Semana siguiente"
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white text-slate-700 active:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = day.iso === selectedDate;
            const isToday = day.iso === today;
            const totalItems = countForDate(day.iso);

            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => {
                  setSelectedDate(day.iso);
                  if (mode === 'semana') setMode('dia');
                }}
                aria-label={`${day.longLabel}, ${totalItems} actividades`}
                aria-pressed={isSelected}
                className={`min-h-[64px] py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700'
                    : isToday
                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                      : 'bg-slate-50 text-slate-800 border-transparent active:bg-slate-100'
                }`}
              >
                <span
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {day.shortLabel}
                </span>
                <span className="text-base font-bold tabular-nums mt-0.5">
                  {day.dayNumber}
                </span>
                <span
                  className={`text-[10px] font-semibold tabular-nums mt-0.5 ${
                    isSelected
                      ? 'text-blue-100'
                      : totalItems > 0
                        ? 'text-blue-700'
                        : 'text-transparent'
                  }`}
                >
                  {totalItems > 0 ? totalItems : '0'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {mode === 'dia' ? (
        <section className="space-y-3.5" aria-label="Actividades del día seleccionado">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {formatDateLongES(selectedDate)}
              {selectedDate === today ? ' (Hoy)' : ''}
            </h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onAddClassForDate(selectedDate)}
                className="min-h-[48px] px-3 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Agregar clase</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Agregar tarea</span>
              </button>
            </div>
          </div>

          {dayClasses.length === 0 && dayTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <p className="text-base font-semibold text-slate-800">
                Sin actividades en este día
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Toca “Agregar clase” o “Agregar tarea” para planificar esta fecha.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayClasses.map((cls) => (
                <article
                  key={cls.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4"
                >
                  <p className="text-xs font-semibold text-blue-700 tabular-nums">
                    Clase · {cls.startTime} – {cls.endTime} · {cls.format}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{cls.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{cls.module}</p>
                  {cls.instructorNote && (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {cls.instructorNote}
                    </p>
                  )}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-red-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </article>
              ))}

              {dayTasks.map((task) => {
                const isDone = task.status === 'completada';
                return (
                  <article
                    key={task.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4"
                  >
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        isDone ? 'text-emerald-800' : 'text-amber-800'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        Tarea · {isDone ? 'Completada' : 'Pendiente'} · {task.module}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-bold mt-1 ${
                        isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`min-h-[48px] w-full px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                          isDone
                            ? 'border border-slate-300 bg-white text-slate-700'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
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
        </section>
      ) : (
        <section className="space-y-3" aria-label="Resumen semanal de actividades">
          {weekDays.map((day) => {
            const wClasses = classes
              .filter((c) => c.date === day.iso)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const wTasks = tasks.filter((t) => t.dueDate === day.iso);
            const isToday = day.iso === today;

            return (
              <div
                key={day.iso}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    {day.longLabel}
                    {isToday ? ' · Hoy' : ''}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.iso);
                      setMode('dia');
                    }}
                    className="min-h-[44px] px-2.5 rounded-xl text-xs font-semibold text-blue-700 cursor-pointer shrink-0"
                  >
                    Abrir día
                  </button>
                </div>

                {wClasses.length === 0 && wTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 pt-2.5">Sin actividades</p>
                ) : (
                  <div className="pt-2.5 space-y-3">
                    {wClasses.map((cls) => (
                      <div key={cls.id} className="space-y-2 pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                        <div>
                          <p className="text-xs font-semibold text-blue-700 tabular-nums">
                            Clase · {cls.startTime} – {cls.endTime}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 mt-0.5">{cls.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[44px] px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(cls)}
                            className="min-h-[44px] px-3 rounded-xl border border-slate-200 text-sm font-semibold text-red-700 cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}

                    {wTasks.map((task) => {
                      const isDone = task.status === 'completada';
                      return (
                        <div key={task.id} className="space-y-2 pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                          <div>
                            <p
                              className={`text-xs font-semibold ${
                                isDone ? 'text-emerald-800' : 'text-amber-800'
                              }`}
                            >
                              Tarea · {isDone ? 'Completada' : 'Pendiente'}
                            </p>
                            <p
                              className={`text-sm font-semibold mt-0.5 ${
                                isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {task.name}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className={`min-h-[44px] px-3 rounded-xl text-sm font-semibold cursor-pointer ${
                                isDone
                                  ? 'border border-slate-300 text-slate-700'
                                  : 'bg-emerald-700 text-white'
                              }`}
                            >
                              {isDone ? 'Pendiente' : 'Completar'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="min-h-[44px] px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CourseTask, Priority, TaskStatus } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  initialTask: CourseTask | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (data: Omit<CourseTask, 'id'>, existingId?: string) => void;
}

export function TaskModal({
  isOpen,
  initialTask,
  defaultDate,
  onClose,
  onSave,
}: TaskModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [module, setModule] = useState('Curso Google AI Studio');
  const [priority, setPriority] = useState<Priority>('media');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setStatus(initialTask.status);
      setModule(initialTask.module);
      setPriority(initialTask.priority || 'media');
    } else {
      setName('');
      setDescription('');
      setDueDate(defaultDate || getTodayISO());
      setStatus('pendiente');
      setModule('Módulo · Google AI Studio');
      setPriority('media');
    }
    setError('');
  }, [isOpen, initialTask, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona una fecha de entrega.');
      return;
    }
    onSave(
      {
        name: name.trim(),
        description: description.trim() || 'Sin descripción adicional.',
        dueDate,
        status,
        module: module.trim() || 'Curso Google AI Studio',
        priority,
      },
      initialTask?.id,
    );
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div className="w-full max-h-[88%] overflow-y-auto bg-white rounded-t-3xl border-t border-slate-200 shadow-xl p-4 pb-5">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <h2 id="task-modal-title" className="text-xl font-bold text-slate-900">
            {initialTask ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de tarea"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="task-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nombre de la tarea
            </label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Probar Structured Outputs en AI Studio"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Descripción
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe qué debes practicar o entregar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <div>
              <label htmlFor="task-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Fecha de entrega
              </label>
              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-2 focus:outline-blue-600"
              />
            </div>

            <div>
              <label htmlFor="task-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Módulo relacionado
              </label>
              <input
                id="task-module"
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                placeholder="Ej. Módulo 3 · Integración"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">Prioridad</span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['alta', 'media', 'baja'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`min-h-[44px] rounded-lg text-sm font-semibold capitalize transition-colors cursor-pointer ${
                    priority === level
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">Estado</span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setStatus('pendiente')}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  status === 'pendiente'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pendiente
              </button>
              <button
                type="button"
                onClick={() => setStatus('completada')}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  status === 'completada'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completada
              </button>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[48px] w-full px-3 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              {initialTask ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

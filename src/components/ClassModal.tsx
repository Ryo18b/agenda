import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CourseClass } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface ClassModalProps {
  isOpen: boolean;
  initialClass: CourseClass | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (data: Omit<CourseClass, 'id'>, existingId?: string) => void;
}

const FORMAT_OPTIONS = [
  'Clase en vivo',
  'Taller práctico',
  'Sesión grabada y dudas',
  'Proyecto final',
];

export function ClassModal({
  isOpen,
  initialClass,
  defaultDate,
  onClose,
  onSave,
}: ClassModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [format, setFormat] = useState('Clase en vivo');
  const [instructorNote, setInstructorNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialClass) {
      setTitle(initialClass.title);
      setModule(initialClass.module);
      setDate(initialClass.date);
      setStartTime(initialClass.startTime);
      setEndTime(initialClass.endTime);
      setFormat(initialClass.format);
      setInstructorNote(initialClass.instructorNote);
    } else {
      setTitle('');
      setModule('Módulo 1 · Google AI Studio');
      setDate(defaultDate || getTodayISO());
      setStartTime('18:00');
      setEndTime('19:15');
      setFormat('Clase en vivo');
      setInstructorNote('');
    }
    setError('');
  }, [isOpen, initialClass, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la clase.');
      return;
    }
    if (!date) {
      setError('Selecciona una fecha para la clase.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        module: module.trim() || 'Curso Google AI Studio',
        date,
        startTime: startTime || '18:00',
        endTime: endTime || '19:00',
        format,
        instructorNote: instructorNote.trim(),
      },
      initialClass?.id,
    );
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="class-modal-title"
    >
      <div className="w-full max-h-[88%] overflow-y-auto bg-white rounded-t-3xl border-t border-slate-200 shadow-xl p-4 pb-5">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <h2 id="class-modal-title" className="text-xl font-bold text-slate-900">
            {initialClass ? 'Editar clase' : 'Nueva clase'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de clase"
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
            <label htmlFor="class-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nombre de la clase
            </label>
            <input
              id="class-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Prompts estructurados en AI Studio"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <div>
              <label htmlFor="class-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Módulo o tema
              </label>
              <input
                id="class-module"
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                placeholder="Ej. Módulo 2 · Prompting"
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
              />
            </div>

            <div>
              <label htmlFor="class-format" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Modalidad
              </label>
              <select
                id="class-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-2 focus:outline-blue-600"
              >
                {FORMAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label htmlFor="class-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Fecha
              </label>
              <input
                id="class-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-2 focus:outline-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

            <div>
              <label htmlFor="class-start" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Hora inicio
              </label>
              <input
                id="class-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-2 focus:outline-blue-600"
              />
            </div>

            <div>
              <label htmlFor="class-end" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Hora fin
              </label>
              <input
                id="class-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-2 focus:outline-blue-600"
              />
            </div>
            </div>
          </div>

          <div>
            <label htmlFor="class-note" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Indicaciones previas (opcional)
            </label>
            <textarea
              id="class-note"
              rows={3}
              value={instructorNote}
              onChange={(e) => setInstructorNote(e.target.value)}
              placeholder="Material necesario o temas a preparar antes de la sesión"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
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
              {initialClass ? 'Guardar cambios' : 'Guardar clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

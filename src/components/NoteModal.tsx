import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CourseNote } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface NoteModalProps {
  isOpen: boolean;
  initialNote: CourseNote | null;
  onClose: () => void;
  onSave: (data: Omit<CourseNote, 'id'>, existingId?: string) => void;
}

const SUGGESTED_TOPICS = [
  'Modelos y Parámetros',
  'Diseño de Prompts',
  'Integración y Seguridad',
  'Multimodalidad',
  'General',
];

export function NoteModal({ isOpen, initialNote, onClose, onSave }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Diseño de Prompts');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialNote) {
      setTitle(initialNote.title);
      setTopic(initialNote.topic);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setTopic('Diseño de Prompts');
      setContent('');
    }
    setError('');
  }, [isOpen, initialNote]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu apunte.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de la nota.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        topic: topic.trim() || 'General',
        content: content.trim(),
        updatedAt: getTodayISO(),
      },
      initialNote?.id,
    );
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div className="w-full max-h-[88%] overflow-y-auto bg-white rounded-t-3xl border-t border-slate-200 shadow-xl p-4 pb-5">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <h2 id="note-modal-title" className="text-xl font-bold text-slate-900">
            {initialNote ? 'Editar nota' : 'Nueva nota'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de nota"
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
            <label htmlFor="note-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Título del apunte
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Cómo usar Function Calling con Gemini"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
          </div>

          <div>
            <label htmlFor="note-topic" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Tema del curso
            </label>
            <input
              id="note-topic"
              type="text"
              list="note-topic-suggestions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Diseño de Prompts"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
            />
            <datalist id="note-topic-suggestions">
              {SUGGESTED_TOPICS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="note-content" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Contenido del apunte
            </label>
            <textarea
              id="note-content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Anota ideas clave, ejemplos de prompts o recordatorios de clase"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-2 focus:outline-blue-600"
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
              {initialNote ? 'Guardar cambios' : 'Guardar nota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

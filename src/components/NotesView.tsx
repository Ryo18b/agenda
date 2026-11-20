import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CourseNote } from '../types';
import { formatDateShortES } from '../utils/dateUtils';

interface NotesViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (note: CourseNote) => void;
  onDeleteNote: (note: CourseNote) => void;
}

export function NotesView({ notes, onAddNote, onEditNote, onDeleteNote }: NotesViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('Todas');

  const topics = ['Todas', ...Array.from(new Set(notes.map((n) => n.topic)))];

  const visibleNotes =
    selectedTopic === 'Todas' || !topics.includes(selectedTopic)
      ? notes
      : notes.filter((n) => n.topic === selectedTopic);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onAddNote}
        className="min-h-[50px] w-full px-4 py-3 rounded-xl bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>Agregar nueva nota</span>
      </button>

      {topics.length > 1 && (
        <div
          role="tablist"
          aria-label="Filtrar notas por tema"
          className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4"
        >
          {topics.map((topic) => {
            const isSelected =
              selectedTopic === topic ||
              (selectedTopic !== 'Todas' && !topics.includes(selectedTopic) && topic === 'Todas');
            return (
              <button
                key={topic}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTopic(topic)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      )}

      {visibleNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
          <p className="text-base font-semibold text-slate-800">
            No tienes apuntes en esta categoría
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Guarda resúmenes de prompts, parámetros de Gemini o ideas de clase.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200 p-4"
            >
              <p className="text-xs font-semibold text-blue-700 tabular-nums">
                {note.topic} · {formatDateShortES(note.updatedAt)}
              </p>
              <h2 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                {note.title}
              </h2>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                {note.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-red-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { AlertTriangle, X } from 'lucide-react';
import { DeleteTarget } from '../types';

interface ConfirmDeleteModalProps {
  target: DeleteTarget | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ target, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  if (!target) return null;

  const isReset = target.kind === 'reset';

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full bg-white rounded-t-3xl border-t border-slate-200 shadow-xl p-4 pb-5">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
                {isReset ? 'Restaurar datos de ejemplo' : 'Confirmar eliminación'}
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isReset
                  ? 'Se volverán a cargar las clases, tareas y apuntes iniciales del curso de Google AI Studio. Los cambios actuales se reemplazarán.'
                  : `¿Seguro que quieres eliminar "${target.label}"? Esta acción no se puede deshacer.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar ventana"
            className="min-h-[44px] min-w-[44px] -mt-1 -mr-1 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] w-full px-3 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            {isReset ? 'Restaurar' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

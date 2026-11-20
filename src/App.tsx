import { useEffect, useRef, useState } from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { ClassModal } from './components/ClassModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { HomeView } from './components/HomeView';
import { NoteModal } from './components/NoteModal';
import { NotesView } from './components/NotesView';
import { ProgressView } from './components/ProgressView';
import { TaskModal } from './components/TaskModal';
import { TasksView } from './components/TasksView';
import { TopBar } from './components/TopBar';
import { createInitialAgendaData } from './data/initialData';
import {
  AgendaState,
  CourseClass,
  CourseNote,
  CourseTask,
  DeleteTarget,
  PriorityFilter,
  TabId,
} from './types';

const STORAGE_KEY = 'mi-agenda-aprendizaje-v1';

function loadInitialState(): AgendaState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AgendaState>;
      if (
        Array.isArray(parsed.classes) &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.notes)
      ) {
        return {
          classes: parsed.classes.map((c) => ({ ...c, priority: c.priority || 'media' })),
          tasks: parsed.tasks.map((t) => ({ ...t, priority: t.priority || 'media' })),
          notes: parsed.notes,
        };
      }
    }
  } catch {
    // Fallback to initial sample data if localStorage is unavailable or malformed
  }
  return createInitialAgendaData();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getFormattedTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function App() {
  const [agenda, setAgenda] = useState<AgendaState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('todas');
  const [clock, setClock] = useState<string>(getFormattedTime);
  const mainRef = useRef<HTMLElement | null>(null);

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [defaultClassDate, setDefaultClassDate] = useState<string | undefined>(undefined);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CourseTask | null>(null);
  const [defaultTaskDate, setDefaultTaskDate] = useState<string | undefined>(undefined);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CourseNote | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(agenda));
    } catch {
      // Ignore storage quota errors silently
    }
  }, [agenda]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(getFormattedTime());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const openNewClass = (dateISO?: string) => {
    setEditingClass(null);
    setDefaultClassDate(dateISO);
    setClassModalOpen(true);
  };

  const openEditClass = (item: CourseClass) => {
    setEditingClass(item);
    setDefaultClassDate(undefined);
    setClassModalOpen(true);
  };

  const handleSaveClass = (data: Omit<CourseClass, 'id'>, existingId?: string) => {
    setAgenda((prev) => {
      if (existingId) {
        return {
          ...prev,
          classes: prev.classes.map((c) => (c.id === existingId ? { ...data, id: existingId } : c)),
        };
      }
      return {
        ...prev,
        classes: [...prev.classes, { ...data, id: generateId('cls') }],
      };
    });
    setClassModalOpen(false);
    setEditingClass(null);
  };

  const openNewTask = (dateISO?: string) => {
    setEditingTask(null);
    setDefaultTaskDate(dateISO);
    setTaskModalOpen(true);
  };

  const openEditTask = (item: CourseTask) => {
    setEditingTask(item);
    setDefaultTaskDate(undefined);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (data: Omit<CourseTask, 'id'>, existingId?: string) => {
    setAgenda((prev) => {
      if (existingId) {
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === existingId ? { ...data, id: existingId } : t)),
        };
      }
      return {
        ...prev,
        tasks: [...prev.tasks, { ...data, id: generateId('tsk') }],
      };
    });
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setAgenda((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'completada' ? 'pendiente' : 'completada' }
          : t,
      ),
    }));
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  const openEditNote = (item: CourseNote) => {
    setEditingNote(item);
    setNoteModalOpen(true);
  };

  const handleSaveNote = (data: Omit<CourseNote, 'id'>, existingId?: string) => {
    setAgenda((prev) => {
      if (existingId) {
        return {
          ...prev,
          notes: prev.notes.map((n) => (n.id === existingId ? { ...data, id: existingId } : n)),
        };
      }
      return {
        ...prev,
        notes: [{ ...data, id: generateId('not') }, ...prev.notes],
      };
    });
    setNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'class') {
      setAgenda((prev) => ({
        ...prev,
        classes: prev.classes.filter((c) => c.id !== deleteTarget.id),
      }));
    } else if (deleteTarget.kind === 'task') {
      setAgenda((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== deleteTarget.id),
      }));
    } else if (deleteTarget.kind === 'note') {
      setAgenda((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== deleteTarget.id),
      }));
    } else if (deleteTarget.kind === 'reset') {
      setAgenda(createInitialAgendaData());
    }
    setDeleteTarget(null);
  };

  const handleTopBarPrimaryAction = () => {
    if (activeTab === 'calendario') {
      openNewClass();
    } else if (activeTab === 'notas') {
      openNewNote();
    } else {
      openNewTask();
    }
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('todas');
  };

  return (
    <div className="min-h-dvh bg-slate-200 px-2 py-3 sm:p-5 flex flex-col items-center overflow-y-auto">
      {/* Marco exterior de teléfono celular */}
      <div className="my-auto relative w-full max-w-[460px] h-[900px] sm:h-[980px] shrink-0 bg-slate-900 rounded-[44px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-slate-700/80">
        {/* Botones laterales del teléfono */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-1 top-32 w-1 h-10 bg-slate-800 rounded-l-md"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-1 top-46 w-1 h-14 bg-slate-800 rounded-l-md"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-1 top-64 w-1 h-14 bg-slate-800 rounded-l-md"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -right-1 top-40 w-1 h-16 bg-slate-800 rounded-r-md"
        />

        {/* Pantalla interior del teléfono */}
        <div className="relative w-full h-full bg-slate-50 text-slate-900 rounded-[32px] sm:rounded-[36px] overflow-hidden flex flex-col">
          {/* Barra superior de estado del celular */}
          <div
            aria-hidden="true"
            className="shrink-0 bg-white px-5 pt-2.5 pb-1.5 flex items-center justify-between text-xs font-semibold text-slate-900 select-none"
          >
            <span className="tabular-nums w-12">{clock}</span>
            <div className="w-24 h-5 bg-slate-900 rounded-full flex items-center justify-end pr-2">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
            <div className="w-12 flex items-center justify-end gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryFull className="w-4 h-4" />
            </div>
          </div>

          <TopBar activeTab={activeTab} onPrimaryAction={handleTopBarPrimaryAction} />

          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto px-4 pt-4 pb-6 overscroll-contain"
          >
            {activeTab === 'inicio' && (
              <HomeView
                classes={agenda.classes}
                tasks={agenda.tasks}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onResetFilters={handleResetFilters}
                onNavigate={handleSelectTab}
                onAddClass={() => openNewClass()}
                onEditClass={openEditClass}
                onDeleteClass={(cls) =>
                  setDeleteTarget({ kind: 'class', id: cls.id, label: cls.title })
                }
                onAddTask={() => openNewTask()}
                onEditTask={openEditTask}
                onDeleteTask={(task) =>
                  setDeleteTarget({ kind: 'task', id: task.id, label: task.name })
                }
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            )}

            {activeTab === 'calendario' && (
              <CalendarView
                classes={agenda.classes}
                tasks={agenda.tasks}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onResetFilters={handleResetFilters}
                onAddClassForDate={(dateISO) => openNewClass(dateISO)}
                onEditClass={openEditClass}
                onDeleteClass={(cls) =>
                  setDeleteTarget({ kind: 'class', id: cls.id, label: cls.title })
                }
                onAddTaskForDate={(dateISO) => openNewTask(dateISO)}
                onEditTask={openEditTask}
                onDeleteTask={(task) =>
                  setDeleteTarget({ kind: 'task', id: task.id, label: task.name })
                }
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            )}

            {activeTab === 'tareas' && (
              <TasksView
                tasks={agenda.tasks}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onResetFilters={handleResetFilters}
                onAddTask={() => openNewTask()}
                onEditTask={openEditTask}
                onDeleteTask={(task) =>
                  setDeleteTarget({ kind: 'task', id: task.id, label: task.name })
                }
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            )}

            {activeTab === 'notas' && (
              <NotesView
                notes={agenda.notes}
                onAddNote={openNewNote}
                onEditNote={openEditNote}
                onDeleteNote={(note) =>
                  setDeleteTarget({ kind: 'note', id: note.id, label: note.title })
                }
              />
            )}

            {activeTab === 'progreso' && (
              <ProgressView
                classes={agenda.classes}
                tasks={agenda.tasks}
                notes={agenda.notes}
                onToggleTaskStatus={handleToggleTaskStatus}
                onNavigate={handleSelectTab}
                onRequestResetSample={() =>
                  setDeleteTarget({ kind: 'reset', id: 'reset', label: 'datos de ejemplo' })
                }
              />
            )}
          </main>

          <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

          {/* Modales renderizados dentro de la pantalla del teléfono */}
          <ClassModal
            isOpen={classModalOpen}
            initialClass={editingClass}
            defaultDate={defaultClassDate}
            onClose={() => setClassModalOpen(false)}
            onSave={handleSaveClass}
          />

          <TaskModal
            isOpen={taskModalOpen}
            initialTask={editingTask}
            defaultDate={defaultTaskDate}
            onClose={() => setTaskModalOpen(false)}
            onSave={handleSaveTask}
          />

          <NoteModal
            isOpen={noteModalOpen}
            initialNote={editingNote}
            onClose={() => setNoteModalOpen(false)}
            onSave={handleSaveNote}
          />

          <ConfirmDeleteModal
            target={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
    </div>
  );
}

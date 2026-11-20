export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export interface CourseClass {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  format: string; // e.g. "En vivo", "Taller práctico", "Grabada + Q&A"
  instructorNote: string;
}

export interface CourseTask {
  id: string;
  name: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: string;
}

export interface CourseNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export interface AgendaState {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
}

export type DeleteTarget =
  | { kind: 'class'; id: string; label: string }
  | { kind: 'task'; id: string; label: string }
  | { kind: 'note'; id: string; label: string }
  | { kind: 'reset'; id: 'reset'; label: string };

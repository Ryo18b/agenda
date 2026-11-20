const MONTHS_SHORT_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_LONG_ES = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const WEEKDAYS_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function toISODateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toISODateLocal(new Date());
}

export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDaysISO(iso: string, deltaDays: number): string {
  const d = parseISODateLocal(iso);
  d.setDate(d.getDate() + deltaDays);
  return toISODateLocal(d);
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateLongES(iso: string): string {
  const d = parseISODateLocal(iso);
  const weekday = capitalize(WEEKDAYS_LONG_ES[d.getDay()]);
  const day = d.getDate();
  const month = MONTHS_LONG_ES[d.getMonth()];
  return `${weekday}, ${day} de ${month}`;
}

export function formatDateShortES(iso: string): string {
  const d = parseISODateLocal(iso);
  const day = d.getDate();
  const month = MONTHS_SHORT_ES[d.getMonth()];
  return `${day} ${month} ${d.getFullYear()}`;
}

export function formatRelativeDayES(iso: string): string {
  const today = getTodayISO();
  if (iso === today) return 'Hoy';
  if (iso === addDaysISO(today, 1)) return 'Mañana';
  if (iso === addDaysISO(today, -1)) return 'Ayer';
  const d = parseISODateLocal(iso);
  const weekday = capitalize(WEEKDAYS_SHORT_ES[d.getDay()]);
  return `${weekday} ${d.getDate()} ${MONTHS_SHORT_ES[d.getMonth()]}`;
}

export function getWeekStartMondayISO(iso: string): string {
  const d = parseISODateLocal(iso);
  const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + diffToMonday);
  return toISODateLocal(d);
}

export function getWeekDaysISO(anchorISO: string): Array<{
  iso: string;
  shortLabel: string;
  dayNumber: number;
  longLabel: string;
}> {
  const monday = getWeekStartMondayISO(anchorISO);
  return Array.from({ length: 7 }, (_, idx) => {
    const iso = addDaysISO(monday, idx);
    const d = parseISODateLocal(iso);
    return {
      iso,
      shortLabel: WEEKDAYS_SHORT_ES[d.getDay()],
      dayNumber: d.getDate(),
      longLabel: formatDateLongES(iso),
    };
  });
}

export function formatWeekRangeES(anchorISO: string): string {
  const days = getWeekDaysISO(anchorISO);
  const first = parseISODateLocal(days[0].iso);
  const last = parseISODateLocal(days[6].iso);
  const firstMonth = MONTHS_SHORT_ES[first.getMonth()];
  const lastMonth = MONTHS_SHORT_ES[last.getMonth()];

  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()} al ${last.getDate()} de ${MONTHS_LONG_ES[last.getMonth()]}`;
  }
  return `${first.getDate()} ${firstMonth} al ${last.getDate()} ${lastMonth}`;
}

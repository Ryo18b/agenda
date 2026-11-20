import { AgendaState } from '../types';
import { addDaysISO, getTodayISO } from '../utils/dateUtils';

export function createInitialAgendaData(): AgendaState {
  const today = getTodayISO();

  return {
    classes: [
      {
        id: 'cls-1',
        title: 'Introducción a Google AI Studio y claves API',
        module: 'Módulo 1 · Fundamentos',
        date: today,
        startTime: '18:00',
        endTime: '19:15',
        format: 'Clase en vivo',
        instructorNote: 'Tener creada una cuenta de Google para generar tu primera API key.',
      },
      {
        id: 'cls-2',
        title: 'Diseño de prompts y System Instructions',
        module: 'Módulo 2 · Prompting',
        date: addDaysISO(today, 1),
        startTime: '18:00',
        endTime: '19:30',
        format: 'Taller práctico',
        instructorNote: 'Revisaremos ejemplos few-shot y control de formato en español.',
      },
      {
        id: 'cls-3',
        title: 'Salidas JSON con Response Schema',
        module: 'Módulo 3 · Integración',
        date: addDaysISO(today, 3),
        startTime: '17:30',
        endTime: '19:00',
        format: 'Clase en vivo',
        instructorNote: 'Cómo obtener respuestas estructuradas confiables para apps web.',
      },
      {
        id: 'cls-4',
        title: 'Análisis multimodal de imágenes y audio',
        module: 'Módulo 4 · Multimodalidad',
        date: addDaysISO(today, 5),
        startTime: '10:00',
        endTime: '11:30',
        format: 'Sesión grabada y dudas',
        instructorNote: 'Práctica guiada subiendo diagramas y notas de voz a Gemini.',
      },
      {
        id: 'cls-5',
        title: 'Seguridad de API Keys y despliegue en servidor',
        module: 'Módulo 5 · Producción',
        date: addDaysISO(today, 7),
        startTime: '18:00',
        endTime: '19:30',
        format: 'Proyecto final',
        instructorNote: 'Uso correcto de variables de entorno y rutas backend seguras.',
      },
    ],
    tasks: [
      {
        id: 'tsk-1',
        name: 'Configurar primer proyecto en Google AI Studio',
        description:
          'Entrar al panel de Google AI Studio, seleccionar el modelo Gemini 2.5 Flash y ejecutar un prompt de prueba para resumir un texto.',
        dueDate: addDaysISO(today, -1),
        status: 'completada',
        module: 'Módulo 1 · Fundamentos',
      },
      {
        id: 'tsk-2',
        name: 'Comparar parámetros Temperature y Top-P',
        description:
          'Probar el mismo prompt con temperatura 0.1 y 0.9 en AI Studio y anotar en qué casos conviene menor o mayor creatividad.',
        dueDate: today,
        status: 'completada',
        module: 'Módulo 1 · Fundamentos',
      },
      {
        id: 'tsk-3',
        name: 'Crear System Instruction para tutor de estudio',
        description:
          'Redactar instrucciones del sistema claras para que el modelo responda dudas de programación paso a paso y en español claro.',
        dueDate: addDaysISO(today, 1),
        status: 'pendiente',
        module: 'Módulo 2 · Prompting',
      },
      {
        id: 'tsk-4',
        name: 'Definir esquema JSON para extraer datos de recibos',
        description:
          'Configurar Structured Outputs con campos de fecha, comercio y total para validar que la respuesta siempre cumpla el esquema.',
        dueDate: addDaysISO(today, 3),
        status: 'pendiente',
        module: 'Módulo 3 · Integración',
      },
      {
        id: 'tsk-5',
        name: 'Probar análisis de imagen con diagrama de flujo',
        description:
          'Subir una fotografía de un diagrama dibujado a mano en AI Studio y pedir un listado ordenado de cada paso.',
        dueDate: addDaysISO(today, 5),
        status: 'pendiente',
        module: 'Módulo 4 · Multimodalidad',
      },
    ],
    notes: [
      {
        id: 'not-1',
        title: 'Cuándo elegir Gemini Flash frente a Gemini Pro',
        topic: 'Modelos y Parámetros',
        content:
          'Gemini Flash es la mejor opción para tareas rápidas, clasificación, resúmenes y chat cotidiano con menor latencia. Gemini Pro destaca en razonamiento complejo, revisión profunda de código y problemas de varios pasos.',
        updatedAt: addDaysISO(today, -1),
      },
      {
        id: 'not-2',
        title: 'Reglas clave para buenas System Instructions',
        topic: 'Diseño de Prompts',
        content:
          '1) Definir el rol y objetivo desde la primera frase. 2) Incluir 2 ejemplos reales de entrada y salida esperada (few-shot). 3) Indicar qué responder cuando falte información para evitar datos inventados.',
        updatedAt: today,
      },
      {
        id: 'not-3',
        title: 'Proteger la GEMINI_API_KEY en proyectos web',
        topic: 'Integración y Seguridad',
        content:
          'Nunca guardar la clave API en código del navegador ni subirla a repositorios públicos. Colocarla siempre en variables de entorno del servidor (.env) y hacer las llamadas desde rutas backend (/api/*).',
        updatedAt: today,
      },
    ],
  };
}

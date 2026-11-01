import type { AssistantChatListItem, AssistantThreadMessage, AssistantThreadResult } from '@autonexhub/react';

export const MOCK_ANSWER_CONVERSATIONS =
  'He encontrado 3 conversaciones de esta semana que hablan de horarios. Dos de ellas son de clientes que querían cambiar la hora de una clase y una pregunta por el horario de la piscina. Te las dejo aquí abajo para que las abras.';

export const MOCK_ANSWER_METRICS =
  'En los últimos 7 días el agente ha atendido 128 llamadas, un 12 % más que la semana anterior. El 92 % se resolvieron sin pasar a recepción y la duración media fue de 3 minutos 12 segundos.';

export const MOCK_ANSWER_UNSUPPORTED =
  'De momento solo puedo ayudarte con conversaciones y métricas de tu organización. Prueba con algo como "¿cuántas llamadas hubo ayer?" o "busca conversaciones sobre reservas".';

export const ASSISTANT_ERROR_TEXT = 'No he podido responder ahora mismo. Inténtalo de nuevo.';

export const MOCK_RESULTS_CONVERSATIONS: AssistantThreadResult[] = [
  {
    type: 'conversation',
    id: 'conv_9f2a',
    title: 'Laura Martí · WhatsApp',
    subtitle: 'Ayer 18:42 · Quería cambiar la hora de su clase de spinning',
    url: '/conversations?conversation=conv_9f2a',
  },
  {
    type: 'conversation',
    id: 'conv_7c11',
    title: 'Llamada sin identificar · Teléfono',
    subtitle: 'Ayer 12:05 · Preguntó por el horario de la piscina',
    url: '/conversations?conversation=conv_7c11',
  },
  {
    type: 'conversation',
    id: 'conv_51d0',
    title: 'Marc Vila · Web',
    subtitle: 'Hace 2 días · Pidió información para darse de alta',
    url: '/conversations?conversation=conv_51d0',
  },
];

export const MOCK_RESULTS_METRICS: AssistantThreadResult[] = [
  {
    type: 'metrics',
    title: 'Métricas de voz · últimos 7 días',
    subtitle: '128 llamadas · 92 % atendidas · 3:12 de media',
    url: '/metrics',
  },
];

export const USER_Q: AssistantThreadMessage = {
  id: 'u1',
  role: 'user',
  content: '¿Qué conversaciones de esta semana hablan de horarios?',
};

export const ANSWER_WITH_RESULTS: AssistantThreadMessage[] = [
  USER_Q,
  {
    id: 'a1',
    role: 'assistant',
    content: MOCK_ANSWER_CONVERSATIONS,
    results: MOCK_RESULTS_CONVERSATIONS,
    scope: 'ok',
    question: USER_Q.content,
  },
];

export const UNSUPPORTED_AND_ERROR: AssistantThreadMessage[] = [
  { id: 'u1', role: 'user', content: '¿Puedes crear una campaña de WhatsApp para mañana?' },
  { id: 'a1', role: 'assistant', content: MOCK_ANSWER_UNSUPPORTED, results: [], scope: 'unsupported', revealed: true },
  { id: 'u2', role: 'user', content: '¿Cuántas llamadas hubo ayer?' },
  {
    id: 'a2',
    role: 'assistant',
    content: ASSISTANT_ERROR_TEXT,
    results: [],
    scope: 'ok',
    error: true,
    question: '¿Cuántas llamadas hubo ayer?',
  },
];

export const MOCK_CHATS: AssistantChatListItem[] = [
  { id: 'chat_1', title: 'Conversaciones sobre horarios', author: 'Bruno Pegenaute', date: 'hace 35 min' },
  { id: 'chat_2', title: 'Métricas de voz de la semana', author: 'Marta Recepción', date: 'ayer' },
  { id: 'chat_3', title: 'Altas nuevas del mes', author: 'Bruno Pegenaute', date: 'hace 4 días' },
];

/** Respuesta simulada (1-2 s de espera) para las demos interactivas. */
export async function mockAssistantQuery(question: string): Promise<{
  answer: string;
  results: AssistantThreadResult[];
  scope: 'ok' | 'unsupported';
}> {
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
  const q = question.toLowerCase();
  if (/error|falla|rompe/.test(q)) throw new Error('Gateway Timeout');
  if (/m[eé]tric|llamad|cu[aá]nt|porcentaje|media|resumen de la semana/.test(q)) {
    return { answer: MOCK_ANSWER_METRICS, results: MOCK_RESULTS_METRICS, scope: 'ok' };
  }
  if (/conversaci|busca|habl|dijo|mensaje|whatsapp|cliente/.test(q)) {
    return { answer: MOCK_ANSWER_CONVERSATIONS, results: MOCK_RESULTS_CONVERSATIONS, scope: 'ok' };
  }
  return { answer: MOCK_ANSWER_UNSUPPORTED, results: [], scope: 'unsupported' };
}

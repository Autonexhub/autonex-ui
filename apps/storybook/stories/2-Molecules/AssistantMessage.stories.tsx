import type { Meta, StoryObj } from '@storybook/react';
import { AssistantMessage } from '@autonexhub/react';
import { ASSISTANT_ERROR_TEXT, MOCK_ANSWER_CONVERSATIONS, MOCK_RESULTS_CONVERSATIONS } from '../assistant-mocks';

const meta: Meta<typeof AssistantMessage> = {
  title: '2-Molecules/AssistantMessage',
  component: AssistantMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mensaje del hilo. Usuario: a la derecha en `Bubble`. Asistente: texto plano sin burbuja con cabecera (pájaro + nombre) cuando cambia el turno; revelado por palabras con `animate`; resultados como `Item`s clicables al terminar; "Reintentar" en errores.',
      },
    },
  },
  decorators: [(Story) => <div className="w-[640px] max-w-full"><Story /></div>],
  args: { onOpenResult: (r) => alert(`Navegaría a ${r.url}`) },
};
export default meta;
type Story = StoryObj<typeof AssistantMessage>;

export const Usuario: Story = {
  args: { message: { id: 'u1', role: 'user', content: '¿Qué conversaciones de esta semana hablan de horarios?' } },
};

export const AsistenteConResultados: Story = {
  args: {
    message: { id: 'a1', role: 'assistant', content: MOCK_ANSWER_CONVERSATIONS, results: MOCK_RESULTS_CONVERSATIONS, scope: 'ok', revealed: true },
  },
};

export const RevelandoPorPalabras: Story = {
  args: {
    animate: true,
    message: { id: 'a2', role: 'assistant', content: MOCK_ANSWER_CONVERSATIONS, results: MOCK_RESULTS_CONVERSATIONS, scope: 'ok' },
  },
};

export const SinCabecera: Story = {
  args: {
    showHeader: false,
    message: { id: 'a3', role: 'assistant', content: MOCK_ANSWER_CONVERSATIONS, results: [], scope: 'ok', revealed: true },
  },
};

export const ErrorConReintentar: Story = {
  args: {
    onRetry: (q) => alert(`Reenviaría: ${q}`),
    message: { id: 'a4', role: 'assistant', content: ASSISTANT_ERROR_TEXT, results: [], error: true, question: '¿Cuántas llamadas hubo ayer?', revealed: true },
  },
};

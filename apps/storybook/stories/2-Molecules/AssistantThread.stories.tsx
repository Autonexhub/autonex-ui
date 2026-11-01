import type { Meta, StoryObj } from '@storybook/react';
import { AssistantThread } from '@autonexhub/react';
import { ANSWER_WITH_RESULTS, UNSUPPORTED_AND_ERROR, USER_Q } from '../assistant-mocks';

const meta: Meta<typeof AssistantThread> = {
  title: '2-Molecules/AssistantThread',
  component: AssistantThread,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista de mensajes: `max-w-3xl mx-auto`, `aria-live="polite"`, auto-scroll al final y cabecera de rol solo al cambiar el turno. Anima únicamente el último mensaje del asistente no revelado; con `pending` añade la fila "Pensando…".',
      },
    },
  },
  decorators: [(Story) => <div className="p-6"><Story /></div>],
  args: { onOpenResult: (r) => alert(`Navegaría a ${r.url}`) },
};
export default meta;
type Story = StoryObj<typeof AssistantThread>;

export const ConResultados: Story = {
  args: { messages: ANSWER_WITH_RESULTS.map((m) => (m.role === 'assistant' ? { ...m, revealed: true } : m)) },
};
export const Pensando: Story = { args: { messages: [USER_Q], pending: true, thinkingWord: 'Pensando' } };
export const NoSoportadoYError: Story = {
  args: { messages: UNSUPPORTED_AND_ERROR, onRetry: (q) => alert(`Reenviaría: ${q}`) },
};

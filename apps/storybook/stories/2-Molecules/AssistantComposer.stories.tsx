import type { Meta, StoryObj } from '@storybook/react';
import { AssistantComposer } from '@autonexhub/react';

const meta: Meta<typeof AssistantComposer> = {
  title: '2-Molecules/AssistantComposer',
  component: AssistantComposer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Caja de chat del asistente: `Textarea` auto-crecible de 1 a 4 líneas, botón de enviar redondo (ArrowUp) activo solo con texto. Enter envía; Shift+Enter salta línea. Textos con `labels` (`placeholder`, `send`).',
      },
    },
  },
  decorators: [(Story) => <div className="w-[560px] max-w-full"><Story /></div>],
  args: { onSend: (q) => alert(`Enviado: ${q}`) },
};
export default meta;
type Story = StoryObj<typeof AssistantComposer>;

export const Default: Story = {};
export const Deshabilitado: Story = {
  name: 'Deshabilitado (el asistente responde)',
  args: { disabled: true },
};
export const TextosPersonalizados: Story = {
  args: { labels: { placeholder: 'Ask me anything…', send: 'Send' } },
};

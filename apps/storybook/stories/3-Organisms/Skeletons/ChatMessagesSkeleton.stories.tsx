import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessagesSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ChatMessagesSkeleton> = {
  title: '3-Organisms/Skeletons/ChatMessagesSkeleton',
  component: ChatMessagesSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Burbujas de chat mientras carga la transcripción: pestaña Mensajes del panel de conversación y bandeja de entrada. Alterna burbujas del contacto y del agente para que la estructura del hilo se reconozca desde el primer frame.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatMessagesSkeleton>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md rounded-xl border border-border bg-card p-4">
      <ChatMessagesSkeleton />
    </div>
  ),
};

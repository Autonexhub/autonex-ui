import type { Meta, StoryObj } from '@storybook/react';
import { ConversationDetailSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ConversationDetailSkeleton> = {
  title: '3-Organisms/Skeletons/ConversationDetailSkeleton',
  component: ConversationDetailSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Skeleton de la pestaña Resumen del panel de conversación: calca cabecera, Resumen, Notas internas y Detalles. El reproductor solo aparece en voz (prop `channel="voice"`), con la receta oficial AudioPlayerSkeleton. La pestaña Mensajes usa ChatMessagesSkeleton, no este.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConversationDetailSkeleton>;

export const Texto: Story = {};

export const Voz: Story = {
  args: { channel: 'voice' },
};

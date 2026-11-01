import type { Meta, StoryObj } from '@storybook/react';
import { DocumentAttachmentCard } from '@autonexhub/react';

const meta: Meta<typeof DocumentAttachmentCard> = {
  title: '2-Molecules/DocumentAttachmentCard',
  component: DocumentAttachmentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tarjeta de documento: icono grande + pie con el nombre del archivo y enlace para abrirlo. Diseño fijo a propósito: simple, estable al scrollear, sin visor embebido.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DocumentAttachmentCard>;

export const Default: Story = { args: { url: '#', filename: 'Presupuesto-2026.pdf' } };
export const WithoutName: Story = { args: { url: '#', filename: null } };

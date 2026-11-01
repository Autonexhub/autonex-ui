import type { Meta, StoryObj } from '@storybook/react';
import { WhatsAppPreview, WhatsAppToken } from "@autonexhub/react";

const meta: Meta<typeof WhatsAppPreview> = {
  title: '2-Molecules/WhatsAppPreview',
  component: WhatsAppPreview,
  tags: ['autodocs'],
  argTypes: {
    header: { control: 'text', description: 'Cabecera opcional en negrita.' },
    footer: { control: 'text', description: 'Pie opcional en gris.' },
    emptyLabel: { control: 'text', description: 'Texto cuando el cuerpo está vacío.' },
    time: { control: 'text', description: 'Hora simulada de la burbuja.' },
    minHeight: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Simula el mensaje tal y como lo verá el cliente en WhatsApp. Usa los colores reales de WhatsApp: excepción documentada en DesignRules (Bruno 02/09); no reutilizar esos hex fuera de la previsualización.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WhatsAppPreview>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    header: 'Cena de Navidad',
    body: 'Hola, te escribimos desde el restaurante para recordarte tu reserva de mañana a las 21:00.',
    footer: 'Responde STOP para no recibir más mensajes',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Confirmar' },
      { type: 'URL', text: 'Ver menú', url: 'https://example.com' },
    ],
  },
};

export const Vacio: Story = {
  args: { emptyLabel: 'Escribe el mensaje…' },
};

export const ConTokens: Story = {
  render: () => (
    <WhatsAppPreview
      body={
        <>
          Hola <WhatsAppToken>María</WhatsAppToken>, tu cita es el <WhatsAppToken>12/09</WhatsAppToken>.
        </>
      }
    />
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { ConversionFunnelChart } from '@autonexhub/react';

const data = [
  { step: 'Conversaciones', count: 500, percentage: 100 },
  { step: 'Con interacción', count: 380, percentage: 76 },
  { step: 'Usó herramientas', count: 210, percentage: 42 },
  { step: 'Reserva confirmada', count: 95, percentage: 19 },
];

const meta: Meta<typeof ConversionFunnelChart> = {
  title: '3-Organisms/ConversionFunnelChart',
  component: ConversionFunnelChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Embudo de conversión: un segmento por paso, abandono entre pasos (clic para ver el motivo si hay desglose) y tasa de conversión global.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  args: { data },
};

export default meta;
type Story = StoryObj<typeof ConversionFunnelChart>;

export const Default: Story = {};

export const ConMotivosDeAbandono: Story = {
  name: 'Con motivos de abandono',
  args: {
    dropoffs: {
      total_to_interaction: { 'Colgó antes de hablar': 70, 'Sin respuesta': 50 },
      interaction_to_tools: { 'Solo consulta': 120, 'Transferida': 50 },
      tools_to_booking: { 'Sin disponibilidad': 70, 'Abandono': 45 },
    },
  },
};

export const SinDatos: Story = { name: 'Sin datos', args: { data: [] } };

import type { Meta, StoryObj } from '@storybook/react';
import { ConversationOutcomeChart } from '@autonexhub/react';

const data = [
  { label: 'Reserva confirmada', count: 95, percentage: 38, color: 'var(--chart-2)' },
  { label: 'Consulta sin reserva', count: 70, percentage: 28, color: 'var(--chart-1)' },
  { label: 'Transferida a humano', count: 40, percentage: 16, color: 'var(--chart-6)' },
  { label: 'Abandono rápido', count: 30, percentage: 12, color: 'var(--chart-5)' },
  { label: 'Sin interacción', count: 15, percentage: 6, color: 'var(--muted-foreground)' },
];

const descriptions: Record<string, string> = {
  'Reserva confirmada': 'El agente completó una reserva exitosamente.',
  'Abandono rápido': 'Llamadas de menos de 15 segundos — el usuario colgó antes de interactuar.',
};

const meta: Meta<typeof ConversationOutcomeChart> = {
  title: '3-Organisms/ConversationOutcomeChart',
  component: ConversationOutcomeChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Distribución de resultados de las conversaciones: donut con el total al centro y leyenda con recuento y porcentaje. `getDescription(label)` devuelve el texto del icono de información de cada resultado.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  args: { data, total: 250, getDescription: (label) => descriptions[label] },
};

export default meta;
type Story = StoryObj<typeof ConversationOutcomeChart>;

export const Default: Story = {};

export const Cargando: Story = { args: { loading: true } };

export const SinDatos: Story = { name: 'Sin datos', args: { data: [], total: 0 } };

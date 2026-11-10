import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@autonexhub/react';

const data = [
  { name: 'Cita programada', Conversaciones: 120, Derivadas: 14 },
  { name: 'Información', Conversaciones: 95, Derivadas: 9 },
  { name: 'Problema resuelto', Conversaciones: 80, Derivadas: 6 },
  { name: 'Derivado', Conversaciones: 45, Derivadas: 45 },
  { name: 'Sin resolución', Conversaciones: 20, Derivadas: 3 },
];

const meta: Meta<typeof BarChart> = {
  title: '3-Organisms/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gráfica de barras (base Tremor) vertical u horizontal, agrupada, apilada o al 100 %, con leyenda deslizable y tooltip. Los colores salen de `chartColors` (tokens `--chart-N`).',
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
  args: {
    data,
    index: 'name',
    categories: ['Conversaciones'],
    colors: ['blue'],
    className: 'h-72',
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {};

export const Agrupada: Story = {
  args: { categories: ['Conversaciones', 'Derivadas'], colors: ['blue', 'amber'] },
};

export const Apilada: Story = {
  args: { categories: ['Conversaciones', 'Derivadas'], colors: ['blue', 'amber'], type: 'stacked' },
};

export const Horizontal: Story = { args: { layout: 'vertical', yAxisWidth: 130 } };

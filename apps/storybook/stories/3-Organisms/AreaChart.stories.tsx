import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from '@autonexhub/react';

const data = [
  { date: 'Lun', Llamadas: 45, Web: 20, WhatsApp: 15 },
  { date: 'Mar', Llamadas: 52, Web: 25, WhatsApp: 18 },
  { date: 'Mié', Llamadas: 48, Web: 22, WhatsApp: 20 },
  { date: 'Jue', Llamadas: 60, Web: 30, WhatsApp: 25 },
  { date: 'Vie', Llamadas: 55, Web: 28, WhatsApp: 22 },
  { date: 'Sáb', Llamadas: 30, Web: 15, WhatsApp: 12 },
  { date: 'Dom', Llamadas: 20, Web: 10, WhatsApp: 8 },
];

const meta: Meta<typeof AreaChart> = {
  title: '3-Organisms/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gráfica de áreas (base Tremor) con leyenda deslizable, tooltip, apilado, relleno degradado/sólido, líneas y áreas de referencia. Los colores salen de `chartColors` (tokens `--chart-N`).',
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
    index: 'date',
    categories: ['Llamadas', 'Web', 'WhatsApp'],
    colors: ['blue', 'emerald', 'violet'],
    className: 'h-72',
  },
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

export const Default: Story = {};

export const Apilada: Story = { args: { type: 'stacked' } };

export const Porcentaje: Story = {
  args: { type: 'percent', valueFormatter: (v) => `${(v * 100).toFixed(0)}%` },
};

export const RellenoSolido: Story = { args: { fill: 'solid', showDots: true } };

export const SinLeyenda: Story = { args: { showLegend: false, categories: ['Llamadas'], colors: ['blue'] } };

export const ConReferencias: Story = {
  args: {
    categories: ['Llamadas'],
    colors: ['blue'],
    referenceLines: [{ axis: 'y', value: 50, label: 'Objetivo', strokeDasharray: '4 4' }],
  },
};

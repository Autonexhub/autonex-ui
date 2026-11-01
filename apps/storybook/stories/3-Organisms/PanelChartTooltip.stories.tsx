import type { Meta, StoryObj } from '@storybook/react';
import { PanelChartTooltip } from '@autonexhub/react';

const meta: Meta<typeof PanelChartTooltip> = {
  title: '3-Organisms/PanelChartTooltip',
  component: PanelChartTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip de gráfica único del panel: misma receta visual que `ChartTooltipContent`, sin exigir `ChartContainer`. En Recharts: `content={<PanelChartTooltip />}`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PanelChartTooltip>;

export const Default: Story = {
  args: {
    active: true,
    label: 'Lunes',
    payload: [
      { name: 'Voz', value: 42, color: 'var(--chart-1)' },
      { name: 'WhatsApp', value: 31, color: 'var(--chart-2)' },
    ],
  },
};

export const WithFormatters: Story = {
  args: {
    ...Default.args,
    valueFormatter: (v) => `${v} llamadas`,
    nameFormatter: (n) => String(n).toUpperCase(),
  },
};

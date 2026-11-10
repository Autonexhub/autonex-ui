import type { Meta, StoryObj } from '@storybook/react';
import { PanelChartTooltip, PanelTooltipShell, PanelTooltipRow } from '@autonexhub/react';

const meta: Meta<typeof PanelChartTooltip> = {
  title: '3-Organisms/PanelChartTooltip',
  component: PanelChartTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip de gráfica único del panel: misma receta visual que `ChartTooltipContent`, sin exigir `ChartContainer`. En Recharts: `content={<PanelChartTooltip />}`. Para gráficas que arman sus propias filas (Finanzas) se usan las piezas `PanelTooltipShell` (caja con título y pie opcional) y `PanelTooltipRow` (muestra de color + nombre + valor; `swatch="dashed"` para series discontinuas, `strong` para totales).',
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

export const Pieces: StoryObj = {
  name: 'Piezas (Shell + Row)',
  render: () => (
    <PanelTooltipShell label="Octubre 2026" footer="Mes parcial: datos hasta el día 20">
      <PanelTooltipRow color="var(--finance-in)" name="Ingresos" value="48.200 €" />
      <PanelTooltipRow color="var(--finance-out)" name="Gastos" value="31.900 €" />
      <PanelTooltipRow color="var(--chart-1)" swatch="dashed" name="Previsión" value="52.000 €" />
      <PanelTooltipRow strong name="Resultado" value="16.300 €" />
    </PanelTooltipShell>
  ),
};

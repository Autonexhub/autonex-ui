import type { Meta, StoryObj } from '@storybook/react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartFrame, EndLabel, LegendRow, TooltipBox, todayLine } from '@autonexhub/react';

/**
 * Finanzas › kit de gráficas: las piezas comunes que usan las gráficas de caja, ARR y previsión.
 * `ChartFrame` (marco que mide antes de montar Recharts), `LegendRow` (leyenda arriba a la derecha),
 * `TooltipBox` (tooltip con filas ya formateadas), `EndLabel` (etiqueta directa al final de la serie) y `todayLine` (marca «Hoy»).
 */
const meta: Meta = {
  title: '3-Organisms/FinanceChartKit',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Todas son presentacionales: reciben textos ya formateados. `todayLine` se llama como función (`{todayLine({ x, label })}`), no como JSX, porque Recharts solo reconoce el `ReferenceLine` como hijo directo del gráfico.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const data = [
  { mes: 'jul', real: 3120, prevision: null },
  { mes: 'ago', real: 3480, prevision: null },
  { mes: 'sep', real: 3790, prevision: null },
  { mes: 'oct', real: 4124, prevision: 4124 },
  { mes: 'nov', real: null, prevision: 4390 },
  { mes: 'dic', real: null, prevision: 4710 },
];

const items = [
  { label: 'MRR real', color: 'var(--chart-1)', shape: 'line' as const },
  { label: 'Previsión', color: 'var(--chart-2)', shape: 'dashed' as const },
];

/** Gráfica completa: marco + leyenda + línea real y prevista, marca «Hoy» y etiqueta al final de cada serie. */
export const GraficaCompuesta: Story = {
  name: 'Gráfica compuesta',
  render: () => (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4">
      <LegendRow items={items} />
      <ChartFrame height={260}>
        <LineChart data={data} margin={{ top: 8, right: 90, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={48} />
          {todayLine({ x: 'oct', label: 'Hoy' })}
          <Line dataKey="real" stroke="var(--chart-1)" strokeWidth={2} dot={false} isAnimationActive={false} label={<EndLabel lastIndex={3} text="Real 4.124 €" color="var(--chart-1)" />} />
          <Line dataKey="prevision" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} label={<EndLabel lastIndex={5} text="Prev. 4.710 €" color="var(--chart-2)" />} />
        </LineChart>
      </ChartFrame>
    </div>
  ),
};

/** Las siete formas de muestra de la leyenda, y su alineación. */
export const Leyenda: Story = {
  render: () => (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <LegendRow
        items={[
          { label: 'Cuadrado', color: 'var(--chart-1)' },
          { label: 'Círculo', color: 'var(--chart-2)', shape: 'circle' },
          { label: 'Línea', color: 'var(--chart-3)', shape: 'line' },
          { label: 'Discontinua', color: 'var(--chart-4)', shape: 'dashed' },
          { label: 'Punteada', color: 'var(--chart-5)', shape: 'dotted' },
          { label: 'Banda', color: 'var(--muted)', shape: 'band' },
          { label: 'Rayada', color: 'var(--chart-1)', shape: 'hatch' },
        ]}
      />
      <LegendRow align="start" items={items} />
    </div>
  ),
};

/** Tooltip con título, filas con muestra de color (una discontinua), total resaltado y nota al pie. */
export const Tooltip: Story = {
  render: () => (
    <TooltipBox
      title="Octubre 2026"
      rows={[
        { label: 'Suscripciones', value: '3.640 €', color: 'var(--chart-1)' },
        { label: 'Servicios', value: '484 €', color: 'var(--chart-2)' },
        { label: 'Previsión', value: '4.390 €', color: 'var(--chart-3)', dashed: true },
        { label: 'Total', value: '4.124 €', strong: true },
      ]}
      note="Cifras sin IVA"
    />
  ),
};

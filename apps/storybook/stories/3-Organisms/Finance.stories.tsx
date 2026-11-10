import type { Meta, StoryObj } from '@storybook/react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  AlertsTable,
  CHART_AXIS,
  CHART_GRID,
  CashFlowChart,
  CashFlowTable,
  CashOverviewChart,
  CashPeriodDetail,
  Card,
  ChartFrame,
  DASH_FORECAST,
  EndLabel,
  FINANCE_COLORS,
  ForecastTable,
  KpiStrip,
  KpiStripSkeleton,
  ReceivablesPanel,
  SCENARIO_COLORS,
  StatementTable,
  TooltipProvider,
  cashMonthly,
  formatCentsRound,
  formatCentsSigned,
  formatMonthAxis,
  formatOneDecimal,
  lastDot,
  lastRealIndex,
  todayLine,
  type FinanceKpi,
  type KpiTileProps,
} from '@autonexhub/react';
import { overviewFixture, resultsFixture, simulationFixture, treasuryFixture, treasuryWeeksFixture } from './financeV2Fixtures';

/**
 * Finanzas: piezas compartidas que siguen vivas fuera de las páginas v3 (tira de KPIs del panel de control y de
 * Cobros, alertas, caja del Resumen, cash flow, PyG en tabla y forecast). Datos = respuestas
 * reales de la API local con clientes ficticios (financeV2Fixtures.ts).
 */
const meta: Meta = {
  title: '3-Organisms/Finance',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-full max-w-6xl space-y-4 bg-background p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj;

const kpi = (key: string): FinanceKpi | undefined => overviewFixture.kpis.find((k) => k.key === key);
const ref = formatMonthAxis(overviewFixture.reference_month);
const info = (k?: FinanceKpi) => [k?.definition, k?.formula].filter(Boolean).join(' · ') || undefined;
const pct = (f: number) => new Intl.NumberFormat('es-ES', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(f);

/** Los 6 KPIs del Resumen con las cifras del overview real (lo formatea la app; el paquete solo pinta). */
function resumenKpis(): KpiTileProps[] {
  const cash = kpi('cash');
  const result = kpi('net_result');
  const runway = kpi('runway');
  const mrr = kpi('mrr');
  const gm = kpi('gross_margin');
  const eb = kpi('ebitda');
  const items: KpiTileProps[] = [
    { label: 'Caja', value: formatCentsRound(cash?.value ?? overviewFixture.cash.balance_cents), sub: `Colchón ${formatCentsRound(overviewFixture.cash.cushion_cents)}`, info: info(cash), href: '#tesoreria' },
  ];
  if (result) {
    items.push({
      label: 'Resultado neto (media 3m)',
      value: result.value !== null ? formatCentsSigned(result.value) : '—',
      negative: (result.value ?? 0) < 0,
      sub: result.month_cents !== undefined ? `${formatCentsSigned(result.month_cents)} ${ref}` : undefined,
      warning: result.costs_incomplete ? `Costes incompletos en ${ref}: faltan compras en Holded.` : undefined,
      info: info(result),
      href: '#pyg',
    });
  }
  if (runway) {
    items.push({
      label: 'Runway',
      value: runway.not_applicable || runway.value === null ? 'N/D' : `${formatOneDecimal(runway.value)} meses`,
      sub: runway.not_applicable ? 'resultado positivo 3 meses' : undefined,
      info: info(runway),
      href: '#forecast',
    });
  }
  if (mrr) {
    items.push({
      label: 'MRR',
      value: mrr.value !== null ? formatCentsRound(mrr.value) : '—',
      delta: mrr.delta_mom != null ? { text: `${mrr.delta_mom >= 0 ? '+' : '−'}${pct(Math.abs(mrr.delta_mom))}`, good: mrr.delta_mom >= 0, vs: 'MoM' } : null,
      sub: mrr.arr_cents !== undefined ? `ARR ${formatCentsRound(mrr.arr_cents)}` : undefined,
      info: info(mrr),
      href: '#kpis',
    });
  }
  if (gm) {
    items.push({
      label: 'Margen bruto',
      value: gm.value !== null ? pct(gm.value) : '—',
      sub: `Margen de ${ref}`,
      estimate: gm.costs_incomplete,
      warning: gm.costs_incomplete ? `Costes incompletos en ${ref}: faltan compras en Holded.` : undefined,
      info: info(gm),
    });
  }
  if (eb) {
    items.push({
      label: `EBITDA ${ref}`,
      value: eb.value !== null ? formatCentsSigned(eb.value) : '—',
      negative: (eb.value ?? 0) < 0,
      sub: eb.margin != null ? `${pct(eb.margin)} sobre ingresos` : undefined,
      info: info(eb),
    });
  }
  return items;
}

export const KpiStripResumen: Story = { name: 'KpiStrip · Resumen (6 KPIs)', render: () => <KpiStrip items={resumenKpis()} /> };
export const KpiStripCargando: Story = { name: 'KpiStrip · cargando', render: () => <KpiStripSkeleton /> };

export const Alertas: Story = {
  name: 'AlertsTable',
  render: () => <AlertsTable alerts={overviewFixture.alerts} total={overviewFixture.alerts_total} />,
};
export const AlertasVacia: Story = { name: 'AlertsTable · sin alertas', render: () => <AlertsTable alerts={[]} total={0} /> };

export const CajaResumen: Story = {
  name: 'CashOverviewChart · caja real + forecast',
  render: () => (
    <Card className="p-4">
      <CashOverviewChart series={cashMonthly(overviewFixture.cash)} cushionCents={overviewFixture.cash.cushion_cents} asOf={overviewFixture.cash.as_of} storageKey={null} />
    </Card>
  ),
};

export const CashFlow: Story = {
  name: 'CashFlowChart + CashFlowTable · 13 semanas',
  render: () => (
    <>
      <Card className="p-4">
        <CashFlowChart data={treasuryWeeksFixture} height={260} />
      </Card>
      <CashFlowTable data={treasuryWeeksFixture} />
    </>
  ),
};

export const DetallePeriodo: Story = {
  name: 'CashPeriodDetail · cobros y pagos de una semana',
  render: () => <CashPeriodDetail period={treasuryWeeksFixture.periods[0]} onClose={() => undefined} />,
};

export const CuentasACobrar: Story = { name: 'ReceivablesPanel · AR', render: () => <ReceivablesPanel aging={treasuryFixture.receivable} kind="receivable" /> };
export const CuentasAPagar: Story = { name: 'ReceivablesPanel · AP vacía', render: () => <ReceivablesPanel aging={treasuryFixture.payable} kind="payable" /> };

export const PygDeGestion: Story = {
  name: 'StatementTable · PyG de gestión',
  render: () => (
    <StatementTable
      columns={resultsFixture.statement.columns}
      rows={resultsFixture.statement.rows}
      incompleteMonths={resultsFixture.series.filter((m) => m.costs_incomplete).map((m) => m.month)}
    />
  ),
};
export const PygPctIngresos: Story = {
  name: 'StatementTable · % sobre ingresos',
  render: () => <StatementTable columns={resultsFixture.statement.columns} rows={resultsFixture.statement.rows} mode="pct" />,
};

export const Forecast: Story = {
  name: 'ForecastTable · detalle mensual del escenario',
  render: () => <ForecastTable months={simulationFixture.months} cushionCents={simulationFixture.cushion_cents ?? 0} />,
};

// R4: etiqueta directa al final de cada serie (`EndLabel`), punto solo en el último valor real (`lastDot`) y marca «Hoy».
const rulesRows = [
  { m: 'jul', real: 120, plan: null },
  { m: 'ago', real: 150, plan: null },
  { m: 'sep', real: 170, plan: null },
  { m: 'oct', real: 210, plan: 210 },
  { m: 'nov', real: null, plan: 240 },
  { m: 'dic', real: null, plan: 275 },
];

function RulesChart() {
  return (
    <Card className="p-6">
      <ChartFrame height={260}>
        <ComposedChart data={rulesRows} margin={{ top: 16, right: 72, left: 0, bottom: 0 }}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="m" {...CHART_AXIS} tickMargin={8} />
          <YAxis {...CHART_AXIS} width={40} />
          {todayLine({ x: 'oct', label: 'Hoy' })}
          <Line
            type="linear"
            dataKey="real"
            stroke={FINANCE_COLORS.net}
            strokeWidth={2}
            dot={lastDot(FINANCE_COLORS.net, lastRealIndex(rulesRows, 'real'))}
            label={<EndLabel lastIndex={lastRealIndex(rulesRows, 'real')} text="Real 210 K€" color={FINANCE_COLORS.net} />}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="plan"
            stroke={SCENARIO_COLORS.base}
            strokeWidth={2}
            strokeDasharray={DASH_FORECAST}
            dot={false}
            label={<EndLabel lastIndex={lastRealIndex(rulesRows, 'plan')} text="Plan 275 K€" color={SCENARIO_COLORS.base} />}
            isAnimationActive={false}
            connectNulls
          />
        </ComposedChart>
      </ChartFrame>
    </Card>
  );
}

export const EtiquetaFinalYHoy: Story = { name: 'Reglas R4 · EndLabel + todayLine()', render: () => <RulesChart /> };

import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  CashOverviewChart,
  FinanceStatStrip,
  PlanVsActualTable,
  TooltipProvider,
  cashMonthly,
  formatCentsRound,
  formatCentsSigned,
  formatMonthLong,
  formatMonthAxis,
  formatOneDecimal,
  type FinanceOverview,
  type FinanceStatProps,
  type PlanVsActual,
} from '@autonexhub/react';
import { overviewFixture } from './financeV2Fixtures';

/** Finanzas v3 › Resumen (spec v3 §4.2): cinco cifras, caja real y prevista, plan frente a real. */
const meta: Meta = {
  title: '3-Organisms/FinanceV3Resumen',
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

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="max-w-2xl rounded-[10px] border border-border bg-card px-4 pb-3 pt-3.5">
    <h3 className="mb-3 text-[0.9rem] font-semibold text-foreground">{title}</h3>
    {children}
  </div>
);

/**
 * Las cinco cifras del Resumen con las cifras del overview (en la app las compone `overviewStats`; aquí, lo mismo
 * en pequeño para enseñar la tira: caja, MRR, resultado estimado, cobros pendientes y runway).
 */
function stats(o: FinanceOverview): FinanceStatProps[] {
  const k = (key: string) => o.kpis.find((x) => x.key === key);
  const ref = formatMonthAxis(o.reference_month);
  const cash = k('cash');
  const mrr = k('mrr');
  const result = k('net_result');
  const runway = k('runway');
  const prev = o.cash.actual.length > 1 ? o.cash.actual[0].balance_cents : null;
  const total = cash?.value ?? o.cash.balance_cents;
  const out: FinanceStatProps[] = [
    {
      label: 'Caja hoy',
      value: formatCentsRound(total),
      ...(prev !== null && o.cash.actual[0].date.slice(0, 7) !== o.cash.as_of.slice(0, 7)
        ? { delta: { text: `${total >= prev ? '▲' : '▼'} ${formatCentsSigned(total - prev)}`, good: total >= prev }, note: 'vs hace 30 días' }
        : { note: `colchón ${formatCentsRound(o.cash.cushion_cents)}` }),
      href: '#tesoreria',
    },
  ];
  if (mrr) {
    out.push({
      label: 'MRR facturado',
      value: mrr.value !== null ? formatCentsRound(mrr.value) : '—',
      ...(mrr.delta_mom != null ? { delta: { text: `${mrr.delta_mom >= 0 ? '▲ +' : '▼ −'}${formatOneDecimal(Math.abs(mrr.delta_mom) * 100)} %`, good: mrr.delta_mom >= 0 } } : {}),
      note: 'vs mes anterior',
    });
  }
  if (result) {
    out.push({
      label: `Resultado de ${formatMonthLong(o.reference_month)}`,
      value: result.month_cents !== undefined ? formatCentsSigned(result.month_cents) : '—',
      negative: (result.month_cents ?? 0) < 0,
      estimate: result.costs_incomplete,
      note: result.costs_incomplete ? `${ref} · sin compras en Holded` : ref,
    });
  }
  out.push({
    label: 'Cobros pendientes',
    value: formatCentsRound(o.receivable.cents),
    ...(o.receivable.overdue_cents > 0 ? { delta: { text: `${formatCentsRound(o.receivable.overdue_cents)} vencidos`, good: false } } : {}),
  });
  out.push({
    label: 'Runway',
    value: runway && !runway.not_applicable && runway.value !== null ? `${formatOneDecimal(runway.value)} meses` : '—',
    note: runway?.cash_out_month ? `cash-out ${formatMonthLong(runway.cash_out_month)}` : 'resultado positivo 3 meses',
    href: '#forecast',
  });
  return out;
}

function Strip({ data }: { data: FinanceOverview }) {
  return <FinanceStatStrip items={stats(data)} columns={5} />;
}

/** Overview real (6-nov-2026): caja sin saldo de hace 30 días (colchón), resultado estimado, vencido en rojo, runway «—». */
export const CincoCifras: Story = { render: () => <Strip data={overviewFixture} /> };

/** Con pérdidas y runway calculado: «7,8 meses» y el mes sin caja; la caja con su variación a 30 días. */
export const CincoCifrasConRunway: Story = {
  render: () => (
    <Strip
      data={{
        ...overviewFixture,
        cash: { ...overviewFixture.cash, actual: [{ date: '2026-10-01', balance_cents: 845525 }, ...overviewFixture.cash.actual] },
        kpis: overviewFixture.kpis.map((k) =>
          k.key === 'runway' ? { ...k, value: 7.8, not_applicable: false, cash_out_month: '2027-06', costs_incomplete: false } : k.key === 'net_result' ? { ...k, month_cents: -230000, costs_incomplete: false } : k,
        ),
        receivable: { ...overviewFixture.receivable, overdue_cents: 0 },
      }}
    />
  ),
};

/** Área real en tinta, previsión base en azul discontinuo y colchón en gris punteado. */
export const CajaRealYPrevision: Story = {
  render: () => (
    <Card title="Caja · real y previsión">
      <CashOverviewChart series={cashMonthly(overviewFixture.cash)} cushionCents={overviewFixture.cash.cushion_cents} asOf={overviewFixture.cash.as_of} height={250} storageKey={null} />
    </Card>
  ),
};

const pva = overviewFixture.plan_vs_actual as PlanVsActual;

/** Lo que trae la API el 6-nov: octubre es el punto de partida del plan (sin desvío) y noviembre va a fecha, en gris y sin puntuar. */
export const PlanVsRealPuntoDePartida: Story = {
  render: () => (
    <Card title="Vs plan Road to €1M ARR · escenario Cielo">
      <PlanVsActualTable data={pva} />
    </Card>
  ),
};

/** Un mes cerrado después del arranque: facturado frente a plan de facturado, desvío con ▲▼ en verde o rojo. */
export const PlanVsRealMesCerradoPuntuado: Story = {
  render: () => (
    <Card title="Vs plan Road to €1M ARR · escenario Cielo">
      <PlanVsActualTable
        data={{
          ...pva,
          month: '2026-11',
          scored: true,
          rows: [
            { key: 'mrr', label: 'MRR', plan_cents: 506958, actual_cents: 480000, delta_cents: -26958 },
            { key: 'new_mrr', label: 'MRR nuevo neto del mes', plan_cents: 94560, actual_cents: 67602, delta_cents: -26958 },
            { key: 'customers', label: 'Clientes activos', plan: 17, actual: 18, delta: 1 },
          ],
          current: { ...pva.current!, month: '2026-12', as_of: '2026-12-04', rows: [{ key: 'mrr', label: 'MRR facturado a fecha', plan_cents: 588000, actual_cents: 12000, delta_cents: null }, { key: 'customers', label: 'Centros del plan', plan: 20, actual: null, delta: null }] },
        }}
      />
    </Card>
  ),
};

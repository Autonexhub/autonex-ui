import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AgingFigures,
  CashFlowChart,
  CashFlowTable,
  FINANCE_COLORS,
  FinanceStatStrip,
  FreshnessLine,
  PairedBarsChart,
  ReceivablesPanel,
  StatementTable,
  TooltipProvider,
  VatAccountCard,
  agingFiveBuckets,
  pairedRowsFromSeries,
  withExtraMonth,
  withPendingMonth,
  type FinanceStatProps,
} from '@autonexhub/react';
import { overviewFixture, resultsFixture, resultsYoyFixture, treasuryFixture, treasuryWeeksFixture } from './financeV2Fixtures';

/** Finanzas v3 (docs/superpowers/specs/2026-11-05-finanzas-v3-design.md): piezas nuevas de Dirección. */
const meta: Meta = {
  title: '3-Organisms/FinanceV3',
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

export const LineaDeFrescuraSincronizadoAyer: Story = {
  render: () => <FreshnessLine data={{ as_of: '2026-11-05 08:40', last_sync_at: '2026-11-04 23:30', last_closed_month: '2026-10' }} />,
};

export const LineaDeFrescuraSincronizadoHoy: Story = {
  render: () => <FreshnessLine data={{ as_of: '2026-11-05 08:40', last_sync_at: '2026-11-05 06:00', last_closed_month: '2026-10' }} />,
};

export const LineaDeFrescuraSinSincronizar: Story = {
  render: () => <FreshnessLine data={{ as_of: '2026-11-05 08:40', last_sync_at: null, last_closed_month: '2026-10' }} />,
};

// ---- Tokens y componentes base (Task 2) ------------------------------------------------------------

const TOKEN_COLOR: Record<string, string> = {
  '--finance-in': FINANCE_COLORS.in,
  '--finance-in-2': FINANCE_COLORS.in2,
  '--finance-in-3': FINANCE_COLORS.in3,
  '--finance-out': FINANCE_COLORS.out,
  '--finance-out-2': FINANCE_COLORS.out2,
  '--finance-out-3': FINANCE_COLORS.out3,
  '--foreground': FINANCE_COLORS.net,
  '--muted-foreground': FINANCE_COLORS.plan,
};
const TOKENS = ['--finance-in', '--finance-in-2', '--finance-in-3', '--finance-out', '--finance-out-2', '--finance-out-3', '--foreground', '--muted-foreground'];

function Swatches() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TOKENS.map((tk) => (
        <div key={tk} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-6 shrink-0 rounded-md border border-border" style={{ background: TOKEN_COLOR[tk] }} />
          <code className="whitespace-nowrap">{tk}</code>
        </div>
      ))}
    </div>
  );
}

/** Los seis tonos financieros + neto y plan, en claro y en oscuro (spec §4.8). */
export const TokensFinancieros: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[10px] border border-border bg-background p-4">
        <Swatches />
      </div>
      <div className="dark rounded-[10px] border border-border bg-background p-4">
        <Swatches />
      </div>
    </div>
  ),
};

/** Tira de Resumen con los cinco valores de octubre de la maqueta v3. */
const resumenOctubre: FinanceStatProps[] = [
  { label: 'Caja hoy', value: '9.761 €', delta: { text: '▲ +1.306 €', good: true }, note: 'vs hace 30 días', href: '/finance/tesoreria' },
  { label: 'MRR facturado', value: '4.124 €', delta: { text: '▲ +40,8 %', good: true }, note: 'vs septiembre' },
  { label: 'Resultado de octubre', value: '+16.005 €', estimate: true, note: '94 % sobre ingresos · sin compras en Holded' },
  { label: 'Cobros pendientes', value: '9.133 €', delta: { text: '862 € vencidos', good: false }, note: '· 4 facturas' },
  { label: 'Runway', value: '—', note: 'resultado positivo 3 meses' },
];

export const TiraDeCifrasResumen: Story = {
  render: () => <FinanceStatStrip items={resumenOctubre} columns={5} />,
};

export const TiraDeCifrasCuatroColumnas: Story = {
  render: () => (
    <FinanceStatStrip
      columns={4}
      items={[
        { label: 'Pendiente de cobro', value: '9.133 €', note: '9 facturas · 5 clientes' },
        { label: 'Vencido', value: '862 €', negative: true, note: '3 facturas · la más antigua, 18 días' },
        { label: 'Esperado en 30 días', value: '4.552 €', note: 'por vencimiento de factura' },
        { label: 'Días medios de cobro', value: '14 días', delta: { text: '▼ −2 días', good: true }, note: 'plazo en factura: 7 días' },
      ]}
    />
  ),
};

const pnl = overviewFixture.pnl_12m;
const pairedRows = pairedRowsFromSeries(pnl);
const incomplete = pnl.filter((m) => m.costs_incomplete).map((m) => m.month);

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-[10px] border border-border bg-card px-4 pb-3 pt-3.5">
    <h3 className="mb-3 text-[0.9rem] font-semibold text-foreground">{title}</h3>
    {children}
  </div>
);

/** Ingresos y gastos de 12 meses (overview real): octubre rayado porque faltan compras en Holded. */
export const BarrasPareadasIngresosYGastos: Story = {
  render: () => (
    <Card title="Ingresos y gastos · 12 meses">
      <PairedBarsChart rows={pairedRows} incompleteMonths={incomplete} onMonthClick={() => undefined} />
    </Card>
  ),
};

/** Todo junto en modo oscuro: los tonos fuertes se aclaran y los de apilar se oscurecen. */
export const ComponentesBaseOscuro: Story = {
  render: () => (
    <div className="dark space-y-4 rounded-[10px] bg-background p-4 text-foreground">
      <FinanceStatStrip items={resumenOctubre} columns={5} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Ingresos y gastos · 12 meses">
          <PairedBarsChart rows={pairedRows} incompleteMonths={incomplete} />
        </Card>
      </div>
      <Card title="Por antigüedad">
        <AgingFigures buckets={agingFiveBuckets(treasuryFixture.receivable)} />
      </Card>
    </div>
  ),
};

/* ---------- Cuenta de resultados (spec §4.3) ---------- */

const statement = resultsFixture.statement;
const resultsIncomplete = resultsFixture.series.filter((m) => m.costs_incomplete).map((m) => m.month);

/** Vista por defecto: sep 26 · oct 26 · Δ · 4T 26 · 2026; los bloques abiertos, las líneas plegadas. */
export const TablaMesAnterior: Story = {
  render: () => <StatementTable columns={statement.columns} rows={statement.rows} incompleteMonths={resultsIncomplete} />,
};

/** Comparar con el mismo mes del año anterior (oct 25, que llega de otra llamada a /results). */
export const TablaMismoMesAnoAnterior: Story = {
  render: () => {
    const s = withExtraMonth(statement, resultsYoyFixture.statement);
    return <StatementTable columns={s.columns} rows={s.rows} compare="yoy" incompleteMonths={resultsIncomplete} />;
  },
};

/** Mientras llega el mes del año anterior: esqueleto en su columna y la Δ vacía. */
export const TablaMismoMesCargando: Story = {
  render: () => {
    const s = withPendingMonth(statement, '2025-10');
    return <StatementTable columns={s.columns} rows={s.rows} compare="yoy" loadingMonths={['2025-10']} />;
  },
};

/** «12 meses»: vista ancha con la banda «Histórico AJE GAMAN» sobre los meses del Holded antiguo. */
export const Tabla12Meses: Story = {
  render: () => <StatementTable columns={statement.columns} rows={statement.rows} view="wide" incompleteMonths={resultsIncomplete} />,
};

/** «% ingresos» sin número de cuenta. */
export const TablaPorcentajeSinNumeroDeCuenta: Story = {
  render: () => <StatementTable columns={statement.columns} rows={statement.rows} mode="pct" showAccounts={false} />,
};

/* ---------- Tesorería (spec §4.4) ---------- */

/** Mensual a 12 meses (/cash?horizon=months real): cobros pendiente/previsto, pagos, saldo, colchón y mínimo. */
export const TesoreriaGraficoMensual: Story = {
  render: () => (
    <Card title="Cobros, pagos y saldo · 12 meses">
      <CashFlowChart data={treasuryFixture} height={320} onPeriodClick={() => undefined} />
    </Card>
  ),
};

/**
 * Lo real frente a lo previsto: el punto «Hoy» es el saldo bancario de apertura (`opening_cents` a `as_of`,
 * 6-nov) y la línea va sólida de él al cierre del mes en curso; desde ahí, discontinua.
 */
export const TesoreriaSaldoRealHastaHoy: Story = {
  render: () => (
    <Card title="Saldo: real hasta hoy, previsto después">
      <CashFlowChart data={{ ...treasuryFixture, periods: treasuryFixture.periods.slice(0, 4) }} height={320} />
    </Card>
  ),
};

/** El toggle «Semanal · 13 semanas»: el mismo motor con `horizon=weeks`. */
export const TesoreriaGraficoSemanal: Story = {
  render: () => (
    <Card title="Cobros, pagos y saldo · 13 semanas">
      <CashFlowChart data={treasuryWeeksFixture} height={320} onPeriodClick={() => undefined} />
    </Card>
  ),
};

/** Saldo bajo el colchón: el margen negativo en rojo en la tabla y el punto de ruptura en el gráfico. */
const tightTreasury = {
  ...treasuryFixture,
  cushion_cents: 1400000,
  breach: { period_start: treasuryFixture.periods[0].start, balance_cents: treasuryFixture.periods[0].closing_cents },
};
export const TesoreriaBajoElColchon: Story = {
  render: () => (
    <Card title="Cobros, pagos y saldo · colchón 14.000 €">
      <CashFlowChart data={tightTreasury} height={320} />
    </Card>
  ),
};

/** Tabla mensual con la fila «Margen sobre el colchón». */
export const TesoreriaTablaMensual: Story = {
  render: () => <CashFlowTable data={treasuryFixture} onPeriodClick={() => undefined} />,
};

/** Cobros pendientes: cuatro cifras, barra por antigüedad y tabla por cliente con método y acción. */
export const CobrosPendientesPorCliente: Story = {
  render: () => <ReceivablesPanel aging={treasuryFixture.receivable} kind="receivable" />,
};

/** «A pagar»: lo mismo sin método ni días medios de cobro (sin compras pendientes en el local). */
export const APagar: Story = {
  render: () => <ReceivablesPanel aging={treasuryFixture.payable} kind="payable" />,
};

/* ---------- IVA apartado (spec §4.3) ---------- */

const bankAccounts = [
  { id: 'acc-operativa', name: 'Cuenta operativa', balance_cents: 1_085_000 },
  { id: 'acc-iva', name: 'Cuenta de IVA', balance_cents: 465_000 },
  { id: 'acc-ahorro', name: 'Cuenta de ahorro', balance_cents: 150_000 },
];
const vatAccount = {
  account_ids: ['acc-iva'],
  accounts: [bankAccounts[1]],
  reserved_cents: 465_000,
  quarter_label: '4T 2026',
  due_date: '2027-01-30',
  due_cents: 436_048,
  shortfall_cents: 0,
};

/** Sin cuenta marcada: sugerencia discreta y el botón que abre el diálogo con las cuentas de Holded. */
export const IvaSinCuentaMarcada: Story = {
  render: () => <VatAccountCard vat={null} bankAccounts={bankAccounts} onSave={() => undefined} />,
};

/** Con cuenta de IVA y saldo suficiente: la línea del trimestre y lo que hay apartado. */
export const IvaApartadoSuficiente: Story = {
  render: () => <VatAccountCard vat={vatAccount} bankAccounts={bankAccounts} onSave={() => undefined} />,
};

/** Si lo apartado no llega al IVA del trimestre, aviso en ámbar con lo que falta. */
export const IvaApartadoInsuficiente: Story = {
  render: () => (
    <VatAccountCard
      vat={{ ...vatAccount, reserved_cents: 300_000, accounts: [{ ...bankAccounts[1], balance_cents: 300_000 }], shortfall_cents: 136_048 }}
      bankAccounts={bankAccounts}
      onSave={() => undefined}
    />
  ),
};

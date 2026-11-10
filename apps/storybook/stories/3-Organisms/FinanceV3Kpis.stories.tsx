import type { Meta, StoryObj } from '@storybook/react';
import { Card, FinanceStatStrip, MrrBridgeChart, TooltipProvider, type FinanceKpi, type FinanceKpis, type FinanceStatProps, type MrrMovementMonth } from '@autonexhub/react';
import { kpisFixture } from './financeV2Fixtures';

/**
 * Finanzas v3 › Métricas SaaS (spec v3 §4.6): bloques de cifras y puente del MRR. La tabla de movimientos de MRR y
 * «qué ha pasado por cliente» son de la página de Métricas y se quedan en el Storybook de la app.
 */
const meta: Meta = {
  title: '3-Organisms/FinanceV3Kpis',
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

/** Una métrica de `/kpis` como cifra de la tira: valor ya formateado por la API (`display`), umbral escrito debajo. */
function statOf(k: FinanceKpi): FinanceStatProps {
  const info = [k.definition ?? k.meaning, k.formula].filter(Boolean).join(' · ') || undefined;
  if (!k.available) return { id: k.key, label: k.label, value: '—', note: k.why_unavailable ? `Sin datos: ${k.why_unavailable}` : 'Sin datos', info };
  return {
    id: k.key,
    label: k.label,
    value: k.display || String(k.value),
    negative: k.band === 'bad',
    estimate: k.costs_incomplete,
    note: k.detail?.length ? k.detail.slice(0, 2).join(' · ') : (k.threshold_label ?? k.caveat ?? undefined),
    info,
  };
}

function Block({ data, index }: { data: FinanceKpis; index: number }) {
  const g = data.groups?.[index];
  const byKey = new Map(data.kpis.map((k) => [k.key, k]));
  const items = (g?.kpis ?? []).flatMap((key) => (byKey.has(key) ? [statOf(byKey.get(key) as FinanceKpi)] : []));
  return g ? (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-foreground">{g.label}</h2>
      <FinanceStatStrip items={items} columns={4} />
    </section>
  ) : null;
}

/** Crecimiento: MRR con su Δ vs el mes anterior; el ARR sale del MRR. */
export const BloqueCrecimiento: Story = { render: () => <Block data={kpisFixture} index={0} /> };

/** Retención: GRR y NRR fuera de umbral (valor en rojo, umbral escrito); clientes en riesgo con su nombre. */
export const BloqueRetencion: Story = { name: 'Bloque retención', render: () => <Block data={kpisFixture} index={1} /> };

/** Unit economics: margen y CAC estimados (faltan compras en Holded): subrayado punteado. */
export const BloqueUnitEconomics: Story = { render: () => <Block data={kpisFixture} index={2} /> };

/** Una métrica no disponible: raya y el motivo en la línea inferior, sin tabla aparte. */
export const MetricaNoDisponible: Story = {
  name: 'Métrica no disponible',
  render: () => (
    <Block
      index={3}
      data={{
        ...kpisFixture,
        kpis: kpisFixture.kpis.map((k) => (k.key === 'dso' ? { ...k, available: false, value: null, why_unavailable: 'Sin ventas en los últimos 90 días' } : k)),
      }}
    />
  ),
};

const octubre: MrrMovementMonth = { month: '2026-10', start_cents: 292898, new_cents: 214500, expansion_cents: 18000, reactivation_cents: 0, contraction_cents: -75000, churn_cents: -29000, timing_cents: -9000, end_cents: 412398, net_cents: 128500 };

/** Puente de octubre (cascada): MRR inicial en tinta, sumas en azules, restas en naranjas, «sin facturar / atrasadas» en gris-naranja y MRR final en tinta. */
export const PuenteDelMes: Story = {
  render: () => (
    <Card className="p-6">
      <MrrBridgeChart row={octubre} />
    </Card>
  ),
};

/** Mes tranquilo: sin contracción, churn ni calendario; solo una alta. Los pasos a 0 no se pintan. */
export const PuenteSoloAltas: Story = {
  render: () => (
    <Card className="p-6">
      <MrrBridgeChart row={{ month: '2026-09', start_cents: 100000, new_cents: 30000, expansion_cents: 0, contraction_cents: 0, churn_cents: 0, timing_cents: 0, end_cents: 130000, net_cents: 30000 }} />
    </Card>
  ),
};

/** Cuota atrasada que llega este mes: «sin facturar / atrasadas» suma (azul claro) en vez de restar. */
export const PuenteConAtrasadaQueLlega: Story = {
  render: () => (
    <Card className="p-6">
      <MrrBridgeChart row={{ ...octubre, timing_cents: 12000, end_cents: 433398 }} />
    </Card>
  ),
};


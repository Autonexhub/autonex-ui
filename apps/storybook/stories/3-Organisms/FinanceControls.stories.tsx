import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  CushionEditor,
  InfoTip,
  KpiTile,
  RecurringCostDialog,
  SyncButton,
  TooltipProvider,
  type RecurringCost,
  type RecurringCostInput,
} from '@autonexhub/react';

/**
 * Finanzas › piezas pequeñas: celda de KPI, «i» de definición, botón de sincronización, editor del colchón y
 * diálogo de gasto recurrente. Todas presentacionales: el estado y las llamadas a la API los pone la página.
 */
const meta: Meta = {
  title: '3-Organisms/FinanceControls',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-full max-w-3xl space-y-4 bg-background p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj;

const tile = 'w-64 overflow-hidden rounded-xl border border-border';

/** Una celda del KPI strip con su variación, la línea de contexto y la «i» con la fórmula. */
export const CeldaDeKpi: Story = {
  render: () => (
    <div className={tile}>
      <KpiTile label="MRR" value="4.124 €" delta={{ text: '+40,8 %', good: true, vs: 'MoM' }} sub="ARR 49.488 €" info="Recurrente facturada del mes · Σ facturas de suscripción" />
    </div>
  ),
};

/** Cifra estimada (subrayado discontinuo y «est.») con la salvedad en ámbar junto a la etiqueta. */
export const CeldaDeKpiEstimada: Story = {
  render: () => (
    <div className={tile}>
      <KpiTile label="Resultado neto (media 3m)" value="+9.008 €" estimate sub="+16.005 € oct 26" warning="Costes incompletos en oct 26: faltan compras en Holded." />
    </div>
  ),
};

/** Cifra mala en rojo y variación a la baja. */
export const CeldaDeKpiNegativa: Story = {
  render: () => (
    <div className={tile}>
      <KpiTile label="Runway" value="4,2 meses" negative delta={{ text: '−1,3 meses', good: false }} sub="cash-out feb 27" />
    </div>
  ),
};

/** Con `href` la celda es un enlace (la app pasa `renderLink` con su router). */
export const CeldaDeKpiEnlace: Story = {
  render: () => (
    <div className={tile}>
      <KpiTile label="Caja" value="6.198 €" sub="Colchón 5.000 €" href="#tesoreria" />
    </div>
  ),
};

export const InfoDeDefinicion: Story = {
  render: () => (
    <p className="flex items-center gap-1 text-sm text-foreground">
      Días medios de cobro
      <InfoTip label="Definición de Días medios de cobro">Days Sales Outstanding: días medios entre la emisión de la factura y su cobro.</InfoTip>
    </p>
  ),
};

const base = { started_at: '2026-11-06 02:10:00', api_calls: 42 };

/** Última sincronización correcta: «Última sincronización: hace 3 min». */
export const SincronizarCorrecta: Story = {
  render: () => <SyncButton lastRun={{ ...base, finished_at: new Date(Date.now() - 3 * 60_000).toISOString(), status: 'ok' }} onSync={() => undefined} />,
};

export const SincronizarEnCurso: Story = {
  render: () => <SyncButton lastRun={{ ...base, finished_at: new Date(Date.now() - 3 * 3_600_000).toISOString(), status: 'ok' }} syncing onSync={() => undefined} />,
};

/** La última ejecución falló: el error sale en rojo bajo el botón. */
export const SincronizarFallida: Story = {
  render: () => <SyncButton lastRun={{ ...base, finished_at: null, status: 'failed', error: 'Holded respondió 502' }} onSync={() => undefined} />,
};

export const SincronizarSinHistorial: Story = { render: () => <SyncButton lastRun={null} onSync={() => undefined} /> };
export const SincronizarCargando: Story = { render: () => <SyncButton lastRun={undefined} loading onSync={() => undefined} /> };

function CushionDemo() {
  const [cents, setCents] = useState(500_000);
  return (
    <div className="flex justify-end">
      <CushionEditor cushionCents={cents} onSave={(c) => setCents(c)}>
        <Button variant="outline" size="sm">
          Colchón {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100)}
        </Button>
      </CushionEditor>
    </div>
  );
}

/** Popover para editar el colchón mínimo de caja; «0» vale (sin colchón) y un importe no válido deshabilita «Guardar». */
export const EditorDelColchon: Story = { render: () => <CushionDemo /> };

const existing: RecurringCost = {
  id: 1,
  name: 'Nóminas socios',
  category: 'personal',
  amount_cents: 650_000,
  vat_basis_points: 0,
  frequency: 'monthly',
  day_of_month: 28,
  months_of_year: [],
  start_month: '2026-01',
  end_month: null,
  active: true,
  notes: 'Sube un 3 % en enero',
};

function CostDialogDemo({ cost, initial }: { cost: RecurringCost | null; initial?: Partial<RecurringCostInput> }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{cost ? 'Editar gasto' : 'Nuevo gasto'}</Button>
      <RecurringCostDialog open={open} onOpenChange={setOpen} cost={cost} initial={initial} onSubmit={async () => undefined} />
    </>
  );
}

/** Alta de un gasto recurrente en blanco (mensual, IVA 21 %). */
export const DialogoDeGastoNuevo: Story = { render: () => <CostDialogDemo cost={null} /> };

/** Alta desde una sugerencia del histórico: proveedor, categoría e importe ya rellenos. */
export const DialogoDeGastoDesdeSugerencia: Story = {
  render: () => <CostDialogDemo cost={null} initial={{ name: 'HubSpot', category: 'comercial', amount_cents: 44_713 }} />,
};

/** Edición de un gasto existente. */
export const DialogoDeGastoEdicion: Story = { render: () => <CostDialogDemo cost={existing} /> };

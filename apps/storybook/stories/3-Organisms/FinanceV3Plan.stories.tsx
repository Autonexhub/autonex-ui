import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ArrTrajectoryChart,
  Button,
  Card,
  FixedCosts,
  ForecastDrivers,
  MilestoneProgress,
  MilestonesDialog,
  ScenarioCards,
  TooltipProvider,
  type PlanLevers,
  type PlanScenario,
  type PlanScenarioKey,
  type RecurringCost,
} from '@autonexhub/react';
import { planFixture } from './financeV2Fixtures';
import { simulationFor } from './planStoryData';

/** Solo los drivers de un escenario (sin key/label/origin): lo que se edita en `ForecastDrivers`. */
function leversOf(s: PlanScenario): PlanLevers {
  return {
    new_customers_per_month: s.new_customers_per_month,
    arpa_new_cents: s.arpa_new_cents,
    churn_pct: s.churn_pct,
    services_cents_per_month: s.services_cents_per_month,
    usage_cents_per_month: s.usage_cents_per_month,
    cost_to_serve_pct: s.cost_to_serve_pct,
    dso_days: s.dso_days,
    hires: s.hires ?? [],
    discoveries_per_month: s.discoveries_per_month ?? null,
    demo_rate: s.demo_rate ?? null,
    proposal_rate: s.proposal_rate ?? null,
    close_rate: s.close_rate ?? null,
    centers_per_close: s.centers_per_close ?? null,
    cents_per_center_month: s.cents_per_center_month ?? null,
  };
}

/** Finanzas v3 › Plan y forecast (spec v3 §4.5): drivers por grupos, trayectoria de ARR, escenarios e hitos. */
const meta: Meta = {
  title: '3-Organisms/FinanceV3Plan',
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

const milestones = planFixture.milestones ?? [];

/** Cielo grueso con los hitos sobre su línea, Tierra e Infierno finos con su cifra final; real en tinta continua. */
export const TrayectoriaDeArr: Story = {
  render: () => (
    <Card className="p-4">
      <ArrTrajectoryChart actualArr={planFixture.actual_arr ?? []} simulation={simulationFor('upside')} milestones={milestones} />
    </Card>
  ),
};

function CardsDemo() {
  const [active, setActive] = useState<PlanScenarioKey>('upside');
  return <ScenarioCards compare={planFixture.compare ?? {}} active={active} onSelect={setActive} />;
}

/** Tres tarjetas a dic-27: ARR y % del hito, centros, caja mínima, break-even y «qué hace falta». Clic = elegir escenario. */
export const TarjetasDeEscenario: Story = { render: () => <CardsDemo /> };

/** Avance hacia el siguiente hito de Cielo con el MRR nuevo al mes que falta. */
export const AvanceHaciaElHito: Story = {
  render: () => <MilestoneProgress milestone={{ month: '2027-03', arr_cents: 16_600_000, arr_now_cents: 4_948_776, progress_bp: 2981, required_new_mrr_cents: 1_210_000 }} />,
};

/** Sin hito pendiente. */
export const AvanceSinHito: Story = { render: () => <MilestoneProgress milestone={null} /> };

const fixedItems: RecurringCost[] = [
  { id: 1, name: 'Nóminas socios', category: 'personal', amount_cents: 650_000, vat_basis_points: 0, frequency: 'monthly', day_of_month: 28, months_of_year: [], start_month: '2026-01', end_month: null, active: true, notes: '' },
  { id: 2, name: 'HubSpot', category: 'comercial', amount_cents: 44_713, vat_basis_points: 2100, frequency: 'monthly', day_of_month: 1, months_of_year: [], start_month: '2026-01', end_month: null, active: true, notes: '' },
  { id: 3, name: 'LiveKit', category: 'cogs_saas', amount_cents: 31_023, vat_basis_points: 2100, frequency: 'monthly', day_of_month: 1, months_of_year: [], start_month: '2026-01', end_month: null, active: true, notes: '' },
  { id: 4, name: 'Asesoría', category: 'general', amount_cents: 7_689, vat_basis_points: 2100, frequency: 'monthly', day_of_month: 5, months_of_year: [], start_month: '2026-01', end_month: null, active: true, notes: '' },
];

/** Costes fijos: total grande, barra por categoría, lista debajo y sugerencias plegadas con «Añadir las 5». */
export const CostesFijosConBarras: Story = {
  render: () => (
    <FixedCosts
      fixedCosts={{
        monthly_total_cents: 733_425,
        annual_total_cents: 8_801_100,
        items: fixedItems,
        by_category: [
          { category: 'personal', label: 'Personal', monthly_cents: 650_000 },
          { category: 'comercial', label: 'Ventas y marketing', monthly_cents: 44_713 },
          { category: 'cogs_saas', label: 'Coste de servir (SaaS)', monthly_cents: 31_023 },
          { category: 'general', label: 'Generales y administración', monthly_cents: 7_689 },
        ],
      }}
      suggestions={planFixture.suggestions}
      onAdd={() => undefined}
      onEdit={() => undefined}
      onDelete={() => undefined}
      onAddSuggestion={() => undefined}
      onAddSuggestions={() => undefined}
    />
  ),
};

function DriversDemo() {
  const [scenario, setScenario] = useState<PlanScenarioKey>('base');
  const saved = leversOf(planFixture.scenarios[scenario]);
  const [levers, setLevers] = useState<PlanLevers>({ ...saved, discoveries_per_month: 200 });
  return (
    <div className="max-w-[340px]">
      <ForecastDrivers
        scenario={scenario}
        onScenario={(s) => {
          setScenario(s);
          setLevers(leversOf(planFixture.scenarios[s]));
        }}
        levers={levers}
        saved={saved}
        onChange={setLevers}
        history={planFixture.defaults_from_history?.base}
        historyNotes={planFixture.defaults_from_history?.notes}
        monthsUsed={6}
        dirty={JSON.stringify(levers) !== JSON.stringify(saved)}
        onSave={() => undefined}
        onReset={() => setLevers(saved)}
        cushionCents={planFixture.cushion_cents}
        onCushionSave={() => undefined}
        fixedCostsMonthlyCents={planFixture.fixed_costs.monthly_total_cents}
        fixedCostsMissing
      />
    </div>
  );
}

/** Drivers en tres grupos con «hist.»; discoveries cambiadas a 200 (tintada) y churn distinto del histórico. */
export const DriversPorGrupos: Story = { render: () => <DriversDemo /> };

function MilestonesDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Editar hitos</Button>
      <MilestonesDialog open={open} onOpenChange={setOpen} milestones={milestones} onSubmit={async () => undefined} />
    </>
  );
}

/** Diálogo de hitos del plan (mes + ARR; ordenados y crecientes). */
export const DialogoDeHitos: Story = { render: () => <MilestonesDemo /> };

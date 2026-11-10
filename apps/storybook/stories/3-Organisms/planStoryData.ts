import type { PlanScenarioKey, PlanSimulation } from '@autonexhub/react';
import { simulationFixture } from './financeV2Fixtures';

/**
 * La simulación fija de Storybook (Tierra) vista desde otro escenario: sus series de `others` pasan a ser los
 * meses del activo y Tierra pasa a `others`. Solo para que el cambio de escenario se vea en las stories.
 */
export function simulationFor(s: PlanScenarioKey): PlanSimulation {
  const base = simulationFixture;
  if (s === base.scenario) return base;
  const series = base.others[s] ?? [];
  const months = base.months.map((m) => {
    const o = series.find((x) => x.month === m.month);
    return o ? { ...m, closing_cents: o.closing_cents, mrr_cents: o.mrr_cents ?? m.mrr_cents, arr_cents: o.arr_cents ?? m.arr_cents } : m;
  });
  const others: PlanSimulation['others'] = { [base.scenario]: base.months.map((m) => ({ month: m.month, closing_cents: m.closing_cents, mrr_cents: m.mrr_cents, arr_cents: m.arr_cents })) };
  for (const k of Object.keys(base.others) as PlanScenarioKey[]) if (k !== s) others[k] = base.others[k];
  return { ...base, scenario: s, months, others };
}

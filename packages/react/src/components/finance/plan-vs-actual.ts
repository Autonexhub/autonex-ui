import type { PlanVsActual } from "./types";

export interface PlanVsActualViewRow {
  key: string;
  label: string;
  /** Céntimos (MRR) o unidades (centros). */
  money: boolean;
  plan: number | null;
  actual: number | null;
  delta: number | null;
}

export interface PlanVsActualView {
  /** Último mes cerrado: la única comparación que puntúa. */
  closed: { month: string; baseline: boolean; scored: boolean; rows: PlanVsActualViewRow[] };
  /** Mes en curso, informativo: plan del mes y MRR facturado a fecha, sin desvío. */
  current: { month: string; asOf: string; planMrr: number | null; planCustomers: number | null; billedToDate: number | null } | null;
}

/**
 * «Vs plan» (final-findings #1): solo puntúa el último mes cerrado (facturado frente a plan de facturado) y solo si la
 * API lo marca `scored`, no es el mes de arranque (punto de partida del plan, plan = real) y el MRR real es > 0. Si
 * no puntúa, los desvíos van a null (sin ▲▼ ni color). El mes en curso nunca puntúa: plan del mes y facturado a fecha.
 */
export function planVsActualView(p: PlanVsActual): PlanVsActualView {
  const baseline = !!p.baseline_month && p.month <= p.baseline_month;
  const mrr = p.rows.find((r) => r.key === 'mrr');
  const scored = p.scored === true && !baseline && (mrr?.actual_cents ?? 0) > 0;
  const rows = p.rows.map((r) => {
    const money = r.plan_cents !== undefined;
    return {
      key: r.key,
      label: r.label,
      money,
      plan: (money ? r.plan_cents : r.plan) ?? null,
      actual: (money ? r.actual_cents : r.actual) ?? null,
      delta: scored ? ((money ? r.delta_cents : r.delta) ?? null) : null,
    };
  });
  const c = p.current;
  const cMrr = c?.rows.find((r) => r.key === 'mrr');
  const cCust = c?.rows.find((r) => r.key === 'customers');
  return {
    closed: { month: p.month, baseline, scored, rows },
    current: c
      ? { month: c.month, asOf: c.as_of, planMrr: cMrr?.plan_cents ?? null, planCustomers: cCust?.plan ?? null, billedToDate: cMrr?.actual_cents ?? null }
      : null,
  };
}

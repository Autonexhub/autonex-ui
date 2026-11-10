import { COST_CATEGORIES, PLAN_SCENARIOS, type ActualArrPoint, type CostCategory, type PlanCompareRow, type PlanLevers, type PlanMilestone, type PlanScenarioKey, type PlanSimulation, type RecurringCost } from "./types";

/**
 * Cálculos puros de «Plan y forecast» (spec v3 §4.5): siguiente hito, valores tintados de las palancas,
 * embudo, la columna en vivo del escenario activo y las filas de la trayectoria de ARR.
 */

const EPS = 1e-6;
const differs = (a: number, b: number) => Math.abs(a - b) > EPS * Math.max(1, Math.abs(a), Math.abs(b));

/** Siguiente hito del plan: el primero posterior al último mes real cuyo ARR aún no se ha alcanzado. */
export function nextMilestone(
  actualArr: ActualArrPoint[],
  milestones: PlanMilestone[],
): { milestone: PlanMilestone; currentArrCents: number; gapCents: number } | null {
  const last = [...actualArr].sort((a, b) => a.month.localeCompare(b.month)).slice(-1)[0];
  const current = last?.arr_cents ?? 0;
  const next = [...milestones]
    .sort((a, b) => a.month.localeCompare(b.month))
    .find((m) => (!last || m.month > last.month) && m.arr_cents > current);
  return next ? { milestone: next, currentArrCents: current, gapCents: next.arr_cents - current } : null;
}

/** Valor «tocado» (fondo tintado, patrón Causal): difiere del histórico o del escenario guardado. */
export function isOverride(value: number | null | undefined, hist: number | null | undefined, saved: number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof hist === 'number' && differs(value, hist)) return true;
  return typeof saved === 'number' && differs(value, saved);
}

type FullFunnel = { discoveries: number; demo: number; proposal: number; close: number; centers: number; cents: number };

function fullFunnel(l: PlanLevers): FullFunnel | null {
  const v = [l.discoveries_per_month, l.demo_rate, l.proposal_rate, l.close_rate, l.centers_per_close, l.cents_per_center_month];
  if (v.some((x) => x === null || x === undefined)) return null;
  const [discoveries, demo, proposal, close, centers, cents] = v as number[];
  return { discoveries, demo, proposal, close, centers, cents };
}

/** Tasas acumuladas sobre discoveries: firma ≤ propuesta ≤ demo (si no, el servidor responde 422). */
export function funnelOrderError(l: PlanLevers): 'proposal_gt_demo' | 'close_gt_proposal' | null {
  const f = fullFunnel(l);
  if (!f) return null;
  if (f.proposal > f.demo + EPS) return 'proposal_gt_demo';
  if (f.close > f.proposal + EPS) return 'close_gt_proposal';
  return null;
}

/** Flujo del embudo al mes: demos, propuestas y cierres (discoveries × tasa) y el MRR nuevo que traen. */
export function funnelFlow(l: PlanLevers): { demos: number; proposals: number; closes: number; newMrrCents: number } | null {
  const f = fullFunnel(l);
  if (!f) return null;
  const closes = f.discoveries * f.close;
  return { demos: f.discoveries * f.demo, proposals: f.discoveries * f.proposal, closes, newMrrCents: Math.round(closes * f.centers * f.cents) };
}

/**
 * Columna de «Escenarios lado a lado» rehecha con la simulación en curso (misma receta que el `compare` del
 * servidor): así la tabla y las cifras se mueven al tocar una palanca, antes de guardar.
 */
export function compareFromSimulation(sim: PlanSimulation, levers: PlanLevers, milestones: PlanMilestone[]): PlanCompareRow | null {
  const rows = sim.months;
  const last = rows[rows.length - 1];
  if (!last) return null;
  const arr = last.arr_cents ?? last.mrr_cents * 12;
  let target: number | null = null;
  for (const m of [...milestones].sort((a, b) => a.month.localeCompare(b.month))) if (m.month <= last.month) target = m.arr_cents;
  let min = rows[0];
  let costs = 0;
  for (const r of rows) {
    costs += r.costs_cents;
    if (r.closing_cents < min.closing_cents) min = r;
  }
  const flow = funnelFlow(levers);
  const unit = flow ? (levers.cents_per_center_month as number) : levers.arpa_new_cents;
  return {
    month: last.month,
    discoveries_per_month: flow ? (levers.discoveries_per_month as number) : null,
    closes_per_month: flow ? Math.round(flow.closes * 1000) / 1000 : levers.new_customers_per_month,
    customers_dec: unit > 0 ? Math.round(last.mrr_cents / unit) : null,
    mrr_dec_cents: last.mrr_cents,
    arr_dec_cents: arr,
    arr_target_pct: target && target > 0 ? Math.round((arr / target) * 1000) / 10 : null,
    costs_monthly_cents: Math.round(costs / rows.length),
    ebitda_dec_cents: last.ebitda_cents,
    cash_min_cents: min.closing_cents,
    cash_min_month: min.month,
    break_even_month: sim.answers.break_even?.month ?? null,
    break_even_already: sim.answers.break_even?.already ?? false,
    costs_missing: sim.costs_missing ?? false,
  };
}

export type ArrRow = { month: string; actual: number | null } & Record<PlanScenarioKey, number | null>;

/**
 * Filas de la trayectoria de ARR: el real hasta el último mes cerrado y los tres escenarios de la simulación,
 * enganchados al último punto real para que las líneas salgan de él.
 */
export function arrTrajectoryRows(actualArr: ActualArrPoint[], sim: PlanSimulation): ArrRow[] {
  const byMonth = new Map<string, ArrRow>();
  const row = (month: string) => {
    let r = byMonth.get(month);
    if (!r) {
      r = { month, actual: null, base: null, downside: null, upside: null };
      byMonth.set(month, r);
    }
    return r;
  };
  // Los ceros anteriores al primer ARR real son «aún sin datos», no un ARR de 0 €: se descartan (los ceros posteriores, sí valen).
  const sorted = [...actualArr].sort((a, b) => a.month.localeCompare(b.month));
  const firstReal = sorted.findIndex((p) => p.arr_cents > 0);
  const actual = firstReal < 0 ? sorted : sorted.slice(firstReal);
  for (const p of actual) row(p.month).actual = p.arr_cents;
  for (const m of sim.months) row(m.month)[sim.scenario] = m.arr_cents ?? m.mrr_cents * 12;
  for (const s of PLAN_SCENARIOS) {
    if (s === sim.scenario) continue;
    for (const o of sim.others[s] ?? []) {
      const v = o.arr_cents ?? (o.mrr_cents !== undefined ? o.mrr_cents * 12 : null);
      if (v !== null) row(o.month)[s] = v;
    }
  }
  const anchor = actual[actual.length - 1];
  if (anchor) {
    const r = row(anchor.month);
    for (const s of PLAN_SCENARIOS) if (r[s] === null) r[s] = anchor.arr_cents;
  }
  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/** Hitos válidos para PUT /plan/milestones: 1–24, meses y ARR estrictamente crecientes y ARR > 0 (en el orden dado). */
export function milestonesError(rows: PlanMilestone[]): 'count' | 'months' | 'arr' | null {
  if (rows.length < 1 || rows.length > 24) return 'count';
  for (let i = 0; i < rows.length; i++) {
    if (!/^\d{4}-\d{2}$/.test(rows[i].month) || (i > 0 && rows[i].month <= rows[i - 1].month)) return 'months';
  }
  for (let i = 0; i < rows.length; i++) {
    if (!(rows[i].arr_cents > 0) || (i > 0 && rows[i].arr_cents <= rows[i - 1].arr_cents)) return 'arr';
  }
  return null;
}

/**
 * El 422 de PUT /plan/milestones llega con el texto del servidor en español: se traduce a la misma clave que la
 * validación local (`forecast.milestones.errors.*`) y, si no se reconoce, a un error genérico.
 */
export function milestonesServerError(message: string): 'count' | 'months' | 'arr' | 'server' {
  if (/\blista\b/.test(message)) return 'count';
  if (/repetido|\.month\b/.test(message)) return 'months';
  if (/\bARR\b|arr_cents/.test(message)) return 'arr';
  return 'server';
}

/** El plan se abre en Cielo: es el escenario de referencia (los hitos del plan son los suyos). */
export const defaultScenario = (): PlanScenarioKey => 'upside';

export type ScenarioGapItem = { driver: 'discoveries' | 'closes'; from: number; to: number };

/**
 * «Qué hace falta» para pasar de un escenario a otro: el esfuerzo comercial al mes de cada uno. Con embudo son las
 * discoveries; sin él (escenario solo del deck), los cierres. Vacío si falta un escenario o no hay diferencia.
 */
export function scenarioGap(compare: Partial<Record<PlanScenarioKey, PlanCompareRow>>, from: PlanScenarioKey, to: PlanScenarioKey): ScenarioGapItem[] {
  const a = compare[from];
  const b = compare[to];
  if (!a || !b) return [];
  if (a.discoveries_per_month !== null && b.discoveries_per_month !== null) {
    return differs(a.discoveries_per_month, b.discoveries_per_month) ? [{ driver: 'discoveries', from: a.discoveries_per_month, to: b.discoveries_per_month }] : [];
  }
  return differs(a.closes_per_month, b.closes_per_month) ? [{ driver: 'closes', from: a.closes_per_month, to: b.closes_per_month }] : [];
}

/** Avance hacia el siguiente hito: % con un decimal (de `progress_bp` si viene) y lo que falta en céntimos. */
export function milestoneProgress(m: { arr_now_cents: number; arr_cents: number; progress_bp?: number }): { pct: number; gapCents: number } {
  const raw = m.progress_bp !== undefined ? m.progress_bp / 100 : m.arr_cents > 0 ? (m.arr_now_cents / m.arr_cents) * 100 : 0;
  return { pct: Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10, gapCents: Math.max(0, m.arr_cents - m.arr_now_cents) };
}

export type FixedCostBar = { category: CostCategory; cents: number; pct: number };

/** Costes fijos activos por categoría (equivalente mensual), de mayor a menor, con su peso sobre el total. */
export function fixedCostBars(items: RecurringCost[]): FixedCostBar[] {
  const sums = new Map<CostCategory, number>();
  for (const c of items) {
    if (!c.active) continue;
    const v = c.monthly_equivalent_cents ?? c.amount_cents;
    if (v > 0) sums.set(c.category, (sums.get(c.category) ?? 0) + v);
  }
  const total = [...sums.values()].reduce((a, b) => a + b, 0);
  return [...sums.entries()]
    .sort((a, b) => b[1] - a[1] || COST_CATEGORIES.indexOf(a[0]) - COST_CATEGORIES.indexOf(b[0]))
    .map(([category, cents]) => ({ category, cents, pct: Math.round((cents / total) * 1000) / 10 }));
}

/** Un % exactamente en 0 en la columna «hist.» (churn o coste de servir sin meses ni compras que lo midan) no es dato: guion. */
export function histIsBlank(kind: string, v: unknown): boolean {
  return typeof v !== 'number' || (kind === 'pct' && v === 0);
}

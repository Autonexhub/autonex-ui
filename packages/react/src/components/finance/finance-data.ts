import type { FinanceOverview, PlanLevers, PlanScenario, PlanScenarioKey, StatementRow } from "./types";
import { parseEurosToCents } from "./format";

/** Transformaciones de forma (no de cifras) de Finanzas: series de caja, árbol del PyG, palancas y etiquetas finales. */

/** «5.000» → céntimos; «0» vale (sin colchón). */
export function parseCushion(text: string): number | null {
  if (/^\s*0+([,.]0*)?\s*€?\s*$/.test(text)) return 0;
  const r = parseEurosToCents(text, 100_000_000_00);
  return r.error ? null : r.cents;
}

/** Un mes de la gráfica de caja del Resumen: saldo real a cierre (o a hoy) y forecast de cada escenario. */
export interface CashMonthRow {
  month: string;
  actual_cents: number | null;
  /** Escenario base (Tierra): el mismo que `forecast_base`. */
  forecast_cents: number | null;
  forecast_downside: number | null;
  forecast_base: number | null;
  forecast_upside: number | null;
}

/**
 * Caja diaria real (último saldo de cada mes) + forecast mensual de los tres escenarios, en una serie por mes. El
 * último mes real repite su saldo como punto de partida de cada forecast para que las líneas salgan del real. Sin
 * `forecast_scenarios` (API antigua), el base sale de `forecast` y los otros dos quedan vacíos.
 */
export function cashMonthly(cash: FinanceOverview['cash']): CashMonthRow[] {
  const actual = new Map<string, number>();
  for (const p of cash.actual) actual.set(p.date.slice(0, 7), p.balance_cents);
  const sc = { base: cash.forecast, ...cash.forecast_scenarios };
  const lastActual = [...actual.keys()].sort().pop();
  const byKey = (k: PlanScenarioKey) => new Map((sc[k] ?? []).map((f) => [f.month, f.closing_cents]));
  const maps = { downside: byKey('downside'), base: byKey('base'), upside: byKey('upside') };
  const months = [...new Set([...actual.keys(), ...Object.values(maps).flatMap((m) => [...m.keys()])])].sort();
  const value = (k: PlanScenarioKey, m: string): number | null =>
    maps[k].get(m) ?? (m === lastActual && maps[k].size > 0 ? actual.get(m) ?? null : null);
  return months.map((m) => ({
    month: m,
    actual_cents: actual.get(m) ?? null,
    forecast_cents: value('base', m),
    forecast_downside: value('downside', m),
    forecast_base: value('base', m),
    forecast_upside: value('upside', m),
  }));
}

/** Mes de hoy si la serie lo contiene (la marca «Hoy» de la gráfica necesita un valor del eje X); si no, null. */
export function cashTodayMonth(series: readonly { month: string }[], asOf: string): string | null {
  const m = asOf.slice(0, 7);
  return series.some((r) => r.month === m) ? m : null;
}


/** Árbol de filas del PyG a partir de las filas planas con `parent`. */
export interface StatementNode extends StatementRow {
  children: StatementNode[];
}
export function statementTree(rows: StatementRow[]): StatementNode[] {
  const byKey = new Map<string, StatementNode>(rows.map((r) => [r.key, { ...r, children: [] }]));
  const roots: StatementNode[] = [];
  for (const r of rows) {
    const node = byKey.get(r.key)!;
    const parent = r.parent ? byKey.get(r.parent) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}


/** Solo los drivers de un escenario (sin key/label/origin) para simulate y PUT /plan/{scenario}. */
export function leversOf(s: PlanScenario): PlanLevers {
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


/**
 * Desplazamiento vertical (px) de las etiquetas finales para que no se pisen: si dos extremos de línea quedan a menos de
 * `minGap` px, se separan hacia abajo siguiendo el orden de valor (el mayor arriba). `span` = rango del eje Y en
 * céntimos y `plotPx` = alto útil de la gráfica.
 */
export function endLabelOffsets(items: { key: string; value: number }[], span: number, plotPx: number, minGap = 14): Record<string, number> {
  const out: Record<string, number> = {};
  if (!(span > 0)) return Object.fromEntries(items.map((i) => [i.key, 0]));
  const sorted = [...items].sort((a, b) => b.value - a.value);
  let prevY: number | null = null;
  for (const i of sorted) {
    const y = ((sorted[0].value - i.value) / span) * plotPx;
    const placed: number = prevY === null ? y : Math.max(y, prevY + minGap);
    out[i.key] = Math.round(placed - y);
    prevY = placed;
  }
  return out;
}

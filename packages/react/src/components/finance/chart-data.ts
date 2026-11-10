import type { AgingBucketKey, FinanceAging, MrrMovementMonth, PnlMonth } from "./types";

/**
 * Datos de las gráficas de Finanzas v3, en puro (sin React ni Intl) para poder probarlos con vitest.
 * Las etiquetas salen en español por defecto; quien tenga `t()` las sustituye con el segundo argumento.
 */

export interface ChartSegment<K extends string = string> {
  key: K;
  label: string;
  cents: number;
}

/** Un mes de barras pareadas: entradas apiladas (verdes) junto a salidas apiladas (rojas) y el neto. */
export interface PairedBarRow {
  month: string;
  in: ChartSegment[];
  out: ChartSegment[];
  net_cents: number;
}

export type AgingFiveKey = 'por_vencer' | '1_30' | '31_60' | '60_mas' | 'sin_vencimiento';

export interface AgingBarBucket {
  key: AgingFiveKey;
  label: string;
  cents: number;
  count?: number;
}

const PAIRED_LABELS = {
  recurring: 'Recurrente',
  services: 'Servicios',
  usage: 'Consumo',
  other: 'Otros',
  cost_to_serve: 'Coste de servir',
  opex: 'Gastos de explotación',
};
export type PairedLabelKey = keyof typeof PAIRED_LABELS;

/** PyG mensual → barras pareadas. El neto es el resultado del mes que manda la API (no se recalcula). */
export function pairedRowsFromSeries(
  series: PnlMonth[],
  labels: Partial<Record<PairedLabelKey, string>> = {},
): PairedBarRow[] {
  const l = { ...PAIRED_LABELS, ...labels };
  return series.map((m) => ({
    month: m.month,
    in: (['recurring', 'services', 'usage', 'other'] as const).map((k) => ({ key: k, label: l[k], cents: m.revenue[k] ?? 0 })),
    out: [
      { key: 'cost_to_serve', label: l.cost_to_serve, cents: m.cost_to_serve_cents },
      { key: 'opex', label: l.opex, cents: m.opex_cents },
    ],
    net_cents: m.result_cents,
  }));
}

/**
 * PyG mensual → barras de la Cuenta de resultados: ingresos en dos tramos (recurrente y el resto: servicios,
 * consumo y otros) junto a una barra de gastos totales, y el resultado. Menos tramos que la tabla a propósito:
 * el gráfico enseña la tendencia; el detalle está en la tabla de debajo.
 */
export function pnlRowsFromSeries(
  series: PnlMonth[],
  labels: Partial<Record<'recurring' | 'nonRecurring' | 'costs', string>> = {},
): PairedBarRow[] {
  const l = { recurring: 'Recurrente', nonRecurring: 'No recurrente', costs: 'Gastos', ...labels };
  return series.map((m) => ({
    month: m.month,
    in: [
      { key: 'recurring', label: l.recurring, cents: m.revenue.recurring ?? 0 },
      { key: 'non_recurring', label: l.nonRecurring, cents: m.revenue_cents - (m.revenue.recurring ?? 0) },
    ],
    out: [{ key: 'costs', label: l.costs, cents: m.costs_cents }],
    net_cents: m.result_cents,
  }));
}

/**
 * PyG mensual → barras pareadas de totales (Resumen, spec §4.2): una barra de ingresos y una de gastos por mes.
 * Ingresos − gastos = resultado (la API lo garantiza; el neto se toma tal cual).
 */
export function totalsRowsFromSeries(
  series: PnlMonth[],
  labels: Partial<Record<'revenue' | 'costs', string>> = {},
): PairedBarRow[] {
  const l = { revenue: 'Ingresos', costs: 'Gastos', ...labels };
  return series.map((m) => ({
    month: m.month,
    in: [{ key: 'revenue', label: l.revenue, cents: m.revenue_cents }],
    out: [{ key: 'costs', label: l.costs, cents: m.costs_cents }],
    net_cents: m.result_cents,
  }));
}

const MOVEMENT_LABELS = {
  new: 'Nuevo',
  expansion: 'Expansión',
  reactivation: 'Reactivación',
  contraction: 'Contracción',
  churn: 'Churn',
};
export type MovementLabelKey = keyof typeof MOVEMENT_LABELS;

/** `-Math.abs` sin dejar un -0 suelto. */
const negative = (c: number): number => -Math.abs(c) || 0;

const AGING_LABELS: Record<AgingFiveKey, string> = {
  por_vencer: 'Por vencer',
  '1_30': '1–30 días',
  '31_60': '31–60 días',
  '60_mas': 'Más de 60 días',
  sin_vencimiento: 'Sin vencimiento',
};

const AGING_SOURCE: Record<AgingFiveKey, AgingBucketKey[]> = {
  por_vencer: ['por_vencer'],
  '1_30': ['1_30'],
  '31_60': ['31_60'],
  '60_mas': ['61_90', '90_mas'],
  sin_vencimiento: ['sin_vencimiento'],
};

/** Seis tramos de la API → cinco de la barra: «61–90» y «más de 90» se funden en «más de 60». */
export function agingFiveBuckets(aging: FinanceAging, labels: Partial<Record<AgingFiveKey, string>> = {}): AgingBarBucket[] {
  return (Object.keys(AGING_SOURCE) as AgingFiveKey[]).map((key) => {
    const src = aging.buckets.filter((b) => AGING_SOURCE[key].includes(b.key));
    const apiLabel = src.length === 1 && AGING_SOURCE[key].length === 1 ? src[0].label : undefined;
    return {
      key,
      label: labels[key] ?? apiLabel ?? AGING_LABELS[key],
      cents: src.reduce((s, b) => s + b.pending_cents, 0),
      count: src.reduce((s, b) => s + b.count, 0),
    };
  });
}

/**
 * Tramo [primer, último] de meses del Holded antiguo (`source: 'legacy'`) dentro de la serie, para la banda
 * gris del gráfico; null si no hay ninguno. Los meses `mixed` (el del corte) ya no cuentan como histórico.
 */
export function legacyRange(series: { month: string; source: string | null }[]): { from: string; to: string } | null {
  const legacy = series.filter((m) => m.source === 'legacy');
  return legacy.length ? { from: legacy[0].month, to: legacy[legacy.length - 1].month } : null;
}

/** Índice del último valor real (número finito) de `key` en `rows`; -1 si no hay ninguno. Para `lastDot`. */
export function lastRealIndex(rows: readonly object[], key: string): number {
  for (let i = rows.length - 1; i >= 0; i--) {
    const v = (rows[i] as Record<string, unknown>)[key];
    if (typeof v === 'number' && Number.isFinite(v)) return i;
  }
  return -1;
}

export type BridgeStepKey = 'start' | MovementLabelKey | 'timing' | 'end';

export interface BridgeStep {
  key: BridgeStepKey;
  label: string;
  /** Importe con signo (inicio y fin, el total del mes). */
  cents: number;
  /** Desde dónde flota la barra (0 en inicio y fin). */
  base: number;
  /** Largo de la barra, siempre ≥ 0. */
  value: number;
  kind: 'total' | 'up' | 'down';
}

const BRIDGE_LABELS: Record<BridgeStepKey, string> = {
  start: 'MRR inicial',
  new: 'Nuevo',
  expansion: 'Expansión',
  reactivation: 'Reactivación',
  contraction: 'Contracción',
  churn: 'Churn',
  timing: 'Sin facturar / atrasadas',
  end: 'MRR final',
};

/**
 * Puente del mes (cascada): inicio, sumas, restas, «sin facturar / atrasadas» y fin. Los pasos a 0 se omiten salvo
 * inicio y fin. Contracción y churn restan venga como venga el signo. Si la respuesta es antigua (sin start/end/timing),
 * el inicio es 0 y el fin sale de sumar, para que siempre cierre: end = start + Σ pasos.
 */
export function bridgeSteps(row: MrrMovementMonth, labels: Partial<Record<BridgeStepKey, string>> = {}): BridgeStep[] {
  const l = { ...BRIDGE_LABELS, ...labels };
  const start = row.start_cents ?? 0;
  const moves: [BridgeStepKey, number][] = [
    ['new', row.new_cents],
    ['expansion', row.expansion_cents],
    ['reactivation', row.reactivation_cents ?? 0],
    ['contraction', negative(row.contraction_cents)],
    ['churn', negative(row.churn_cents)],
    ['timing', row.timing_cents ?? 0],
  ];
  const steps: BridgeStep[] = [{ key: 'start', label: l.start, cents: start, base: 0, value: start, kind: 'total' }];
  let run = start;
  for (const [key, cents] of moves) {
    if (cents === 0) continue;
    const base = cents > 0 ? run : run + cents;
    run += cents;
    steps.push({ key, label: l[key], cents, base, value: Math.abs(cents), kind: cents > 0 ? 'up' : 'down' });
  }
  steps.push({ key: 'end', label: l.end, cents: run, base: 0, value: run, kind: 'total' });
  return steps;
}

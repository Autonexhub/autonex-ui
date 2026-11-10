import type { StatementColumn, StatementRow } from "./types";

/**
 * Columnas visibles de la cuenta de resultados y sus Δ, en puro (sin React ni Intl) para probarlo con vitest.
 * El backend manda 12 meses + QTD + YTD + `prev` + `delta` (y aparte las vistas por trimestre y año); aquí se elige
 * qué se enseña y la Δ del mes se recalcula contra el comparado: vale para «mes anterior» y «mismo mes del año anterior».
 */

export type CompareMode = 'prev' | 'yoy';

export interface StatementData {
  columns: StatementColumn[];
  rows: StatementRow[];
}

/** «YYYY-MM» n meses atrás (n negativo: hacia delante). */
export function monthsBack(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number);
  const t = y * 12 + (m - 1) - n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
}

const monthCols = (cols: StatementColumn[]) => cols.filter((c) => c.type === 'month');

/** El mes pedido: la última columna mensual. */
export function currentColumn(cols: StatementColumn[]): StatementColumn | undefined {
  const m = monthCols(cols);
  return m[m.length - 1];
}

/** Columna con la que se compara el mes pedido, o null si no está en los datos. */
export function compareColumn(cols: StatementColumn[], compare: CompareMode): StatementColumn | null {
  const cur = currentColumn(cols);
  if (!cur) return null;
  const target = monthsBack(cur.key, compare === 'yoy' ? 12 : 1);
  if (compare === 'prev') {
    const prev = cols.find((c) => c.type === 'prev' && c.from === target);
    if (prev) return prev;
  }
  return monthCols(cols).find((c) => c.key === target) ?? null;
}

/** Mes con el que se compara («YYYY-MM») o null si no hay datos de ese mes. */
export const compareMonth = (cols: StatementColumn[], compare: CompareMode): string | null => compareColumn(cols, compare)?.from ?? null;

/** Columna Δ sintética: del mes comparado al mes pedido. */
function deltaColumn(cols: StatementColumn[], compare: CompareMode): StatementColumn | null {
  const cur = currentColumn(cols);
  const cmp = compareColumn(cols, compare);
  if (!cur || !cmp) return null;
  return { key: 'delta', label: 'Δ', type: 'delta', from: cmp.from, to: cur.key, source: null };
}

/** Vista por mes: mes comparado · mes · Δ. Sin mes comparado, solo el mes. El trimestre y el año tienen su vista. */
export function defaultColumns(cols: StatementColumn[], compare: CompareMode): StatementColumn[] {
  const cur = currentColumn(cols);
  if (!cur) return [];
  const cmp = compareColumn(cols, compare);
  const delta = deltaColumn(cols, compare);
  return [...(cmp ? [cmp] : []), cur, ...(delta ? [delta] : [])];
}

/**
 * Vista ancha por mes («Histórico»): los 12 meses que acaban en el pedido y la Δ del mes contra el comparado. El
 * mes del año anterior (si se ha añadido para comparar) solo cuenta en la Δ, no como columna.
 */
export function wideColumns(cols: StatementColumn[], compare: CompareMode): StatementColumn[] {
  const cur = currentColumn(cols);
  const floor = cur ? monthsBack(cur.key, 12) : '';
  const delta = deltaColumn(cols, compare);
  return [...monthCols(cols).filter((c) => c.key > floor), ...(delta ? [delta] : [])];
}

/**
 * Vista por trimestre o año (`statements.quarter|year` de la API): periodo anterior comparable · periodo · Δ; en
 * ancha, todos los periodos y la Δ. El anterior comparable va recortado a los mismos meses que lleva el actual.
 */
export function periodColumns(cols: StatementColumn[], view: 'compact' | 'wide'): StatementColumn[] {
  const periods = cols.filter((c) => c.type === 'period');
  const cur = periods[periods.length - 1];
  const prev = cols.find((c) => c.type === 'prev');
  const delta = cols.find((c) => c.type === 'delta');
  if (!cur) return [];
  if (view === 'wide') return [...periods, ...(delta ? [delta] : [])];
  return [...(prev ? [prev] : []), cur, ...(delta ? [delta] : [])];
}

/** Meses [desde, hasta] que cubre una columna (la Δ, los de las dos que compara). */
export function columnMonths(cols: StatementColumn[], c: StatementColumn): string[][] {
  if (c.type !== 'delta') return [[c.from, c.to]];
  return [valueIndex(cols, c.from), valueIndex(cols, c.to)].filter((i) => i >= 0).map((i) => [cols[i].from, cols[i].to]);
}

/** La columna toca algún mes con costes incompletos (para la Δ: cualquiera de los dos periodos que compara). */
export function columnIncomplete(cols: StatementColumn[], c: StatementColumn, incompleteMonths: string[]): boolean {
  return columnMonths(cols, c).some(([f, t]) => incompleteMonths.some((m) => m >= f && m <= t));
}

/** Estado de la carga del mismo mes del año anterior. */
export type YoyState = 'idle' | 'loading' | 'error' | 'ready';

/**
 * Comparación que de verdad se aplica: «mismo mes del año anterior» cae a «mes anterior» si ese mes no está
 * entre los disponibles o no se ha podido cargar (así nunca se queda una tabla sin Δ).
 */
export function effectiveCompare(compare: CompareMode, yoyAvailable: boolean, yoy: YoyState): CompareMode {
  return compare === 'yoy' && yoyAvailable && yoy !== 'error' ? 'yoy' : 'prev';
}

/** Posición en `values` de la columna mensual (o `prev`) de un mes; -1 si no está. */
export function valueIndex(cols: StatementColumn[], month: string): number {
  const i = cols.findIndex((c) => c.type === 'month' && c.key === month);
  if (i >= 0) return i;
  const p = cols.findIndex((c) => c.type === 'prev' && c.from === month);
  // Vistas por periodo: la Δ apunta por clave (`prev` y el inicio del periodo actual).
  return p >= 0 ? p : cols.findIndex((c) => c.key === month);
}

/** Importe con signo de resultado: los costes (que llegan en positivo) restan. */
const signed = (r: StatementRow, v: number) => (r.kind === 'cost' ? -Math.abs(v) : v);

const at = (r: StatementRow, i: number): number | null => (i < 0 ? null : (r.values[i] ?? null));

/**
 * Δ de la columna `a` (mes) contra la `b` (comparado) en efecto sobre el resultado: positivo es bueno. Un
 * coste que baja da Δ positiva; un ingreso que baja, negativa. En filas de % es la diferencia en tanto por uno.
 */
export function deltaOf(row: StatementRow, a: number, b: number): number | null {
  const va = at(row, a);
  const vb = at(row, b);
  if (va === null || vb === null) return null;
  if (row.kind === 'pct') return va - vb;
  return signed(row, va) - signed(row, vb);
}

/** Δ en puntos porcentuales del peso de la fila sobre los ingresos (modo «% ingresos»). */
export function deltaShareOf(row: StatementRow, revenue: StatementRow | undefined, a: number, b: number): number | null {
  if (!revenue || row.kind === 'pct') return null;
  const va = at(row, a);
  const vb = at(row, b);
  const ra = at(revenue, a);
  const rb = at(revenue, b);
  if (va === null || vb === null || !ra || !rb) return null;
  return (signed(row, va) / ra - signed(row, vb) / rb) * 100;
}

export type DeltaTone = 'good' | 'bad' | 'neutral';

/**
 * Celda Δ ya decidida: valor, unidad y tono. En € es el efecto sobre el resultado (`deltaOf`); en «% ingresos»
 * son puntos del peso sobre ingresos (`deltaShareOf`), salvo las filas de % que siempre van en pp (`deltaOf`).
 * En «% ingresos» la Δ de las líneas de ingreso es mezcla, ni buena ni mala: tono neutro.
 * Con `estimated` (alguno de los dos meses no tiene compras, `deltaIsEstimate`) conserva su tono bueno/malo
 * y la celda va marcada como estimación (`estimate: true`).
 */
export function deltaCell(
  row: StatementRow,
  revenue: StatementRow | undefined,
  a: number,
  b: number,
  mode: 'amount' | 'pct',
  estimated = false,
): { value: number; unit: 'eur' | 'pp'; tone: DeltaTone; estimate?: true } | null {
  let value: number | null;
  let unit: 'eur' | 'pp';
  if (row.kind === 'pct') {
    const d = deltaOf(row, a, b);
    value = d === null ? null : d * 100;
    unit = 'pp';
  } else if (mode === 'pct') {
    value = deltaShareOf(row, revenue, a, b);
    unit = 'pp';
  } else {
    value = deltaOf(row, a, b);
    unit = 'eur';
  }
  if (value === null) return null;
  const mix = mode === 'pct' && row.kind === 'revenue';
  const tone: DeltaTone = mix || value === 0 ? 'neutral' : value > 0 ? 'good' : 'bad';
  return estimated ? { value, unit, tone, estimate: true } : { value, unit, tone };
}

/** Una columna Δ es estimación si cualquiera de los dos meses que compara (`from`, `to`) tiene costes incompletos. */
export function deltaIsEstimate(c: StatementColumn, incompleteMonths: string[]): boolean {
  return c.type === 'delta' && (incompleteMonths.includes(c.from) || incompleteMonths.includes(c.to));
}

/** El estado con una columna vacía delante para un mes que aún se está cargando (celdas a null). */
export function withPendingMonth(base: StatementData, month: string): StatementData {
  if (base.columns.some((c) => c.type === 'month' && c.key === month)) return base;
  const col: StatementColumn = { key: month, label: month, type: 'month', from: month, to: month, source: null };
  return { columns: [col, ...base.columns], rows: base.rows.map((r) => ({ ...r, values: [null, ...r.values] })) };
}

/**
 * Pone delante del estado el último mes de otro estado (el del mismo mes del año anterior) para poder
 * compararlo. Se casa por clave de fila; una fila que no existía entonces vale 0 (o null si es un %), y las
 * filas que solo existían entonces no se añaden.
 */
export function withExtraMonth(base: StatementData, other: StatementData): StatementData {
  const last = currentColumn(other.columns);
  if (!last || base.columns.some((c) => c.type === 'month' && c.key === last.key)) return base;
  const idx = other.columns.indexOf(last);
  const byKey = new Map(other.rows.map((r) => [r.key, r.values[idx] ?? null]));
  return {
    columns: [last, ...base.columns],
    rows: base.rows.map((r) => ({ ...r, values: [byKey.has(r.key) ? byKey.get(r.key)! : r.kind === 'pct' ? null : 0, ...r.values] })),
  };
}

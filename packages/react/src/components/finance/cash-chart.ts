import type { CashPeriod, CashTableRow } from "./types";
import { formatAccounting, formatSignedPlain } from "./format";

/** Clave del punto «Hoy» en el eje (no es un periodo: no se puede clicar ni tiene barras). */
export const TODAY_KEY = '__today';

export type CashChartRow = CashPeriod & {
  pending: number;
  forecast: number;
  /** Cobros del periodo en una sola serie: pendientes de factura + previstos. */
  collections: number;
  out_abs: number;
  /** El ancla «Hoy» (saldo de apertura real). */
  today: boolean;
  /** Periodo ya cerrado (`end < as_of`): barras atenuadas. */
  actual: boolean;
  /** Saldo final en el tramo real (línea sólida) y en el previsto (discontinua); se tocan en el mes en curso. */
  closing_real: number | null;
  closing_forecast: number | null;
};

/**
 * Filas del gráfico de caja (spec v3 §4.4). Con `as_of`, se antepone el punto real «Hoy» con el saldo de
 * apertura; la línea es sólida desde él (y desde los periodos ya cerrados) hasta el cierre del periodo en
 * curso, y discontinua desde ahí. Sin `as_of`, todo es previsión.
 */
export function cashChartRows(data: { periods: CashPeriod[]; opening_cents?: number; as_of?: string }, todayLabel: string): CashChartRow[] {
  const asOf = data.as_of ?? '';
  const anchored = !!asOf && data.opening_cents !== undefined;
  // Periodo en curso: el primero que no ha terminado. Si todos han terminado, el último.
  const open = data.periods.findIndex((p) => p.end >= asOf);
  const currentIdx = !anchored ? -1 : open === -1 ? data.periods.length - 1 : open;
  const rows: CashChartRow[] = data.periods.map((p, i) => {
    const hasSplit = p.in_pending_cents !== undefined || p.in_forecast_cents !== undefined;
    const pending = hasSplit ? p.in_pending_cents ?? 0 : p.in_cents;
    const forecast = hasSplit ? p.in_forecast_cents ?? 0 : 0;
    return {
      ...p,
      pending,
      forecast,
      collections: pending + forecast,
      out_abs: Math.abs(p.out_cents),
      today: false,
      actual: !!asOf && p.end < asOf,
      closing_real: anchored && i <= currentIdx ? p.closing_cents : null,
      closing_forecast: !anchored || i >= currentIdx ? p.closing_cents : null,
    };
  });
  if (!anchored) return rows;
  const today: CashChartRow = {
    start: TODAY_KEY,
    end: asOf,
    label: todayLabel,
    in_cents: 0,
    out_cents: 0,
    closing_cents: data.opening_cents ?? 0,
    lines: [],
    pending: 0,
    forecast: 0,
    collections: 0,
    out_abs: 0,
    today: true,
    actual: true,
    closing_real: data.opening_cents ?? 0,
    closing_forecast: null,
  };
  return [today, ...rows];
}

/** Saldos de la tabla de cash flow: lo único de la tabla que va en rojo si es negativo (es un estado). */
const CASH_STOCK = new Set(['opening', 'closing']);

/**
 * Texto y tono de una celda de la tabla de cash flow (§4.8): saldos negativos en rojo y contables; flujo neto en
 * tinta con signo (+/−), que es una variación del periodo y no un estado; el resto contable y en tinta.
 */
export function cashCell(rowKey: string, cents: number): { text: string; tone: 'ink' | 'bad' } {
  if (rowKey === 'net') return { text: Math.round(cents / 100) === 0 ? '–' : formatSignedPlain(cents), tone: 'ink' };
  return { text: formatAccounting(cents), tone: cents < 0 && CASH_STOCK.has(rowKey) ? 'bad' : 'ink' };
}

/** Cuántos meses se enseñan por defecto en Tesorería (el resto, con «12 meses»). */
export const DEFAULT_VISIBLE_MONTHS = 6;

export type VisibleRange = 'default' | 'all';

/** Periodos que se enseñan: los 6 primeros por defecto o todos (12). */
export function visiblePeriods<T>(periods: T[], range: VisibleRange): T[] {
  return range === 'all' ? periods : periods.slice(0, DEFAULT_VISIBLE_MONTHS);
}

/** La tabla de cash flow recortada a las `n` primeras columnas (cada fila y sus hijas llevan un valor por columna). */
export function trimTable(table: { columns: { start: string; end: string; label: string }[]; rows: CashTableRow[] }, n: number): { columns: { start: string; end: string; label: string }[]; rows: CashTableRow[] } {
  const cut = (r: CashTableRow): CashTableRow => ({ ...r, values: r.values.slice(0, n), ...(r.children ? { children: r.children.map(cut) } : {}) });
  return { columns: table.columns.slice(0, n), rows: table.rows.map(cut) };
}

/**
 * La cuenta de un saldo (R1): saldo de partida + entradas − salidas − IVA = saldo al cierre del periodo `index`.
 * El IVA (mod. 303) sale de `by_type.vat` y se separa de las demás salidas; las `out_cents` de la API ya lo incluyen.
 */
export function cashBridge(
  periods: CashPeriod[],
  openingCents: number,
  index: number,
): { opening: number; in: number; out: number; vat: number; closing: number } {
  const upto = periods.slice(0, index + 1);
  const inCents = upto.reduce((s, p) => s + p.in_cents, 0);
  const outAll = upto.reduce((s, p) => s + Math.abs(p.out_cents), 0);
  const vat = upto.reduce((s, p) => s + Math.abs(p.by_type?.vat ?? 0), 0);
  return { opening: openingCents, in: inCents, out: outAll - vat, vat, closing: upto.length ? upto[upto.length - 1].closing_cents : openingCents };
}

import type { AgingContact, AgingDocument, CashPeriod, FinanceAging, FinanceBillingMethod, MethodsByContact } from "./types";
import type { AgingBarBucket, AgingFiveKey } from "./chart-data";

/**
 * Datos de Tesorería v3 en puro (sin React ni Intl) para probarlos con vitest: la tabla por cliente de
 * «Cobros pendientes» / «A pagar» y el margen sobre el colchón.
 */

/** Estado de un cliente en la tabla, de lo más urgente a lo informativo. */
export type ReceivableStatus = 'overdue' | 'unreconciled' | 'test_amount' | 'no_due' | 'on_time';

export interface ReceivableRow extends AgingContact {
  /** Método de cobro de Cobros; `none` si el contacto no tiene cuenta de cobros o no lo tiene decidido. */
  method: FinanceBillingMethod;
  organization_id: number | null;
  status: ReceivableStatus;
  /** Documentos pendientes del contacto (sin anuladas), del más antiguo al más reciente. */
  documents: AgingDocument[];
  /** El documento de `oldest_number`, para enlazarlo en Holded. */
  oldest: AgingDocument | null;
}

function statusOf(c: AgingContact, docs: AgingDocument[]): ReceivableStatus {
  if (c.max_days_overdue > 0 && docs.length > 0 && docs.every((d) => d.flags.includes('importe_de_prueba'))) return 'test_amount';
  if (c.max_days_overdue > 0) return 'overdue';
  if (docs.some((d) => d.flags.includes('posible_cobro_sin_conciliar'))) return 'unreconciled';
  if (docs.length > 0 && docs.every((d) => d.flags.includes('importe_de_prueba'))) return 'test_amount';
  if (docs.length > 0 && docs.every((d) => !d.due_date)) return 'no_due';
  return 'on_time';
}

/**
 * Payload sin `by_contact` (API anterior): el mismo resumen por contacto calculado de los documentos,
 * agrupando por nombre. El nombre hace de `contact_id`, así que no casa con `methods_by_contact`.
 */
function contactsFromDocuments(docs: AgingDocument[]): AgingContact[] {
  const map = new Map<string, AgingContact>();
  for (const d of [...docs].sort((a, b) => a.date.localeCompare(b.date))) {
    const c = map.get(d.contact_name) ?? {
      contact_id: d.contact_name,
      contact_name: d.contact_name,
      pending_cents: 0,
      overdue_cents: 0,
      oldest_number: d.number,
      oldest_date: d.date,
      max_days_overdue: 0,
      count: 0,
    };
    const late = d.days_overdue ?? 0;
    c.pending_cents += d.pending_cents;
    if (late > 0) c.overdue_cents += d.pending_cents;
    c.max_days_overdue = Math.max(c.max_days_overdue, late);
    c.count += 1;
    map.set(d.contact_name, c);
  }
  return [...map.values()];
}

/**
 * `by_contact` de la API → filas de la tabla: cada contacto con su método de cobro (o `none` si no está en
 * `methods_by_contact`), sus documentos y su estado. Primero quien más tarde va, luego quien más debe.
 */
export function receivableRows(aging: FinanceAging, methods: MethodsByContact = {}): ReceivableRow[] {
  const live = aging.documents.filter((d) => !d.flags.includes('anulada'));
  const fallback = aging.by_contact === undefined;
  return (fallback ? contactsFromDocuments(live) : aging.by_contact ?? [])
    .map((c) => {
      const documents = live
        .filter((d) => d.contact_name === c.contact_name)
        .sort((a, b) => (a.due_date ?? a.date).localeCompare(b.due_date ?? b.date));
      const m = fallback ? undefined : methods[c.contact_id];
      return {
        ...c,
        method: m?.method ?? 'none',
        organization_id: m?.organization_id ?? null,
        status: statusOf(c, documents),
        documents,
        oldest: documents.find((d) => d.number === c.oldest_number) ?? documents[0] ?? null,
      };
    })
    .sort((a, b) => b.max_days_overdue - a.max_days_overdue || b.pending_cents - a.pending_cents);
}

/** El punto más justo del horizonte: el mínimo de saldo final − colchón y el periodo (`start`) en que cae. */
export function cushionMargin(periods: CashPeriod[], cushionCents: number): { month: string; margin_cents: number } | null {
  let best: { month: string; margin_cents: number } | null = null;
  for (const p of periods) {
    const margin = p.closing_cents - cushionCents;
    if (!best || margin < best.margin_cents) best = { month: p.start, margin_cents: margin };
  }
  return best;
}

const DAY = 24 * 60 * 60 * 1000;
const days = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

/** Plazo de pago que se pone en las facturas: el más habitual entre emisión y vencimiento (sin anuladas). */
export function invoiceTermDays(docs: AgingDocument[]): number | null {
  const counts = new Map<number, number>();
  for (const d of docs) {
    if (!d.due_date || d.flags.includes('anulada')) continue;
    const n = days(d.date, d.due_date);
    if (n >= 0) counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  let best: [number, number] | null = null;
  for (const [n, c] of counts) if (!best || c > best[1] || (c === best[1] && n < best[0])) best = [n, c];
  return best ? best[0] : null;
}

export interface AgingFigure {
  key: AgingFiveKey;
  label: string;
  cents: number;
  count: number;
  /** Ya vencido (todo menos «por vencer»): se pinta en rojo si tiene importe. */
  overdue: boolean;
}

const FIGURE_KEYS: AgingFiveKey[] = ['por_vencer', '1_30', '31_60', '60_mas'];

/**
 * Antigüedad del pendiente en cuatro cifras (por vencer, 1–30, 31–60, más de 60) y «sin vencimiento» aparte:
 * no es un tramo de retraso, es lo que no tiene fecha. `noDue` es null si el tramo no viene en los datos.
 */
export function agingFigures(buckets: AgingBarBucket[]): { figures: AgingFigure[]; noDue: AgingFigure | null } {
  const figure = (b: AgingBarBucket): AgingFigure => ({ key: b.key, label: b.label, cents: b.cents, count: b.count ?? 0, overdue: b.key !== 'por_vencer' && b.key !== 'sin_vencimiento' });
  const by = new Map(buckets.map((b) => [b.key, b]));
  return {
    figures: FIGURE_KEYS.flatMap((k) => (by.has(k) ? [figure(by.get(k)!)] : [])),
    noDue: by.has('sin_vencimiento') ? figure(by.get('sin_vencimiento')!) : null,
  };
}

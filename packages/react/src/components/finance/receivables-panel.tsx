import { Fragment, useState, type ReactNode } from "react";
import { ArrowSquareOut, CaretRight } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { StatusDot, type StatusDotVariant } from "../molecules/status-dot";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AgingFigures, type AgingFiguresLabels } from "./aging-figures";
import { agingFiveBuckets, type AgingFiveKey } from "./chart-data";
import { FinanceStatStrip, type FinanceStatProps } from "./finance-stat";
import { formatAccounting, formatCentsRound, formatDayShort, getFinanceLocale } from "./format";
import { invoiceTermDays, receivableRows, type ReceivableRow, type ReceivableStatus } from "./receivables";
import type { AgingDocument, DocumentFlag, FinanceAging, FinanceBillingMethod } from "./types";

const STATUS_DOT: Record<ReceivableStatus, StatusDotVariant> = {
  overdue: "destructive",
  unreconciled: "warning",
  test_amount: "secondary",
  no_due: "secondary",
  on_time: "success",
};

export interface ReceivablesPanelLabels {
  ar: {
    pending: string;
    holdedNote: (amount: string) => string;
    matchedNote: (amount: string) => string;
    /** Tooltip del pendiente de cobro estimado. */
    tip: (v: { holded: string; cancelled: string; matched: string; real: string }) => string;
    caption: string;
    contact: string;
    empty: string;
  };
  ap: {
    pending: string;
    pendingNote: (v: { docs: string; contacts: string }) => string;
    contacts: (count: number) => string;
    expected30: string;
    caption: string;
    contact: string;
    empty: string;
  };
  invoices: (count: number) => string;
  daysN: (count: number) => string;
  overdue: string;
  overdueNote: (v: { docs: string; days: string }) => string;
  nothingOverdue: string;
  due30: string;
  byDueDate: string;
  dso: string;
  dsoHint: string;
  invoiceTerm: (days: string) => string;
  daysLate: (count: number) => string;
  byAge: string;
  byAgeNote: string;
  buckets: Record<AgingFiveKey, string>;
  col: { pending: string; overdue: string; oldest: string; method: string; status: string; action: string };
  status: Record<ReceivableStatus, string>;
  flag: Record<Exclude<DocumentFlag, "sin_vencimiento">, string>;
  noDocs: string;
  docs: (count: number) => string;
  dueOn: (date: string) => string;
  noDue: string;
  openInHolded: string;
  methods: Record<FinanceBillingMethod, string>;
  aging: Partial<AgingFiguresLabels>;
}

const plural = (n: number, one: string, other: string) => `${n} ${n === 1 ? one : other}`;

export const DEFAULT_RECEIVABLES_PANEL_LABELS: ReceivablesPanelLabels = {
  ar: {
    pending: "Pendiente de cobro",
    holdedNote: (amount) => `${amount} en Holded`,
    matchedNote: (amount) => `${amount} ya cobrados sin conciliar`,
    tip: ({ holded, cancelled, matched, real }) => `En Holded: ${holded}\nMenos anuladas: ${cancelled}\nMenos ya cobradas sin conciliar: ${matched}\nPendiente de cobro estimado: ${real}`,
    caption: "Cobros pendientes por cliente",
    contact: "Cliente",
    empty: "Sin facturas pendientes de cobro.",
  },
  ap: {
    pending: "Pendiente de pago",
    pendingNote: ({ docs, contacts }) => `${docs} · ${contacts}`,
    contacts: (count) => plural(count, "proveedor", "proveedores"),
    expected30: "A pagar en 30 días",
    caption: "Pagos pendientes por proveedor",
    contact: "Proveedor",
    empty: "Sin compras pendientes de pago.",
  },
  invoices: (count) => plural(count, "factura", "facturas"),
  daysN: (count) => plural(count, "día", "días"),
  overdue: "Vencido",
  overdueNote: ({ docs, days }) => `${docs} · la más antigua, ${days}`,
  nothingOverdue: "nada vencido",
  due30: "Vence en 30 días",
  byDueDate: "por vencimiento de factura",
  dso: "Días medios de cobro",
  dsoHint: "Days Sales Outstanding: días medios entre la emisión de la factura y su cobro (cuentas a cobrar ÷ ventas × días del periodo).",
  invoiceTerm: (days) => `plazo en factura: ${days}`,
  daysLate: (count) => plural(count, "día de retraso", "días de retraso"),
  byAge: "Por antigüedad",
  byAgeNote: "según fecha de vencimiento",
  buckets: { por_vencer: "Por vencer", "1_30": "1–30 días", "31_60": "31–60 días", "60_mas": "Más de 60 días", sin_vencimiento: "Sin vencimiento" },
  col: { pending: "Pendiente", overdue: "Vencido", oldest: "Más antigua", method: "Método", status: "Estado", action: "Acción" },
  status: { overdue: "vencida", unreconciled: "posible cobro sin conciliar", test_amount: "importe de prueba", no_due: "sin vencimiento", on_time: "en plazo" },
  flag: { posible_cobro_sin_conciliar: "posible cobro sin conciliar", importe_de_prueba: "importe de prueba", anulada: "anulada" },
  noDocs: "Sin documentos pendientes.",
  docs: (count) => plural(count, "documento", "documentos"),
  dueOn: (date) => `vence ${date}`,
  noDue: "sin vencimiento",
  openInHolded: "Abrir en Holded",
  methods: { sepa: "SEPA", transfer: "Transferencia", none: "Sin método" },
  aging: {},
};

/**
 * Enlace al documento en Holded. Si la API manda `holded_url`, manda ella; si no, la ficha de la factura
 * o compra en la web de Holded por su id.
 */
export function holdedDocumentUrl(doc: Pick<AgingDocument, "holded_id"> & { holded_url?: string | null }, kind: "receivable" | "payable"): string {
  if (doc.holded_url) return doc.holded_url;
  return kind === "receivable"
    ? `https://app.holded.com/sales/revenue#open:invoice-${encodeURIComponent(doc.holded_id)}`
    : `https://app.holded.com/expenses/list#open:purchase-${encodeURIComponent(doc.holded_id)}`;
}

const METHOD_DOT: Record<FinanceBillingMethod, string> = {
  sepa: "var(--chart-1)",
  transfer: "var(--muted-foreground)",
  none: "var(--warning)",
};

/** Fecha de calendario `yyyy-MM-dd` → «18 oct» (con el año si no es el actual). */
const defaultFormatDate = (ymd: string | null | undefined): string => {
  const m = ymd ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd) : null;
  if (!m) return "—";
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const sameYear = Number(m[1]) === new Date().getFullYear();
  return new Intl.DateTimeFormat(getFinanceLocale(), sameYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" }).format(date);
};

/**
 * «Cobros pendientes» / «A pagar» (spec v3 §4.4): cuatro cifras (pendiente de cobro estimado, vencido, vence en 30
 * días y días medios de cobro), la antigüedad en cuatro cifras y una tabla por cliente con pendiente, vencido, factura más
 * antigua, método de cobro (de Cobros), estado y acción. Cada fila se despliega con sus documentos.
 * En «A pagar» no hay método ni días medios de cobro. `renderMethod` pinta la celda de método (la app la enlaza a
 * la cuenta de cobros); por defecto, punto de color + nombre.
 */
export function ReceivablesPanel({
  aging,
  kind,
  renderMethod,
  formatDate = defaultFormatDate,
  labels: labelsProp,
}: {
  aging: FinanceAging;
  kind: "receivable" | "payable";
  renderMethod?: (row: ReceivableRow) => ReactNode;
  /** Fecha de calendario `yyyy-MM-dd` de los documentos desplegados. */
  formatDate?: (ymd: string | null | undefined) => string;
  labels?: Partial<ReceivablesPanelLabels>;
}) {
  const labels: ReceivablesPanelLabels = {
    ...DEFAULT_RECEIVABLES_PANEL_LABELS,
    ...labelsProp,
    ar: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.ar, ...labelsProp?.ar },
    ap: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.ap, ...labelsProp?.ap },
    buckets: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.buckets, ...labelsProp?.buckets },
    col: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.col, ...labelsProp?.col },
    status: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.status, ...labelsProp?.status },
    flag: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.flag, ...labelsProp?.flag },
    methods: { ...DEFAULT_RECEIVABLES_PANEL_LABELS.methods, ...labelsProp?.methods },
  };
  const ar = kind === "receivable";
  const k = labels[ar ? "ar" : "ap"];
  const rows = receivableRows(aging, ar ? aging.methods_by_contact : {});
  const [open, setOpen] = useState<string | null>(null);

  const docs = aging.documents.filter((d) => !d.flags.includes("anulada"));
  const overdueDocs = docs.filter((d) => (d.days_overdue ?? 0) > 0);
  const overdueCents = rows.reduce((s, r) => s + r.overdue_cents, 0);
  const oldestDays = Math.max(0, ...rows.map((r) => r.max_days_overdue));
  const docCount = rows.reduce((s, r) => s + r.count, 0);
  const term = ar ? invoiceTermDays(docs) : null;

  const real = aging.estimated_real_cents ?? aging.total_cents;
  const cancelled = aging.cancelled_cents ?? 0;
  const matched = aging.matched_unreconciled_cents ?? 0;
  // Una sola cifra de pendiente de cobro: el estimado real. Holded y lo ya cobrado sin conciliar, en la nota y el tooltip.
  const pendingStat: FinanceStatProps = ar
    ? {
        label: labels.ar.pending,
        value: formatCentsRound(real),
        note: [labels.ar.holdedNote(formatCentsRound(aging.total_cents)), ...(matched > 0 ? [labels.ar.matchedNote(formatCentsRound(matched))] : [])].join(" · "),
        info: labels.ar.tip({
          holded: formatCentsRound(aging.total_cents),
          cancelled: formatCentsRound(cancelled),
          matched: formatCentsRound(matched),
          real: formatCentsRound(real),
        }),
      }
    : {
        label: labels.ap.pending,
        value: formatCentsRound(aging.total_cents),
        note: labels.ap.pendingNote({ docs: labels.invoices(docCount), contacts: labels.ap.contacts(rows.length) }),
      };

  const stats: FinanceStatProps[] = [
    pendingStat,
    {
      label: labels.overdue,
      value: formatCentsRound(overdueCents),
      negative: overdueCents > 0,
      note: overdueDocs.length > 0 ? labels.overdueNote({ docs: labels.invoices(overdueDocs.length), days: labels.daysN(oldestDays) }) : labels.nothingOverdue,
    },
    {
      label: ar ? labels.due30 : labels.ap.expected30,
      value: aging.expected_30d_cents === undefined ? "—" : formatCentsRound(aging.expected_30d_cents),
      note: labels.byDueDate,
    },
  ];
  if (ar) {
    stats.push({
      label: labels.dso,
      info: labels.dsoHint,
      value: aging.dso_days === null ? "—" : labels.daysN(Math.round(aging.dso_days)),
      note: term !== null ? labels.invoiceTerm(labels.daysN(term)) : undefined,
    });
  }

  const oldestText = (r: ReceivableRow) => {
    const d = r.oldest;
    if (r.max_days_overdue > 0) return labels.daysLate(r.max_days_overdue);
    if (d?.due_date) return labels.dueOn(formatDayShort(d.due_date));
    return labels.noDue;
  };

  const method = (r: ReceivableRow) =>
    renderMethod ? (
      renderMethod(r)
    ) : (
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-sm leading-5 text-foreground">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: METHOD_DOT[r.method] }} />
        {labels.methods[r.method]}
      </span>
    );

  const cols = ar ? 7 : 6;

  return (
    <div className="flex flex-col gap-4">
      <FinanceStatStrip items={stats} />
      <Card className="gap-0 overflow-hidden p-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pt-4">
          <h3 className="flex items-center gap-1 text-sm font-semibold text-foreground">{labels.byAge}</h3>
          <span className="text-xs text-muted-foreground">{labels.byAgeNote}</span>
        </div>
        <div className="px-4 pb-4 pt-3">
          <AgingFigures
            buckets={agingFiveBuckets(aging, labels.buckets)}
            labels={{ invoices: labels.invoices, ...labels.aging }}
          />
        </div>
        {rows.length === 0 ? (
          <p className="border-t px-4 py-4 text-sm text-muted-foreground">{k.empty}</p>
        ) : (
          <div className="overflow-x-auto border-t">
            <table className="w-full border-collapse text-sm tabular-nums">
              <caption className="sr-only">{k.caption}</caption>
              <thead>
                <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
                  <th scope="col" className="px-4 py-2 text-left font-medium">
                    {k.contact}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {labels.col.pending}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {labels.col.overdue}
                  </th>
                  <th scope="col" className="px-3 py-2 text-left font-medium">
                    {labels.col.oldest}
                  </th>
                  {ar && (
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      {labels.col.method}
                    </th>
                  )}
                  <th scope="col" className="px-3 py-2 text-left font-medium">
                    {labels.col.status}
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-medium">
                    <span className="sr-only">{labels.col.action}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isOpen = open === r.contact_id;
                  return (
                    <Fragment key={r.contact_id}>
                      <tr className={cn("border-b last:border-b-0", isOpen && "bg-muted/30")}>
                        <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                          <button
                            type="button"
                            onClick={() => setOpen(isOpen ? null : r.contact_id)}
                            aria-expanded={isOpen}
                            className="inline-flex max-w-[16rem] items-center gap-2 text-left"
                          >
                            <CaretRight className={cn("size-3 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                            <span className="truncate">{r.contact_name}</span>
                            <span className="shrink-0 text-xs font-normal text-muted-foreground">· {labels.docs(r.count)}</span>
                          </button>
                        </th>
                        <td className="whitespace-nowrap px-3 py-2 text-right text-foreground">{formatAccounting(r.pending_cents)}</td>
                        <td className={cn("whitespace-nowrap px-3 py-2 text-right", r.overdue_cents > 0 ? "font-medium text-destructive" : "text-muted-foreground")}>
                          {formatAccounting(r.overdue_cents)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-foreground/80">
                          {r.oldest_number && <span className="text-muted-foreground">{r.oldest_number} · </span>}
                          {oldestText(r)}
                        </td>
                        {ar && <td className="whitespace-nowrap px-3 py-2">{method(r)}</td>}
                        <td className="whitespace-nowrap px-3 py-2">
                          <StatusDot variant={STATUS_DOT[r.status]}>{labels.status[r.status]}</StatusDot>
                        </td>
                        <td className="whitespace-nowrap px-4 py-1.5 text-right">
                          {r.oldest && (
                            <Button asChild variant="ghost" size="icon-sm" title={labels.openInHolded}>
                              <a href={holdedDocumentUrl(r.oldest, kind)} target="_blank" rel="noreferrer" aria-label={`${labels.openInHolded}: ${r.contact_name}`}>
                                <ArrowSquareOut className="size-4" />
                              </a>
                            </Button>
                          )}
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-b bg-muted/30">
                          <td colSpan={cols} className="px-4 pb-2 pl-10 pt-0">
                            {r.documents.length === 0 ? (
                              <p className="py-1.5 text-sm text-muted-foreground">{labels.noDocs}</p>
                            ) : (
                              <ul className="divide-y">
                                {r.documents.map((d) => (
                                  <li key={d.holded_id} className="flex flex-wrap items-baseline gap-x-4 py-1.5 text-sm">
                                    <a href={holdedDocumentUrl(d, kind)} target="_blank" rel="noreferrer" className="tabular-nums text-foreground underline-offset-4 hover:underline">
                                      {d.number}
                                    </a>
                                    <span className="text-xs text-muted-foreground">{formatDate(d.date)}</span>
                                    <span className={cn("text-xs", (d.days_overdue ?? 0) > 0 ? "text-destructive" : "text-muted-foreground")}>
                                      {d.due_date ? labels.dueOn(formatDate(d.due_date)) : labels.noDue}
                                      {(d.days_overdue ?? 0) > 0 && ` · ${labels.daysLate(d.days_overdue ?? 0)}`}
                                    </span>
                                    {d.flags
                                      .filter((f): f is Exclude<DocumentFlag, "sin_vencimiento"> => f !== "sin_vencimiento")
                                      .map((f) => (
                                        <span key={f} className="text-xs text-muted-foreground">
                                          {labels.flag[f]}
                                        </span>
                                      ))}
                                    <span className="ml-auto tabular-nums text-foreground">{formatCentsRound(d.pending_cents)}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

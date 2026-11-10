import { Fragment, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { statementTree, type StatementNode } from "./finance-data";
import { capFirst, formatAccounting, formatMonthAxis, formatMonthLong, getFinanceLocale } from "./format";
import { InfoTip } from "./info-tip";
import { columnIncomplete, defaultColumns, deltaCell, periodColumns, valueIndex, wideColumns, type CompareMode } from "./statement-columns";
import type { StatementColumn, StatementRow } from "./types";

export interface StatementTableLabels {
  caption: string;
  /** Cabecera de la primera columna en modo importes («€»). */
  eur: string;
  pctOfRevenue: string;
  legacyBand: string;
  /** «Δ vs sep 26». */
  deltaHead: (what: string) => string;
  /** Tooltip de la cabecera Δ: «vs septiembre de 2026». */
  deltaVs: (month: string) => string;
  /** Nota bajo la tabla con los meses con costes incompletos. */
  incompleteNote: (months: string) => string;
  unclassifiedHintLabel: string;
  unclassifiedHint: string;
}

export const DEFAULT_STATEMENT_TABLE_LABELS: StatementTableLabels = {
  caption: "Cuenta de resultados de gestión, desplegable hasta la cuenta contable",
  eur: "€",
  pctOfRevenue: "% ingresos",
  legacyBand: "Histórico AJE GAMAN (aprox.)",
  deltaHead: (what) => `Δ vs ${what}`,
  deltaVs: (month) => `vs ${month}`,
  incompleteNote: (months) => `* Faltan compras de ${months} en Holded: costes, EBITDA y resultado de esas columnas son provisionales y su variación es una estimación.`,
  unclassifiedHintLabel: "Qué es «Sin clasificar»",
  unclassifiedHint: "Cuentas que no encajan en ninguna regla (ventas sin cuenta, gastos fuera de 6x). Revisa en Holded y reclasifica.",
};

const isCost = (r: StatementRow) => r.kind === "cost";

export type StatementMode = "amount" | "pct";
export type StatementView = "compact" | "wide";

/** Filas que se abren al cargar: los bloques de primer nivel (las líneas y las cuentas, cerradas). */
const OPEN_BY_DEFAULT = ["revenue", "cost_to_serve", "opex"];

/**
 * Cuenta de resultados de gestión al estilo Holded: concepto fijo a la izquierda y cada bloque desplegable
 * hasta la cuenta contable (número + nombre; `showAccounts` oculta el número). Vista `compact` (por
 * defecto): mes comparado · mes · Δ · trimestre · año; `wide`: los 12 meses, trimestre, año y Δ.
 * `compare` elige el mes comparado (anterior o el mismo del año anterior; sin datos de ese mes no hay
 * Δ). La Δ está en efecto sobre el resultado (un coste que baja suma) y es lo único en verde/rojo, con ▲/▼
 * y signo (spec §4.8); los negativos van entre paréntesis en tinta normal. Filas de % en cursiva y siempre
 * visibles bajo su subtotal. `mode="pct"` enseña cada
 * fila como % sobre los ingresos de su columna. Cabecera: banda «Histórico AJE GAMAN» sobre los meses del
 * Holded antiguo (vista ancha) y marca en los meses con costes incompletos (`incompleteMonths`).
 */
export function StatementTable({
  columns,
  rows,
  mode = "amount",
  view = "compact",
  compare = "prev",
  showAccounts = true,
  incompleteMonths = [],
  loadingMonths = [],
  revenueKey = "revenue",
  period = "month",
  labels: labelsProp,
}: {
  columns: StatementColumn[];
  rows: StatementRow[];
  mode?: StatementMode;
  view?: StatementView;
  compare?: CompareMode;
  showAccounts?: boolean;
  incompleteMonths?: string[];
  /** Meses que aún se están cargando (el del año anterior al comparar): celdas en esqueleto. */
  loadingMonths?: string[];
  revenueKey?: string;
  /** `month`: columnas del mes (statement); `quarter`/`year`: columnas `period` (statements.quarter|year). */
  period?: "month" | "quarter" | "year";
  labels?: Partial<StatementTableLabels>;
}) {
  const labels = { ...DEFAULT_STATEMENT_TABLE_LABELS, ...labelsProp };
  const tree = statementTree(rows);
  const shown = period !== "month" ? periodColumns(columns, view) : view === "wide" ? wideColumns(columns, compare) : defaultColumns(columns, compare);
  // En la vista ancha lo último (mes, trimestre, año) es lo que se mira: la tabla abre desplazada a la derecha.
  const scroller = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = view === "wide" ? el.scrollWidth : 0;
  }, [shown.length, view]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(OPEN_BY_DEFAULT));
  const toggle = (k: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const loading = new Set(loadingMonths);
  const revenueRow = rows.find((r) => r.key === revenueKey);
  const pctFmt = new Intl.NumberFormat(getFinanceLocale(), {
    style: "percent",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  const ppFmt = new Intl.NumberFormat(getFinanceLocale(), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  const isLegacy = (c: StatementColumn) => c.source === "legacy";
  const incomplete = (c: StatementColumn) => columnIncomplete(columns, c, incompleteMonths);
  const separator = (i: number) =>
    i > 0 && (shown[i].type === "delta" || ((shown[i].type === "quarter" || shown[i].type === "ytd") && shown[i - 1].type !== "quarter"));
  const short = (m: string) => capFirst(formatMonthAxis(m).replace(".", ""));
  // Cabeceras en claro: «Oct 26», «4T 26 · oct», «2026 · ene–oct» y «Δ vs sept»; un * si faltan compras.
  const plainHead = (c: StatementColumn): string => {
    if (c.type === "period" || (c.type === "prev" && period !== "month")) return c.span ? `${c.label} · ${c.span}` : c.label;
    if (c.type === "month" || c.type === "prev") return short(c.from);
    if (c.type === "ytd") return c.to.slice(0, 4);
    return c.label.replace(/ \(.*\)$/, "").replace(/ 20(\d\d)/, " $1");
  };
  const head = (c: StatementColumn): string => {
    if (c.type !== "delta") return plainHead(c);
    const base = columns[valueIndex(columns, c.from)];
    return base ? labels.deltaHead(plainHead(base)) : "Δ";
  };
  const headTitle = (c: StatementColumn) =>
    c.type === "delta" && period === "month"
      ? labels.deltaVs(formatMonthLong(c.from))
      : c.type === "ytd" || c.type === "quarter"
        ? c.label
        : undefined;
  const incompleteShown = incompleteMonths.filter((m) => shown.some((c) => c.type !== "delta" && m >= c.from && m <= c.to));
  const legacyBand = view === "wide" && shown.some(isLegacy);

  const pctText = (p: number) => (p === 0 ? "–" : p < 0 ? `(${pctFmt.format(Math.abs(p))})` : pctFmt.format(p));
  const cell = (
    r: StatementRow,
    c: StatementColumn,
  ): {
    text: string;
    tone: "good" | "bad" | "muted" | null;
    estimate?: boolean;
  } => {
    if (c.type === "delta") {
      const d = deltaCell(r, revenueRow, valueIndex(columns, c.to), valueIndex(columns, c.from), mode, incomplete(c));
      if (d === null) return { text: "", tone: null };
      if (Math.abs(d.value) < (d.unit === "pp" ? 0.05 : 50)) return { text: "–", tone: "muted" };
      const abs = Math.abs(d.value);
      const num = d.unit === "pp" ? `${ppFmt.format(abs)} pp` : formatAccounting(abs);
      const text = `${d.value > 0 ? "▲ +" : "▼ −"}${num}`;
      return {
        text,
        tone: d.tone === "neutral" ? "muted" : d.tone,
        estimate: d.estimate,
      };
    }
    // Rojo y verde solo en la Δ (spec §4.8): los negativos van en tinta normal, entre paréntesis.
    const v = r.values[columns.indexOf(c)];
    if (v === null || v === undefined) return { text: "", tone: null };
    if (r.kind === "pct") return { text: pctText(v), tone: null };
    const signedV = isCost(r) ? -Math.abs(v) : v;
    if (mode === "pct") {
      const base = revenueRow?.values[columns.indexOf(c)];
      if (!base) return { text: "", tone: null };
      return { text: pctText(signedV / base), tone: null };
    }
    return { text: formatAccounting(signedV), tone: null };
  };

  const label = (r: StatementNode) => {
    const n = r.account;
    const named = n !== undefined && r.label !== n;
    return (
      <span className="truncate" title={n ? `${n} · ${r.label}` : r.label}>
        {n && (showAccounts || !named) && <span className={cn("font-mono text-xs tabular-nums text-muted-foreground", named && "mr-2")}>{n}</span>}
        {named || !n ? r.label : null}
      </span>
    );
  };

  const renderRow = (r: StatementNode, depth: number): ReactElement => {
    // Los % cuelgan de su subtotal pero se ven siempre: no se pliegan.
    const pctKids = r.children.filter((c) => c.kind === "pct");
    const kids = r.children.filter((c) => c.kind !== "pct");
    const isOpen = open.has(r.key);
    const block = depth === 0 && r.kind !== "pct";
    const subtotal = r.kind === "subtotal" && depth === 0;
    const pctRow = r.kind === "pct";
    const account = r.account !== undefined;
    return (
      <Fragment key={r.key}>
        <tr className={cn("border-b last:border-b-0", subtotal && "bg-muted/40")}>
          <th
            scope="row"
            className={cn(
              "sticky left-0 z-10 min-w-[240px] max-w-[360px] whitespace-nowrap px-3 py-1.5 text-left",
              subtotal ? "bg-muted" : "bg-card",
              block ? "font-semibold text-foreground" : account ? "font-normal text-muted-foreground" : "font-normal text-foreground/80",
              pctRow && "italic text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-1.5" style={{ paddingLeft: Math.min(depth, 2) * 16 }}>
              {kids.length > 0 ? (
                <button type="button" onClick={() => toggle(r.key)} aria-expanded={isOpen} className="inline-flex min-w-0 items-center gap-1.5 text-left">
                  <CaretRight className={cn("size-3 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                  {label(r)}
                </button>
              ) : (
                <span className="flex min-w-0 pl-[18px]">{label(r)}</span>
              )}
              {r.key === "unclassified" && <InfoTip label={labels.unclassifiedHintLabel}>{labels.unclassifiedHint}</InfoTip>}
            </span>
          </th>
          {shown.map((c, i) => {
            const { text, tone } = cell(r, c);
            const delta = c.type === "delta";
            return (
              <td
                key={c.key}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 text-right",
                  tone === "bad"
                    ? "text-destructive"
                    : tone === "good"
                      ? "text-success"
                      : tone === "muted" || pctRow
                        ? "text-muted-foreground"
                        : account
                          ? "text-muted-foreground"
                          : depth > 0
                            ? "text-foreground/80"
                            : "text-foreground",
                  pctRow && "italic",
                  block && !delta && "font-medium",
                  (c.type === "quarter" || c.type === "ytd") && "bg-muted/25",
                  separator(i) && "border-l",
                )}
              >
                {loading.has(c.key) ? <Skeleton className="ml-auto h-3.5 w-12" /> : text}
              </td>
            );
          })}
        </tr>
        {pctKids.map((ch) => renderRow(ch, depth + 1))}
        {kids.length > 0 && isOpen && kids.map((ch) => renderRow(ch, depth + 1))}
      </Fragment>
    );
  };

  // Banda superior (vista ancha): un tramo por grupo contiguo de columnas del Holded antiguo.
  const bands: { span: number; legacy: boolean; key: string }[] = [];
  shown.forEach((c) => {
    const last = bands[bands.length - 1];
    if (last && last.legacy === isLegacy(c)) last.span += 1;
    else bands.push({ span: 1, legacy: isLegacy(c), key: c.key });
  });

  return (
    <div className="flex flex-col gap-2">
      {incompleteShown.length > 0 && (
        <p className="text-xs text-muted-foreground" role="note">
          {labels.incompleteNote(incompleteShown.map((m) => formatMonthLong(m)).join(", "))}
        </p>
      )}
      <div ref={scroller} className="overflow-x-auto rounded-xl border bg-card">
        <table className={cn("border-collapse text-sm tabular-nums", view === "wide" ? "w-full min-w-max" : "w-full")}>
          <caption className="sr-only">{labels.caption}</caption>
          <thead className="text-xs text-muted-foreground">
            {legacyBand && (
              <tr>
                <th className="sticky left-0 z-10 bg-card" />
                {bands.map((b) => (
                  <th
                    key={b.key}
                    colSpan={b.span}
                    className={cn("px-3 pt-2 text-right font-normal", b.legacy && "border-b-2 border-dashed border-muted-foreground/40")}
                  >
                    {b.legacy ? labels.legacyBand : ""}
                  </th>
                ))}
              </tr>
            )}
            <tr className="border-b bg-muted/50">
              <th scope="col" className="sticky left-0 z-10 bg-muted px-3 py-2 text-left font-medium">
                {mode === "pct" ? labels.pctOfRevenue : labels.eur}
              </th>
              {shown.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  title={headTitle(c) ?? (isLegacy(c) ? labels.legacyBand : undefined)}
                  className={cn("w-24 whitespace-nowrap px-3 py-2 text-right font-medium", isLegacy(c) && "italic", separator(i) && "border-l")}
                >
                  {head(c)}
                  {incomplete(c) && <span aria-hidden>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{tree.map((r) => renderRow(r, 0))}</tbody>
        </table>
      </div>
    </div>
  );
}

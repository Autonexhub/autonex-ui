import { Fragment, useState, type ReactElement } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { cashCell } from "./cash-chart";
import { formatPeriodAxis, formatSignedPlain } from "./format";
import type { CashTableRow, FinanceTreasury } from "./types";

export interface CashFlowTableLabels {
  caption: string;
  /** Cabecera de la primera columna («€»). */
  concept: string;
  total: string;
  /** Tooltip de un saldo final bajo el colchón. */
  belowCushion: string;
  margin: string;
}

export const DEFAULT_CASH_FLOW_TABLE_LABELS: CashFlowTableLabels = {
  caption: "Cash flow directo",
  concept: "€",
  total: "Total",
  belowCushion: "Por debajo del colchón mínimo",
  margin: "Margen sobre el colchón",
};

/** Filas que son salidas de caja: llegan en positivo y se enseñan con signo contable (entre paréntesis). */
const OUTFLOW = /^(payments|vat)/;

/**
 * Cash flow directo (formato de tesorería) tal como lo da la API en `table`: saldo inicial, cobros por tipo,
 * pagos por tipo, IVA 303, flujo neto y saldo final; una columna por periodo y el total del horizonte. Pagos
 * entre paréntesis; saldos finales bajo el colchón, marcados. Debajo, «Margen sobre el colchón» (saldo final −
 * colchón, en tinta y con signo: §4.8 reserva el rojo para variaciones y estados). Clic en la cabecera de un periodo → `onPeriodClick` (detalle de ese periodo).
 */
export function CashFlowTable({
  data,
  selected,
  onPeriodClick,
  labels: labelsProp,
}: {
  data: Pick<FinanceTreasury, "table" | "periods" | "cushion_cents"> & { horizon?: FinanceTreasury["horizon"] };
  selected?: string | null;
  onPeriodClick?: (start: string) => void;
  labels?: Partial<CashFlowTableLabels>;
}) {
  const labels = { ...DEFAULT_CASH_FLOW_TABLE_LABELS, ...labelsProp };
  const { columns, rows } = data.table;
  const [open, setOpen] = useState<Set<string>>(() => new Set(rows.filter((r) => r.children?.length).map((r) => r.key)));
  const colLabel = (c: { start: string; label: string }) => (data.horizon ? formatPeriodAxis(c, data.horizon) : c.label);
  const closingRow = rows.find((r) => r.key === "closing");
  const margins = closingRow ? closingRow.values.map((v) => v - data.cushion_cents) : null;
  const below = (i: number) => data.periods[i]?.below_cushion ?? data.periods[i]?.closing_cents < data.cushion_cents;

  const signed = (r: CashTableRow, v: number) => (OUTFLOW.test(r.key) ? -Math.abs(v) : v);
  const total = (r: CashTableRow): number | null => {
    if (r.values.length === 0) return null;
    if (r.key === "opening") return r.values[0];
    if (r.key === "closing") return r.values[r.values.length - 1];
    return r.values.reduce((s, v) => s + signed(r, v), 0);
  };

  const renderRow = (r: CashTableRow, depth: number): ReactElement | null => {
    // Detalle a cero en todo el horizonte: fuera, para no llenar la tabla de guiones.
    if (depth > 0 && r.values.every((v) => v === 0)) return null;
    const kids = (r.children?.length ?? 0) > 0;
    const isOpen = open.has(r.key);
    const strong = depth === 0;
    const isClosing = r.key === "closing";
    const tot = total(r);
    const totCell = tot === null ? null : cashCell(r.key, tot);
    return (
      <Fragment key={r.key}>
        <tr className={cn("border-b last:border-b-0", isClosing && "bg-muted/40", r.key === "net" && "border-t-2 border-t-border")}>
          <th
            scope="row"
            className={cn(
              "sticky left-0 z-10 whitespace-nowrap px-3 py-1.5 text-left",
              isClosing ? "bg-muted" : "bg-card",
              strong ? "font-semibold text-foreground" : "font-normal text-foreground/80",
            )}
          >
            <span className="flex items-center gap-1.5" style={{ paddingLeft: depth * 16 }}>
              {kids ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpen((s) => {
                      const n = new Set(s);
                      if (n.has(r.key)) n.delete(r.key);
                      else n.add(r.key);
                      return n;
                    })
                  }
                  className="inline-flex items-center gap-1.5"
                >
                  <CaretRight className={cn("size-3 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                  {r.label}
                </button>
              ) : (
                <span className="pl-[18px]">{r.label}</span>
              )}
            </span>
          </th>
          {r.values.map((v, i) => {
            const cell = cashCell(r.key, signed(r, v));
            const low = isClosing && below(i);
            return (
              <td
                key={columns[i]?.start ?? i}
                className={cn(
                  "whitespace-nowrap px-2.5 py-1.5 text-right",
                  cell.tone === "bad" ? "text-destructive" : strong ? "text-foreground" : "text-foreground/80",
                  strong && "font-medium",
                  low && "bg-warning-soft font-semibold",
                  selected === columns[i]?.start && !low && "bg-muted/60",
                )}
                title={low ? labels.belowCushion : undefined}
              >
                {cell.text}
              </td>
            );
          })}
          <td className={cn("whitespace-nowrap border-l px-3 py-1.5 text-right", strong && "font-semibold", totCell?.tone === "bad" ? "text-destructive" : "text-foreground")}>
            {totCell?.text ?? ""}
          </td>
        </tr>
        {kids && isOpen && r.children!.map((c) => renderRow(c, depth + 1))}
      </Fragment>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-max border-collapse text-sm tabular-nums">
        <caption className="sr-only">{labels.caption}</caption>
        <thead>
          <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
            <th scope="col" className="sticky left-0 z-10 bg-muted px-3 py-2 text-left font-medium">
              {labels.concept}
            </th>
            {columns.map((c) => (
              <th key={c.start} scope="col" className={cn("px-2.5 py-2 text-right font-medium", selected === c.start && "bg-muted text-foreground")}>
                {onPeriodClick ? (
                  <button type="button" onClick={() => onPeriodClick(c.start)} className="whitespace-nowrap underline-offset-4 hover:text-foreground hover:underline">
                    {colLabel(c)}
                  </button>
                ) : (
                  <span className="whitespace-nowrap">{colLabel(c)}</span>
                )}
              </th>
            ))}
            <th scope="col" className="border-l px-3 py-2 text-right font-medium">
              {labels.total}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => renderRow(r, 0))}
          {margins && (
            <tr className="border-t">
              <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-card px-3 py-1.5 text-left font-normal italic text-foreground">
                <span className="pl-[18px]">{labels.margin}</span>
              </th>
              {margins.map((m, i) => (
                <td
                  key={columns[i]?.start ?? i}
                  className={cn("whitespace-nowrap px-2.5 py-1.5 text-right text-foreground", selected === columns[i]?.start && "bg-muted/60")}
                >
                  {formatSignedPlain(m)}
                </td>
              ))}
              <td className="whitespace-nowrap border-l px-3 py-1.5 text-right text-foreground">
                {margins.length > 0 ? formatSignedPlain(margins[margins.length - 1]) : ""}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

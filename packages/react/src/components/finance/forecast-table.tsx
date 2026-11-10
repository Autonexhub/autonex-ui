import { cn } from "../../lib/utils";
import { capFirst, formatAccounting, formatMonthAxis } from "./format";
import type { PlanSimulation } from "./types";

export interface ForecastTableLabels {
  caption: string;
  /** Cabecera de la primera columna («€»). */
  unit: string;
  revenue: string;
  costs: string;
  cash: string;
}

export const DEFAULT_FORECAST_TABLE_LABELS: ForecastTableLabels = {
  caption: "Forecast mensual",
  unit: "€",
  revenue: "Ingresos",
  costs: "Costes",
  cash: "Caja final",
};

/** Tabla mensual del Forecast: MRR, ingresos, costes, EBITDA y caja final, un mes por columna. */
export function ForecastTable({
  months,
  cushionCents,
  labels: labelsProp,
}: {
  months: PlanSimulation["months"];
  cushionCents: number;
  labels?: Partial<ForecastTableLabels>;
}) {
  const labels = { ...DEFAULT_FORECAST_TABLE_LABELS, ...labelsProp };
  const rows: { key: string; label: string; get: (m: PlanSimulation["months"][number]) => number; strong?: boolean; cost?: boolean }[] = [
    { key: "mrr", label: "MRR", get: (m) => m.mrr_cents },
    { key: "revenue", label: labels.revenue, get: (m) => m.revenue_cents, strong: true },
    { key: "costs", label: labels.costs, get: (m) => -Math.abs(m.costs_cents), cost: true },
    { key: "ebitda", label: "EBITDA", get: (m) => m.ebitda_cents ?? m.net_cents, strong: true },
    { key: "cash", label: labels.cash, get: (m) => m.closing_cents, strong: true },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-max border-collapse text-sm tabular-nums">
        <caption className="sr-only">{labels.caption}</caption>
        <thead>
          <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
            <th scope="col" className="sticky left-0 z-10 bg-muted px-3 py-2 text-left font-medium">
              {labels.unit}
            </th>
            {months.map((m) => (
              <th key={m.month} scope="col" className="whitespace-nowrap px-2.5 py-2 text-right font-medium">
                {capFirst(formatMonthAxis(m.month))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className={cn("border-b last:border-b-0", r.key === "cash" && "bg-muted/40")}>
              <th scope="row" className={cn("sticky left-0 z-10 whitespace-nowrap px-3 py-1.5 text-left", r.key === "cash" ? "bg-muted" : "bg-card", r.strong ? "font-semibold text-foreground" : "font-normal text-foreground")}>
                {r.label}
              </th>
              {months.map((m) => {
                const v = r.get(m);
                const below = r.key === "cash" && v < cushionCents;
                return (
                  <td
                    key={m.month}
                    // Negativos en tinta, entre paréntesis (spec §4.8: rojo solo en variaciones); bajo colchón, fondo ámbar.
                    className={cn("whitespace-nowrap px-2.5 py-1.5 text-right", r.cost ? "text-foreground/80" : "text-foreground", r.strong && "font-medium", below && "bg-warning-soft")}
                  >
                    {formatAccounting(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

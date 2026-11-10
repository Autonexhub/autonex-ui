import type { FinanceFreshness } from "./types";
import { formatMonthName, getFinanceLocale } from "./format";
import { formatStamp, syncAge } from "./freshness";

export interface FreshnessLineLabels {
  asOf: (date: string) => string;
  syncNever: string;
  syncToday: string;
  syncYesterday: string;
  syncDays: (n: number) => string;
  closedMonth: (month: string) => string;
}

export const DEFAULT_FRESHNESS_LINE_LABELS: FreshnessLineLabels = {
  asOf: (date) => `Datos a ${date}`,
  syncNever: "Holded sin sincronizar",
  syncToday: "Holded sincronizado hoy",
  syncYesterday: "Holded sincronizado ayer",
  syncDays: (n) => `Holded sincronizado hace ${n} días`,
  closedMonth: (month) => `último mes cerrado: ${month}`,
};

/**
 * Cabecera de las páginas de Dirección: «Datos a 5 nov, 08:40 · Holded sincronizado ayer · último mes cerrado:
 * octubre». Tres datos del servidor, compuestos aquí.
 */
export function FreshnessLine({ data, labels: labelsProp }: { data: FinanceFreshness; labels?: Partial<FreshnessLineLabels> }) {
  const labels = { ...DEFAULT_FRESHNESS_LINE_LABELS, ...labelsProp };
  const date = formatStamp(data.as_of, getFinanceLocale());
  const age = syncAge(data.last_sync_at, data.as_of);
  const sync =
    age.kind === "never"
      ? labels.syncNever
      : age.kind === "today"
        ? labels.syncToday
        : age.kind === "yesterday"
          ? labels.syncYesterday
          : labels.syncDays(age.n);
  const parts = [labels.asOf(date), sync, labels.closedMonth(formatMonthName(data.last_closed_month))];
  return <p className="mt-1 text-sm text-muted-foreground">{parts.join(" · ")}</p>;
}

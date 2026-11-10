import { ArrowsClockwise } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import type { FinanceSyncRun } from "./types";

export interface SyncButtonLabels {
  button: string;
  running: string;
  last: (when: string) => string;
  never: string;
  failed: (error: string) => string;
}

export const DEFAULT_SYNC_BUTTON_LABELS: SyncButtonLabels = {
  button: "Sincronizar con Holded",
  running: "Sincronizando…",
  last: (when) => `Última sincronización: ${when}`,
  never: "Aún no se ha sincronizado",
  failed: (error) => `La última sincronización falló: ${error}`,
};

/** Fecha de la última sincronización cuando la app no pasa su propio formateador (relativa a ahora). */
const defaultFormatWhen = (iso: string): string => {
  const d = new Date(iso.includes("T") || iso.endsWith("Z") ? iso : `${iso.replace(" ", "T")}Z`);
  if (isNaN(d.getTime())) return "—";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
};

/**
 * «Sincronizar con Holded» (POST /finance/sync) con la hora de la última sincronización debajo.
 * Presentacional: la página le pasa el estado y la acción.
 */
export function SyncButton({
  lastRun,
  loading,
  syncing,
  onSync,
  className,
  formatWhen = defaultFormatWhen,
  labels: labelsProp,
}: {
  lastRun: FinanceSyncRun | null | undefined;
  loading?: boolean;
  syncing?: boolean;
  onSync: () => void;
  className?: string;
  /** Cómo se escribe la fecha de la última sincronización (por defecto, relativa: «hace 3 min»). */
  formatWhen?: (iso: string) => string;
  labels?: Partial<SyncButtonLabels>;
}) {
  const labels = { ...DEFAULT_SYNC_BUTTON_LABELS, ...labelsProp };
  const when = lastRun?.finished_at ?? lastRun?.started_at ?? null;
  const failed = lastRun && lastRun.status !== "ok" && lastRun.status !== "success" && lastRun.status !== "running" && lastRun.error;

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Button variant="outline" onClick={onSync} disabled={syncing} aria-busy={syncing || undefined}>
        <ArrowsClockwise className={cn("h-4 w-4", syncing && "animate-spin")} />
        {syncing ? labels.running : labels.button}
      </Button>
      {loading ? (
        <Skeleton className="h-3 w-40" />
      ) : (
        <p className={cn("max-w-[280px] text-right text-xs", failed ? "text-destructive" : "text-muted-foreground")} aria-live="polite">
          {failed ? labels.failed(lastRun?.error ?? "") : when ? labels.last(formatWhen(when)) : labels.never}
        </p>
      )}
    </div>
  );
}

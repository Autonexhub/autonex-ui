import { cn } from "../../lib/utils";
import type { AgingBarBucket } from "./chart-data";
import { formatCentsRound } from "./format";
import { agingFigures } from "./receivables";

export interface AgingFiguresLabels {
  /** Etiqueta accesible de la lista de cifras. */
  aria: string;
  /** «3 facturas». */
  invoices: (count: number) => string;
  /** «Sin vencimiento: 1.200 € · 2 facturas». */
  noDue: (amount: string, docs: string) => string;
}

export const DEFAULT_AGING_FIGURES_LABELS: AgingFiguresLabels = {
  aria: "Distribución del pendiente por antigüedad",
  invoices: (count) => `${count} ${count === 1 ? "factura" : "facturas"}`,
  noDue: (amount, docs) => `Sin vencimiento: ${amount} · ${docs}`,
};

export interface AgingFiguresProps {
  buckets: AgingBarBucket[];
  labels?: Partial<AgingFiguresLabels>;
}

/**
 * Pendiente por antigüedad en cuatro cifras en fila (por vencer, 1–30, 31–60, más de 60 días), cada una con su
 * importe y su nº de facturas. Lo vencido va en rojo si tiene importe (el rojo es un estado). «Sin vencimiento»
 * queda aparte, en una línea debajo: no es un retraso, es lo que no tiene fecha.
 */
export function AgingFigures({ buckets, labels: labelsProp }: AgingFiguresProps) {
  const labels = { ...DEFAULT_AGING_FIGURES_LABELS, ...labelsProp };
  const { figures, noDue } = agingFigures(buckets);
  return (
    <div className="flex flex-col gap-2.5">
      <dl aria-label={labels.aria} className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {figures.map((f) => (
          <div key={f.key} className="min-w-0">
            <dt className="truncate text-xs font-medium text-muted-foreground">{f.label}</dt>
            <dd className={cn("mt-0.5 text-xl font-semibold tabular-nums tracking-[-0.01em]", f.overdue && f.cents > 0 ? "text-destructive" : f.cents > 0 ? "text-foreground" : "text-muted-foreground")}>
              {formatCentsRound(f.cents)}
            </dd>
            <dd className="text-xs text-muted-foreground">{labels.invoices(f.count)}</dd>
          </div>
        ))}
      </dl>
      {noDue && noDue.cents > 0 && (
        <p className="text-xs tabular-nums text-muted-foreground">{labels.noDue(formatCentsRound(noDue.cents), labels.invoices(noDue.count))}</p>
      )}
    </div>
  );
}

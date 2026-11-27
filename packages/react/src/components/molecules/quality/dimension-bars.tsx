import { cn } from "../../../lib/utils";

export type DimensionKey = "ve" | "pr" | "co" | "te";

export interface RapDimension {
  key: DimensionKey;
  code: string;
  label: string;
  weight: number;
}

/** Dimensiones RAP y sus pesos (config/rap-weights.yaml; los pesos están pendientes de calibrar). */
export const RAP_DIMENSIONS: RapDimension[] = [
  { key: "ve", code: "VE", label: "Veracidad", weight: 32 },
  { key: "pr", code: "PR", label: "Proceso", weight: 30 },
  { key: "co", code: "CO", label: "Conducción", weight: 22 },
  { key: "te", code: "TE", label: "Técnica", weight: 16 },
];

export interface DimensionBarsProps {
  values: Partial<Record<DimensionKey, number | null>>;
  dimensions?: RapDimension[];
  /** Por debajo, la barra va en ámbar (y en rojo por debajo de threshold - 20). Default 70. */
  threshold?: number;
  showWeights?: boolean;
  unevaluatedLabel?: string;
  weightLabel?: (w: number) => string;
  className?: string;
}

/** Subnotas 0-100 por dimensión; null = sin evaluar (nunca 0). */
export function DimensionBars({
  values,
  dimensions = RAP_DIMENSIONS,
  threshold = 70,
  showWeights,
  unevaluatedLabel = "Sin evaluar",
  weightLabel = (w) => `peso ${w}`,
  className,
}: DimensionBarsProps) {
  return (
    <div data-slot="dimension-bars" className={cn("flex flex-col gap-2.5", className)}>
      {dimensions.map((d) => {
        const raw = values[d.key];
        const v = raw === null || raw === undefined || Number.isNaN(Number(raw)) ? null : Math.max(0, Math.min(100, Number(raw)));
        const tone = v === null ? "" : v >= threshold ? "bg-success" : v >= threshold - 20 ? "bg-warning" : "bg-destructive";
        return (
          <div key={d.key} className="grid grid-cols-[minmax(0,10rem)_1fr_4.5rem] items-center gap-3" data-dimension={d.key}>
            <div className="min-w-0 truncate text-sm">
              <span className="font-mono text-xs font-medium text-muted-foreground">{d.code}</span>{" "}
              <span className="text-foreground">{d.label}</span>
              {showWeights ? <span className="ml-1 text-xs text-muted-foreground">({weightLabel(d.weight)})</span> : null}
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="meter"
              aria-label={`${d.code} ${d.label}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={v ?? undefined}
            >
              {v !== null ? <div className={cn("h-full rounded-full", tone)} style={{ width: `${v}%` }} /> : null}
            </div>
            <div className={cn("text-right text-sm tabular-nums", v === null && "text-xs text-muted-foreground")}>
              {v === null ? unevaluatedLabel : Math.round(v * 10) / 10}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import type { ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InfoTip } from "./info-tip";

/** Enlace de la app (react-router `Link`…): el paquete no conoce el router. */
export type FinanceRenderLink = (props: { href: string; className: string; children: ReactNode }) => ReactNode;

export interface KpiTileLabels {
  /** Etiqueta accesible de la «i» («Definición de Runway»). */
  definition: (label: string) => string;
  /** «est.» tras la cifra estimada. */
  estimatedShort: string;
}

export const DEFAULT_KPI_TILE_LABELS: KpiTileLabels = {
  definition: (label) => `Definición de ${label}`,
  estimatedShort: "est.",
};

export interface KpiTileProps {
  /** Nombre estándar (Runway, Burn neto, MRR, EBITDA…). */
  label: string;
  /** Cifra ya formateada. */
  value: string;
  /** Cifra negativa: en rojo. */
  negative?: boolean;
  /** Variación ya formateada («+12,3 %») y si es buena noticia (verde) o no (rojo). */
  delta?: { text: string; good: boolean | null; vs?: string } | null;
  /** Línea seca debajo: «ARR 31.548 €», «cash-out ago-2027». */
  sub?: ReactNode;
  /** Cifra estimada: subrayado discontinuo y «est.» (lo estimado nunca parece real). */
  estimate?: boolean;
  /** Definición y fórmula (tooltip «i»). */
  info?: ReactNode;
  /** Salvedad seca (costes incompletos…): marca ámbar pequeña junto a la etiqueta, texto en tooltip. */
  warning?: string;
  href?: string;
}

const defaultLink: FinanceRenderLink = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

/** Una celda del KPI strip: etiqueta, cifra, Δ y una línea de contexto. Sin etiquetas de fuente. */
export function KpiTile({
  label,
  value,
  negative,
  delta,
  sub,
  estimate,
  info,
  warning,
  href,
  renderLink = defaultLink,
  labels: labelsProp,
}: KpiTileProps & { renderLink?: FinanceRenderLink; labels?: Partial<KpiTileLabels> }) {
  const labels = { ...DEFAULT_KPI_TILE_LABELS, ...labelsProp };
  const body = (
    <>
      <div className="flex items-center gap-1">
        <span className="min-w-0 text-xs font-medium leading-tight text-muted-foreground">{label}</span>
        <InfoTip label={labels.definition(label)}>{info}</InfoTip>
        {warning && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} aria-label={warning} className="ml-auto inline-flex shrink-0 items-center text-warning">
                <WarningCircle className="size-3.5" weight="fill" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-normal">{warning}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            "text-xl font-semibold tracking-tight tabular-nums sm:text-2xl",
            negative ? "text-destructive" : "text-foreground",
            estimate && "underline decoration-muted-foreground/60 decoration-dashed decoration-1 underline-offset-[6px]",
          )}
        >
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              delta.good === null ? "text-muted-foreground" : delta.good ? "text-success" : "text-destructive",
            )}
          >
            {delta.text}
            {delta.vs && <span className="ml-1 font-normal text-muted-foreground">{delta.vs}</span>}
          </span>
        )}
      </div>
      {(sub || estimate) && (
        <div className="mt-0.5 truncate text-xs text-muted-foreground tabular-nums">
          {sub}
          {estimate && <span>{sub ? " · " : ""}{labels.estimatedShort}</span>}
        </div>
      )}
    </>
  );
  const cls = "block min-w-0 bg-card px-4 py-3.5";
  return href ? (
    <>{renderLink({ href, className: cn(cls, "transition-colors hover:bg-muted/40"), children: body })}</>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/**
 * KPI strip: una fila de KPIs en una sola tarjeta con divisores (formato board pack), que en móvil pasa a
 * dos columnas. La usan el Resumen de Finanzas y el área «Dirección y Finanzas» del panel de control.
 */
export function KpiStrip({
  items,
  className,
  renderLink,
  labels,
}: {
  items: KpiTileProps[];
  className?: string;
  renderLink?: FinanceRenderLink;
  labels?: Partial<KpiTileLabels>;
}) {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div
        className={cn(
          "grid gap-px bg-border",
          items.length >= 6
            ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
            : items.length === 4
              ? "grid-cols-2 xl:grid-cols-4"
              : items.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2",
        )}
      >
        {items.map((i) => (
          <KpiTile key={i.label} {...i} renderLink={renderLink} labels={labels} />
        ))}
      </div>
    </Card>
  );
}

export function KpiStripSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Card className="grid grid-cols-2 gap-px overflow-hidden p-0 sm:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-2 px-4 py-3.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </Card>
  );
}

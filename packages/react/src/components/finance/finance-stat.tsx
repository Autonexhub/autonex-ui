import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { InfoTip } from "./info-tip";
import type { FinanceRenderLink } from "./kpi-tile";

export interface FinanceStatProps {
  /** Clave estable de la celda en la tira (por defecto, su posición: dos etiquetas iguales no chocan). */
  id?: string;
  label: string;
  /** Cifra ya formateada. «—» se pinta en gris (no aplica / sin dato). */
  value: string;
  /** Variación ya formateada («▲ +1.306 €»). `good` colorea solo el delta: verde, rojo o gris si es null. */
  delta?: { text: string; good: boolean | null };
  /** Línea de contexto tras el delta («vs septiembre», «9 facturas · 5 clientes»). Nunca el umbral («objetivo ≥»). */
  note?: string;
  /** Cifra estimada (costes incompletos…): subrayado punteado ámbar. */
  estimate?: boolean;
  /** Cifra mala en sí misma (vencido, NRR bajo umbral): en rojo. */
  negative?: boolean;
  href?: string;
  /** Definición tras la etiqueta (ⓘ con tooltip), p. ej. cómo se calculan los días medios de cobro. */
  info?: ReactNode;
}

/** Keys de React de una tira de cifras: el `id` de cada cifra o su posición (dos etiquetas iguales no chocan). */
export const statKeys = (items: FinanceStatProps[]): string[] => items.map((it, i) => it.id ?? `#${i}`);

const defaultLink: FinanceRenderLink = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

/** Una celda de la tira de cifras de Finanzas v3: etiqueta, cifra y una línea de contexto. */
export function FinanceStat({
  label,
  value,
  delta,
  note,
  estimate,
  negative,
  href,
  info,
  renderLink = defaultLink,
}: FinanceStatProps & { renderLink?: FinanceRenderLink }) {
  const body = (
    <>
      {info ? (
        <div className="flex h-4 min-w-0 items-center gap-1 text-xs font-medium tracking-[0.01em] text-muted-foreground">
          <span className="truncate">{label}</span>
          <InfoTip label={label}>{info}</InfoTip>
        </div>
      ) : (
        <div className="truncate text-xs font-medium tracking-[0.01em] text-muted-foreground">{label}</div>
      )}
      <div
        className={cn(
          "mb-1 mt-1.5 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums",
          negative ? "text-destructive" : value === "—" ? "text-muted-foreground" : "text-foreground",
          estimate && "underline decoration-warning decoration-dotted decoration-[1.5px] underline-offset-[5px]",
        )}
      >
        {value}
      </div>
      {(delta || note) && (
        <div className="text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "font-medium tabular-nums",
                delta.good === null ? "text-muted-foreground" : delta.good ? "text-success" : "text-destructive",
              )}
            >
              {delta.text}
            </span>
          )}
          {delta && note ? " " : null}
          {note}
        </div>
      )}
    </>
  );
  // Hilo de 1 px por dentro a la derecha y abajo de cada celda (no es una sombra: es la retícula de la maqueta).
  const cls = "block min-h-24 min-w-0 bg-card px-4 py-3.5 [box-shadow:inset_-1px_0_0_var(--border),inset_0_-1px_0_var(--border)]";
  return href ? (
    <>{renderLink({ href, className: cn(cls, "transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"), children: body })}</>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/**
 * Tira de cifras: retícula `auto-fit minmax(200px, 1fr)` con hilos de 1 px, borde, radio 10 px y sin sombra.
 * `columns` fija el máximo de columnas en pantallas anchas (por defecto, tantas como quepan).
 */
export function FinanceStatStrip({
  items,
  columns,
  className,
  renderLink,
}: {
  items: FinanceStatProps[];
  columns?: 4 | 5;
  className?: string;
  renderLink?: FinanceRenderLink;
}) {
  const min = columns ? `max(200px, calc(100% / ${columns} - 1px))` : "200px";
  const keys = statKeys(items);
  // La retícula se sale 1 px por la derecha y por abajo y el contenedor la recorta: los hilos de las celdas
  // del borde quedan fuera y la última fila incompleta no deja huecos grises.
  return (
    <div className={cn("overflow-hidden rounded-[10px] border border-border bg-card", className)}>
      <div className="-mb-px -mr-px grid" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))` }}>
        {items.map((it, i) => (
          <FinanceStat key={keys[i]} {...it} renderLink={renderLink} />
        ))}
      </div>
    </div>
  );
}

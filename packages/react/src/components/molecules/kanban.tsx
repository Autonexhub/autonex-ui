import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

/**
 * Kanban — receta ÚNICA (decisión Bruno 22/11, referencia HubSpot). En Marta lo usan Negocios, Tareas,
 * Candidatos e Incidencias. Ver DesignRules › Kanban y la story 2-Molecules/Kanban.
 *
 *  - Tablero: scroll horizontal, columnas separadas 16px.
 *  - Columna = bandeja gris (`bg-muted/60`, `rounded-xl`) con la cabecera DENTRO:
 *    `KanbanColumnTitle` (Badge) + contador + extra opcional (importe, "+").
 *    Pie opcional con un resumen (donde HubSpot pone los importes).
 *  - Tarjeta = blanca y separada (`KanbanCard`: borde + sombra susurro `shadow-elev`).
 *  - Solo presentación: el arrastre (HTML5 o dnd-kit) lo pone cada página por props/ref.
 */

export function KanbanBoard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-x-auto pb-2', className)}>
      <div className="flex h-full gap-4">{children}</div>
    </div>
  );
}

/** Título de columna: estado/fase como Badge. `variant` para estados canónicos; `dotClassName` para fases con color propio. */
export function KanbanColumnTitle({ label, variant = 'secondary', dotClassName }: {
  label: ReactNode;
  variant?: 'secondary' | 'warning' | 'info' | 'success' | 'destructive';
  dotClassName?: string;
}) {
  return (
    <Badge variant={variant} className="min-w-0 gap-1.5 font-normal">
      {dotClassName && <span className={cn('size-2 shrink-0 rounded-full', dotClassName)} aria-hidden />}
      <span className="truncate">{label}</span>
    </Badge>
  );
}

interface KanbanColumnProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  count: number;
  /** A la derecha de la cabecera: importe, botón "+"… */
  extra?: ReactNode;
  footer?: ReactNode;
  /** Algo se está arrastrando encima: la bandeja se oscurece un paso. */
  isDropTarget?: boolean;
  /** Ref del área de tarjetas (dnd-kit `useDroppable().setNodeRef`). */
  bodyRef?: Ref<HTMLDivElement>;
}

export function KanbanColumn({ title, count, extra, footer, isDropTarget, bodyRef, className, children, ...rest }: KanbanColumnProps) {
  return (
    <section
      className={cn(
        'group/col flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-xl transition-colors',
        isDropTarget ? 'bg-muted' : 'bg-muted/60',
        className,
      )}
      {...rest}
    >
      <header className="flex h-12 shrink-0 items-center gap-2 px-3">
        {title}
        <span className="text-sm text-muted-foreground tabular-nums">{count}</span>
        {extra && <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">{extra}</span>}
      </header>
      <div ref={bodyRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-2">
        {children}
      </div>
      {footer && (
        <footer className="shrink-0 border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">{footer}</footer>
      )}
    </section>
  );
}

/** Columna vacía (o destino de arrastre vacío). */
export function KanbanEmpty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed py-8 text-center text-xs text-muted-foreground">{children}</p>;
}

interface KanbanCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Abierta en el panel lateral: borde marcado (el gris de selección no se distingue sobre la bandeja). */
  selected?: boolean;
  /** Es la que se está arrastrando: se atenúa en su sitio. */
  dragging?: boolean;
}

/** Tarjeta: blanca, separada, borde + `shadow-elev`. El relleno lo pone el contenido (p-3 o `KanbanCardSection`). */
export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(({ selected, dragging, className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group/card relative rounded-lg border bg-card text-left shadow-elev transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      selected ? 'border-foreground/40' : 'border-border hover:border-foreground/20',
      dragging && 'opacity-40',
      className,
    )}
    {...rest}
  />
));
KanbanCard.displayName = 'KanbanCard';

/** Bloque de una tarjeta separado por línea fina (estilo HubSpot). El primero va sin línea. */
export function KanbanCardSection({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t border-border/60 px-3 py-2.5 first:border-t-0', className)} {...rest} />;
}

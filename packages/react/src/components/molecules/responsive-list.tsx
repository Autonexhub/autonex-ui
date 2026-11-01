import type { ReactNode } from 'react';
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useIsMobile } from "../../hooks/use-mobile";
import { cn } from "../../lib/utils";

export interface ResponsiveListLabels {
  viewDetailsOf: (label: string) => string;
  viewDetails: string;
  selectLabeled: (label: string) => string;
  selectRow: string;
  selectAll: string;
}

export const DEFAULT_RESPONSIVE_LIST_LABELS: ResponsiveListLabels = {
  viewDetailsOf: (label) => `Ver detalles de ${label}`,
  viewDetails: 'Ver detalles',
  selectLabeled: (label) => `Seleccionar ${label}`,
  selectRow: 'Seleccionar fila',
  selectAll: 'Seleccionar todo',
};

export interface ResponsiveListColumn<T> {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  align?: 'left' | 'right';
  /** Clases extra de la celda y su cabecera (anchos, p. ej. `w-40`). */
  className?: string;
}

export interface ResponsiveListSelection<T, K> {
  selected: ReadonlySet<K>;
  onChange: (next: Set<K>) => void;
  /** Por defecto todas; las que devuelvan false salen con el checkbox deshabilitado. */
  isSelectable?: (item: T) => boolean;
}

export interface ResponsiveListProps<T, K extends string | number> {
  items: T[];
  columns: ResponsiveListColumn<T>[];
  /** Contenido de la tarjeta en móvil (< 768 px). El marco, el checkbox y el clic los pone la lista. */
  renderCard: (item: T) => ReactNode;
  getKey: (item: T) => K;
  /** Nombre de la fila para lectores de pantalla ("Rdifusion"): "Seleccionar Rdifusion", "Ver detalles de Rdifusion". */
  getRowLabel?: (item: T) => string;
  selection?: ResponsiveListSelection<T, K>;
  /** Fila con el detalle abierto (Sheet): se marca con `bg-muted`. */
  activeKey?: K | null;
  onItemClick?: (item: T) => void;
  /** Filas en skeleton bajo las cabeceras reales. */
  loading?: boolean;
  skeletonRows?: number;
  /** Se pinta dentro del marco, bajo la cabecera, cuando no hay elementos. */
  empty?: ReactNode;
  ariaLabel?: string;
  className?: string;
  labels?: Partial<ResponsiveListLabels>;
}

const FRAME = 'overflow-hidden rounded-xl border bg-card shadow-elev';

/**
 * Tabla con el marco de la casa desde `md`; lista de tarjetas por debajo, sin
 * scroll horizontal de página. Cargando, vacío y con datos comparten marco y
 * cabecera para que nada salte.
 */
export function ResponsiveList<T, K extends string | number>({
  items,
  columns,
  renderCard,
  getKey,
  getRowLabel,
  selection,
  activeKey = null,
  onItemClick,
  loading = false,
  skeletonRows = 5,
  empty,
  ariaLabel,
  className,
  labels,
}: ResponsiveListProps<T, K>) {
  const l = { ...DEFAULT_RESPONSIVE_LIST_LABELS, ...labels };
  const isMobile = useIsMobile();

  const canSelect = (item: T) => selection?.isSelectable?.(item) ?? true;
  const selectableKeys = selection ? items.filter(canSelect).map(getKey) : [];
  const selectedCount = selection ? selectableKeys.filter((k) => selection.selected.has(k)).length : 0;
  const headerChecked: boolean | 'indeterminate' =
    selectedCount === 0 ? false : selectedCount === selectableKeys.length ? true : 'indeterminate';

  const toggleAll = () => {
    if (!selection) return;
    const next = new Set(selection.selected);
    if (headerChecked === true) selectableKeys.forEach((k) => next.delete(k));
    else selectableKeys.forEach((k) => next.add(k));
    selection.onChange(next);
  };

  const toggleOne = (key: K) => {
    if (!selection) return;
    const next = new Set(selection.selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selection.onChange(next);
  };

  /**
   * Abrir el detalle: un <button> de verdad que cubre la fila (inset-0) pero sin
   * eventos de ratón. El ratón usa el onClick de la fila, así los checkboxes y
   * enlaces de las celdas siguen siendo clicables; el teclado llega al botón con
   * Tab, que se anuncia como botón con nombre y pinta el anillo de foco en toda
   * la fila (ring-inset, visible también sobre la fila resaltada en bg-muted).
   * Se elige frente a role="button" en el <tr> porque eso borra la semántica de
   * fila de la tabla.
   */
  const openButton = (item: T) => {
    if (!onItemClick) return null;
    const label = getRowLabel?.(item);
    return (
      <button
        type="button"
        className="pointer-events-none absolute inset-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        aria-label={label ? l.viewDetailsOf(label) : l.viewDetails}
        onClick={(e) => {
          e.stopPropagation();
          onItemClick(item);
        }}
      />
    );
  };

  const itemCheckbox = (item: T) => {
    const key = getKey(item);
    const label = getRowLabel?.(item);
    return (
      // El clic en el checkbox no abre el detalle.
      <div className="relative z-10 flex h-5 items-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selection?.selected.has(key) ?? false}
          disabled={!canSelect(item)}
          onCheckedChange={() => toggleOne(key)}
          aria-label={label ? l.selectLabeled(label) : l.selectRow}
        />
      </div>
    );
  };

  const isEmpty = !loading && items.length === 0;

  if (isMobile) {
    return (
      <div className={cn(FRAME, className)} aria-busy={loading || undefined}>
        {selection && !isEmpty && (
          <label className="flex h-12 items-center gap-3 border-b bg-muted px-4 text-sm">
            <Checkbox
              checked={headerChecked}
              onCheckedChange={toggleAll}
              disabled={loading || selectableKeys.length === 0}
              className="border-border bg-background"
            />
            {l.selectAll}
          </label>
        )}
        {loading ? (
          <ul className="divide-y divide-border">
            {Array.from({ length: Math.min(skeletonRows, 4) }).map((_, i) => (
              <li key={i} className="flex flex-col gap-2 p-4">
                <div className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-5 w-20 rounded-3xl" />
              </li>
            ))}
          </ul>
        ) : isEmpty ? (
          empty
        ) : (
          <ul role="list" aria-label={ariaLabel} className="divide-y divide-border">
            {items.map((item) => {
              const key = getKey(item);
              const highlighted = key === activeKey || (selection?.selected.has(key) ?? false);
              return (
                <li
                  key={key}
                  data-list-item={key}
                  className={cn(
                    'relative flex gap-3 p-4 text-sm transition-colors',
                    onItemClick && 'cursor-pointer hover:bg-muted/50',
                    highlighted && 'bg-muted hover:bg-muted',
                  )}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                >
                  {selection && itemCheckbox(item)}
                  {openButton(item)}
                  <div className="min-w-0 flex-1">{renderCard(item)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  const colSpan = columns.length + (selection ? 1 : 0);
  const alignClass = (c: ResponsiveListColumn<T>) => (c.align === 'right' ? 'text-right' : undefined);

  return (
    <div className={cn(FRAME, className)}>
      <Table aria-label={ariaLabel} aria-busy={loading || undefined}>
        <TableHeader>
          <TableRow>
            {selection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={headerChecked}
                  onCheckedChange={toggleAll}
                  disabled={loading || selectableKeys.length === 0}
                  aria-label={l.selectAll}
                  className="border-border bg-background"
                />
              </TableHead>
            )}
            {columns.map((c) => (
              <TableHead key={c.key} className={cn(alignClass(c), c.className)}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, r) => (
              <TableRow key={r} className="hover:bg-transparent">
                {selection && (
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded-[5px]" />
                  </TableCell>
                )}
                {columns.map((c, i) => (
                  <TableCell key={c.key} className={c.className}>
                    <Skeleton className={cn('h-4', i === 0 ? 'w-32' : 'w-20', c.align === 'right' && 'ml-auto')} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isEmpty ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colSpan} className="p-0 whitespace-normal">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const key = getKey(item);
              const selected = selection?.selected.has(key) ?? false;
              return (
                <TableRow
                  key={key}
                  data-list-item={key}
                  data-state={selected || key === activeKey ? 'selected' : undefined}
                  className={cn('relative', onItemClick && 'cursor-pointer')}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                >
                  {selection && <TableCell className="align-top">{itemCheckbox(item)}</TableCell>}
                  {columns.map((c, i) => (
                    <TableCell key={c.key} className={cn('align-top', alignClass(c), c.className)}>
                      {/* El botón de abrir va en la primera celda (tras el checkbox) y cubre toda la fila. */}
                      {i === 0 && openButton(item)}
                      {c.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

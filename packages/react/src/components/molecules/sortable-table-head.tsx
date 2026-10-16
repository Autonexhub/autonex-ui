import { ReactNode } from 'react';
import { TableHead } from "../ui/table";
import { ArrowDown, ArrowUp, CaretUpDown as ChevronsUpDown } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

export interface SortState<K extends string = string> {
  key: K;
  dir: 'asc' | 'desc';
}

/**
 * Cabecera de tabla ordenable — UN solo componente para todo el CRM.
 * Origen: extraído de los 5 `SortHead` idénticos que vivían duplicados en
 * Contactos, ListaDetalle, Tareas, Negocios y Servicios (revisión Ola 2,
 * diff 25). El affordance de orden es la flecha; la cabecera NO se re-estila
 * (regla Table Headers).
 */
export function SortableTableHead<K extends string>({
  k,
  sort,
  onToggle,
  className,
  style,
  children,
}: {
  k: K;
  sort: SortState<K> | null;
  onToggle: (k: K) => void;
  className?: string;
  /** Ancho de columna, para que la tabla no se dimensione solo por contenido. */
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <TableHead className={cn(className)} style={style}>
      <button
        onClick={() => onToggle(k)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${
          sort?.key === k ? 'text-foreground' : ''
        }`}
      >
        {children}
        {sort?.key === k
          ? (sort.dir === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)
          : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
      </button>
    </TableHead>
  );
}

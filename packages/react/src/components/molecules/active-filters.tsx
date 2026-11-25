import { X } from "@phosphor-icons/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  /** Texto del botón de limpiar. Por defecto, "Limpiar todo". */
  clearAllLabel?: string;
  /** Prefijo del aria-label de cada aspa. Por defecto, "Quitar". */
  removeLabel?: string;
  /**
   * Pulsar el texto de una píldora abre ese filtro para cambiarlo (como Linear); el aspa sigue quitándolo.
   * Sin `onSelect` las píldoras no se pueden pulsar.
   */
  onSelect?: (id: string) => void;
  /** Qué píldoras se pueden pulsar para editar (por defecto, todas si hay `onSelect`). */
  isSelectable?: (id: string) => boolean;
  /** Prefijo del aria-label del texto editable. Por defecto, "Cambiar". */
  editLabel?: string;
}

/**
 * Lo que hay filtrado ahora mismo, en píldoras con su aspa. Acompañante de
 * `FilterPopover` / `FilterBar`: el popover cerrado solo enseña un número y con eso no se
 * sabe POR QUÉ falta media lista; aquí se lee de un vistazo y se quita de
 * uno en uno. Los textos llegan por props (el paquete no depende de i18n).
 */
export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  clearAllLabel = "Limpiar todo",
  removeLabel = "Quitar",
  onSelect,
  isSelectable,
  editLabel = "Cambiar",
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const editable = !!onSelect && (isSelectable ? isSelectable(filter.id) : true);
        return (
          <Badge key={filter.id} variant="secondary" className="gap-1 pr-1">
            {editable ? (
              <button
                type="button"
                onClick={() => onSelect?.(filter.id)}
                className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`${editLabel} ${filter.label}`}
              >
                {filter.label}
              </button>
            ) : (
              filter.label
            )}
            <button
              type="button"
              onClick={() => onRemove(filter.id)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              aria-label={`${removeLabel} ${filter.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground">
        {clearAllLabel}
      </Button>
    </div>
  );
}

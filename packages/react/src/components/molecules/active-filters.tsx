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
}

/**
 * Lo que hay filtrado ahora mismo, en píldoras con su aspa. Acompañante de
 * `FilterPopover`: el popover cerrado solo enseña un número y con eso no se
 * sabe POR QUÉ falta media lista; aquí se lee de un vistazo y se quita de
 * uno en uno. Los textos llegan por props (el paquete no depende de i18n).
 */
export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  clearAllLabel = "Limpiar todo",
  removeLabel = "Quitar",
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Badge key={filter.id} variant="secondary" className="gap-1 pr-1">
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove(filter.id)}
            className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
            aria-label={`${removeLabel} ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground">
        {clearAllLabel}
      </Button>
    </div>
  );
}

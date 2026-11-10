import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Funnel as Filter, Plus, MagnifyingGlass as Search } from "@phosphor-icons/react";

interface KBBlocksSkeletonProps {
  /** Number of block card skeletons to render. Default 5. */
  count?: number;
}

/**
 * Skeleton for the UnifiedKBView / Knowledge Base blocks.
 * Calca la anatomía real (opción A, Bruno 02/09): toolbar canon (buscador +
 * filtro de estado + "Añadir bloque"), contador y tarjetas sin banda de cabecera.
 * La toolbar es estructura, no datos — se pinta real pero deshabilitada
 * (regla Skeleton Loading); solo el contador y las tarjetas hacen pulse.
 */
export function KBBlocksSkeleton({ count = 5 }: KBBlocksSkeletonProps) {
  return (
    <div>
      {/* Toolbar de listado (regla Toolbars, Bruno 02/09): mismas clases que la real
          en UnifiedKBView — mb-6, gap-3, buscador flex-1 a 40 px, Estado + Añadir bloque. */}
      <div className="mb-6 flex gap-3 items-center">
        <InputGroup className="h-10 flex-1">
          <InputGroupAddon>
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar bloques…" disabled aria-label="Buscar bloques" />
        </InputGroup>
        <Button variant="outline" className="gap-2" disabled>
          <Filter className="h-4 w-4" />
          Estado
        </Button>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" /> Añadir bloque
        </Button>
      </div>

      {/* Contador "N bloques · M activos" */}
      <Skeleton className="mb-4 h-4 w-48" />

      {/* Block cards: misma rejilla que SortableCard */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div
              className="grid gap-3 px-4 py-3 items-center"
              style={{ gridTemplateColumns: "auto minmax(0,1fr) 8rem 18rem 5rem" }}
            >
              {/* Grip handle */}
              <Skeleton className="h-5 w-5" />

              {/* Chevron + título + categoría (un solo trigger en la tarjeta real) */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>

              {/* Status badge */}
              <Skeleton className="h-5 w-16 rounded-full" />

              {/* Dates */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

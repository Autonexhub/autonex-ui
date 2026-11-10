import { Skeleton } from "../ui/skeleton";

interface CareersKanbanSkeletonProps {
  cardsPerColumn?: number[];
}

/**
 * Skeleton del tablero de candidaturas: 7 columnas w-72 (como el tablero real)
 * con tarjetas de avatar + nombre + puesto + fila de meta.
 */
export function CareersKanbanSkeleton({
  cardsPerColumn = [3, 2, 2, 1, 1, 0, 1],
}: CareersKanbanSkeletonProps) {
  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-hidden pb-2">
      {cardsPerColumn.map((count, colIdx) => (
        <div key={colIdx} className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-card p-1.5">
          <Skeleton className="mx-0.5 mb-2 h-1 rounded-full" />
          <div className="flex items-center gap-2 px-2 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-4" />
          </div>
          <div className="flex-1 space-y-2 rounded-lg bg-muted/60 p-2">
            {Array.from({ length: count }).map((_, cardIdx) => (
              <div key={cardIdx} className="space-y-2.5 rounded-lg border border-border bg-card p-3">
                <div className="flex items-start gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-border/60 pt-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

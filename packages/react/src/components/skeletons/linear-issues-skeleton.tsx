import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface LinearIssuesSkeletonProps {
  rows?: number;
  columns?: string[];
  /** Títulos reales de columna, por clave. Por defecto los mismos que pinta la
   *  tabla real (por defecto, en español) — los títulos son estructura, no dato: se pintan como
   *  texto durante la carga y solo las filas hacen shimmer. */
  labels?: Partial<Record<string, string>>;
}

/**
 * Skeleton for Linear issues table/list view.
 * Matches the actual table structure for a smooth transition.
 */
export function LinearIssuesSkeleton({
  rows = 8,
  columns = ['priority', 'state', 'ref', 'title', 'project', 'labels', 'assignee', 'due'],
  labels,
}: LinearIssuesSkeletonProps) {
  const head = (key: string, fallback: string) => labels?.[key] ?? fallback;
  return (
    <Card className="rounded-xl border overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.includes('priority') && <TableHead className="w-8"></TableHead>}
            {columns.includes('state') && <TableHead className="w-8"></TableHead>}
            {columns.includes('ref') && <TableHead className="w-[90px]">{head('ref', "Ref")}</TableHead>}
            {columns.includes('title') && <TableHead>{head('title', "Título")}</TableHead>}
            {columns.includes('project') && <TableHead className="w-[140px]">{head('project', "Proyecto")}</TableHead>}
            {columns.includes('labels') && <TableHead className="w-[150px]">{head('labels', "Label")}</TableHead>}
            {columns.includes('assignee') && <TableHead className="w-[150px]">{head('assignee', "Asignado")}</TableHead>}
            {columns.includes('due') && <TableHead className="w-[100px]">{head('due', "Venc.")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {columns.includes('priority') && (
                <TableCell><Skeleton className="h-4 w-4 rounded-sm" /></TableCell>
              )}
              {columns.includes('state') && (
                <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
              )}
              {columns.includes('ref') && (
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              )}
              {columns.includes('title') && (
                <TableCell>
                  <Skeleton className="h-4" style={{ width: `${60 + Math.random() * 30}%` }} />
                </TableCell>
              )}
              {columns.includes('project') && (
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3 w-3 rounded-sm" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
              )}
              {columns.includes('labels') && (
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    {i % 3 === 0 && <Skeleton className="h-5 w-10 rounded-full" />}
                  </div>
                </TableCell>
              )}
              {columns.includes('assignee') && (
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>
              )}
              {columns.includes('due') && (
                <TableCell><Skeleton className="h-3 w-12" /></TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * Skeleton for Linear Kanban board view.
 */
export function LinearKanbanSkeleton({ columns = 5, cardsPerColumn = 4 }: { columns?: number; cardsPerColumn?: number }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Array.from({ length: columns }).map((_, colIdx) => (
        <div key={colIdx} className="flex-shrink-0 w-[280px]">
          {/* Column header */}
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-6 ml-auto" />
          </div>
          {/* Cards */}
          <div className="space-y-2">
            {Array.from({ length: cardsPerColumn }).map((_, cardIdx) => (
              <Card key={cardIdx} className="p-3 space-y-2 animate-pulse">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full ml-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

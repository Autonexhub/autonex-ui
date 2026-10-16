import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

interface TableSkeletonProps {
  /** Number of skeleton rows to render. Default 6. */
  rows?: number;
  /** Number of columns per row. Default 5. */
  columns?: number;
  /** Real header titles. When provided, the header renders as text (not
   * skeleton bars) so the table structure stays legible while loading. */
  headers?: string[];
  /** Reserve a leading checkbox column (w-12) so titles don't shift when
   * the real table (with row checkboxes) replaces the skeleton. */
  checkboxColumn?: boolean;
  /** Explicit grid-template-columns matching the real table's column widths
   * (e.g. "minmax(0,1fr) 8rem 6rem"), so nothing shifts on data arrival. */
  template?: string;
  /** Per-column text alignment for the header titles (defaults to left). */
  aligns?: ("left" | "center" | "right")[];
}

/**
 * Skeleton for table-based content (Tools, Users, Conversations list, etc.).
 * Renders a header row + N data rows. Pass `headers` to keep the real
 * column titles visible while only the rows shimmer.
 */
export const TableSkeleton = ({ rows = 6, columns = 5, headers, checkboxColumn = false, template, aligns }: TableSkeletonProps) => {
  const cols = headers ? headers.length : columns;
  // Sin gap: la tabla real espacia por padding de celda (px-4), el grid igual.
  const gridTemplate = `${checkboxColumn ? "3rem " : ""}${template ?? `repeat(${cols}, minmax(0, 1fr))`}`;
  const alignClass = (i: number) =>
    aligns?.[i] === "right" ? "text-right justify-self-end" : aligns?.[i] === "center" ? "text-center justify-self-center" : "";
  const checkboxCell = <div className="px-4"><Skeleton className="h-4 w-4 rounded-[5px]" /></div>;
  return (
    <div className="space-y-3">
      {/* Header row */}
      {headers ? (
        <div className="grid h-12 items-center border-b border-border bg-muted text-sm font-normal text-foreground" style={{ gridTemplateColumns: gridTemplate }}>
          {checkboxColumn && checkboxCell}
          {headers.map((h, i) => (
            <span key={i} className={`truncate whitespace-nowrap px-4 ${alignClass(i)}`}>{h}</span>
          ))}
        </div>
      ) : (
      <div className="grid gap-4 px-4 py-3 border-b border-border" style={{ gridTemplateColumns: gridTemplate }}>
        {checkboxColumn && checkboxCell}
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      )}
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={`grid items-center py-3 ${headers ? "" : "gap-4 px-4"}`} style={{ gridTemplateColumns: gridTemplate }}>
          {checkboxColumn && checkboxCell}
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={headers ? "px-4" : ""}>
              <Skeleton className={`h-4 ${c === 0 ? 'w-full' : c === cols - 1 ? 'w-16' : 'w-3/4'}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton del reproductor de audio: píldora de tiempo,
 * play redondo, barra de onda y dos controles redondos. Se superpone al
 * reproductor mientras WaveSurfer descarga y decodifica el audio.
 */
export const AudioPlayerSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {/* Calca la anatomía real del reproductor: -5s · play · +10s · tiempo ·
          onda · duración · chip de velocidad · descargar */}
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
      <Skeleton className="h-3 flex-1 rounded-full" />
      <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
      <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
      <Skeleton className="size-8 shrink-0 rounded-full" />
    </div>
  );
};

interface CardGridSkeletonProps {
  /** Number of card placeholders. Default 4. */
  count?: number;
  /** Tailwind grid-cols class. Default md:grid-cols-2. */
  gridClass?: string;
}

/**
 * Skeleton for card-grid layouts (MetricsHub, list of options).
 */
export const CardGridSkeleton = ({ count = 4, gridClass = "md:grid-cols-2" }: CardGridSkeletonProps) => {
  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4 shadow-elev">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-9 w-full mt-6" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for form-based pages (Profile settings, config forms).
 */
export const FormSkeleton = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4 shadow-elev">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for a list of items (conversation list, message list).
 */
export const ListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
};

interface TableRowSkeletonProps {
  /** Number of columns in the table. */
  columns: number;
  /** Number of skeleton rows to render. Default 6. */
  rows?: number;
}

/**
 * Skeleton rows designed to go inside an existing <Table>'s <TableBody>.
 * Use when the table header is already rendered and you only want to
 * replace the data rows during loading.
 */
export const TableRowSkeleton = ({ columns, rows = 6 }: TableRowSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <TableCell key={c} className="py-3">
              <Skeleton className={`h-4 ${c === 0 ? 'w-full' : c === columns - 1 ? 'w-16' : 'w-3/4'}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

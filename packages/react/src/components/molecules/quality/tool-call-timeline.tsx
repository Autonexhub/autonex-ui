import * as React from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { cn } from "../../../lib/utils";
import { formatOffset } from "./format";

export interface ToolCallItem {
  name: string;
  tOffsetS?: number | null;
  durationMs?: number | null;
  error?: boolean | string | null;
  input?: unknown;
  output?: unknown;
  status?: string | null;
}

export interface ToolCallTimelineProps {
  calls: ToolCallItem[];
  onSeek?: (seconds: number) => void;
  emptyLabel?: string;
  detailLabel?: string;
  inputLabel?: string;
  outputLabel?: string;
  className?: string;
}

const MAX_JSON = 2000;

export function stringifyPayload(v: unknown): string {
  let s: string;
  if (typeof v === "string") {
    try {
      s = JSON.stringify(JSON.parse(v), null, 2);
    } catch {
      s = v;
    }
  } else {
    try {
      s = JSON.stringify(v, null, 2) ?? String(v);
    } catch {
      s = String(v);
    }
  }
  return s.length > MAX_JSON ? `${s.slice(0, MAX_JSON)}…` : s;
}

function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1).replace(/\.0$/, "")} s` : `${Math.round(ms)} ms`;
}

/** Herramientas que llamó el agente, en orden, con su segundo, duración, error y la entrada/salida plegada. */
export function ToolCallTimeline({
  calls,
  onSeek,
  emptyLabel = "Sin llamadas a herramientas",
  detailLabel = "Detalle",
  inputLabel = "Entrada",
  outputLabel = "Salida",
  className,
}: ToolCallTimelineProps) {
  if (!calls.length) return <div className={cn("py-4 text-sm text-muted-foreground", className)}>{emptyLabel}</div>;
  return (
    <ol data-slot="tool-call-timeline" className={cn("relative flex flex-col", className)}>
      {calls.map((c, i) => {
        const failed = c.error === true || (typeof c.error === "string" && c.error.length > 0);
        const hasT = c.tOffsetS !== null && c.tOffsetS !== undefined && Number.isFinite(Number(c.tOffsetS));
        const hasDetail = c.input !== undefined && c.input !== null ? true : c.output !== undefined && c.output !== null;
        return (
          <li key={i} className="relative flex gap-3 pb-3 last:pb-0" data-error={failed ? "true" : undefined}>
            {i < calls.length - 1 ? <span aria-hidden="true" className="absolute left-[4px] top-4 bottom-0 w-px bg-border" /> : null}
            <span aria-hidden="true" className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", failed ? "bg-destructive" : "bg-brand")} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono font-medium text-foreground">{c.name}</span>
                {c.status ? <span className="text-xs text-muted-foreground">{c.status}</span> : null}
                {typeof c.error === "string" && c.error ? <span className="text-xs text-destructive">{c.error}</span> : null}
                <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                  {c.durationMs !== null && c.durationMs !== undefined ? <span>{formatDuration(Number(c.durationMs))}</span> : null}
                  {hasT ? (
                    onSeek ? (
                      <button
                        type="button"
                        className="rounded px-1 font-mono hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        onClick={() => onSeek(Number(c.tOffsetS))}
                        aria-label={`Ir a ${formatOffset(c.tOffsetS)}`}
                      >
                        {formatOffset(c.tOffsetS)}
                      </button>
                    ) : (
                      <span className="font-mono">{formatOffset(c.tOffsetS)}</span>
                    )
                  ) : null}
                </span>
              </div>
              {hasDetail ? (
                <Collapsible>
                  <CollapsibleTrigger className="group mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <CaretRight className="size-3 transition-transform group-data-[state=open]:rotate-90" aria-hidden="true" />
                    {detailLabel}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 flex flex-col gap-1.5">
                    {c.input !== undefined && c.input !== null ? (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">{inputLabel}</div>
                        <pre className="max-h-48 overflow-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">{stringifyPayload(c.input)}</pre>
                      </div>
                    ) : null}
                    {c.output !== undefined && c.output !== null ? (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">{outputLabel}</div>
                        <pre className="max-h-48 overflow-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">{stringifyPayload(c.output)}</pre>
                      </div>
                    ) : null}
                  </CollapsibleContent>
                </Collapsible>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import * as React from "react";
import { cn } from "../../../lib/utils";
import { formatOffset } from "./format";

export interface TranscriptTurn {
  index: number;
  role: "user" | "assistant" | "agent" | "system" | string;
  text: string;
  /** Segundo de la llamada. */
  t?: number | null;
}

export interface TranscriptEvidenceHandle {
  scrollToTurn: (index: number) => void;
}

export interface TranscriptEvidenceProps {
  turns: TranscriptTurn[];
  /** Turno resaltado (el de la cita seleccionada): se lleva a la vista cada vez que cambia. */
  highlightIndex?: number | null;
  /** Turnos con evidencia: marca sutil. */
  highlightIndexes?: number[];
  onSeek?: (seconds: number, turn: TranscriptTurn) => void;
  roleLabels?: Partial<Record<string, string>>;
  maxHeight?: number | string;
  emptyLabel?: string;
  className?: string;
}

export const DEFAULT_TRANSCRIPT_ROLE_LABELS: Record<string, string> = {
  user: "Cliente",
  contact: "Cliente",
  assistant: "Agente",
  bot: "Agente",
  agent: "Persona",
  system: "Sistema",
};

function scrollIntoViewSafe(el: Element | null | undefined) {
  if (el && typeof (el as HTMLElement).scrollIntoView === "function") {
    try {
      (el as HTMLElement).scrollIntoView({ block: "center", behavior: "smooth" });
    } catch {
      /* entornos sin layout (tests) */
    }
  }
}

/** Transcripción con el turno de la evidencia resaltado y marcas de tiempo que saltan en el audio. */
export const TranscriptEvidence = React.forwardRef<TranscriptEvidenceHandle, TranscriptEvidenceProps>(function TranscriptEvidence(
  { turns, highlightIndex, highlightIndexes, onSeek, roleLabels, maxHeight = 480, emptyLabel = "Sin transcripción", className },
  ref,
) {
  const listRef = React.useRef<HTMLOListElement>(null);
  const labels = { ...DEFAULT_TRANSCRIPT_ROLE_LABELS, ...roleLabels };
  const marked = React.useMemo(() => new Set(highlightIndexes ?? []), [highlightIndexes]);

  const scrollToTurn = React.useCallback((index: number) => {
    scrollIntoViewSafe(listRef.current?.querySelector(`[data-turn-index="${index}"]`));
  }, []);
  React.useImperativeHandle(ref, () => ({ scrollToTurn }), [scrollToTurn]);
  React.useEffect(() => {
    if (highlightIndex !== null && highlightIndex !== undefined) scrollToTurn(highlightIndex);
  }, [highlightIndex, scrollToTurn]);

  if (!turns.length) {
    return <div className={cn("py-6 text-center text-sm text-muted-foreground", className)}>{emptyLabel}</div>;
  }
  return (
    <ol
      ref={listRef}
      data-slot="transcript-evidence"
      className={cn("flex flex-col gap-1 overflow-y-auto pr-1", className)}
      style={{ maxHeight }}
    >
      {turns.map((turn) => {
        const isUser = turn.role === "user" || turn.role === "contact";
        const active = highlightIndex === turn.index;
        const hasT = turn.t !== null && turn.t !== undefined && Number.isFinite(Number(turn.t));
        return (
          <li
            key={turn.index}
            data-turn-index={turn.index}
            data-active={active ? "true" : undefined}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-muted ring-2 ring-ring/50" : marked.has(turn.index) ? "bg-muted/50" : "",
            )}
          >
            {marked.has(turn.index) && !active ? (
              <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-warning" />
            ) : null}
            <div className="mb-0.5 flex items-center gap-2 text-xs">
              <span className={cn("font-medium", isUser ? "text-brand" : "text-muted-foreground")}>{labels[turn.role] ?? turn.role}</span>
              <span className="text-muted-foreground">#{turn.index}</span>
              {hasT ? (
                onSeek ? (
                  <button
                    type="button"
                    className="ml-auto rounded px-1 font-mono tabular-nums text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={() => onSeek(Number(turn.t), turn)}
                    aria-label={`Ir a ${formatOffset(turn.t)}`}
                  >
                    {formatOffset(turn.t)}
                  </button>
                ) : (
                  <span className="ml-auto font-mono tabular-nums text-muted-foreground">{formatOffset(turn.t)}</span>
                )
              ) : null}
            </div>
            <p className="whitespace-pre-wrap text-foreground">{turn.text}</p>
          </li>
        );
      })}
    </ol>
  );
});

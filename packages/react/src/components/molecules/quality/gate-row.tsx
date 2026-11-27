import * as React from "react";
import { Play } from "@phosphor-icons/react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { GateBadge, type GateBadgeLabels, type GateState } from "./badges";
import { momentLabel } from "./format";

/** Cita literal que prueba una puerta o un hallazgo, con el turno y el segundo de la llamada si se conocen. */
export interface EvidenceQuote {
  quote: string;
  reason?: string | null;
  turnIndex?: number | null;
  tOffsetS?: number | null;
}

export interface GateRowProps {
  label: string;
  description?: string;
  state: GateState;
  lowConfidence?: boolean;
  evidence?: EvidenceQuote[];
  /** «Ir al momento» de una cita (salta en la transcripción y el audio). */
  onSeek?: (q: EvidenceQuote) => void;
  /** Contenido extra a la derecha, antes del badge. */
  trailing?: React.ReactNode;
  badgeLabels?: GateBadgeLabels;
  goToLabel?: string;
  className?: string;
}

/** Una puerta RAP: nombre y descripción, estado, y debajo las citas que la prueban con enlace al momento. */
export function GateRow({ label, description, state, lowConfidence, evidence, onSeek, trailing, badgeLabels, goToLabel = "Ir al momento", className }: GateRowProps) {
  return (
    <div data-slot="gate-row" className={cn("flex flex-col gap-2 py-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{label}</div>
          {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {trailing}
          <GateBadge state={state} lowConfidence={lowConfidence} labels={badgeLabels} />
        </div>
      </div>
      {evidence && evidence.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {evidence.map((q, i) => {
            const moment = momentLabel(q.tOffsetS, q.turnIndex);
            return (
              <li key={i} className="flex flex-col gap-1">
                <blockquote className="border-l-2 border-border pl-3 text-sm italic text-foreground">«{q.quote}»</blockquote>
                {q.reason || (onSeek && moment) ? (
                  <div className="flex flex-wrap items-center gap-2 pl-3.5">
                    {q.reason ? <span className="text-xs text-muted-foreground">{q.reason}</span> : null}
                    {onSeek && moment ? (
                      <Button type="button" variant="link" size="xs" className="h-auto px-0" onClick={() => onSeek(q)}>
                        <Play weight="fill" aria-hidden="true" />
                        {goToLabel} · {moment}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

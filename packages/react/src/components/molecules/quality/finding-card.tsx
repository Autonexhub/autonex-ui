import * as React from "react";
import { CheckCircle, Play, XCircle } from "@phosphor-icons/react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { SeverityBadge, type Severity } from "./badges";
import { momentLabel } from "./format";

export interface FindingCardLabels {
  goTo: string;
  confirmed: string;
  rejected: string;
  confidence: (pct: number) => string;
  penalty: (p: number) => string;
}

export const DEFAULT_FINDING_CARD_LABELS: FindingCardLabels = {
  goTo: "Ir al momento",
  confirmed: "Confirmado",
  rejected: "Rechazado",
  confidence: (pct) => `${pct} % confianza`,
  penalty: (p) => `${p > 0 ? "+" : ""}${p} pts`,
};

export interface FindingCardProps {
  patternCode: string;
  patternLabel?: string;
  description?: string;
  severity: Severity | string;
  dimension?: string | null;
  quote?: string | null;
  reason?: string | null;
  turnIndex?: number | null;
  tOffsetS?: number | null;
  /** 0-1. */
  confidence?: number | null;
  penalty?: number | null;
  verdict?: "unreviewed" | "confirmed" | "rejected" | string | null;
  /** Hallazgo seleccionado (el que está resaltado en la transcripción). */
  active?: boolean;
  onGoTo?: () => void;
  /** Botones de revisión u otras acciones, al pie. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  labels?: Partial<FindingCardLabels>;
  className?: string;
}

/** Un hallazgo RAP: patrón, gravedad, dimensión, la cita que lo prueba y el enlace al momento de la llamada. */
export function FindingCard({
  patternCode,
  patternLabel,
  description,
  severity,
  dimension,
  quote,
  reason,
  turnIndex,
  tOffsetS,
  confidence,
  penalty,
  verdict,
  active,
  onGoTo,
  actions,
  children,
  labels: labelsProp,
  className,
}: FindingCardProps) {
  const labels = { ...DEFAULT_FINDING_CARD_LABELS, ...labelsProp };
  const moment = momentLabel(tOffsetS, turnIndex);
  const showFooter = (onGoTo && moment) || verdict === "confirmed" || verdict === "rejected" || actions;
  return (
    <article
      data-slot="finding-card"
      data-active={active ? "true" : undefined}
      data-verdict={verdict ?? undefined}
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3 transition-colors",
        active && "bg-muted ring-2 ring-ring/40",
        verdict === "rejected" && "opacity-70",
        className,
      )}
    >
      <header className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold text-foreground">{patternCode}</span>
        {patternLabel ? <span className="min-w-0 text-sm font-medium text-foreground">{patternLabel}</span> : null}
        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={severity} />
          {dimension ? (
            <Badge variant="secondary" className="font-mono uppercase">
              {dimension}
            </Badge>
          ) : null}
          {confidence !== null && confidence !== undefined ? (
            <span className="text-xs tabular-nums text-muted-foreground">{labels.confidence(Math.round(Number(confidence) * 100))}</span>
          ) : null}
          {penalty !== null && penalty !== undefined && Number(penalty) !== 0 ? (
            <span className="text-xs tabular-nums text-muted-foreground">{labels.penalty(Number(penalty))}</span>
          ) : null}
        </span>
      </header>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {quote ? <blockquote className="border-l-2 border-border pl-3 text-sm italic text-foreground">«{quote}»</blockquote> : null}
      {reason ? <p className="text-xs text-muted-foreground">{reason}</p> : null}
      {children}
      {showFooter ? (
        <footer className="flex flex-wrap items-center gap-2">
          {onGoTo && moment ? (
            <Button type="button" variant="link" size="xs" className="h-auto px-0" onClick={onGoTo}>
              <Play weight="fill" aria-hidden="true" />
              {labels.goTo} · {moment}
            </Button>
          ) : null}
          {verdict === "confirmed" ? (
            <Badge variant="success">
              <CheckCircle weight="fill" aria-hidden="true" />
              {labels.confirmed}
            </Badge>
          ) : verdict === "rejected" ? (
            <Badge variant="secondary" className="text-muted-foreground">
              <XCircle weight="fill" aria-hidden="true" />
              {labels.rejected}
            </Badge>
          ) : null}
          {actions ? <div className="ml-auto flex flex-wrap items-center gap-1.5">{actions}</div> : null}
        </footer>
      ) : null}
    </article>
  );
}

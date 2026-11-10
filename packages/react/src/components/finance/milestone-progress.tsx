import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { formatArrShort, formatCentsRound, formatMonthAxis, formatMonthsNumber } from "./format";
import { milestoneProgress } from "./forecast-view";
import { InfoTip } from "./info-tip";

export interface MilestoneProgressLabels {
  title: string;
  info: string;
  none: string;
  /** «ARR hoy 49 K€ de 166 K€ · mar 27 · 30 %». */
  line: (v: { now: string; target: string; month: string; pct: string }) => string;
  /** «faltan 117 K€ · 12 K€ de MRR nuevo al mes». */
  gap: (v: { gap: string; mrr: string }) => string;
  gapOnly: (v: { gap: string }) => string;
  aria: (target: string) => string;
}

export const DEFAULT_MILESTONE_PROGRESS_LABELS: MilestoneProgressLabels = {
  title: "Siguiente hito",
  info: "Los hitos del plan son los del escenario Cielo: es el que el plan quiere alcanzar.",
  none: "Sin hitos pendientes",
  line: ({ now, target, month, pct }) => `ARR hoy ${now} de ${target} · ${month} · ${pct} %`,
  gap: ({ gap, mrr }) => `faltan ${gap} · ${mrr} de MRR nuevo al mes`,
  gapOnly: ({ gap }) => `faltan ${gap}`,
  aria: (target) => `Avance hacia el hito de ${target}`,
};

export interface MilestoneProgressValue {
  month: string;
  arr_cents: number;
  arr_now_cents: number;
  progress_bp?: number;
  required_new_mrr_cents?: number;
}

/**
 * «Siguiente hito» del Plan (R1): barra de avance del ARR de hoy hacia el hito de Cielo («ARR hoy 49 K€ de 166 K€ ·
 * mar 27 · 30 %») y debajo lo que falta y el MRR nuevo al mes que haría falta. Sin hito pendiente, lo dice.
 */
export function MilestoneProgress({
  milestone,
  className,
  labels: labelsProp,
}: {
  milestone: MilestoneProgressValue | null;
  className?: string;
  labels?: Partial<MilestoneProgressLabels>;
}) {
  const labels = { ...DEFAULT_MILESTONE_PROGRESS_LABELS, ...labelsProp };
  if (!milestone) {
    return (
      <Card className={cn("flex items-center gap-2 px-6 py-4", className)}>
        <h2 className="text-sm font-semibold text-foreground">{labels.title}</h2>
        <span className="text-sm text-muted-foreground">{labels.none}</span>
      </Card>
    );
  }
  const { pct, gapCents } = milestoneProgress(milestone);
  const target = formatArrShort(milestone.arr_cents);
  return (
    <Card className={cn("flex flex-col gap-3 px-6 py-4", className)}>
      <div className="flex items-center gap-1 text-xs font-medium tracking-[0.01em] text-muted-foreground">
        <h2 className="text-xs font-medium">{labels.title}</h2>
        <InfoTip label={labels.title}>{labels.info}</InfoTip>
      </div>
      <p className="text-base font-semibold tabular-nums text-foreground">
        {labels.line({ now: formatArrShort(milestone.arr_now_cents), target, month: formatMonthAxis(milestone.month), pct: formatMonthsNumber(Math.round(pct)) })}
      </p>
      <Progress value={pct} className="h-2" aria-label={labels.aria(target)} />
      <p className="text-sm tabular-nums text-muted-foreground">
        {milestone.required_new_mrr_cents !== undefined
          ? labels.gap({ gap: formatCentsRound(gapCents), mrr: formatCentsRound(milestone.required_new_mrr_cents) })
          : labels.gapOnly({ gap: formatCentsRound(gapCents) })}
      </p>
    </Card>
  );
}

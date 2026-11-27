import { Warning } from "@phosphor-icons/react";
import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";

// ── Puertas ────────────────────────────────────────────────────────────────────────────────────────────────────

/** true = abierta, false = cerrada, null = sin medir (nunca «cerrada» por defecto). */
export type GateState = boolean | null;

export interface GateBadgeLabels {
  open?: string;
  closed?: string;
  unmeasured?: string;
}

export interface GateBadgeProps {
  state: GateState;
  /** El dato no identifica bien el caso (p. ej. recontacto cuando el teléfono no es el de quien llama). */
  lowConfidence?: boolean;
  /** Nombre de la puerta: pinta «label · estado». */
  label?: string;
  labels?: GateBadgeLabels;
  /** Texto del aviso de baja confianza. */
  lowConfidenceLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

export const DEFAULT_GATE_LABELS: Required<GateBadgeLabels> = { open: "Abierta", closed: "Cerrada", unmeasured: "Sin medir" };

/** Estado de una puerta RAP: abierta (verde), cerrada (roja) o sin medir (gris). */
export function GateBadge({ state, lowConfidence, label, labels, lowConfidenceLabel = "baja confianza", size = "sm", className }: GateBadgeProps) {
  const l = { ...DEFAULT_GATE_LABELS, ...labels };
  const text = state === true ? l.open : state === false ? l.closed : l.unmeasured;
  const variant = state === true ? "success" : state === false ? "destructive" : "secondary";
  return (
    <Badge
      variant={variant}
      data-slot="gate-badge"
      data-state={state === true ? "open" : state === false ? "closed" : "unmeasured"}
      title={lowConfidence ? `${text} (${lowConfidenceLabel})` : undefined}
      className={cn(state === null && "text-muted-foreground", size === "md" && "h-6 px-2.5 text-sm", className)}
    >
      {label ? <span className="font-normal opacity-80">{label} ·</span> : null}
      {text}
      {lowConfidence ? (
        <span className="inline-flex items-center gap-0.5 text-warning" aria-label={lowConfidenceLabel}>
          <Warning weight="fill" aria-hidden="true" />
        </span>
      ) : null}
    </Badge>
  );
}

// ── Veredicto RAP ──────────────────────────────────────────────────────────────────────────────────────────────

export type RapVerdict = "pass" | "fail" | "indeterminate" | "no_basis";

export const DEFAULT_RAP_VERDICT_LABELS: Record<RapVerdict, string> = {
  pass: "Aprobada",
  fail: "No aprobada",
  indeterminate: "Indeterminada",
  no_basis: "Sin base",
};

const VERDICT_VARIANT: Record<RapVerdict, "success" | "destructive" | "warning" | "secondary"> = {
  pass: "success",
  fail: "destructive",
  indeterminate: "warning",
  no_basis: "secondary",
};

export interface RapVerdictBadgeProps {
  verdict: RapVerdict | string | null;
  labels?: Partial<Record<RapVerdict, string>>;
  className?: string;
}

/** Veredicto RAP: aprobada (todas las puertas abiertas), no aprobada, indeterminada (alguna sin medir) o sin base. */
export function RapVerdictBadge({ verdict, labels, className }: RapVerdictBadgeProps) {
  const known = verdict && verdict in DEFAULT_RAP_VERDICT_LABELS ? (verdict as RapVerdict) : null;
  if (!known) {
    return (
      <Badge variant="secondary" data-slot="rap-verdict" className={cn("text-muted-foreground", className)}>
        —
      </Badge>
    );
  }
  const text = { ...DEFAULT_RAP_VERDICT_LABELS, ...labels }[known];
  return (
    <Badge
      variant={VERDICT_VARIANT[known]}
      data-slot="rap-verdict"
      data-verdict={known}
      className={cn(known === "no_basis" && "text-muted-foreground", className)}
    >
      {text}
    </Badge>
  );
}

// ── Gravedad ───────────────────────────────────────────────────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low" | "clean";

export const DEFAULT_SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Media",
  low: "Baja",
  clean: "Limpia",
};

const SEVERITY_DOT: Record<Severity, string> = {
  critical: "bg-destructive",
  high: "bg-destructive/70",
  medium: "bg-warning",
  low: "bg-brand",
  clean: "bg-success",
};

export interface SeverityBadgeProps {
  severity: Severity | string | null;
  labels?: Partial<Record<Severity, string>>;
  className?: string;
}

/** Gravedad de un hallazgo o una conversación: punto de color + texto. */
export function SeverityBadge({ severity, labels, className }: SeverityBadgeProps) {
  const known = severity && severity in DEFAULT_SEVERITY_LABELS ? (severity as Severity) : null;
  const text = known ? { ...DEFAULT_SEVERITY_LABELS, ...labels }[known] : severity || "—";
  return (
    <Badge variant="outline" data-slot="severity-badge" data-severity={known ?? undefined} className={cn("gap-1.5 font-normal", className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", known ? SEVERITY_DOT[known] : "bg-muted-foreground/60")} />
      {text}
    </Badge>
  );
}

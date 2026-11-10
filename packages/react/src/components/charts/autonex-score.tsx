export interface AutonexScoreLabels {
  pendingTitle: string
  pendingAria: string
  title: (score: number) => string
  aria: (score: number) => string
}

export const DEFAULT_AUTONEX_SCORE_LABELS: AutonexScoreLabels = {
  pendingTitle: "AutonexScore: pendiente de evaluar",
  pendingAria: "AutonexScore pendiente de evaluar",
  title: (score) => `AutonexScore: ${score}/5`,
  aria: (score) => `AutonexScore ${score} de 5`,
}

export interface AutonexScoreProps {
  /** AutonexScore 1..5 (null/undefined = aún sin puntuar → pastilla gris con guion). */
  value: number | null | undefined
  className?: string
  labels?: Partial<AutonexScoreLabels>
}

// Estado "aún sin puntuar": misma pastilla que las notas pero en gris neutro,
// con un guion, para que la columna Score nunca quede vacía.
const PENDING_COLORS = "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"

// Pastilla SÓLIDA por nota, con los mismos umbrales normalizados que ScoreBadge:
// en escala 1-5: 4-5 verde, 3 ámbar, 1-2 rojo. Solo tokens semánticos del DS.
const SCORE_COLORS: Record<number, string> = {
  1: "bg-destructive text-destructive-foreground",
  2: "bg-destructive text-destructive-foreground",
  3: "bg-warning text-warning-foreground",
  4: "bg-success text-success-foreground",
  5: "bg-success text-success-foreground",
}

/**
 * AutonexScore — desempeño del asistente en la conversación (1..5), como pastilla
 * con color sólido. Si no hay puntuación muestra una pastilla gris con un guion,
 * para que la columna nunca quede vacía.
 */
export function AutonexScore({ value, className = "", labels: labelsProp }: AutonexScoreProps) {
  const labels = { ...DEFAULT_AUTONEX_SCORE_LABELS, ...labelsProp }
  const score = value != null && value >= 1 && value <= 5 ? Math.round(value) : null

  if (score === null) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md text-xs font-medium px-2 py-0.5 ${PENDING_COLORS} ${className}`}
        title={labels.pendingTitle}
        aria-label={labels.pendingAria}
      >
        —
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md text-xs font-medium min-w-6 h-6 px-1.5 ${SCORE_COLORS[score]} ${className}`}
      title={labels.title(score)}
      aria-label={labels.aria(score)}
    >
      {score}
    </span>
  )
}

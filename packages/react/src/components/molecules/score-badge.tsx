import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export interface ScoreBadgeProps {
  /** Valor del score, en la escala indicada por `scale`. null/undefined pinta N/A. */
  score: number | null | undefined;
  /** Máximo de la escala: 5 (autonex_score 1-5), 10 (RAP 0-10), 100, o el de una
   *  rúbrica de Puntuación (p. ej. 3). Default 100. */
  scale?: number;
  size?: "sm" | "md";
  className?: string;
}

// Única fuente de verdad de los scores (RAP / Autonex Score).
// Umbrales normalizados: >=80% verde, >=60% ámbar, resto rojo.
// SÓLIDO, no suave (decisión Bruno 01/09): el score es un veredicto numérico
// y debe destacar sobre los badges suaves de estado.
export function ScoreBadge({ score, scale = 100, size = "sm", className }: ScoreBadgeProps) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) {
    return <span className={cn("text-muted-foreground text-xs", className)}>N/A</span>;
  }
  const pct = (Number(score) / scale) * 100;
  const variant = pct >= 80 ? "success-solid" : pct >= 60 ? "warning-solid" : "destructive-solid";
  const label = scale === 100 ? String(score) : Number(score).toFixed(1).replace(/\.0$/, "");
  return (
    <Badge
      variant={variant}
      // Rectángulo redondeado suave (rounded-md), no píldora: la silueta
      // distingue el veredicto numérico de los badges de estado (Bruno 01/09).
      className={cn("min-w-8 justify-center rounded-md tabular-nums", size === "md" && "h-6 px-2.5 text-sm", className)}
    >
      {label}
    </Badge>
  );
}

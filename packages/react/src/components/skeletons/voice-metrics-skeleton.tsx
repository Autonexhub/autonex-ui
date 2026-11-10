import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

interface VoiceMetricsSkeletonProps {
  /** Number of KPI cells to show (4 for Text/WhatsApp, 5 for Voice, 6 for Todas) */
  kpiCount?: 4 | 5 | 6;
  /** Títulos reales de las gráficas (los títulos son estructura: se pintan, no hacen shimmer) */
  titles?: { hourly?: string; left?: string; right?: string };
}

/**
 * Skeleton de las páginas de Métricas (Todas, Voz, Texto, WhatsApp, Instagram).
 *
 * Calca el layout real para que nada salte al llegar los datos: franja de KPIs
 * como UNA tarjeta con celdas divididas (igual que KPICell) y, para cada gráfica,
 * el título real + UN solo bloque Skeleton (decisión Bruno 02/09: nada de siluetas
 * dibujadas — ondas, barras o burbujas — solo el átomo oficial).
 */
export const VoiceMetricsSkeleton = ({ kpiCount = 5, titles }: VoiceMetricsSkeletonProps) => {
  const hourlyTitle =
    titles?.hourly ?? (kpiCount === 6 ? "Uso por horas (por canal)" : "Uso por horas");
  const leftTitle = titles?.left ?? "Idiomas más usados";
  const rightTitle = titles?.right ?? "Temas principales";

  // Mirror the exact grid classes used by the real KPI strip.
  const gridCols =
    kpiCount === 6
      ? "md:grid-cols-3 lg:grid-cols-6"
      : kpiCount === 5
      ? "md:grid-cols-3 lg:grid-cols-5"
      : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="space-y-6">
      {/* KPI Strip — single seamless card with divided cells (matches KPICell) */}
      <Card className="p-0 overflow-hidden">
        <div
          className={`grid grid-cols-2 divide-y divide-border md:divide-y-0 ${gridCols}`}
        >
          {Array.from({ length: kpiCount }).map((_, i) => (
            <div
              key={i}
              className={
                "relative px-6 py-5 " +
                "md:[&:not(:first-child)]:before:absolute md:[&:not(:first-child)]:before:left-0 " +
                "md:[&:not(:first-child)]:before:top-1/4 md:[&:not(:first-child)]:before:bottom-1/4 " +
                "md:[&:not(:first-child)]:before:w-px md:[&:not(:first-child)]:before:bg-border"
              }
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-28" />
              <Skeleton className="mt-3 h-3 w-20" />
            </div>
          ))}
        </div>
      </Card>

      {/* Gráfica horaria: título real + un bloque */}
      <Card className="p-6">
        <h3 className="text-base font-medium text-foreground mb-4">{hourlyTitle}</h3>
        <Skeleton className="h-[288px] w-full rounded-lg" />
      </Card>

      {/* Fila inferior: dos gráficas, mismo patrón */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-base font-medium text-foreground mb-4">{leftTitle}</h3>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </Card>
        <Card className="p-6">
          <h3 className="text-base font-medium text-foreground mb-4">{rightTitle}</h3>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </Card>
      </div>
    </div>
  );
};

/**
 * Skeleton de UNA gráfica suelta (para tarjetas de gráfica fuera de Métricas):
 * título real + un bloque. Misma receta, sin franja de KPIs.
 */
export const ChartSkeleton = ({ title, height = 280 }: { title: string; height?: number }) => (
  <Card className="p-6">
    <h3 className="text-base font-medium text-foreground mb-4">{title}</h3>
    <Skeleton className="w-full rounded-lg" style={{ height }} />
  </Card>
);

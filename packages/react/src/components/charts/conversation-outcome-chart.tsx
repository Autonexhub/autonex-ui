import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Info } from "@phosphor-icons/react";
import { ChartEmptyState } from "../molecules/empty-state";
import { PanelChartTooltip } from "../molecules/panel-chart-tooltip";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface OutcomeDistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ConversationOutcomeChartLabels {
  title: string;
  calls: string;
  noData: string;
  /** Texto del tooltip del donut: "{count} llamadas ({percentage}%)". */
  tooltipCount: (count: number, percentage: number) => string;
  /** aria-label del botón de información de cada resultado. */
  infoAbout: (label: string) => string;
}

export const DEFAULT_CONVERSATION_OUTCOME_CHART_LABELS: ConversationOutcomeChartLabels = {
  title: "Distribución de resultados",
  calls: "llamadas",
  noData: "Sin datos disponibles",
  tooltipCount: (count, percentage) => `${count} llamadas (${percentage}%)`,
  infoAbout: (label) => `Información sobre ${label}`,
};

export interface ConversationOutcomeChartProps {
  data: OutcomeDistributionItem[];
  total: number;
  /** Pinta el skeleton en lugar de la gráfica mientras llegan los datos. */
  loading?: boolean;
  /** Descripción (tooltip de información) de un resultado por su etiqueta; undefined = sin icono. */
  getDescription?: (label: string) => string | undefined;
  labels?: Partial<ConversationOutcomeChartLabels>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, labels }: any) => {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <PanelChartTooltip
      active
      label={d.label}
      payload={[
        {
          name: labels.calls,
          value: labels.tooltipCount(d.count, d.percentage),
          color: d.color,
        },
      ]}
    />
  );
};
/** Skeleton que calca la anatomía: donut a la izquierda, leyenda a la derecha. */
const OutcomeChartSkeleton = () => (
  <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[260px_1fr]">
    <div className="flex h-[250px] items-center justify-center">
      <Skeleton className="h-[200px] w-[200px] rounded-full" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

export const ConversationOutcomeChart = ({ data, total, loading = false, getDescription, labels: labelsProp }: ConversationOutcomeChartProps) => {
  const labels = { ...DEFAULT_CONVERSATION_OUTCOME_CHART_LABELS, ...labelsProp };
  // Sort descending so the biggest slices show first in the legend
  const sorted = [...data].sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div>
        <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">
          {labels.title}
        </h3>
        <OutcomeChartSkeleton />
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">
          {labels.title}
        </h3>
        <ChartEmptyState title={labels.noData} />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">
        {labels.title}
      </h3>

      {/* Chart left, legend right */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-center">
        <div className="relative h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sorted}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                dataKey="count"
                nameKey="label"
                stroke="none"
                animationDuration={800}
              >
                {sorted.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip labels={labels} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">{labels.calls}</p>
            </div>
          </div>
        </div>

        {/* Legend: count + percentage to the right of each label */}
        <TooltipProvider delayDuration={150}>
          <div className="space-y-2">
            {sorted.map((item, i) => {
              const description = getDescription?.(item.label);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-border/40 py-1 text-sm last:border-b-0"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 truncate text-foreground">{item.label}</span>
                  {description && (
                    <UiTooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={labels.infoAbout(item.label)}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-56">{description}</TooltipContent>
                    </UiTooltip>
                  )}
                  <span className="font-semibold tabular-nums text-foreground">{item.count}</span>
                  <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { ChartEmptyState } from "../molecules/empty-state";

export interface FunnelStep {
  step: string;
  count: number;
  percentage?: number;
}

export interface FunnelDropoffs {
  [stepKey: string]: Record<string, number>;
}

export interface ConversionFunnelChartLabels {
  title: string;
  dropoffReason: string;
  conversionRate: string;
  noData: string;
  /** Etiqueta de abandono entre pasos: "-{pct}% ({count})". */
  dropoffLabel: (pct: string, count: number) => string;
}

export const DEFAULT_CONVERSION_FUNNEL_CHART_LABELS: ConversionFunnelChartLabels = {
  title: "Embudo de conversión",
  dropoffReason: "Motivo de abandono",
  conversionRate: "Tasa de conversión global",
  noData: "Sin datos disponibles",
  dropoffLabel: (pct, count) => `-${pct}% (${count})`,
};

export interface ConversionFunnelChartProps {
  data: FunnelStep[];
  dropoffs?: FunnelDropoffs;
  labels?: Partial<ConversionFunnelChartLabels>;
}

const STEP_COLORS = [
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-6)",
  "var(--chart-2)",
];

const DROPOFF_KEYS = [
  "total_to_interaction",
  "interaction_to_tools",
  "tools_to_booking",
];


export const ConversionFunnelChart = ({ data, dropoffs, labels: labelsProp }: ConversionFunnelChartProps) => {
  const labels = { ...DEFAULT_CONVERSION_FUNNEL_CHART_LABELS, ...labelsProp };
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const maxCount = data[0]?.count || 1;

  const getDropOff = (i: number) => {
    if (i === 0) return null;
    const prev = data[i - 1].count;
    if (prev === 0) return null;
    return (((prev - data[i].count) / prev) * 100).toFixed(0);
  };

  const getDropoffData = (i: number): Record<string, number> | null => {
    if (i === 0 || !dropoffs) return null;
    const key = DROPOFF_KEYS[i - 1];
    return key && dropoffs[key] ? dropoffs[key] : null;
  };

  const toggleExpand = (i: number) => {
    setExpandedStep(expandedStep === i ? null : i);
  };

  if (!data.length) {
    return (
      <div>
        <h3 className="mb-5 text-base font-semibold tracking-tight text-foreground">
          {labels.title}
        </h3>
        <ChartEmptyState title={labels.noData} />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-5 text-base font-semibold tracking-tight text-foreground">
        {labels.title}
      </h3>

      <div className="flex flex-col items-center gap-0">
        {data.map((step, i) => {
          const widthPct = Math.max((step.count / maxCount) * 100, 20);
          const dropOff = getDropOff(i);
          const dropoffData = getDropoffData(i);
          const droppedCount = i > 0 ? data[i - 1].count - step.count : 0;
          const isExpanded = expandedStep === i;

          return (
            <div key={i} className="w-full flex flex-col items-center">
              {/* Drop-off indicator between steps */}
              {dropOff !== null && (
                <button
                  className="flex items-center gap-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                  onClick={() => dropoffData && toggleExpand(i)}
                  disabled={!dropoffData}
                >
                  <div className="w-px h-3 bg-border" />
                  <span className={dropoffData ? "group-hover:underline cursor-pointer" : ""}>
                    {labels.dropoffLabel(dropOff, droppedCount)}
                  </span>
                  {dropoffData && (
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      {isExpanded ? <CaretUp className="h-3 w-3" /> : <CaretDown className="h-3 w-3" />}
                    </span>
                  )}
                  <div className="w-px h-3 bg-border" />
                </button>
              )}

              {/* Dropoff breakdown */}
              {isExpanded && dropoffData && (
                <div className="w-full max-w-md mb-1 px-4">
                  <div className="bg-muted/50 rounded-md p-3 space-y-1.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {labels.dropoffReason}
                    </p>
                    {Object.entries(dropoffData).map(([label, count]) => {
                      const pct = droppedCount > 0 ? ((count / droppedCount) * 100).toFixed(0) : "0";
                      return (
                        <div key={label} className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.max((count / droppedCount) * 100, 4)}%`,
                                backgroundColor: STEP_COLORS[i] || "var(--muted-foreground)",
                                opacity: 0.6,
                              }}
                            />
                            <span className="text-xs text-foreground whitespace-nowrap">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Funnel segment */}
              <div
                className="relative h-14 rounded-md flex items-center justify-between px-4 transition-all duration-300 ease-out"
                style={{
                  width: `${widthPct}%`,
                  minWidth: "180px",
                  backgroundColor: STEP_COLORS[i] || "var(--chart-1)",
                  clipPath: i < data.length - 1
                    ? "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)"
                    : "polygon(2% 0%, 98% 0%, 98% 100%, 2% 100%)",
                }}
              >
                <span className="truncate text-xs font-medium text-primary-foreground">
                  {step.step}
                </span>
                <span className="ml-2 whitespace-nowrap text-sm font-semibold text-primary-foreground">
                  {step.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion rate summary */}
      {data.length >= 2 && data[0].count > 0 && (
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{labels.conversionRate}</span>
          <span className="font-semibold text-success text-lg">
            {((data[data.length - 1].count / data[0].count) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

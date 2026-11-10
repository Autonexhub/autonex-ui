import { ChartEmptyState } from "../molecules/empty-state";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { PanelChartTooltip } from "../molecules/panel-chart-tooltip";
import { cn } from "../../lib/utils";

export interface EmailTimelinePoint {
  time: string;
  sent: number;
  failed: number;
}

export type EmailTimingPeriod = "24h" | "30d";

export interface EmailTimingChartLabels {
  title: string;
  last24h: string;
  last30d: string;
  noData: string;
  tooltipSent: string;
  tooltipFailed: string;
  sentCount: (count: number) => string;
  failedCount: (count: number) => string;
}

export const DEFAULT_EMAIL_TIMING_CHART_LABELS: EmailTimingChartLabels = {
  title: "Actividad de correos",
  last24h: "Últimas 24 horas",
  last30d: "Últimos 30 días",
  noData: "Sin datos para este período",
  tooltipSent: "Enviados",
  tooltipFailed: "Fallidos",
  sentCount: (count) => `${count} enviados`,
  failedCount: (count) => `${count} fallidos`,
};

export interface EmailTimingChartProps {
  /** Serie temporal del periodo activo (la carga el consumidor). */
  data: EmailTimelinePoint[];
  loading?: boolean;
  /** Periodo activo (controlado). */
  period: EmailTimingPeriod;
  onPeriodChange: (period: EmailTimingPeriod) => void;
  className?: string;
  labels?: Partial<EmailTimingChartLabels>;
}

export const EmailTimingChart = ({
  data,
  loading = false,
  period,
  onPeriodChange,
  className,
  labels: labelsProp,
}: EmailTimingChartProps) => {
  const labels = { ...DEFAULT_EMAIL_TIMING_CHART_LABELS, ...labelsProp };

  const totalSent = data.reduce((sum, d) => sum + d.sent, 0);
  const totalFailed = data.reduce((sum, d) => sum + d.failed, 0);

  // Nombres visibles de las series en el tooltip oficial (claves técnicas → etiqueta).
  const seriesName = (name: string | number) =>
    name === "sent" ? labels.tooltipSent : labels.tooltipFailed;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>
          {period === "24h" ? labels.last24h : labels.last30d}
          {!loading && (
            <>
              {" · "}
              {labels.sentCount(totalSent)}
              {totalFailed > 0 && (
                <>
                  {" · "}
                  {labels.failedCount(totalFailed)}
                </>
              )}
            </>
          )}
        </CardDescription>
        <CardAction>
          <Tabs value={period} onValueChange={(v) => onPeriodChange(v as EmailTimingPeriod)}>
            <TabsList variant="default">
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="h-[120px]">
          {loading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : data.length === 0 ? (
            <ChartEmptyState title={labels.noData} height={120} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={period === "24h" ? 5 : 6}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<PanelChartTooltip nameFormatter={seriesName} />} />
                <Area
                  type="linear"
                  dataKey="sent"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
                  fill="url(#sentGradient)"
                  isAnimationActive={false}
                />
                {totalFailed > 0 && (
                  <Area
                    type="linear"
                    dataKey="failed"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--chart-2)", strokeWidth: 0 }}
                    fill="url(#failedGradient)"
                    isAnimationActive={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

import { ChartEmptyState } from "../molecules/empty-state";
import { PanelChartTooltip } from "../molecules/panel-chart-tooltip";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export interface HourlyByChannel {
  hour: number;
  voice: number;
  web: number;
  whatsapp: number;
  instagram: number;
}

export interface ChannelStackedHourlyChartLabels {
  title: string;
  noData: string;
  voice: string;
  web: string;
  whatsapp: string;
  instagram: string;
}

export const DEFAULT_CHANNEL_STACKED_HOURLY_CHART_LABELS: ChannelStackedHourlyChartLabels = {
  title: "Uso por horas (por canal)",
  noData: "Sin datos disponibles",
  voice: "Voz",
  web: "Web",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
};

export interface ChannelStackedHourlyChartProps {
  data: HourlyByChannel[];
  labels?: Partial<ChannelStackedHourlyChartLabels>;
}

const formatHour = (h: number) => `${String(h).padStart(2, "0")}h`;

// Channel colors - matching the design system
const COLORS = {
  voice: "var(--chart-1)",
  web: "var(--chart-6)",
  whatsapp: "var(--chart-2)",
  instagram: "var(--chart-3)",
};

export const ChannelStackedHourlyChart = ({
  data: dataProp,
  labels: labelsProp,
}: ChannelStackedHourlyChartProps) => {
  const labels = { ...DEFAULT_CHANNEL_STACKED_HOURLY_CHART_LABELS, ...labelsProp };
  const LABELS: Record<string, string> = {
    voice: labels.voice,
    web: labels.web,
    whatsapp: labels.whatsapp,
    instagram: labels.instagram,
  };
  // Blindaje: hay orgs cuya API no trae hourly_by_channel — sin esta guarda
  // el .map sobre undefined tumbaba la página entera (bug 01/09).
  const data = dataProp ?? [];
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        hour: formatHour(d.hour),
        voice: d.voice,
        web: d.web,
        whatsapp: d.whatsapp,
        instagram: d.instagram,
      })),
    [data]
  );

  // Check which channels have data to only show those in the chart
  const hasVoice = data.some((d) => d.voice > 0);
  const hasWeb = data.some((d) => d.web > 0);
  const hasWhatsapp = data.some((d) => d.whatsapp > 0);
  const hasInstagram = data.some((d) => d.instagram > 0);

  const sinActividad = !hasVoice && !hasWeb && !hasWhatsapp && !hasInstagram;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          {labels.title}
        </h2>
      </div>

      {sinActividad ? (
        <ChartEmptyState title={labels.noData} />
      ) : (
      <ResponsiveContainer width="100%" height={288} className="mt-6">
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillVoice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.voice} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.voice} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.web} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.web} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillWhatsapp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.whatsapp} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.whatsapp} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillInstagram" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.instagram} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.instagram} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            content={
              <PanelChartTooltip
                nameFormatter={(n) => LABELS[n as string] || n}
              />
            }
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>
                {LABELS[value] || value}
              </span>
            )}
          />

          {/* Una línea por canal, cada una con su valor real (14/09). Apiladas,
              la línea de WhatsApp dibujaba voz + WhatsApp y parecía subir aunque
              fuese 0. Solo se pintan los canales con datos. */}
          {hasVoice && (
            <Area
              type="linear"
              dataKey="voice"
              stroke={COLORS.voice}
              fill="url(#fillVoice)"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          )}
          {hasWeb && (
            <Area
              type="linear"
              dataKey="web"
              stroke={COLORS.web}
              fill="url(#fillWeb)"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          )}
          {hasWhatsapp && (
            <Area
              type="linear"
              dataKey="whatsapp"
              stroke={COLORS.whatsapp}
              fill="url(#fillWhatsapp)"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          )}
          {hasInstagram && (
            <Area
              type="linear"
              dataKey="instagram"
              stroke={COLORS.instagram}
              fill="url(#fillInstagram)"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartEmptyState } from "../molecules/empty-state"
import { PanelChartTooltip } from "../molecules/panel-chart-tooltip"

export interface HourlyBucket {
  hour: number
  calls: number
}

export interface VoiceHourlyChartLabels {
  title: string
  noData: string
  callsSeries: string
}

export const DEFAULT_VOICE_HOURLY_CHART_LABELS: VoiceHourlyChartLabels = {
  title: "Uso por horas",
  noData: "Sin datos disponibles",
  callsSeries: "Llamadas",
}

export interface VoiceHourlyChartProps {
  /** Color del canal (token var(--chart-N)); por defecto voz. */
  color?: string
  data: HourlyBucket[]
  labels?: Partial<VoiceHourlyChartLabels>
}

const formatHour = (h: number) => `${String(h).padStart(2, "0")}h`

const numberFormatter = (n: number) => Intl.NumberFormat("es-ES").format(Math.round(n))

export const VoiceHourlyChart = ({ data, color = "var(--chart-1)", labels: labelsProp }: VoiceHourlyChartProps) => {
  const labels = { ...DEFAULT_VOICE_HOURLY_CHART_LABELS, ...labelsProp }
  const chartData = useMemo(
    () => data.map((d) => ({ hour: formatHour(d.hour), Llamadas: d.calls })),
    [data],
  )

  const fillId = "voice-peak-fill"

  const sinActividad = chartData.length === 0 || chartData.every((d) => !d.Llamadas)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">{labels.title}</h2>
      </div>
      {sinActividad ? (
        <ChartEmptyState title={labels.noData} />
      ) : (
        <ResponsiveContainer width="100%" height={288} className="mt-6">
          <AreaChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              {/* Un solo color: el del canal. Relleno 0.30→0 según DesignRules · Charts. */}
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={40}
              tickFormatter={numberFormatter}
            />
            <Tooltip
              content={
                <PanelChartTooltip
                  valueFormatter={(v) => numberFormatter(Number(v))}
                  nameFormatter={() => labels.callsSeries}
                />
              }
            />
            <Area
              type="linear"
              dataKey="Llamadas"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--background)", strokeWidth: 2 }}
              fill={`url(#${fillId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

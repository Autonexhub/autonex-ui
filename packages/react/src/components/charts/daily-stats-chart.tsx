/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react"
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartEmptyState } from "../molecules/empty-state"
import { badgeVariants } from "../ui/badge"
import { cn } from "../../lib/utils"

export interface DailyStatEntry {
  date: string
  calls: number
  total_seconds?: number
  cost: number
  bookings: number
}

export interface DailyStatsTotals {
  total_cost: number
  cost_per_conversation: number
  cost_per_booking: number | null
  avg_calls_per_day: number
  total_calls?: number
  total_seconds?: number
  avg_duration_seconds: number
  cost_per_minute: number
  total_bookings: number
  avg_bookings_per_day: number
  num_days?: number
}

export interface DailyStatsData {
  daily: DailyStatEntry[]
  totals: DailyStatsTotals
}

export interface DailyStatsChartLabels {
  seriesCalls: string
  seriesCost: string
  seriesBookings: string
  totalCost: string
  costPerConv: string
  avgCallsPerDay: string
  bookingsPerDay: string
  avgDuration: string
  costPerMinute: string
  costPerBooking: string
  noData: string
  selectMetric: string
}

export const DEFAULT_DAILY_STATS_CHART_LABELS: DailyStatsChartLabels = {
  seriesCalls: "Llamadas",
  seriesCost: "Coste",
  seriesBookings: "Agendamientos",
  totalCost: "Coste total",
  costPerConv: "Coste/conv",
  avgCallsPerDay: "Media llamadas/día",
  bookingsPerDay: "Agendamientos/día",
  avgDuration: "Duración media",
  costPerMinute: "Coste/min",
  costPerBooking: "Coste/reserva",
  noData: "No hay datos para el rango seleccionado.",
  selectMetric: "Selecciona al menos una métrica.",
}

export interface DailyStatsChartProps {
  data: DailyStatsData
  labels?: Partial<DailyStatsChartLabels>
}

type SeriesKey = "calls" | "cost" | "bookings"

const SERIES_META = {
  calls: { color: "var(--chart-2)", unit: "" },
  cost: { color: "var(--chart-3)", unit: " €" },
  bookings: { color: "var(--chart-6)", unit: "" },
} as const

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.dataKey === "cost" ? `${entry.value.toFixed(2)} €` : entry.value}
        </p>
      ))}
    </div>
  )
}

export const DailyStatsChart: React.FC<DailyStatsChartProps> = ({ data, labels: labelsProp }) => {
  const labels = { ...DEFAULT_DAILY_STATS_CHART_LABELS, ...labelsProp }
  const SERIES = {
    calls: { label: labels.seriesCalls, ...SERIES_META.calls },
    cost: { label: labels.seriesCost, ...SERIES_META.cost },
    bookings: { label: labels.seriesBookings, ...SERIES_META.bookings },
  } as const
  const hasBookings = data?.totals?.total_bookings ? data.totals.total_bookings > 0 : false

  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    calls: true,
    cost: true,
    bookings: hasBookings,
  })

  useEffect(() => {
    setVisible((prev) => ({ ...prev, bookings: hasBookings }))
  }, [hasBookings])

  if (!data?.daily || !data?.totals) return null
  const { daily, totals } = data

  const toggle = (key: SeriesKey) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }))

  const activeKeys = (Object.keys(visible) as SeriesKey[]).filter((k) => visible[k])

  const chartData = daily
    .filter((d) => d.date)
    .map((d) => ({
      date: d.date.slice(5),
      calls: d.calls,
      cost: d.cost,
      bookings: d.bookings,
    }))

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  // Figure out which Y axes we need
  const needsCountAxis = visible.calls || visible.bookings
  const needsCostAxis = visible.cost

  return (
    <div>
      {/* Stats row */}
      <div className="flex flex-wrap gap-6 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">{labels.totalCost}</p>
          <p className="text-2xl font-semibold text-foreground">{totals.total_cost.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{labels.costPerConv}</p>
          <p className="text-lg font-semibold text-foreground">{totals.cost_per_conversation.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{labels.avgCallsPerDay}</p>
          <p className="text-lg font-semibold text-foreground">{totals.avg_calls_per_day}</p>
        </div>
        {hasBookings && (
          <div>
            <p className="text-xs text-muted-foreground">{labels.bookingsPerDay}</p>
            <p className="text-lg font-semibold text-foreground">{totals.avg_bookings_per_day}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground">{labels.avgDuration}</p>
          <p className="text-lg font-semibold text-foreground">{formatDuration(totals.avg_duration_seconds)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{labels.costPerMinute}</p>
          <p className="text-lg font-semibold text-foreground">{totals.cost_per_minute.toFixed(2)} €</p>
        </div>
        {totals.cost_per_booking !== null && totals.total_bookings > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">{labels.costPerBooking}</p>
            <p className="text-lg font-semibold text-foreground">{totals.cost_per_booking.toFixed(2)} €</p>
          </div>
        )}
      </div>

      {/* Toggles: píldoras oficiales del DS (badge), no chips a mano. */}
      <div className="mb-3 flex gap-3">
        {(Object.entries(SERIES) as [SeriesKey, (typeof SERIES)[SeriesKey]][])
          .filter(([key]) => key !== "bookings" || hasBookings)
          .map(([key, s]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              aria-pressed={visible[key]}
              className={cn(
                badgeVariants({ variant: visible[key] ? "default" : "outline" }),
                "h-6 cursor-pointer px-2.5 transition-colors",
                visible[key] ? "border-transparent text-primary-foreground" : "text-muted-foreground",
              )}
              style={visible[key] ? { backgroundColor: s.color } : undefined}
            >
              {s.label}
            </button>
          ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && activeKeys.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            {needsCountAxis && (
              <YAxis yAxisId="count" tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
            )}
            {needsCostAxis && (
              <YAxis
                yAxisId="cost"
                orientation={needsCountAxis ? "right" : "left"}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={(v: number) => `${v}€`}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            {visible.calls && (
              <Bar yAxisId="count" dataKey="calls" name={SERIES.calls.label} fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
            )}
            {visible.bookings && (
              <Bar yAxisId="count" dataKey="bookings" name={SERIES.bookings.label} fill="var(--chart-6)" radius={[3, 3, 0, 0]} />
            )}
            {visible.cost && (
              <Bar yAxisId="cost" dataKey="cost" name={SERIES.cost.label} fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      ) : chartData.length === 0 ? (
        <ChartEmptyState title={labels.noData} />
      ) : (
        <p className="text-center text-muted-foreground py-8">{labels.selectMetric}</p>
      )}
    </div>
  )
}

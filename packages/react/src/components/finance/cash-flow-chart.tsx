import { Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { barShape } from "./bar-shape";
import { lastRealIndex } from "./chart-data";
import { cashChartRows, TODAY_KEY, type CashChartRow } from "./cash-chart";
import { ChartFrame, EndLabel, LegendRow, todayLine, TooltipBox } from "./chart-kit";
import { formatCentsCompact, formatCentsRound, formatCentsSigned, formatCentsThousands, formatDayShort, formatPeriodAxis } from "./format";
import { cushionMargin } from "./receivables";
import type { CashPeriod, FinanceTreasury } from "./types";
import { CASH_COLORS, CHART_AXIS, CHART_BAR_SIZE, CHART_CURSOR_BAR, CHART_GRID, CUSHION_LINE, DASH_FORECAST, FINANCE_COLORS, chartActiveDot, lastDot } from "./ui";

type Row = CashChartRow;

export interface CashFlowChartLabels {
  /** Etiqueta del punto «Hoy» en el eje. */
  today: string;
  /** Título del tooltip del punto «Hoy». */
  cashToday: string;
  in: string;
  out: string;
  inPending: string;
  inForecast: string;
  closing: string;
  balance: string;
  margin: string;
  clickPeriod: string;
  cushionLabel: (amount: string) => string;
  lowAnnotation: (v: { amount: string; period: string }) => string;
  breachWeek: (period: string) => string;
  breachMonth: (period: string) => string;
}

export const DEFAULT_CASH_FLOW_CHART_LABELS: CashFlowChartLabels = {
  today: "Hoy",
  cashToday: "Caja hoy",
  in: "Cobros",
  out: "Pagos",
  inPending: "Cobros pendientes",
  inForecast: "Cobros previstos",
  closing: "Saldo final",
  balance: "Saldo",
  margin: "Margen sobre el colchón",
  clickPeriod: "Clic para ver el detalle",
  cushionLabel: (amount) => `Colchón ${amount}`,
  lowAnnotation: ({ amount, period }) => `mínimo ${amount} · ${period}`,
  breachWeek: (period) => `Bajo colchón · sem. ${period}`,
  breachMonth: (period) => `Bajo colchón · ${period}`,
};

/**
 * Cobros, pagos y saldo (spec v3 §4.4, R4): cuatro series. Por periodo, los cobros en verde (facturas emitidas +
 * previstos, una sola barra; el desglose, en el tooltip) junto a los pagos en rojo; el saldo final en tinta con
 * su cifra al final, sólido en lo real y discontinuo en lo previsto; el colchón en gris continuo fino. Marca
 * «Hoy» y el mínimo anotado. Si el saldo cruza el colchón, se marca el punto en rojo. Clic en un periodo →
 * `onPeriodClick`.
 */
export function CashFlowChart({
  data,
  height = 300,
  selected,
  onPeriodClick,
  lowStart,
  labels: labelsProp,
}: {
  data: Pick<FinanceTreasury, "periods" | "cushion_cents" | "breach" | "horizon"> & { as_of?: string; opening_cents?: number };
  height?: number;
  selected?: string | null;
  onPeriodClick?: (start: string) => void;
  /** Inicio del periodo del punto más bajo de TODO el horizonte (el de la cifra de cabecera): se anota solo si está a la vista. */
  lowStart?: string;
  labels?: Partial<CashFlowChartLabels>;
}) {
  const labels = { ...DEFAULT_CASH_FLOW_CHART_LABELS, ...labelsProp };
  const rows: Row[] = cashChartRows(data, labels.today);
  const anchored = rows[0]?.today ?? false;
  const byStart = new Map(rows.map((r) => [r.start, r]));
  const breach = data.breach ? byStart.get(data.breach.period_start) ?? null : null;
  const low = lowStart ? { month: lowStart, margin_cents: 0 } : cushionMargin(data.periods, data.cushion_cents);
  const lowRow = low && low.month !== breach?.start ? byStart.get(low.month) ?? null : null;
  // Una selección de otro horizonte (mes elegido antes de pasar a semanas) no atenúa nada.
  const sel = selected && byStart.has(selected) ? selected : null;
  const dim = (r: Row) => (sel && r.start !== sel ? 0.35 : 1) * (r.actual ? 0.5 : 1);
  const axis = (r: Pick<CashPeriod, "start" | "label">) => (r.start === TODAY_KEY ? r.label : formatPeriodAxis(r, data.horizon));
  // El mínimo se anota bajo la línea (maqueta); si cae pegado al eje, encima para no pisar el 0 ni el colchón.
  const top = Math.max(0, ...rows.flatMap((r) => [r.closing_cents, r.collections, r.out_abs]));
  const lowAbove = !!lowRow && lowRow.closing_cents - Math.min(0, ...rows.map((r) => r.closing_cents)) < top * 0.18;
  const lastClosing = rows.length ? rows[rows.length - 1].closing_cents : null;
  const endText = lastClosing === null ? null : `${labels.balance} ${formatCentsThousands(lastClosing)}`;
  const rightMargin = Math.max(96, Math.ceil((endText?.length ?? 0) * 6.5 + 12));
  const lowName = (r: Row) => (data.horizon === "months" ? axis(r).toLocaleLowerCase() : formatDayShort(r.start));

  const tooltip = ({ active, label }: { active?: boolean; label?: string | number }) => {
    if (!active || label === undefined) return null;
    const r = byStart.get(String(label));
    if (!r) return null;
    if (r.today)
      return (
        <TooltipBox
          title={labels.cashToday}
          rows={[
            { label: labels.closing, value: formatCentsRound(r.closing_cents), color: CASH_COLORS.balance, strong: true },
            { label: labels.margin, value: formatCentsSigned(r.closing_cents - data.cushion_cents) },
          ]}
        />
      );
    return (
      <TooltipBox
        title={r.label}
        rows={[
          { label: labels.in, value: formatCentsRound(r.collections), color: FINANCE_COLORS.in, strong: true },
          ...(r.forecast > 0 ? [{ label: `· ${labels.inPending}`, value: formatCentsRound(r.pending) }, { label: `· ${labels.inForecast}`, value: formatCentsRound(r.forecast) }] : []),
          { label: labels.out, value: formatCentsRound(r.out_abs), color: CASH_COLORS.out },
          { label: labels.closing, value: formatCentsRound(r.closing_cents), color: CASH_COLORS.balance, strong: true, dashed: r.closing_forecast !== null && r.closing_real === null },
          { label: labels.margin, value: formatCentsSigned(r.closing_cents - data.cushion_cents) },
        ]}
        note={onPeriodClick ? labels.clickPeriod : undefined}
      />
    );
  };

  const breachLabel = breach
    ? data.horizon === "weeks"
      ? labels.breachWeek(formatDayShort(breach.start))
      : labels.breachMonth(axis(breach))
    : null;

  return (
    <div className="flex flex-col gap-3">
      <LegendRow
        items={[
          { label: labels.in, color: FINANCE_COLORS.in },
          { label: labels.out, color: CASH_COLORS.out },
          { label: labels.balance, color: CASH_COLORS.balance, shape: "line" },
          { label: labels.cushionLabel(formatCentsRound(data.cushion_cents)), color: CASH_COLORS.cushion, shape: "line" },
        ]}
      />
      <ChartFrame height={height}>
        <ComposedChart
          data={rows}
          margin={{ top: 16, right: rightMargin, left: 0, bottom: 0 }}
          barGap={4}
          barCategoryGap="30%"
          onClick={onPeriodClick ? (e) => e?.activeLabel !== undefined && String(e.activeLabel) !== TODAY_KEY && onPeriodClick(String(e.activeLabel)) : undefined}
          style={onPeriodClick ? { cursor: "pointer" } : undefined}
        >
          <CartesianGrid {...CHART_GRID} />
          <XAxis
            dataKey="start"
            {...CHART_AXIS}
            tickMargin={8}
            minTickGap={6}
            tickFormatter={(s: string) => {
              const r = byStart.get(s);
              return r ? axis(r) : s;
            }}
          />
          <YAxis {...CHART_AXIS} width={64} tickFormatter={(v: number) => formatCentsCompact(v)} />
          <ReferenceLine y={0} stroke="var(--border)" />
          {anchored ? todayLine({ x: TODAY_KEY, label: labels.today }) : null}
          <Tooltip content={tooltip} cursor={CHART_CURSOR_BAR} />
          <Bar dataKey="collections" fill={FINANCE_COLORS.in} maxBarSize={CHART_BAR_SIZE} shape={barShape()} isAnimationActive={false}>
            {rows.map((r) => (
              <Cell key={r.start} fillOpacity={dim(r)} />
            ))}
          </Bar>
          <Bar dataKey="out_abs" fill={CASH_COLORS.out} maxBarSize={CHART_BAR_SIZE} shape={barShape()} isAnimationActive={false}>
            {rows.map((r) => (
              <Cell key={r.start} fillOpacity={dim(r)} />
            ))}
          </Bar>
          <ReferenceLine y={data.cushion_cents} {...CUSHION_LINE} ifOverflow="extendDomain" />
          {anchored && (
            <Line type="linear" dataKey="closing_real" stroke={CASH_COLORS.balance} strokeWidth={2} dot={false} activeDot={false} connectNulls={false} isAnimationActive={false} />
          )}
          <Line
            type="linear"
            dataKey="closing_forecast"
            stroke={CASH_COLORS.balance}
            strokeWidth={2}
            strokeDasharray={DASH_FORECAST}
            dot={false}
            activeDot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
          {/* Puntos del saldo en todos los periodos (las dos líneas solo dibujan el trazo). */}
          <Line
            type="linear"
            dataKey="closing_cents"
            stroke="transparent"
            dot={lastDot(CASH_COLORS.balance, lastRealIndex(rows, "closing_cents"))}
            activeDot={chartActiveDot(CASH_COLORS.balance)}
            legendType="none"
            isAnimationActive={false}
            label={endText ? <EndLabel lastIndex={lastRealIndex(rows, "closing_cents")} text={endText} color={CASH_COLORS.balance} /> : undefined}
          />
          {lowRow && low && (
            <ReferenceDot
              x={lowRow.start}
              y={lowRow.closing_cents}
              r={0}
              ifOverflow="extendDomain"
              label={{
                value: labels.lowAnnotation({ amount: formatCentsRound(lowRow.closing_cents), period: lowName(lowRow) }),
                position: lowAbove ? "top" : "bottom",
                fill: "var(--foreground)",
                fontSize: 11,
                fontWeight: 600,
                offset: 12,
              }}
            />
          )}
          {breach && (
            <ReferenceDot
              x={breach.start}
              y={breach.closing_cents}
              r={6}
              fill="var(--destructive)"
              stroke="var(--card)"
              strokeWidth={2}
              label={{ value: breachLabel ?? "", position: "bottom", fill: "var(--destructive)", fontSize: 11, offset: 10 }}
            />
          )}
        </ComposedChart>
      </ChartFrame>
    </div>
  );
}

import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { lastRealIndex } from "./chart-data";
import { ChartFrame, EndLabel, LegendRow, todayLine, TooltipBox } from "./chart-kit";
import { cashTodayMonth, endLabelOffsets, type CashMonthRow } from "./finance-data";
import { capFirst, formatCentsCompact, formatCentsRound, formatCentsThousands, formatMonthAxis, formatMonthLong } from "./format";
import { PLAN_SCENARIOS, type PlanScenarioKey } from "./types";
import { CASH_COLORS, CHART_AXIS, CHART_CURSOR_LINE, CHART_GRID, CUSHION_LINE, DASH_FORECAST, SCENARIO_COLORS, chartActiveDot, lastDot } from "./ui";

export interface CashOverviewChartLabels {
  scenarios: Record<PlanScenarioKey, string>;
  /** Leyenda accesible del grupo de casillas. */
  cashScenarios: string;
  cashActual: string;
  cashForecast: string;
  cashCushion: (amount: string) => string;
  /** Nombre del colchón en el tooltip. */
  cushion: string;
  today: string;
}

export const DEFAULT_CASH_OVERVIEW_CHART_LABELS: CashOverviewChartLabels = {
  scenarios: { base: "Tierra", downside: "Infierno", upside: "Cielo" },
  cashScenarios: "Escenarios",
  cashActual: "Real",
  cashForecast: "Previsión (escenario Tierra)",
  cashCushion: (amount) => `Colchón ${amount}`,
  cushion: "Colchón mínimo",
  today: "Hoy",
};

/** Clave de localStorage con la que se recuerdan los escenarios encendidos. */
export const CASH_SCENARIOS_STORAGE_KEY = "finance.cashScenarios";
const KEY_OF: Record<PlanScenarioKey, "forecast_downside" | "forecast_base" | "forecast_upside"> = {
  downside: "forecast_downside",
  base: "forecast_base",
  upside: "forecast_upside",
};

function readVisible(storageKey: string | null): PlanScenarioKey[] {
  if (storageKey) {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(raw)) return PLAN_SCENARIOS.filter((s) => raw.includes(s));
    } catch {
      // sin almacenamiento (modo privado, miniaturas): los tres
    }
  }
  return [...PLAN_SCENARIOS];
}

/**
 * «Caja · real y previsión» del Resumen (spec v3 §4.2): saldo real a cierre de mes como área en tinta, la previsión
 * de cada escenario del plan (Infierno, Tierra, Cielo) en discontinuo y el colchón en una línea fina continua gris,
 * el «Hoy» marcado y cada escenario con su cifra final. Cada escenario se enciende o apaga con su casilla; la
 * elección se recuerda en este navegador (`storageKey`, `null` = no recordar). Misma fuente que Tesorería.
 */
export function CashOverviewChart({
  series,
  cushionCents,
  asOf,
  height = 240,
  storageKey = CASH_SCENARIOS_STORAGE_KEY,
  labels: labelsProp,
}: {
  series: CashMonthRow[];
  cushionCents: number;
  /** Fecha de hoy (`cash.as_of`): marca «Hoy» en el mes en curso. */
  asOf?: string;
  height?: number;
  storageKey?: string | null;
  labels?: Partial<CashOverviewChartLabels>;
}) {
  const labels: CashOverviewChartLabels = { ...DEFAULT_CASH_OVERVIEW_CHART_LABELS, ...labelsProp, scenarios: { ...DEFAULT_CASH_OVERVIEW_CHART_LABELS.scenarios, ...labelsProp?.scenarios } };
  const [visible, setVisible] = useState<PlanScenarioKey[]>(() => readVisible(storageKey));
  const byMonth = new Map(series.map((s) => [s.month, s]));
  // Solo se ofrecen los escenarios que traen datos (la API antigua solo manda Tierra).
  const available = PLAN_SCENARIOS.filter((s) => series.some((r) => r[KEY_OF[s]] !== null && r.actual_cents === null));
  const shown = available.filter((s) => visible.includes(s));
  const endLabels = shown.flatMap((sc) => {
    const i = lastRealIndex(series, KEY_OF[sc]);
    const v = i >= 0 ? series[i][KEY_OF[sc]] : null;
    return v === null ? [] : [{ key: sc, value: v, text: `${labels.scenarios[sc]} ${formatCentsThousands(v)}` }];
  });
  const allValues = [cushionCents, ...series.flatMap((r) => [r.actual_cents, ...shown.map((sc) => r[KEY_OF[sc]])]).filter((v): v is number => v !== null)];
  const span = Math.max(...allValues) - Math.min(...allValues);
  const dys = endLabelOffsets(endLabels, span, height - 40);
  const rightMargin = Math.max(96, Math.ceil(Math.max(0, ...endLabels.map((l) => l.text.length)) * 6.5 + 12));
  const todayMonth = asOf ? cashTodayMonth(series, asOf) : null;

  const toggle = (s: PlanScenarioKey, on: boolean) => {
    const next = PLAN_SCENARIOS.filter((k) => (k === s ? on : visible.includes(k)));
    setVisible(next);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // sin almacenamiento: vale para esta visita
    }
  };

  return (
    <div className={cn("flex flex-col gap-3")}>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
        {available.length > 1 ? (
          <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground">
            <legend className="sr-only">{labels.cashScenarios}</legend>
            {available.map((s) => (
              <label key={s} className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap py-1">
                <Checkbox checked={visible.includes(s)} onCheckedChange={(v) => toggle(s, v === true)} aria-label={labels.scenarios[s]} />
                <span className="w-3.5 shrink-0 border-t-2 border-dashed" style={{ borderColor: SCENARIO_COLORS[s] }} />
                {labels.scenarios[s]}
              </label>
            ))}
          </fieldset>
        ) : null}
        <LegendRow
          items={[
            { label: labels.cashActual, color: CASH_COLORS.balance, shape: "line" },
            ...(available.length <= 1 ? [{ label: labels.cashForecast, color: SCENARIO_COLORS.base, shape: "dashed" as const }] : []),
            { label: labels.cashCushion(formatCentsRound(cushionCents)), color: CASH_COLORS.cushion, shape: "line" },
          ]}
        />
      </div>
      <ChartFrame height={height}>
        <ComposedChart data={series} margin={{ top: 8, right: rightMargin, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cash-actual-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={CASH_COLORS.balance} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CASH_COLORS.balance} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="month" {...CHART_AXIS} tickMargin={8} minTickGap={12} tickFormatter={formatMonthAxis} />
          <YAxis {...CHART_AXIS} width={64} tickFormatter={(v: number) => formatCentsCompact(v)} />
          <ReferenceLine y={cushionCents} {...CUSHION_LINE} ifOverflow="extendDomain" />
          {todayMonth ? todayLine({ x: todayMonth, label: labels.today }) : null}
          <Tooltip
            cursor={CHART_CURSOR_LINE}
            content={({ active, label }) => {
              const r = active && label !== undefined ? byMonth.get(String(label)) : undefined;
              if (!r) return null;
              // De Cielo a Infierno: el orden en que se apilan las líneas en la gráfica.
              const scenarioRows = [...shown].reverse().flatMap((s) => {
                const v = r[KEY_OF[s]];
                return v !== null && r.actual_cents === null
                  ? [{ label: shown.length > 1 || available.length > 1 ? labels.scenarios[s] : labels.cashForecast, value: formatCentsRound(v), color: SCENARIO_COLORS[s], dashed: true }]
                  : [];
              });
              return (
                <TooltipBox
                  title={capFirst(formatMonthLong(r.month))}
                  rows={[
                    ...(r.actual_cents !== null ? [{ label: labels.cashActual, value: formatCentsRound(r.actual_cents), color: CASH_COLORS.balance }] : []),
                    ...scenarioRows,
                    { label: labels.cushion, value: formatCentsRound(cushionCents), color: CASH_COLORS.cushion, dashed: true },
                  ]}
                />
              );
            }}
          />
          <Area type="linear" dataKey="actual_cents" stroke={CASH_COLORS.balance} strokeWidth={2} fill="url(#cash-actual-fill)" dot={lastDot(CASH_COLORS.balance, lastRealIndex(series, "actual_cents"))} activeDot={chartActiveDot(CASH_COLORS.balance)} isAnimationActive={false} connectNulls={false} />
          {shown.map((s) => (
            <Line
              key={s}
              type="linear"
              dataKey={KEY_OF[s]}
              name={labels.scenarios[s]}
              stroke={SCENARIO_COLORS[s]}
              strokeWidth={2}
              strokeDasharray={DASH_FORECAST}
              dot={lastDot(SCENARIO_COLORS[s], lastRealIndex(series, KEY_OF[s]))}
              activeDot={chartActiveDot(SCENARIO_COLORS[s])}
              isAnimationActive={false}
              connectNulls
              label={(() => {
                const l = endLabels.find((x) => x.key === s);
                return l ? <EndLabel lastIndex={lastRealIndex(series, KEY_OF[s])} text={l.text} color={SCENARIO_COLORS[s]} offset={dys[s] ?? 0} /> : undefined;
              })()}
            />
          ))}
        </ComposedChart>
      </ChartFrame>
    </div>
  );
}

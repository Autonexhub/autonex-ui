import { CartesianGrid, ComposedChart, Line, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { lastRealIndex } from "./chart-data";
import { ChartFrame, EndLabel, LegendRow, todayLine, TooltipBox } from "./chart-kit";
import { endLabelOffsets } from "./finance-data";
import { arrTrajectoryRows } from "./forecast-view";
import { capFirst, formatCentsCompact, formatCentsRound, formatCentsThousands, formatMonthAxis, formatMonthLong, milestoneLabel } from "./format";
import { PLAN_SCENARIOS, type ActualArrPoint, type PlanMilestone, type PlanScenarioKey, type PlanSimulation } from "./types";
import { CHART_AXIS, CHART_CURSOR_LINE, CHART_GRID, DASH_FORECAST, PLAN_COLORS, SCENARIO_COLORS, chartActiveDot, lastDot } from "./ui";

export interface ArrTrajectoryChartLabels {
  scenarios: Record<PlanScenarioKey, string>;
  actual: string;
  milestones: string;
  /** «Hito del plan (Cielo): 166.000 €». */
  milestoneNote: (amount: string) => string;
  today: string;
}

export const DEFAULT_ARR_TRAJECTORY_CHART_LABELS: ArrTrajectoryChartLabels = {
  scenarios: { base: "Tierra", downside: "Infierno", upside: "Cielo" },
  actual: "Real",
  milestones: "Hitos del plan",
  milestoneNote: (amount) => `Hito del plan (Cielo): ${amount}`,
  today: "Hoy",
};

/** Etiqueta del hito sobre la marca, con un halo del color de la tarjeta para que no la tape una línea. */
function MilestoneLabel({ viewBox, text, last }: { viewBox?: { x?: number; y?: number }; text: string; last: boolean }) {
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;
  return (
    <text
      x={last ? x - 8 : x}
      y={last ? y + 4 : y - 10}
      textAnchor={last ? "end" : "middle"}
      fontSize={11}
      fill="var(--muted-foreground)"
      stroke="var(--card)"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  );
}

/**
 * Trayectoria de ARR (spec R1-R5, §4.4): el ARR real en tinta continua; Cielo (la referencia) grueso y con los hitos
 * del plan sobre su línea; Tierra e Infierno finos, cada uno con su cifra final (EndLabel). Sin puntos por mes: solo
 * el último real. «Hoy» marca el último mes cerrado.
 */
export function ArrTrajectoryChart({
  actualArr,
  simulation,
  milestones,
  height = 320,
  labels: labelsProp,
}: {
  actualArr: ActualArrPoint[];
  simulation: PlanSimulation;
  milestones: PlanMilestone[];
  height?: number;
  labels?: Partial<ArrTrajectoryChartLabels>;
}) {
  const labels: ArrTrajectoryChartLabels = { ...DEFAULT_ARR_TRAJECTORY_CHART_LABELS, ...labelsProp, scenarios: { ...DEFAULT_ARR_TRAJECTORY_CHART_LABELS.scenarios, ...labelsProp?.scenarios } };
  const rows = arrTrajectoryRows(actualArr, simulation);
  // De Cielo a Infierno: el orden en que se apilan las líneas.
  const shown = [...PLAN_SCENARIOS].reverse().filter((s) => rows.some((r) => r[s] !== null && r.actual === null));
  const byMonth = new Map(rows.map((r) => [r.month, r]));
  const marks = milestones.filter((m) => byMonth.has(m.month));
  const todayIdx = lastRealIndex(rows, "actual");
  const todayMonth = todayIdx >= 0 ? rows[todayIdx].month : null;
  const endLabels = shown.flatMap((s) => {
    const i = lastRealIndex(rows, s);
    const v = i >= 0 ? (rows[i][s] as number) : null;
    return v === null ? [] : [{ key: s, value: v, text: `${labels.scenarios[s]} ${formatCentsThousands(v)}` }];
  });
  const values = [...rows.flatMap((r) => [r.actual, ...shown.map((s) => r[s])]), ...marks.map((m) => m.arr_cents)].filter((v): v is number => v !== null);
  const span = Math.max(0, ...values) - Math.min(0, ...values);
  const dys = endLabelOffsets(endLabels, span, height - 40);
  const rightMargin = Math.max(96, Math.ceil(Math.max(0, ...endLabels.map((l) => l.text.length)) * 6.5 + 12));

  return (
    <div className="flex flex-col gap-3">
      <LegendRow
        items={[
          { label: labels.actual, color: PLAN_COLORS.actual, shape: "line" },
          ...shown.map((s) => ({ label: labels.scenarios[s], color: SCENARIO_COLORS[s], shape: "dashed" as const })),
          ...(marks.length > 0 ? [{ label: labels.milestones, color: PLAN_COLORS.milestone, shape: "circle" as const }] : []),
        ]}
      />
      <ChartFrame height={height}>
        <ComposedChart data={rows} margin={{ top: 28, right: rightMargin, left: 0, bottom: 0 }}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="month" {...CHART_AXIS} tickMargin={8} minTickGap={14} tickFormatter={formatMonthAxis} />
          <YAxis {...CHART_AXIS} width={64} tickFormatter={(v: number) => formatCentsCompact(v)} />
          {todayMonth ? todayLine({ x: todayMonth, label: labels.today }) : null}
          <Tooltip
            cursor={CHART_CURSOR_LINE}
            content={({ active: on, label }) => {
              if (!on || label === undefined) return null;
              const r = byMonth.get(String(label));
              if (!r) return null;
              const ms = milestones.find((m) => m.month === label);
              const items = [
                ...(r.actual !== null ? [{ label: labels.actual, value: formatCentsRound(r.actual), color: PLAN_COLORS.actual }] : []),
                ...(r.actual === null
                  ? shown
                      .filter((s) => r[s] !== null)
                      .map((s) => ({ label: labels.scenarios[s], value: formatCentsRound(r[s] as number), color: SCENARIO_COLORS[s], dashed: true, strong: s === "upside" }))
                  : []),
              ];
              return <TooltipBox title={capFirst(formatMonthLong(String(label)))} rows={items} note={ms ? labels.milestoneNote(formatCentsRound(ms.arr_cents)) : undefined} />;
            }}
          />
          {shown.map((s) => (
            <Line
              key={s}
              type="linear"
              dataKey={s}
              name={labels.scenarios[s]}
              stroke={SCENARIO_COLORS[s]}
              strokeWidth={s === "upside" ? 3 : 1.5}
              strokeDasharray={DASH_FORECAST}
              dot={false}
              activeDot={chartActiveDot(SCENARIO_COLORS[s])}
              isAnimationActive={false}
              connectNulls
              label={(() => {
                const l = endLabels.find((x) => x.key === s);
                return l ? <EndLabel lastIndex={lastRealIndex(rows, s)} text={l.text} color={SCENARIO_COLORS[s]} offset={dys[s] ?? 0} /> : undefined;
              })()}
            />
          ))}
          <Line type="linear" dataKey="actual" name="actual" stroke={PLAN_COLORS.actual} strokeWidth={2} dot={lastDot(PLAN_COLORS.actual, todayIdx)} activeDot={chartActiveDot(PLAN_COLORS.actual)} isAnimationActive={false} />
          {marks.map((m, i) => (
            <ReferenceDot
              key={m.month}
              x={m.month}
              // Sobre la línea de Cielo (si no hay dato de Cielo ese mes, en la cifra del hito).
              y={byMonth.get(m.month)?.upside ?? m.arr_cents}
              r={4}
              fill="var(--card)"
              stroke={SCENARIO_COLORS.upside}
              strokeWidth={2}
              ifOverflow="extendDomain"
              label={(props: { viewBox?: { x?: number; y?: number } }) => <MilestoneLabel {...props} text={milestoneLabel(m)} last={i === marks.length - 1} />}
            />
          ))}
        </ComposedChart>
      </ChartFrame>
    </div>
  );
}

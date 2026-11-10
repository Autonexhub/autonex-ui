import { Bar, BarChart, Cell, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { bridgeSteps, type BridgeStep, type BridgeStepKey } from "./chart-data";
import { ChartFrame, TooltipBox } from "./chart-kit";
import { capFirst, formatCentsRound, formatCentsSigned, formatMonthLong, formatMonthName } from "./format";
import type { MrrMovementMonth } from "./types";
import { CHART_AXIS, CHART_BAR_SIZE, CHART_CURSOR_BAR, FINANCE_COLORS } from "./ui";

export interface MrrBridgeChartLabels {
  steps: Record<BridgeStepKey, string>;
  timingInfo: string;
  /** Descripción accesible: «Puente del MRR de Octubre: de 2.929 € a 4.124 €». */
  aria: (v: { month: string; start: string; end: string }) => string;
}

export const DEFAULT_MRR_BRIDGE_CHART_LABELS: MrrBridgeChartLabels = {
  steps: {
    start: "MRR inicial",
    end: "MRR final",
    timing: "Sin facturar / atrasadas",
    new: "Nuevo",
    expansion: "Expansión",
    reactivation: "Reactivación",
    contraction: "Contracción",
    churn: "Churn",
  },
  timingInfo: "Cuotas facturadas tarde o aún sin facturar, y clientes vistos por primera vez antes del primer mes completo. No son altas ni bajas.",
  aria: ({ month, start, end }) => `Puente del MRR de ${month}: de ${start} a ${end}`,
};

/** Sumas en verdes, restas en rojos (regla verde/rojo del panel), inicio y fin en tinta. */
const STEP_COLOR: Record<BridgeStepKey, string> = {
  start: FINANCE_COLORS.net,
  new: FINANCE_COLORS.in,
  expansion: FINANCE_COLORS.in2,
  reactivation: FINANCE_COLORS.in3,
  contraction: FINANCE_COLORS.out2,
  churn: FINANCE_COLORS.out,
  timing: FINANCE_COLORS.plan,
  end: FINANCE_COLORS.net,
};
const colorOf = (s: BridgeStep) => (s.key === "timing" ? (s.kind === "up" ? FINANCE_COLORS.in3 : FINANCE_COLORS.out3) : STEP_COLOR[s.key]);

const ROW_HEIGHT = 34;

/**
 * Puente del MRR del mes (cascada horizontal): del MRR inicial al final con lo que suma, lo que resta y lo que
 * es solo calendario de facturación («sin facturar / atrasadas»). Cada barra lleva su importe a la derecha.
 */
export function MrrBridgeChart({ row, labels: labelsProp }: { row: MrrMovementMonth; labels?: Partial<MrrBridgeChartLabels> }) {
  const labels: MrrBridgeChartLabels = { ...DEFAULT_MRR_BRIDGE_CHART_LABELS, ...labelsProp, steps: { ...DEFAULT_MRR_BRIDGE_CHART_LABELS.steps, ...labelsProp?.steps } };
  const steps = bridgeSteps(row, labels.steps);
  const data = steps.map((s) => ({ ...s, rest: s.base }));
  const max = Math.max(...steps.map((s) => s.base + s.value), 1);
  const month = capFirst(formatMonthName(row.month));
  const first = steps[0];
  const last = steps[steps.length - 1];

  const tooltip = ({ active, payload }: { active?: boolean; payload?: { payload?: BridgeStep }[] }) => {
    const s = payload?.[0]?.payload;
    if (!active || !s) return null;
    const total = s.kind === "total";
    return (
      <TooltipBox
        title={`${s.label} · ${capFirst(formatMonthLong(row.month))}`}
        rows={[{ label: s.label, value: total ? formatCentsRound(s.cents) : formatCentsSigned(s.cents), color: colorOf(s), strong: true }]}
        note={s.key === "timing" ? labels.timingInfo : undefined}
      />
    );
  };

  return (
    <div role="img" aria-label={labels.aria({ month, start: formatCentsRound(first.cents), end: formatCentsRound(last.cents) })}>
      <ChartFrame height={steps.length * ROW_HEIGHT + 12}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 96, left: 0, bottom: 4 }} barCategoryGap="22%">
          <XAxis type="number" hide domain={[0, max]} />
          <YAxis type="category" dataKey="label" {...CHART_AXIS} width={176} tick={{ ...CHART_AXIS.tick, fontSize: 12, fill: "var(--foreground)" }} />
          <Tooltip content={tooltip} cursor={CHART_CURSOR_BAR} />
          <Bar dataKey="rest" stackId="b" fill="transparent" isAnimationActive={false} maxBarSize={CHART_BAR_SIZE} />
          <Bar dataKey="value" stackId="b" radius={6} maxBarSize={CHART_BAR_SIZE} isAnimationActive={false}>
            {data.map((s) => (
              <Cell key={s.key} fill={colorOf(s)} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              content={(p) => {
                const { x = 0, y = 0, width = 0, height = 0, index = 0 } = p as { x?: number; y?: number; width?: number; height?: number; index?: number };
                const s = data[index];
                if (!s) return null;
                return (
                  <text x={x + width + 8} y={y + height / 2} dominantBaseline="central" fontSize={12} fontWeight={s.kind === "total" ? 600 : 500} fill="var(--foreground)" className="tabular-nums">
                    {s.kind === "total" ? formatCentsRound(s.cents) : formatCentsSigned(s.cents)}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ChartFrame>
    </div>
  );
}

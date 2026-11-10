import { useId } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { barShape } from "./bar-shape";
import { lastRealIndex, type PairedBarRow } from "./chart-data";
import { ChartFrame, LegendRow, TooltipBox, type LegendItem, type TooltipRow } from "./chart-kit";
import { capFirst, formatCentsCompact, formatCentsRound, formatCentsSigned, formatMonthAxis, formatMonthLong } from "./format";
import { CHART_AXIS, CHART_BAR_SIZE, CHART_CURSOR_BAR, CHART_GRID, FINANCE_COLORS, chartActiveDot, lastDot } from "./ui";

export interface PairedBarsChartLabels {
  /** Nombre de la línea de neto en leyenda y tooltip (por defecto «Resultado»). */
  net: string;
  in: string;
  out: string;
  incompleteMonth: string;
  incompleteNote: string;
  clickMonth: string;
}

export const DEFAULT_PAIRED_BARS_CHART_LABELS: PairedBarsChartLabels = {
  net: "Resultado",
  in: "Entradas",
  out: "Salidas",
  incompleteMonth: "Mes con costes incompletos",
  incompleteNote: "Mes con costes incompletos: faltan compras en Holded.",
  clickMonth: "Clic para ver el detalle del mes",
};

/** Tonos por posición del segmento (el orden de `in`/`out` es fijo, así que el color es por identidad). */
const IN_TONES = [FINANCE_COLORS.in, FINANCE_COLORS.in2, FINANCE_COLORS.in3, FINANCE_COLORS.plan];
const OUT_TONES = [FINANCE_COLORS.out, FINANCE_COLORS.out2, FINANCE_COLORS.out3, FINANCE_COLORS.plan];

type Flat = { month: string; net: number } & Record<string, number | string>;

/**
 * Barras pareadas por mes: entradas apiladas en verde junto a salidas apiladas en rojo, y el neto como
 * línea en tinta con puntos. Los meses incompletos (costes sin cargar) llevan la entrada rayada y la salida
 * al 50 %: la cifra existe pero no es de fiar. `band` sombrea en gris un tramo de meses con su etiqueta
 * (p. ej. «Histórico AJE GAMAN · hasta sep 26»). Clic en un mes → `onMonthClick`.
 */
export function PairedBarsChart({
  rows,
  height = 300,
  incompleteMonths = [],
  onMonthClick,
  netLabel,
  band,
  barSize = CHART_BAR_SIZE,
  labels: labelsProp,
}: {
  rows: PairedBarRow[];
  /** Ancho máximo de cada barra (px). */
  barSize?: number;
  height?: number;
  incompleteMonths?: string[];
  onMonthClick?(m: string): void;
  /** Nombre de la línea de neto en leyenda y tooltip (por defecto «Resultado»). */
  netLabel?: string;
  /** Tramo sombreado [from, to] (meses «YYYY-MM» incluidos) con su etiqueta. */
  band?: { from: string; to: string; label: string } | null;
  labels?: Partial<PairedBarsChartLabels>;
}) {
  const labels = { ...DEFAULT_PAIRED_BARS_CHART_LABELS, ...labelsProp };
  const uid = useId().replace(/:/g, "");
  const net = netLabel ?? labels.net;
  const first = rows[0];
  // Solo las series con algún importe; el color sigue siendo el de su posición original.
  const inSeries = (first?.in ?? []).map((s, i) => ({ ...s, i, color: IN_TONES[i] ?? FINANCE_COLORS.plan })).filter((s) => rows.some((r) => r.in[s.i]?.cents));
  const outSeries = (first?.out ?? []).map((s, i) => ({ ...s, i, color: OUT_TONES[i] ?? FINANCE_COLORS.plan })).filter((s) => rows.some((r) => r.out[s.i]?.cents));
  const inKeys = inSeries.map((s) => `in${s.i}`);
  const outKeys = outSeries.map((s) => `out${s.i}`);
  const incomplete = new Set(incompleteMonths);
  const hasIncomplete = rows.some((r) => incomplete.has(r.month));
  const hasNegative = rows.some((r) => r.net_cents < 0);

  const data: Flat[] = rows.map((r) => {
    const o: Flat = { month: r.month, net: r.net_cents };
    r.in.forEach((s, i) => (o[`in${i}`] = s.cents));
    r.out.forEach((s, i) => (o[`out${i}`] = s.cents));
    return o;
  });

  const legend: LegendItem[] = [
    ...inSeries.map((s) => ({ label: s.label, color: s.color })),
    ...outSeries.map((s) => ({ label: s.label, color: s.color })),
    { label: net, color: FINANCE_COLORS.net, shape: "line" as const },
    ...(hasIncomplete ? [{ label: labels.incompleteMonth, color: FINANCE_COLORS.in, shape: "hatch" as const }] : []),
  ];

  const click = onMonthClick
    ? (e: { activeLabel?: string | number } | null) => {
        if (e?.activeLabel !== undefined) onMonthClick(String(e.activeLabel));
      }
    : undefined;

  const tooltip = ({ active, label }: { active?: boolean; label?: string | number }) => {
    if (!active || label === undefined) return null;
    const r = rows.find((x) => x.month === label);
    if (!r) return null;
    const totalIn = r.in.reduce((s, x) => s + x.cents, 0);
    const totalOut = r.out.reduce((s, x) => s + x.cents, 0);
    const lines: TooltipRow[] = [
      ...inSeries.map((s) => ({ label: s.label, value: formatCentsRound(r.in[s.i]?.cents ?? 0), color: s.color })),
      { label: labels.in, value: formatCentsRound(totalIn), strong: true },
      ...outSeries.map((s) => ({ label: s.label, value: formatCentsRound(r.out[s.i]?.cents ?? 0), color: s.color })),
      { label: labels.out, value: formatCentsRound(totalOut), strong: true },
      { label: net, value: formatCentsSigned(r.net_cents), strong: true },
    ];
    return (
      <TooltipBox
        title={capFirst(formatMonthLong(r.month))}
        rows={lines}
        note={incomplete.has(r.month) ? labels.incompleteNote : onMonthClick ? labels.clickMonth : undefined}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <LegendRow items={legend} />
      <ChartFrame height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="30%"
          barGap={3}
          onClick={click}
          style={onMonthClick ? { cursor: "pointer" } : undefined}
        >
          <defs>
            {inSeries.map((s) => (
              <pattern key={s.i} id={`${uid}-hatch-${s.i}`} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={2} height={4} fill={s.color} />
              </pattern>
            ))}
          </defs>
          <CartesianGrid {...CHART_GRID} />
          {band && (
            <ReferenceArea
              x1={band.from}
              x2={band.to}
              fill="var(--muted)"
              fillOpacity={0.7}
              stroke="none"
              ifOverflow="extendDomain"
              label={{ value: band.label, position: "insideTopLeft", fill: "var(--muted-foreground)", fontSize: 11, offset: 6 }}
            />
          )}
          <XAxis dataKey="month" {...CHART_AXIS} tickMargin={8} tickFormatter={formatMonthAxis} minTickGap={8} />
          <YAxis {...CHART_AXIS} width={64} tickFormatter={(v: number) => formatCentsCompact(v)} />
          <Tooltip content={tooltip} cursor={CHART_CURSOR_BAR} />
          {hasNegative && <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.5} />}
          {inSeries.map((s, k) => (
            <Bar key={`in${s.i}`} dataKey={`in${s.i}`} name={s.label} stackId="in" fill={s.color} maxBarSize={barSize} shape={barShape({ before: inKeys.slice(0, k), after: inKeys.slice(k + 1) })} isAnimationActive={false}>
              {rows.map((r) =>
                incomplete.has(r.month) ? (
                  <Cell key={r.month} fill={`url(#${uid}-hatch-${s.i})`} stroke={s.color} strokeWidth={1} />
                ) : (
                  <Cell key={r.month} />
                ),
              )}
            </Bar>
          ))}
          {outSeries.map((s, k) => (
            <Bar key={`out${s.i}`} dataKey={`out${s.i}`} name={s.label} stackId="out" fill={s.color} maxBarSize={barSize} shape={barShape({ before: outKeys.slice(0, k), after: outKeys.slice(k + 1) })} isAnimationActive={false}>
              {rows.map((r) => (
                <Cell key={r.month} fillOpacity={incomplete.has(r.month) ? 0.5 : 1} />
              ))}
            </Bar>
          ))}
          <Line
            type="linear"
            dataKey="net"
            name={net}
            stroke={FINANCE_COLORS.net}
            strokeWidth={2}
            dot={lastDot(FINANCE_COLORS.net, lastRealIndex(data, "net"))}
            activeDot={chartActiveDot(FINANCE_COLORS.net)}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartFrame>
    </div>
  );
}

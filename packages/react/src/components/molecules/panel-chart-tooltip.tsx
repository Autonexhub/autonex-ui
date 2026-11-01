/**
 * Tooltip de gráfica ÚNICO del panel (decisión Bruno 01/09): clona la receta
 * visual del `ChartTooltipContent` oficial de ui/chart — el canon de
 * 4-Templates/MetricsPage — sin exigir ChartContainer, para poder usarlo en
 * los charts existentes con ResponsiveContainer y en los customTooltip de
 * Tremor. Recharts: `content={<PanelChartTooltip />}`.
 */

interface TooltipItem {
  name?: string | number;
  value?: number | string;
  color?: string;
  payload?: { fill?: string } & Record<string, unknown>;
}

interface PanelChartTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  labelFormatter?: (label: string | number, payload: TooltipItem[]) => React.ReactNode;
  valueFormatter?: (value: number | string, name?: string | number) => React.ReactNode;
  /** Renombra series (p.ej. claves técnicas -> etiqueta visible). */
  nameFormatter?: (name: string | number) => React.ReactNode;
}

export function PanelChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  nameFormatter,
}: PanelChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {label !== undefined && label !== "" && (
        <div className="font-medium text-foreground">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item, i) => (
          <div key={i} className="flex w-full items-center gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ background: item.color ?? item.payload?.fill ?? "var(--chart-1)" }}
            />
            <span className="text-muted-foreground">
              {nameFormatter ? nameFormatter(item.name ?? "") : item.name}
            </span>
            <span className="ml-auto font-medium tabular-nums text-foreground">
              {valueFormatter && item.value !== undefined
                ? valueFormatter(item.value, item.name)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

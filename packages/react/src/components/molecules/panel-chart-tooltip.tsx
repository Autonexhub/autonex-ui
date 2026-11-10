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
    <PanelTooltipShell label={label !== undefined && label !== "" ? (labelFormatter ? labelFormatter(label, payload) : label) : undefined}>
      {payload.map((item, i) => (
        <PanelTooltipRow
          key={i}
          color={item.color ?? item.payload?.fill ?? "var(--chart-1)"}
          name={nameFormatter ? nameFormatter(item.name ?? "") : item.name}
          value={valueFormatter && item.value !== undefined ? valueFormatter(item.value, item.name) : item.value}
        />
      ))}
    </PanelTooltipShell>
  );
}

/**
 * Piezas del tooltip, para gráficas que arman sus propias filas (Finanzas): la caja con su título y una
 * fila (muestra de color + nombre + valor). Son las mismas que pinta `PanelChartTooltip`.
 */
export function PanelTooltipShell({
  label,
  children,
  footer,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {label !== undefined && label !== null && label !== "" && (
        <div className="font-medium text-foreground">{label}</div>
      )}
      <div className="grid gap-1.5">{children}</div>
      {footer && <div className="text-muted-foreground">{footer}</div>}
    </div>
  );
}

export function PanelTooltipRow({
  color,
  swatch = "square",
  name,
  value,
  strong = false,
}: {
  color?: string;
  /** `dashed` para series discontinuas (previsiones, umbrales). */
  swatch?: "square" | "dashed";
  name: React.ReactNode;
  value: React.ReactNode;
  /** Fila de total: separada por una línea y con el nombre en tinta. */
  strong?: boolean;
}) {
  return (
    <div className={"flex w-full items-center gap-2" + (strong ? " border-t border-border/50 pt-1.5" : "")}>
      {color &&
        (swatch === "dashed" ? (
          <div className="w-2.5 shrink-0 border-t-2 border-dashed" style={{ borderColor: color }} />
        ) : (
          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: color }} />
        ))}
      <span className={strong ? "font-medium text-foreground" : "text-muted-foreground"}>{name}</span>
      <span className="ml-auto font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

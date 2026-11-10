import { useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { ReferenceLine, ResponsiveContainer } from "recharts";
import { cn } from "../../lib/utils";
import { PanelTooltipRow, PanelTooltipShell } from "../molecules/panel-chart-tooltip";
import { Skeleton } from "../ui/skeleton";

/**
 * Mide un elemento con ResizeObserver, de forma síncrona al montar (antes de pintar) y en cada cambio. Existe
 * para esquivar un bug de `ResponsiveContainer` de Recharts: si se monta antes de que su padre tenga tamaño, la
 * gráfica sale vacía hasta que algo fuerza un re-cálculo. Montándola solo cuando `ready`, la primera medida ya es buena.
 */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) => (prev.width === rect.width && prev.height === rect.height ? prev : { width: rect.width, height: rect.height }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, size, ready: size.width > 0 && size.height > 0 };
}

/**
 * Piezas comunes de las gráficas de Finanzas, con el lenguaje de las del panel de Operaciones: marco que solo
 * monta la gráfica cuando tiene tamaño (el bug de Recharts de la gráfica vacía, ver useElementSize), leyenda
 * como la del BarChart del panel (arriba a la derecha, muestra de 8 px, texto xs) y tooltip = PanelChartTooltip.
 */

export function ChartFrame({ height, children, className }: { height: number; children: ReactElement; className?: string }) {
  const { ref, ready } = useElementSize<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("w-full", className)} style={{ height }}>
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : <Skeleton className="h-full w-full" />}
    </div>
  );
}

export type LegendItem = { label: string; color: string; shape?: "square" | "circle" | "line" | "dashed" | "dotted" | "band" | "hatch" };

/** Leyenda del panel (LegendItem del BarChart): `size-2 rounded-sm` + texto xs, alineada a la derecha. */
export function LegendRow({ items, className, align = "end" }: { items: LegendItem[]; className?: string; align?: "start" | "end" }) {
  return (
    <ul className={cn("-mx-2 flex flex-wrap items-center text-xs text-foreground", align === "end" ? "justify-end" : "justify-start", className)}>
      {items.map((i) => (
        <li key={i.label} className="inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-1">
          {i.shape === "line" ? (
            <span className="h-0.5 w-3.5 shrink-0 rounded-full" style={{ background: i.color }} />
          ) : i.shape === "dashed" ? (
            <span className="w-3.5 shrink-0 border-t-2 border-dashed" style={{ borderColor: i.color }} />
          ) : i.shape === "dotted" ? (
            <span className="w-3.5 shrink-0 border-t-2 border-dotted" style={{ borderColor: i.color }} />
          ) : i.shape === "hatch" ? (
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ boxShadow: `inset 0 0 0 1px ${i.color}`, background: `repeating-linear-gradient(45deg, transparent 0 1.5px, ${i.color} 1.5px 3px)` }}
            />
          ) : i.shape === "circle" ? (
            <span className="size-2 shrink-0 rounded-full border-2 bg-card" style={{ borderColor: i.color }} />
          ) : i.shape === "band" ? (
            <span className="h-2 w-3.5 shrink-0 rounded-sm border border-border" style={{ background: i.color }} />
          ) : (
            <span className="size-2 shrink-0 rounded-sm" style={{ background: i.color }} />
          )}
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export type TooltipRow = { label: string; value: string; color?: string; strong?: boolean; dashed?: boolean };

/** Tooltip de Finanzas: las piezas de PanelChartTooltip con filas ya formateadas (totales separados por línea). */
export function TooltipBox({ title, rows, note }: { title: ReactNode; rows: TooltipRow[]; note?: ReactNode }) {
  return (
    <PanelTooltipShell label={title} footer={note}>
      {rows.map((r) => (
        <PanelTooltipRow key={r.label} color={r.color} swatch={r.dashed ? "dashed" : "square"} name={r.label} value={r.value} strong={r.strong} />
      ))}
    </PanelTooltipShell>
  );
}

/**
 * Etiqueta directa al final de una serie (R4): úsala como `<Line label={<EndLabel … />}>`. Pinta solo en el
 * último valor real (`lastIndex`, de `lastRealIndex`), a la derecha del punto y en el color de la serie.
 */
export function EndLabel({
  lastIndex,
  text,
  color,
  offset = 0,
  ...p
}: {
  lastIndex: number;
  /** Texto ya formateado («Cielo 273 K€»). */
  text: string;
  color: string;
  /** Desplazamiento vertical en px para separar etiquetas cercanas. */
  offset?: number;
  // Props que Recharts inyecta en el `label` de una línea.
  x?: number | string;
  y?: number | string;
  index?: number;
}) {
  const x = Number(p.x);
  const y = Number(p.y);
  if (p.index !== lastIndex || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x + 8} y={y} dy={4 + offset} fontSize={11} fontWeight={600} fill={color} textAnchor="start">
      {text}
    </text>
  );
}

/**
 * Marca vertical «Hoy» (R4) cuando el gráfico mezcla real y previsión. `x` = valor del eje X de ese punto; `label` =
 * `t("charts.today")`. Se LLAMA (`{todayLine({ x, label })}`), no se renderiza como JSX: Recharts solo reconoce el
 * `ReferenceLine` como hijo directo del gráfico, no dentro de otro componente.
 */
export function todayLine({ x, label }: { x: string | number; label: string }) {
  return (
    <ReferenceLine
      x={x}
      stroke="var(--muted-foreground)"
      strokeOpacity={0.6}
      strokeWidth={1}
      label={{ value: label, position: "insideTopRight", fontSize: 11, fill: "var(--muted-foreground)" }}
    />
  );
}

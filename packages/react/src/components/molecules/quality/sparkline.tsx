import * as React from "react";
import { cn } from "../../../lib/utils";

export interface SparklineProps {
  values: (number | null)[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: boolean;
  min?: number;
  max?: number;
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
}

/** Puntos SVG de la línea; los null cortan la línea en segmentos. */
export function sparklineSegments(values: (number | null)[], width: number, height: number, min?: number, max?: number, pad = 2) {
  const nums = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (!nums.length) return { segments: [] as [number, number][][], last: null as [number, number] | null };
  const lo = min ?? Math.min(...nums);
  const hi = max ?? Math.max(...nums);
  const span = hi - lo || 1;
  const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  const segments: [number, number][][] = [];
  let cur: [number, number][] = [];
  let last: [number, number] | null = null;
  values.forEach((v, i) => {
    if (v === null || !Number.isFinite(v)) {
      if (cur.length) segments.push(cur);
      cur = [];
      return;
    }
    const x = values.length > 1 ? pad + i * stepX : width / 2;
    const y = hi === lo && min === undefined && max === undefined ? height / 2 : pad + (1 - (v - lo) / span) * (height - pad * 2);
    const p: [number, number] = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
    cur.push(p);
    last = p;
  });
  if (cur.length) segments.push(cur);
  return { segments, last };
}

/** Línea mínima para tendencias en una celda o un KPI. */
export function Sparkline({
  values,
  width = 96,
  height = 28,
  stroke = "var(--primary)",
  fill = false,
  min,
  max,
  strokeWidth = 1.5,
  className,
  ariaLabel,
}: SparklineProps) {
  const { segments, last } = sparklineSegments(values, width, height, min, max);
  const id = React.useId();
  return (
    <svg
      data-slot="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("inline-block shrink-0 overflow-visible", className)}
    >
      {fill
        ? segments
            .filter((s) => s.length > 1)
            .map((s, i) => (
              <path
                key={`f${id}${i}`}
                d={`M${s[0]![0]},${height} ${s.map(([x, y]) => `L${x},${y}`).join(" ")} L${s[s.length - 1]![0]},${height} Z`}
                fill={stroke}
                opacity={0.12}
              />
            ))
        : null}
      {segments.map((s, i) =>
        s.length > 1 ? (
          <polyline
            key={`l${id}${i}`}
            points={s.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : (
          <circle key={`p${id}${i}`} cx={s[0]![0]} cy={s[0]![1]} r={strokeWidth} fill={stroke} />
        ),
      )}
      {last ? <circle cx={(last as [number, number])[0]} cy={(last as [number, number])[1]} r={2} fill={stroke} /> : null}
    </svg>
  );
}

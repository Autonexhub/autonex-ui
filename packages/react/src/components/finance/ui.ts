import { createElement, type ReactElement } from "react";

/** Colores y constantes de gráfica de Finanzas (lenguaje de gráfica del panel de Operaciones). */

// Colores por identidad (los mismos en Inicio, Resultados y el panel de control). Los tokens `--finance-*` los
// define la app; si no existen (Storybook) caen a los tonos de éxito/destructivo del sistema.

/**
 * Colores de las series financieras: lo que entra o suma, en verde; lo que sale o resta, en rojo; neto en tinta y
 * plan/umbral en gris (mismo criterio que las variaciones ▲/▼).
 */
export const FINANCE_COLORS = {
  in: "var(--finance-in, var(--success))",
  in2: "var(--finance-in-2, color-mix(in oklab, var(--success) 62%, var(--card)))",
  in3: "var(--finance-in-3, color-mix(in oklab, var(--success) 40%, var(--card)))",
  out: "var(--finance-out, var(--destructive))",
  out2: "var(--finance-out-2, color-mix(in oklab, var(--destructive) 62%, var(--card)))",
  out3: "var(--finance-out-3, color-mix(in oklab, var(--destructive) 40%, var(--card)))",
  net: "var(--foreground)",
  plan: "var(--muted-foreground)",
} as const;

/** Caja: entra en verde, sale en rojo, el saldo en tinta y el colchón en gris (punteado en la gráfica). */
export const CASH_COLORS = {
  in: FINANCE_COLORS.in,
  out: FINANCE_COLORS.out,
  balance: FINANCE_COLORS.net,
  cushion: FINANCE_COLORS.plan,
  costs: FINANCE_COLORS.out,
} as const;

/**
 * Trayectoria de ARR del Plan (spec v3 §4.5): el real en tinta, el escenario activo en azul (`--chart-1`) y los otros dos en
 * gris a opacidad plena (el azul claro al 40 % casi no se veía, sobre todo en oscuro); los hitos, en gris plan.
 * Color por papel (activo / otros / real), no por escenario: al cambiar de escenario cambia cuál va en azul.
 */
export const PLAN_COLORS = {
  actual: FINANCE_COLORS.net,
  active: "var(--chart-1)",
  other: FINANCE_COLORS.plan,
  milestone: FINANCE_COLORS.plan,
} as const;

// ---- Lenguaje de gráfica del panel (Operaciones · Métricas), el mismo en todas las de Finanzas ----------

/** Ejes sin línea ni marcas, cifras a 11 px en gris (igual que «Uso por horas» y el Panel de control). */
export const CHART_AXIS = { tick: { fontSize: 11, fill: "var(--muted-foreground)" }, tickLine: false, axisLine: false } as const;
/** Rejilla punteada, solo horizontal. */
export const CHART_GRID = { stroke: "var(--border)", strokeDasharray: "3 3", vertical: false } as const;
/** Grosor máximo de barra (R4: 20-28 px; PyG 26). */
export const CHART_BAR_SIZE = 22;
/** Sombra del mes bajo el ratón: barras (como el BarChart del panel) y líneas (como su AreaChart). */
export const CHART_CURSOR_BAR = { fill: "var(--muted-foreground)", opacity: 0.15 } as const;
export const CHART_CURSOR_LINE = { stroke: "var(--border)", strokeWidth: 1 } as const;
/**
 * Punto de línea (R4): solo el último valor real lleva punto (hueco, r 3, borde del color de la serie); el resto,
 * nada. `lastIndex` sale de `lastRealIndex(rows, key)`. El punto al pasar el ratón es `chartActiveDot`.
 */
export const lastDot = (color: string, lastIndex: number) => (p: { cx?: number; cy?: number; index?: number; key?: string }): ReactElement<SVGElement> =>
  p.index === lastIndex && p.cx !== undefined && p.cy !== undefined
    ? createElement("circle", { key: p.key ?? `dot-${p.index}`, cx: p.cx, cy: p.cy, r: 3, fill: "var(--card)", stroke: color, strokeWidth: 2 }) as unknown as ReactElement<SVGElement>
    : (createElement("g", { key: p.key ?? `dot-${p.index}` }) as unknown as ReactElement<SVGElement>);
export const chartActiveDot = (color: string) => ({ r: 4, fill: color, stroke: "var(--card)", strokeWidth: 2, strokeDasharray: "0" });
/** Escenarios del plan: Cielo en verde (sube), Tierra en azul (referencia) e Infierno en rojo (baja). */
export const SCENARIO_COLORS = {
  downside: "var(--destructive)",
  base: "var(--chart-1)",
  upside: "var(--success)",
} as const;

/** Discontinuo: solo las previsiones (R4). */
export const DASH_FORECAST = "4 3";
/** Colchón: línea fina gris continua (R4: nada más que la previsión va discontinuo). */
export const CUSHION_LINE = { stroke: CASH_COLORS.cushion, strokeWidth: 1, strokeOpacity: 0.7 } as const;

/** Tarjeta de gráfica del panel: `Card` con p-6 y título text-base semibold (VoiceMetrics). */
export const CHART_CARD = "flex min-w-0 flex-col gap-4 p-6";
export const CHART_TITLE = "text-base font-semibold tracking-tight text-foreground";

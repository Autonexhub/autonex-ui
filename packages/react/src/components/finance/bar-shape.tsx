/**
 * Forma de barra del panel (la de `components/BarChart`, Tremor): extremos redondeados del todo. En una pila,
 * solo se redondean los extremos de la pila (la base del primer tramo con importe y la punta del último), no
 * las juntas entre tramos; así una pila de un solo tramo queda como la píldora del panel.
 *
 * `before` / `after`: claves de la misma pila por debajo / por encima de este tramo (en el sentido en que
 * crece la pila). `dir`: hacia dónde crece (abajo para lo que resta en las barras divergentes).
 */
type ShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  payload?: Record<string, unknown>;
};

const has = (row: Record<string, unknown> | undefined, k: string) => Number(row?.[k] ?? 0) !== 0;

export function barShape({ before = [], after = [], dir = "up" }: { before?: string[]; after?: string[]; dir?: "up" | "down" } = {}) {
  return function PanelBar(p: ShapeProps) {
    let { y = 0, height = 0 } = p;
    const { x = 0, width = 0 } = p;
    if (height < 0) {
      y += height;
      height = -height;
    }
    if (!width || !height) return <g />;
    const base = !before.some((k) => has(p.payload, k));
    const tip = !after.some((k) => has(p.payload, k));
    // Arriba y abajo en pantalla según el sentido de la pila.
    const roundTop = dir === "up" ? tip : base;
    const roundBottom = dir === "up" ? base : tip;
    const both = roundTop && roundBottom;
    const r = Math.max(0, Math.min(width / 2, both ? height / 2 : height));
    const rt = roundTop ? r : 0;
    const rb = roundBottom ? r : 0;
    const d = [
      `M${x},${y + rt}`,
      rt ? `A${rt},${rt} 0 0 1 ${x + rt},${y}` : "",
      `L${x + width - rt},${y}`,
      rt ? `A${rt},${rt} 0 0 1 ${x + width},${y + rt}` : "",
      `L${x + width},${y + height - rb}`,
      rb ? `A${rb},${rb} 0 0 1 ${x + width - rb},${y + height}` : "",
      `L${x + rb},${y + height}`,
      rb ? `A${rb},${rb} 0 0 1 ${x},${y + height - rb}` : "",
      "Z",
    ].join(" ");
    return <path d={d} fill={p.fill} fillOpacity={p.fillOpacity} stroke={p.stroke} strokeWidth={p.strokeWidth} />;
  };
}

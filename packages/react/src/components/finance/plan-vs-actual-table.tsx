import { cn } from "../../lib/utils";
import { formatCentsRound, formatCentsSigned, formatMonthAxis, getFinanceLocale } from "./format";
import { planVsActualView, type PlanVsActualViewRow } from "./plan-vs-actual";
import type { PlanVsActual } from "./types";

export interface PlanVsActualTableLabels {
  /** Caption accesible: «Vs plan Road to €1M ARR · escenario Cielo». */
  title: string;
  baseline: string;
  planCol: (month: string) => string;
  actualCol: (month: string) => string;
  deltaCol: string;
  /** Etiquetas de las filas conocidas; el resto usa la que manda la API. */
  rows: Partial<Record<"mrr" | "new_mrr" | "customers", string>>;
}

export const DEFAULT_PLAN_VS_ACTUAL_TABLE_LABELS: PlanVsActualTableLabels = {
  title: "Vs plan Road to €1M ARR · escenario Cielo",
  baseline: "Punto de partida del plan",
  planCol: (month) => `Plan ${month}`,
  actualCol: (month) => `Real ${month}`,
  deltaCol: "Desvío",
  rows: { mrr: "MRR", new_mrr: "MRR nuevo neto", customers: "Clientes activos" },
};

const unitNf = () => new Intl.NumberFormat(getFinanceLocale(), { maximumFractionDigits: 0 });

/**
 * «Vs plan Road to €1M ARR · escenario Cielo» del Resumen. La tabla puntuada es la del último mes cerrado: facturado
 * frente al plan de facturado, desvío con ▲ ▼ en verde o rojo (lo único con color) solo si la API lo puntúa; si el mes
 * cerrado es el arranque del plan, «Punto de partida del plan» sin desvío.
 */
export function PlanVsActualTable({ data, labels: labelsProp }: { data: PlanVsActual; labels?: Partial<PlanVsActualTableLabels> }) {
  const labels = { ...DEFAULT_PLAN_VS_ACTUAL_TABLE_LABELS, ...labelsProp, rows: { ...DEFAULT_PLAN_VS_ACTUAL_TABLE_LABELS.rows, ...labelsProp?.rows } };
  const { closed } = planVsActualView(data);
  const num = (money: boolean, n: number | null) =>
    n === null ? "—" : `${n < 0 ? "−" : ""}${money ? formatCentsRound(Math.abs(n)) : unitNf().format(Math.abs(n))}`;
  const fmtDelta = (r: PlanVsActualViewRow) => {
    const d = r.delta;
    if (d === null) return "—";
    const body = r.money ? formatCentsSigned(d) : `${d > 0 ? "+" : d < 0 ? "−" : ""}${unitNf().format(Math.abs(d))}`;
    return `${d > 0 ? "▲ " : d < 0 ? "▼ " : ""}${body}`;
  };
  const label = (r: PlanVsActualViewRow) => (r.key === "mrr" || r.key === "new_mrr" || r.key === "customers" ? labels.rows[r.key] ?? r.label : r.label);
  const th = "pb-2 pl-3 text-right text-xs font-medium text-muted-foreground";
  const rowTh = "whitespace-nowrap py-2 pr-3 text-left font-normal text-foreground";
  return (
    <table className="w-full text-sm tabular-nums">
      <caption className="sr-only">{labels.title}</caption>
      <thead>
        <tr className="border-b">
          <th className="pb-2 text-left text-xs font-medium text-muted-foreground">{closed.baseline ? labels.baseline : null}</th>
          <th scope="col" className={th}>
            {labels.planCol(formatMonthAxis(closed.month))}
          </th>
          <th scope="col" className={th}>
            {labels.actualCol(formatMonthAxis(closed.month))}
          </th>
          <th scope="col" className={th}>
            {labels.deltaCol}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {closed.rows.map((r) => (
          <tr key={r.key}>
            <th scope="row" className={rowTh}>
              {label(r)}
            </th>
            <td className="py-2 pl-3 text-right text-muted-foreground">{num(r.money, r.plan)}</td>
            <td className="py-2 pl-3 text-right text-foreground">{num(r.money, r.actual)}</td>
            <td className={cn("whitespace-nowrap py-2 pl-3 text-right font-medium", r.delta === null || r.delta === 0 ? "text-muted-foreground" : r.delta > 0 ? "text-success" : "text-destructive")}>
              {fmtDelta(r)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

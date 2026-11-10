import type { KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { formatCentsRound, formatMonthAxis, formatMonthsNumber } from "./format";
import { scenarioGap } from "./forecast-view";
import { PLAN_SCENARIOS, type PlanCompareRow, type PlanScenarioKey } from "./types";
import { SCENARIO_COLORS } from "./ui";

export interface ScenarioCardsLabels {
  /** Nombre de cada escenario. */
  scenarios: Record<PlanScenarioKey, string>;
  /** «Escenarios a dic 27». */
  group: (month: string) => string;
  /** Etiqueta del grupo de radio. */
  scenario: string;
  units: { discoveries: string; closes: string };
  /** «Tierra: 120 discoveries/mes». */
  plan: (v: { scenario: string; n: string; unit: string }) => string;
  needMore: (v: { scenario: string; to: string; from: string; unit: string; ref: string }) => string;
  needLess: (v: { scenario: string; to: string; from: string; unit: string; ref: string }) => string;
  select: (scenario: string) => string;
  ofTarget: (pct: string) => string;
  customers: string;
  breakEven: string;
  costsMissing: string;
  alreadyBreakEven: string;
  notInHorizon: string;
  cashMin: string;
}

export const DEFAULT_SCENARIO_CARDS_LABELS: ScenarioCardsLabels = {
  scenarios: { base: "Tierra", downside: "Infierno", upside: "Cielo" },
  group: (month) => `Escenarios a ${month}`,
  scenario: "Escenario",
  units: { discoveries: "discoveries/mes", closes: "cierres/mes" },
  plan: ({ scenario, n, unit }) => `${scenario}: ${n} ${unit}`,
  needMore: ({ scenario, to, from, unit, ref }) => `${scenario} pide ${to} ${unit}; ${ref} ${from}`,
  needLess: ({ scenario, to, from, unit, ref }) => `${scenario} se queda en ${to} ${unit}; ${ref} ${from}`,
  select: (scenario) => `Ver las hipótesis de ${scenario}`,
  ofTarget: (pct) => `${pct} % del hito`,
  customers: "Centros",
  breakEven: "Break-even",
  costsMissing: "n/d · faltan costes",
  alreadyBreakEven: "ya",
  notInHorizon: "no en el horizonte",
  cashMin: "Caja mínima",
};

const int = (n: number) => formatMonthsNumber(Math.round(n));
const money = (c: number) => (c < 0 ? `(${formatCentsRound(-c)})` : formatCentsRound(c));

/**
 * Los tres escenarios a final del plan como tarjetas (R1): ARR y % del hito, centros, caja mínima, break-even y una
 * línea de «qué hace falta» frente a Tierra (su referencia). Clic o teclado = abrir las hipótesis de ese escenario.
 * El escenario activo lleva el borde en tinta. Negativos en tinta y entre paréntesis (rojo solo en variaciones).
 */
export function ScenarioCards({
  compare,
  active,
  onSelect,
  className,
  labels: labelsProp,
}: {
  compare: Partial<Record<PlanScenarioKey, PlanCompareRow>>;
  active: PlanScenarioKey;
  onSelect: (s: PlanScenarioKey) => void;
  className?: string;
  labels?: Partial<ScenarioCardsLabels>;
}) {
  const labels: ScenarioCardsLabels = {
    ...DEFAULT_SCENARIO_CARDS_LABELS,
    ...labelsProp,
    scenarios: { ...DEFAULT_SCENARIO_CARDS_LABELS.scenarios, ...labelsProp?.scenarios },
    units: { ...DEFAULT_SCENARIO_CARDS_LABELS.units, ...labelsProp?.units },
  };
  const cols = PLAN_SCENARIOS.filter((s) => compare[s]);
  const sample = compare[cols[0]];
  return (
    <section className={cn("flex flex-col gap-3", className)} aria-labelledby="forecast-cards-title">
      <h2 id="forecast-cards-title" className="text-base font-semibold tracking-tight text-foreground">
        {labels.group(sample ? formatMonthAxis(sample.month) : "")}
      </h2>
      <div role="radiogroup" aria-label={labels.scenario} className="grid gap-3 sm:grid-cols-3">
        {cols.map((s) => {
          const c = compare[s] as PlanCompareRow;
          const isActive = s === active;
          const name = labels.scenarios[s];
          const gap = s === "base" ? [] : scenarioGap(compare, "base", s);
          const unit = (d: "discoveries" | "closes") => labels.units[d];
          const own = c.discoveries_per_month !== null ? ({ driver: "discoveries", n: c.discoveries_per_month } as const) : ({ driver: "closes", n: c.closes_per_month } as const);
          const need =
            s === "base"
              ? labels.plan({ scenario: name, n: int(own.n), unit: unit(own.driver) })
              : gap[0]
                ? (gap[0].to >= gap[0].from ? labels.needMore : labels.needLess)({
                    scenario: name,
                    to: int(gap[0].to),
                    from: int(gap[0].from),
                    unit: unit(gap[0].driver),
                    ref: labels.scenarios.base,
                  })
                : null;
          const key = (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(s);
            }
          };
          return (
            <Card
              key={s}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              aria-label={labels.select(name)}
              onClick={() => onSelect(s)}
              onKeyDown={key}
              className={cn(
                "flex cursor-pointer flex-col gap-3 p-5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "border-foreground bg-muted/40",
              )}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="w-4 shrink-0 border-t-2 border-dashed" style={{ borderColor: SCENARIO_COLORS[s] }} aria-hidden="true" />
                {name}
              </div>
              <div>
                <div className="text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums text-foreground">{formatCentsRound(c.arr_dec_cents)}</div>
                <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                  ARR {formatMonthAxis(c.month)}
                  {c.arr_target_pct !== null && ` · ${labels.ofTarget(int(c.arr_target_pct))}`}
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm tabular-nums">
                {c.customers_dec !== null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">{labels.customers}</dt>
                    <dd className="text-foreground">{int(c.customers_dec)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-muted-foreground">{labels.breakEven}</dt>
                  <dd className="text-foreground">
                    {c.costs_missing ? (
                      <a href="#costes-fijos" onClick={(e) => e.stopPropagation()} className="underline decoration-dotted underline-offset-2">
                        {labels.costsMissing}
                      </a>
                    ) : c.break_even_already ? (
                      labels.alreadyBreakEven
                    ) : c.break_even_month ? (
                      formatMonthAxis(c.break_even_month)
                    ) : (
                      labels.notInHorizon
                    )}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">{labels.cashMin}</dt>
                  <dd className="text-foreground">
                    {money(c.cash_min_cents)} <span className="text-xs text-muted-foreground">({formatMonthAxis(c.cash_min_month)})</span>
                  </dd>
                </div>
              </dl>
              {need && <p className="border-t pt-2 text-xs text-muted-foreground tabular-nums">{need}</p>}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

import { useState } from "react";
import { CaretDown, Lightbulb, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { fixedCostBars } from "./forecast-view";
import { formatCentsRound, formatMonthShort } from "./format";
import { COST_CATEGORIES, type CostCategory, type FinancePlan, type PlanSuggestion, type RecurringCost, type RecurringFrequency } from "./types";
import { FINANCE_COLORS } from "./ui";

/** Nombre de cada categoría de coste (la API manda el suyo en `by_category[].label`, que manda). */
export const DEFAULT_COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  cogs_saas: "Coste de servir (SaaS)",
  cogs_servicios: "Coste directo de servicios",
  comercial: "Ventas y marketing",
  id: "I+D",
  general: "Generales y administración",
  personal: "Personal",
  tributos: "Tributos",
  financiero: "Gastos financieros",
  otros: "Otros gastos",
};

export const DEFAULT_FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  monthly: "Mensual",
  quarterly: "Trimestral",
  yearly: "Anual",
};

export interface FixedCostsLabels {
  categories: Record<CostCategory, string>;
  frequencies: Record<RecurringFrequency, string>;
  fixedTitle: string;
  addFixed: string;
  fixedEmpty: string;
  personalReminder: string;
  fallback: (amount: string) => string;
  perMonthAmount: (amount: string) => string;
  perYearAmount: (amount: string) => string;
  byCategory: string;
  dayN: (day: number) => string;
  until: (month: string) => string;
  paused: string;
  editCost: (name: string) => string;
  deleteCost: (name: string) => string;
  suggestionsToggle: (count: number) => string;
  suggestionsHint: string;
  seenMonths: (count: number) => string;
  approxPerMonth: (amount: string) => string;
  add: string;
  addAll: (count: number) => string;
  showLess: string;
  showMore: (count: number) => string;
  confirmTitle: (count: number) => string;
  confirmDesc: string;
  confirmTotal: (amount: string) => string;
  confirmCogs: string;
  cancel: string;
}

export const DEFAULT_FIXED_COSTS_LABELS: FixedCostsLabels = {
  categories: DEFAULT_COST_CATEGORY_LABELS,
  frequencies: DEFAULT_FREQUENCY_LABELS,
  fixedTitle: "Costes fijos",
  addFixed: "Añadir coste fijo",
  fixedEmpty: "Sin costes fijos registrados.",
  personalReminder: "Personal: las nóminas y las cuotas de autónomos de los socios no están en Holded. Añádelas aquí.",
  fallback: (amount) => `Sin costes fijos cargados, el forecast usa el OpEx medio del histórico: ${amount}/mes (estimado, sin personal).`,
  perMonthAmount: (amount) => `${amount}/mes`,
  perYearAmount: (amount) => `${amount}/año (sin IVA)`,
  byCategory: "Por categoría",
  dayN: (day) => `día ${day}`,
  until: (month) => `hasta ${month}`,
  paused: "en pausa",
  editCost: (name) => `Editar ${name}`,
  deleteCost: (name) => `Eliminar ${name}`,
  suggestionsToggle: (count) => `Sugerencias del histórico (${count})`,
  suggestionsHint: "Proveedores con cargos en 3 meses o más, con su media mensual.",
  seenMonths: (count) => `${count} ${count === 1 ? "mes" : "meses"} con cargos`,
  approxPerMonth: (amount) => `≈ ${amount}/mes`,
  add: "Añadir",
  addAll: (count) => `Añadir las ${count}`,
  showLess: "Ver menos",
  showMore: (count) => `Ver ${count} más`,
  confirmTitle: (count) => `¿Añadir estos ${count} costes fijos?`,
  confirmDesc: "Se darán de alta como mensuales, día 1, con IVA del 21 % y desde este mes. Podrás editarlos después.",
  confirmTotal: (amount) => `Total: ${amount}/mes`,
  confirmCogs: "Los costes fijos de coste de servir (COGS) se descuentan del % de coste de servir de los escenarios: no se cuentan dos veces.",
  cancel: "Cancelar",
};

/**
 * Costes fijos del Forecast (sustituye a «Supuestos › Gastos recurrentes»): agrupados por categoría con su
 * total mensual, alta, edición y borrado, y sugerencias del histórico (proveedores recurrentes ≥ 3 meses).
 * Presentacional: los diálogos y las llamadas los pone la página.
 */
export function FixedCosts({
  fixedCosts,
  suggestions,
  onAdd,
  onEdit,
  onDelete,
  onAddSuggestion,
  onAddSuggestions,
  className,
  labels: labelsProp,
}: {
  fixedCosts: FinancePlan["fixed_costs"];
  suggestions: PlanSuggestion[];
  onAdd: () => void;
  onEdit: (c: RecurringCost) => void;
  onDelete: (c: RecurringCost) => void;
  onAddSuggestion: (s: PlanSuggestion) => void;
  /** «Añadir las N»: da de alta de golpe las sugerencias que se ven. */
  onAddSuggestions?: (s: PlanSuggestion[]) => Promise<unknown> | void;
  className?: string;
  labels?: Partial<FixedCostsLabels>;
}) {
  const labels: FixedCostsLabels = {
    ...DEFAULT_FIXED_COSTS_LABELS,
    ...labelsProp,
    categories: { ...DEFAULT_COST_CATEGORY_LABELS, ...labelsProp?.categories },
    frequencies: { ...DEFAULT_FREQUENCY_LABELS, ...labelsProp?.frequencies },
  };
  const [allSuggestions, setAllSuggestions] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const shownSuggestions = allSuggestions ? suggestions : suggestions.slice(0, 5);
  const totals = new Map(fixedCosts.by_category.filter((c) => c.monthly_cents !== 0).map((c) => [c.category, c]));
  const items = fixedCosts.items;
  const cats = COST_CATEGORIES.filter((c) => totals.has(c) || items.some((i) => i.category === c));
  const hasPersonal = items.some((i) => i.category === "personal" && i.active);
  const bars = fixedCostBars(items);
  const monthly = (c: RecurringCost) => c.monthly_equivalent_cents ?? c.amount_cents;

  return (
    <Card id="costes-fijos" className={cn("scroll-mt-20 p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{labels.fixedTitle}</h2>
          <p className="mt-1.5 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums text-foreground">
            {labels.perMonthAmount(formatCentsRound(fixedCosts.monthly_total_cents))}
          </p>
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
            {labels.perYearAmount(formatCentsRound(fixedCosts.annual_total_cents ?? fixedCosts.monthly_total_cents * 12))}
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="size-4" />
          {labels.addFixed}
        </Button>
      </div>

      {(!hasPersonal || fixedCosts.using_history_fallback) && (
        <div className="mt-4 space-y-0.5 border-l-2 border-warning pl-3 text-xs text-muted-foreground">
          {fixedCosts.using_history_fallback && fixedCosts.fallback_monthly_cents !== undefined && (
            <p>{labels.fallback(formatCentsRound(fixedCosts.fallback_monthly_cents))}</p>
          )}
          {!hasPersonal && <p>{fixedCosts.note ?? labels.personalReminder}</p>}
        </div>
      )}

      {bars.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2" aria-label={labels.byCategory}>
          {bars.map((b) => (
            <li key={b.category} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] items-center gap-3 text-sm sm:grid-cols-[12rem_minmax(0,1fr)_auto]">
              <span className="truncate text-foreground">{totals.get(b.category)?.label ?? labels.categories[b.category]}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <span className="block h-full rounded-full" style={{ width: `${Math.max(b.pct, 1)}%`, background: FINANCE_COLORS.in }} />
              </span>
              <span className="text-right tabular-nums text-foreground">{labels.perMonthAmount(formatCentsRound(b.cents))}</span>
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{labels.fixedEmpty}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {cats.map((cat: CostCategory) => {
            const rows = items.filter((i) => i.category === cat);
            const total = totals.get(cat);
            return (
              <section key={cat}>
                <header className="flex items-baseline justify-between gap-3 border-b pb-1.5">
                  <h3 className="text-sm font-medium text-foreground">{total?.label ?? labels.categories[cat]}</h3>
                  {total && <span className="text-sm tabular-nums text-muted-foreground">{labels.perMonthAmount(formatCentsRound(total.monthly_cents))}</span>}
                </header>
                <ul className="divide-y">
                  {rows.map((c) => (
                    <li key={c.id} className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 py-2", !c.active && "opacity-60")}>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {labels.frequencies[c.frequency]} · {labels.dayN(c.day_of_month)}
                          {c.end_month && ` · ${labels.until(formatMonthShort(c.end_month))}`}
                          {!c.active && ` · ${labels.paused}`}
                        </p>
                      </div>
                      <span className="text-sm tabular-nums text-foreground">{labels.perMonthAmount(formatCentsRound(monthly(c)))}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(c)} aria-label={labels.editCost(c.name)}>
                          <PencilSimple className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onDelete(c)} aria-label={labels.deleteCost(c.name)}>
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen} className="mt-6 rounded-xl bg-muted/40">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-4">
            <CollapsibleTrigger className="group flex items-center gap-2 text-sm font-medium text-foreground">
              <Lightbulb className="size-4 text-warning" weight="fill" />
              {labels.suggestionsToggle(suggestions.length)}
              <CaretDown className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            {onAddSuggestions && (
              <Button variant="outline" size="sm" onClick={() => setConfirmAll(true)}>
                <Plus className="size-3.5" />
                {labels.addAll(shownSuggestions.length)}
              </Button>
            )}
          </div>
          <CollapsibleContent className="px-3 pb-3 sm:px-4 sm:pb-4">
            <p className="text-xs text-muted-foreground">{labels.suggestionsHint}</p>
            <ul className="mt-2 divide-y divide-border/60">
              {shownSuggestions.map((s) => (
                <li key={s.supplier} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{s.supplier}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.category_label ?? labels.categories[s.category]} · {labels.seenMonths(s.months_seen)}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{labels.approxPerMonth(formatCentsRound(s.avg_monthly_cents))}</span>
                  <Button variant="outline" size="sm" onClick={() => onAddSuggestion(s)}>
                    <Plus className="size-3.5" />
                    {labels.add}
                  </Button>
                </li>
              ))}
            </ul>
            {suggestions.length > 5 && (
              <button type="button" onClick={() => setAllSuggestions((v) => !v)} className="mt-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                {allSuggestions ? labels.showLess : labels.showMore(suggestions.length - 5)}
              </button>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
      <AlertDialog open={confirmAll} onOpenChange={setConfirmAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.confirmTitle(shownSuggestions.length)}</AlertDialogTitle>
            <AlertDialogDescription>{labels.confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="max-h-64 divide-y overflow-y-auto text-sm">
            {shownSuggestions.map((s) => (
              <li key={s.supplier} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="min-w-0">
                  <span className="block truncate text-foreground">{s.supplier}</span>
                  <span className="block text-xs text-muted-foreground">{s.category_label ?? labels.categories[s.category]}</span>
                </span>
                <span className="tabular-nums text-foreground">{labels.perMonthAmount(formatCentsRound(s.avg_monthly_cents))}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium tabular-nums text-foreground">
            {labels.confirmTotal(formatCentsRound(shownSuggestions.reduce((a, s) => a + s.avg_monthly_cents, 0)))}
          </p>
          <p className="text-xs text-muted-foreground">{labels.confirmCogs}</p>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void onAddSuggestions?.(shownSuggestions)}>{labels.addAll(shownSuggestions.length)}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

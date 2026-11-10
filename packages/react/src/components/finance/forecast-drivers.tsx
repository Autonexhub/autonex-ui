import { useEffect, useState, type ReactNode } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { CushionEditor, type CushionEditorLabels } from "./cushion-editor";
import { funnelFlow, funnelOrderError, histIsBlank, isOverride } from "./forecast-view";
import { capFirst, formatAccounting, formatCentsRound, formatMonthAxis, formatMonthsNumber, parseEurosToCents } from "./format";
import { centsToEurosText, currentMonth, monthChoices } from "./form-inputs";
import { InfoTip } from "./info-tip";
import { PLAN_SCENARIOS, type PlanHire, type PlanLevers, type PlanScenario, type PlanScenarioKey } from "./types";

export interface ForecastDriversLabels {
  scenarios: Record<PlanScenarioKey, string>;
  /** Etiqueta accesible del selector de escenario. */
  scenario: string;
  title: string;
  methodology: string;
  driver: string;
  hist: string;
  histInfo: (months: number) => string;
  overridden: string;
  funnelInfoLabel: string;
  funnelInfo: string;
  groups: { funnel: string; retention: string; costs: string };
  /** Nombre de cada driver (y de las filas calculadas `closes_per_month`, `new_mrr_per_month`, `fixed_costs`). */
  drivers: {
    discoveries_per_month: string;
    demo_rate: string;
    proposal_rate: string;
    close_rate: string;
    centers_per_close: string;
    cents_per_center_month: string;
    churn_pct: string;
    services_cents_per_month: string;
    usage_cents_per_month: string;
    cost_to_serve_pct: string;
    dso_days: string;
    closes_per_month: string;
    new_mrr_per_month: string;
    fixed_costs: string;
  };
  loadFixed: string;
  editFixed: string;
  flowNote: (v: { demos: string; proposals: string }) => string;
  order: { proposal_gt_demo: string; close_gt_proposal: string };
  cushion: string;
  hires: {
    title: string;
    add: string;
    empty: string;
    role: (n: number) => string;
    rolePlaceholder: string;
    cost: string;
    from: string;
    remove: string;
    roleHeader: string;
    costHeader: string;
    fromHeader: string;
  };
  save: (scenario: string) => string;
  saving: string;
  reset: string;
  cushionEditor: Partial<CushionEditorLabels>;
}

export const DEFAULT_FORECAST_DRIVERS_LABELS: ForecastDriversLabels = {
  scenarios: { base: "Tierra", downside: "Infierno", upside: "Cielo" },
  scenario: "Escenario",
  title: "Hipótesis",
  methodology: "Origen de los valores",
  driver: "Driver",
  hist: "hist.",
  histInfo: (months) => `Media de los últimos ${months} meses`,
  overridden: "Distinto del histórico o del escenario guardado",
  funnelInfoLabel: "Cómo se lee el embudo",
  funnelInfo: "Las tasas son acumuladas sobre las discoveries, como en el deck: de cada 100 discoveries, 21 llegan a demo, 15 a propuesta y 10 firman. Cierres = discoveries × tasa de firma.",
  groups: { funnel: "Embudo comercial", retention: "Retención y servicios", costs: "Costes" },
  drivers: {
    discoveries_per_month: "Discoveries / mes",
    demo_rate: "Discovery → demo",
    proposal_rate: "→ propuesta",
    close_rate: "→ firma",
    centers_per_close: "Centros por cierre",
    cents_per_center_month: "€ / centro / mes",
    churn_pct: "Churn mensual",
    services_cents_per_month: "Servicios / mes",
    usage_cents_per_month: "Consumo / mes",
    cost_to_serve_pct: "Coste de servir (% MRR+cons.)",
    dso_days: "Días de cobro",
    closes_per_month: "Cierres / mes",
    new_mrr_per_month: "MRR nuevo / mes",
    fixed_costs: "Costes fijos / mes",
  },
  loadFixed: "cargar ↓",
  editFixed: "editar ↓",
  flowNote: ({ demos, proposals }) => `${demos} demos · ${proposals} propuestas al mes`,
  order: {
    proposal_gt_demo: "La tasa de propuesta no puede superar la de demo (son acumuladas sobre discoveries).",
    close_gt_proposal: "La tasa de firma no puede superar la de propuesta (son acumuladas sobre discoveries).",
  },
  cushion: "Colchón mínimo",
  hires: {
    title: "Equipo",
    add: "Añadir",
    empty: "Sin contrataciones previstas.",
    role: (n) => `Rol ${n}`,
    rolePlaceholder: "Rol",
    cost: "Coste mensual",
    from: "Mes de alta",
    remove: "Quitar contratación",
    roleHeader: "Rol",
    costHeader: "€/mes",
    fromHeader: "Alta",
  },
  save: (scenario) => `Guardar escenario ${scenario}`,
  saving: "Guardando…",
  reset: "Descartar cambios",
  cushionEditor: {},
};

type NumKey = Exclude<keyof PlanLevers, "hires">;
/** int: entero · num: hasta 2 decimales · eur: céntimos · pct: % tal cual (churn) · rate: fracción 0–1 que se edita como % con un decimal. */
type Kind = "int" | "num" | "eur" | "pct" | "rate";
type Driver = { key: NumKey; kind: Kind; max: number };

const FUNNEL_TOP: Driver[] = [
  { key: "discoveries_per_month", kind: "num", max: 1_000_000 },
  { key: "demo_rate", kind: "rate", max: 100 },
  { key: "proposal_rate", kind: "rate", max: 100 },
  { key: "close_rate", kind: "rate", max: 100 },
];
const FUNNEL_VALUE: Driver[] = [
  { key: "centers_per_close", kind: "num", max: 1000 },
  { key: "cents_per_center_month", kind: "eur", max: 10_000_000 },
];
const RETENTION: Driver[] = [
  { key: "churn_pct", kind: "pct", max: 100 },
  { key: "services_cents_per_month", kind: "eur", max: 100_000_000 },
  { key: "usage_cents_per_month", kind: "eur", max: 100_000_000 },
];
const COST_TO_SERVE: Driver = { key: "cost_to_serve_pct", kind: "pct", max: 100 };
const DSO: Driver = { key: "dso_days", kind: "int", max: 365 };

const comma = (n: number) => String(n).replace(".", ",");
/** Fracción → % con un decimal como mucho: 0.21 → «21», 0.215 → «21,5». */
const rateText = (v: number) => comma(Math.round(v * 1000) / 10);

function toText(kind: Kind, v: number | null | undefined): string {
  if (v === null || v === undefined) return "";
  if (kind === "eur") return centsToEurosText(v);
  if (kind === "rate") return rateText(v);
  return comma(v);
}

function parse(kind: Kind, text: string, max: number): number | null {
  const raw = text.trim().replace(/[\s€%]/g, "").replace(".", ",");
  if (kind === "eur") {
    if (/^0+(,0*)?$/.test(raw)) return 0;
    const r = parseEurosToCents(raw, max);
    return r.error ? null : r.cents;
  }
  const re = { int: /^\d{1,6}$/, num: /^\d{1,7}(,\d{1,2})?$/, pct: /^\d{1,3}(,\d{1,2})?$/, rate: /^\d{1,3}(,\d)?$/ }[kind];
  if (!re.test(raw)) return null;
  const n = Number(raw.replace(",", "."));
  if (n < 0 || n > max) return null;
  return kind === "rate" ? Math.round(n * 10) / 1000 : n;
}

function histText(kind: Kind, v: unknown): string {
  if (typeof v !== "number" || histIsBlank(kind, v)) return "–";
  if (kind === "eur") return formatCentsRound(v);
  if (kind === "rate") return `${rateText(v)} %`;
  if (kind === "pct") return `${comma(v)} %`;
  return formatMonthsNumber(v);
}

/** Celda editable: número alineado a la derecha, unidad pegada; tintada si difiere del histórico o del guardado. */
function NumCell({
  id,
  label,
  kind,
  max,
  value,
  onChange,
  tinted,
  tintTitle,
}: {
  id: string;
  label: string;
  kind: Kind;
  max: number;
  value: number | null | undefined;
  onChange: (v: number) => void;
  tinted?: boolean;
  tintTitle?: string;
}) {
  const [text, setText] = useState(toText(kind, value));
  const [bad, setBad] = useState(false);
  useEffect(() => {
    setText((cur) => (parse(kind, cur, max) === value ? cur : toText(kind, value)));
    setBad(false);
  }, [value, kind, max]);
  const unit = kind === "eur" ? "€" : kind === "pct" || kind === "rate" ? "%" : "";
  return (
    <span
      title={tinted ? tintTitle : undefined}
      data-override={tinted || undefined}
      className={cn(
        "flex h-7 items-center justify-end gap-1 rounded-md border px-2 focus-within:border-ring focus-within:bg-background hover:border-ring/60",
        tinted ? "border-border bg-muted font-medium" : "border-transparent bg-muted/40",
        bad && "border-destructive bg-destructive/5",
      )}
    >
      <input
        id={id}
        aria-label={label}
        aria-invalid={bad || undefined}
        inputMode="decimal"
        className="w-full min-w-0 bg-transparent text-right text-sm tabular-nums text-foreground outline-none"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const v = parse(kind, e.target.value, max);
          setBad(v === null);
          if (v !== null) onChange(v);
        }}
      />
      {unit && <span className="text-xs font-normal text-muted-foreground">{unit}</span>}
    </span>
  );
}

function HireRow({ hire, index, onChange, onRemove, labels }: { hire: PlanHire; index: number; onChange: (h: PlanHire) => void; onRemove: () => void; labels: ForecastDriversLabels }) {
  const months = monthChoices([hire.start_month]).filter((m) => m >= currentMonth() || m === hire.start_month);
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-1 pr-2">
        <input
          aria-label={labels.hires.role(index + 1)}
          placeholder={labels.hires.rolePlaceholder}
          className="h-7 w-full min-w-0 rounded-md border border-transparent bg-muted/40 px-2 text-sm outline-none hover:border-border focus:border-ring focus:bg-background"
          value={hire.role}
          onChange={(e) => onChange({ ...hire, role: e.target.value })}
        />
      </td>
      <td className="w-[6.5rem] py-1 pr-2">
        <NumCell id={`hire-${index}`} label={labels.hires.cost} kind="eur" max={100_000_000} value={hire.monthly_cents} onChange={(v) => onChange({ ...hire, monthly_cents: v })} />
      </td>
      <td className="w-[6.5rem] py-1 pr-1">
        <Select value={hire.start_month} onValueChange={(v) => onChange({ ...hire, start_month: v })}>
          <SelectTrigger className="h-7 px-2 text-sm" aria-label={labels.hires.from}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {capFirst(formatMonthAxis(m))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="w-8 py-1">
        <Button variant="ghost" size="icon" className="size-7" onClick={onRemove} aria-label={labels.hires.remove}>
          <Trash className="size-3.5" />
        </Button>
      </td>
    </tr>
  );
}

function GroupHead({ children, aside, first }: { children: ReactNode; aside?: ReactNode; first?: boolean }) {
  return (
    <tr>
      <th colSpan={3} scope="colgroup" className={cn("pb-1 text-left", first ? "pt-2" : "pt-4")}>
        <span className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          {children}
          {aside}
        </span>
      </th>
    </tr>
  );
}

/** Fila calculada («= Cierres / mes»): sin caja de edición, en gris, con su histórico al lado. */
function CalcRow({ label, value, hist, note }: { label: string; value: string; hist: string; note?: string }) {
  return (
    <tr className="border-b last:border-b-0">
      <th scope="row" className="py-1 pr-2 text-left font-normal text-muted-foreground">
        = {label}
        {note && <span className="block text-xs">{note}</span>}
      </th>
      <td className="px-2 py-1 text-right text-sm font-medium tabular-nums text-foreground">{value}</td>
      <td className="py-1 pl-2 text-right text-xs tabular-nums text-muted-foreground">{hist}</td>
    </tr>
  );
}

/**
 * Hipótesis de «Plan y forecast» (spec v3 §4.5): escenario Infierno / Tierra / Cielo y los drivers en tres
 * grupos (embudo comercial, retención y servicios, costes y equipo), cada uno con su valor de los últimos
 * meses en la columna «hist.» y tintado cuando difiere del histórico o del escenario guardado. Presentacional:
 * la página guarda el estado, simula (debounce 300 ms) y persiste con «Guardar escenario».
 */
export function ForecastDrivers({
  scenario,
  onScenario,
  levers,
  saved,
  onChange,
  history,
  historyNotes,
  monthsUsed,
  dirty,
  saving,
  onSave,
  onReset,
  cushionCents,
  onCushionSave,
  fixedCostsMonthlyCents,
  fixedCostsMissing,
  onFixedCosts,
  labels: labelsProp,
}: {
  scenario: PlanScenarioKey;
  onScenario: (s: PlanScenarioKey) => void;
  levers: PlanLevers;
  /** Escenario tal como está guardado (para tintar lo que se ha cambiado). */
  saved?: PlanLevers;
  onChange: (l: PlanLevers) => void;
  history?: Partial<PlanScenario> | null;
  historyNotes?: string[];
  monthsUsed?: number | null;
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onReset: () => void;
  cushionCents: number;
  onCushionSave: (cents: number) => Promise<unknown> | void;
  fixedCostsMonthlyCents: number;
  /** Sin costes fijos cargados (el forecast tira del OpEx medio del histórico). */
  fixedCostsMissing?: boolean;
  /** Lleva al editor de costes fijos (debajo). */
  onFixedCosts?: () => void;
  labels?: Partial<ForecastDriversLabels>;
}) {
  const labels: ForecastDriversLabels = {
    ...DEFAULT_FORECAST_DRIVERS_LABELS,
    ...labelsProp,
    scenarios: { ...DEFAULT_FORECAST_DRIVERS_LABELS.scenarios, ...labelsProp?.scenarios },
    groups: { ...DEFAULT_FORECAST_DRIVERS_LABELS.groups, ...labelsProp?.groups },
    drivers: { ...DEFAULT_FORECAST_DRIVERS_LABELS.drivers, ...labelsProp?.drivers },
    order: { ...DEFAULT_FORECAST_DRIVERS_LABELS.order, ...labelsProp?.order },
    hires: { ...DEFAULT_FORECAST_DRIVERS_LABELS.hires, ...labelsProp?.hires },
  };
  const hires = levers.hires ?? [];
  const set = (k: NumKey, v: number) => onChange({ ...levers, [k]: v });
  const months = monthsUsed ?? 6;
  const flow = funnelFlow(levers);
  const order = funnelOrderError(levers);
  const scenarioName = labels.scenarios[scenario];

  const row = (d: Driver) => {
    const label = labels.drivers[d.key as keyof ForecastDriversLabels["drivers"]];
    const value = levers[d.key] as number | null | undefined;
    const hist = history?.[d.key] as number | null | undefined;
    return (
      <tr key={d.key} className="border-b last:border-b-0">
        <th scope="row" className="py-1 pr-2 text-left font-normal text-foreground">
          <label htmlFor={`driver-${d.key}`}>{label}</label>
        </th>
        <td className="py-1">
          <NumCell
            id={`driver-${d.key}`}
            label={label}
            kind={d.kind}
            max={d.max}
            value={value}
            onChange={(v) => set(d.key, v)}
            tinted={isOverride(value, hist, saved?.[d.key] as number | null | undefined)}
            tintTitle={labels.overridden}
          />
        </td>
        <td className="py-1 pl-2 text-right text-xs tabular-nums text-muted-foreground">{histText(d.kind, hist)}</td>
      </tr>
    );
  };

  const closes = flow ? flow.closes : levers.new_customers_per_month;
  const newMrr = flow ? flow.newMrrCents : Math.round(levers.new_customers_per_month * levers.arpa_new_cents);

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{labels.title}</h2>
          {historyNotes && historyNotes.length > 0 && (
            <InfoTip label={labels.methodology}>
              <ul className="list-disc space-y-0.5 pl-4">
                {historyNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </InfoTip>
          )}
        </div>
        <ToggleGroup type="single" variant="outline" value={scenario} onValueChange={(v) => v && onScenario(v as PlanScenarioKey)} className="w-full" aria-label={labels.scenario}>
          {PLAN_SCENARIOS.map((s) => (
            <ToggleGroupItem key={s} value={s} className="h-8 flex-1 text-xs">
              {labels.scenarios[s]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th scope="col" className="pb-1.5 text-left font-medium">
              {labels.driver}
            </th>
            <th scope="col" className="w-[6.5rem] pb-1.5 text-right font-medium">
              {scenarioName}
            </th>
            <th scope="col" className="w-[4.5rem] pb-1.5 pl-2 text-right font-medium">
              <span title={labels.histInfo(months)}>{labels.hist}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <GroupHead first aside={<InfoTip label={labels.funnelInfoLabel}>{labels.funnelInfo}</InfoTip>}>{labels.groups.funnel}</GroupHead>
          {FUNNEL_TOP.map(row)}
          <CalcRow
            label={labels.drivers.closes_per_month}
            value={formatMonthsNumber(closes)}
            hist={histText("num", history?.closes_per_month)}
            note={flow ? labels.flowNote({ demos: formatMonthsNumber(flow.demos), proposals: formatMonthsNumber(flow.proposals) }) : undefined}
          />
          {FUNNEL_VALUE.map(row)}
          <CalcRow label={labels.drivers.new_mrr_per_month} value={formatCentsRound(newMrr)} hist={histText("eur", history?.new_mrr_cents_per_month)} />
          {order && (
            <tr>
              <td colSpan={3} role="alert" className="pt-1 text-xs text-destructive">
                {labels.order[order]}
              </td>
            </tr>
          )}

          <GroupHead>{labels.groups.retention}</GroupHead>
          {RETENTION.map(row)}

          <GroupHead>{labels.groups.costs}</GroupHead>
          {row(COST_TO_SERVE)}
          <tr className="border-b">
            <th scope="row" className="py-1 pr-2 text-left font-normal text-foreground">
              {labels.drivers.fixed_costs}
            </th>
            <td className="py-1">
              <button
                type="button"
                onClick={onFixedCosts}
                className="flex h-7 w-full items-center justify-end gap-1 rounded-md border border-transparent bg-muted/40 px-2 text-sm tabular-nums hover:border-border"
              >
                {fixedCostsMonthlyCents === 0 ? "0" : formatAccounting(fixedCostsMonthlyCents)}
                <span className="text-xs text-muted-foreground">€</span>
              </button>
            </td>
            <td className="py-1 pl-2 text-right text-xs">
              <button type="button" onClick={onFixedCosts} className={cn("underline-offset-2 hover:underline", fixedCostsMissing ? "text-warning" : "text-muted-foreground")}>
                {fixedCostsMissing ? labels.loadFixed : labels.editFixed}
              </button>
            </td>
          </tr>
          {row(DSO)}
          <tr>
            <th scope="row" className="py-1 pr-2 text-left font-normal text-foreground">
              {labels.cushion}
            </th>
            <td className="py-1 text-right">
              <CushionEditor cushionCents={cushionCents} onSave={onCushionSave} labels={labels.cushionEditor}>
                <button type="button" className="flex h-7 w-full items-center justify-end gap-1 rounded-md border border-transparent bg-muted/40 px-2 text-sm tabular-nums hover:border-border">
                  {formatAccounting(cushionCents)}
                  <span className="text-xs text-muted-foreground">€</span>
                </button>
              </CushionEditor>
            </td>
            <td />
          </tr>
        </tbody>
      </table>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">{labels.hires.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onChange({ ...levers, hires: [...hires, { role: "", monthly_cents: 250000, start_month: currentMonth() }] })}
          >
            <Plus className="size-3.5" />
            {labels.hires.add}
          </Button>
        </div>
        {hires.length === 0 ? (
          <p className="text-xs text-muted-foreground">{labels.hires.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th scope="col" className="pb-1 text-left font-medium">
                  {labels.hires.roleHeader}
                </th>
                <th scope="col" className="pb-1 pr-2 text-right font-medium">
                  {labels.hires.costHeader}
                </th>
                <th scope="col" className="pb-1 text-left font-medium">
                  {labels.hires.fromHeader}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {hires.map((h, i) => (
                <HireRow
                  key={i}
                  index={i}
                  hire={h}
                  onChange={(nh) => onChange({ ...levers, hires: hires.map((x, j) => (j === i ? nh : x)) })}
                  onRemove={() => onChange({ ...levers, hires: hires.filter((_, j) => j !== i) })}
                  labels={labels}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Button size="sm" onClick={onSave} disabled={!dirty || saving || Boolean(order)}>
          {saving ? labels.saving : labels.save(scenarioName)}
        </Button>
        {dirty && (
          <Button size="sm" variant="ghost" onClick={onReset}>
            {labels.reset}
          </Button>
        )}
      </div>
    </Card>
  );
}

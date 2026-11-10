import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DEFAULT_COST_CATEGORY_LABELS, DEFAULT_FREQUENCY_LABELS } from "./fixed-costs";
import { bpToPercentText, centsToEurosText, currentMonth, monthChoices, parseIntInRange, parsePercentToBp } from "./form-inputs";
import { capFirst, formatCents, formatMonthLong, getFinanceLocale, parseEurosToCents, type EurosInputError } from "./format";
import {
  COST_CATEGORIES,
  RECURRING_FREQUENCIES,
  type CostCategory,
  type RecurringCost,
  type RecurringCostInput,
  type RecurringFrequency,
} from "./types";

export interface RecurringCostDialogLabels {
  addTitle: string;
  editTitle: string;
  description: string;
  name: string;
  namePlaceholder: string;
  nameRequired: string;
  category: string;
  categories: Record<CostCategory, string>;
  categoryHints: Record<CostCategory, string>;
  amount: string;
  amountDesc: string;
  amountPlaceholder: string;
  amountError: Record<EurosInputError, string>;
  vat: string;
  vatDesc: string;
  vatError: string;
  frequency: string;
  frequencies: Record<RecurringFrequency, string>;
  day: string;
  dayDesc: string;
  dayError: string;
  months: string;
  monthsDesc: string;
  monthsRequired: string;
  start: string;
  end: string;
  endNone: string;
  endBeforeStart: string;
  active: string;
  activeDesc: string;
  notes: string;
  notesPlaceholder: string;
  cancel: string;
  save: string;
  saving: string;
}

export const DEFAULT_RECURRING_COST_DIALOG_LABELS: RecurringCostDialogLabels = {
  addTitle: "Nuevo gasto recurrente",
  editTitle: "Editar gasto recurrente",
  description: "Es un supuesto: cuenta para el runway y la previsión, no en el PyG real.",
  name: "Nombre",
  namePlaceholder: "Ej: Nómina de Jonnathan",
  nameRequired: "Pon un nombre",
  category: "Categoría",
  categories: DEFAULT_COST_CATEGORY_LABELS,
  categoryHints: {
    cogs_saas: "LLM, voz, telefonía, infraestructura: lo que cuesta servir las suscripciones",
    cogs_servicios: "Coste directo de implantaciones y desarrollos",
    comercial: "Publicidad, herramientas y viajes comerciales",
    id: "I+D, incluidas las APIs de las demos",
    general: "Gestoría, software de oficina, seguros, bancos",
    personal: "Nóminas, Seguridad Social y autónomos",
    tributos: "Impuestos y tasas (no el IVA)",
    financiero: "Intereses y comisiones de préstamos",
    otros: "Amortizaciones y lo demás",
  },
  amount: "Importe sin IVA",
  amountDesc: "Lo que se paga cada vez, sin IVA.",
  amountPlaceholder: "1.250,00",
  amountError: {
    empty: "Pon el importe",
    format: "Escribe el importe como 1.250,50",
    decimals: "Como mucho dos decimales",
    notPositive: "El importe tiene que ser mayor que 0",
    tooBig: "El importe es demasiado alto",
  },
  vat: "IVA soportado",
  vatDesc: "0 en nóminas y Seguridad Social.",
  vatError: "Entre 0 y 100, con dos decimales como mucho",
  frequency: "Frecuencia",
  frequencies: DEFAULT_FREQUENCY_LABELS,
  day: "Día de pago",
  dayDesc: "Día del mes en que sale del banco.",
  dayError: "Un día entre 1 y 31",
  months: "Meses en que se paga",
  monthsDesc: "Marca los meses del año en que toca.",
  monthsRequired: "Marca al menos un mes",
  start: "Desde",
  end: "Hasta",
  endNone: "Sin fecha de fin",
  endBeforeStart: "El fin no puede ser anterior al inicio",
  active: "Activo",
  activeDesc: "Si lo pausas, deja de contar sin borrarlo.",
  notes: "Notas",
  notesPlaceholder: "Ej: sube un 3 % en enero",
  cancel: "Cancelar",
  save: "Guardar",
  saving: "Guardando…",
};

const NO_END = "__none__";
const MAX_CENTS = 100_000_000_00; // 100 M€: tope de cordura, la API valida el suyo.

const monthName = (m: number) => new Intl.DateTimeFormat(getFinanceLocale(), { month: "short" }).format(new Date(2026, m - 1, 1));

/**
 * Alta y edición de un gasto recurrente (Supuestos). Formulario en diálogo centrado, como todos los del
 * panel (DesignRules › Dialogs). Presentacional: guarda con `onSubmit` y los errores por campo de la API
 * (ApiError.errors) salen en su campo.
 */
export function RecurringCostDialog({
  open,
  onOpenChange,
  cost,
  initial,
  onSubmit,
  labels: labelsProp,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = alta. */
  cost: RecurringCost | null;
  /** Valores de partida para un alta (p. ej. una sugerencia del histórico: proveedor, categoría e importe). */
  initial?: Partial<RecurringCostInput> | null;
  /** Si rechaza con un error que lleve `errors` (campo → mensaje; p. ej. `ApiError`), salen en su campo. */
  onSubmit: (input: RecurringCostInput) => Promise<unknown>;
  labels?: Partial<RecurringCostDialogLabels>;
}) {
  const labels: RecurringCostDialogLabels = {
    ...DEFAULT_RECURRING_COST_DIALOG_LABELS,
    ...labelsProp,
    categories: { ...DEFAULT_RECURRING_COST_DIALOG_LABELS.categories, ...labelsProp?.categories },
    categoryHints: { ...DEFAULT_RECURRING_COST_DIALOG_LABELS.categoryHints, ...labelsProp?.categoryHints },
    amountError: { ...DEFAULT_RECURRING_COST_DIALOG_LABELS.amountError, ...labelsProp?.amountError },
    frequencies: { ...DEFAULT_RECURRING_COST_DIALOG_LABELS.frequencies, ...labelsProp?.frequencies },
  };
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CostCategory>("personal");
  const [amountText, setAmountText] = useState("");
  const [vatText, setVatText] = useState("21");
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [dayText, setDayText] = useState("1");
  const [months, setMonths] = useState<number[]>([]);
  const [start, setStart] = useState(currentMonth());
  const [end, setEnd] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const seed = cost ?? initial ?? null;
    setName(seed?.name ?? "");
    setCategory(seed?.category ?? "personal");
    setAmountText(seed?.amount_cents !== undefined ? centsToEurosText(seed.amount_cents) : "");
    setVatText(cost ? bpToPercentText(cost.vat_basis_points) : "21");
    setFrequency(cost?.frequency ?? "monthly");
    setDayText(String(cost?.day_of_month ?? 1));
    setMonths(cost?.months_of_year ?? []);
    setStart(cost?.start_month ?? currentMonth());
    setEnd(cost?.end_month ?? null);
    setActive(cost?.active ?? true);
    setNotes(cost?.notes ?? "");
    setTouched(false);
    setApiErrors({});
  }, [open, cost, initial]);

  const amount = parseEurosToCents(amountText, MAX_CENTS);
  const vat = parsePercentToBp(vatText);
  const day = parseIntInRange(dayText, 1, 31);
  const needsMonths = frequency !== "monthly";

  const nameError = touched && name.trim() === "" ? labels.nameRequired : (apiErrors.name ?? null);
  const amountError = touched && amount.error !== null ? labels.amountError[amount.error] : (apiErrors.amount_cents ?? null);
  const vatError = touched && vat === null ? labels.vatError : (apiErrors.vat_basis_points ?? null);
  const dayError = touched && day === null ? labels.dayError : (apiErrors.day_of_month ?? null);
  const monthsError = touched && needsMonths && months.length === 0 ? labels.monthsRequired : (apiErrors.months_of_year ?? null);
  const endError = end !== null && end < start ? labels.endBeforeStart : (apiErrors.end_month ?? null);

  const submit = async () => {
    setTouched(true);
    if (name.trim() === "") return nameRef.current?.focus();
    if (amount.cents === null) return amountRef.current?.focus();
    if (vat === null || day === null || (needsMonths && months.length === 0) || endError) return;
    if (pending) return;
    setPending(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        amount_cents: amount.cents,
        vat_basis_points: vat,
        frequency,
        day_of_month: day,
        months_of_year: needsMonths ? [...months].sort((a, b) => a - b) : [],
        start_month: start,
        end_month: end,
        active,
        notes: notes.trim(),
      });
      onOpenChange(false);
    } catch (e) {
      const errors = (e as { errors?: Record<string, string> } | null)?.errors;
      if (errors && typeof errors === "object") setApiErrors(errors);
    } finally {
      setPending(false);
    }
  };

  const monthsList = monthChoices([start, end]);
  const id = (k: string) => `finance-cost-${k}`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !pending && onOpenChange(false)}>
      <DialogContent showCloseButton={!pending} data-testid="recurring-cost-dialog">
        <DialogHeader>
          <DialogTitle>{cost ? labels.editTitle : labels.addTitle}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form
          id="finance-cost-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={nameError ? true : undefined}>
                <FieldLabel htmlFor={id("name")}>{labels.name}</FieldLabel>
                <Input
                  ref={nameRef}
                  id={id("name")}
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={labels.namePlaceholder}
                  disabled={pending}
                  aria-invalid={nameError ? true : undefined}
                />
                {nameError && <FieldError>{nameError}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor={id("category")}>{labels.category}</FieldLabel>
                <Select value={category} onValueChange={(v) => setCategory(v as CostCategory)} disabled={pending}>
                  <SelectTrigger id={id("category")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COST_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {labels.categories[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{labels.categoryHints[category]}</FieldDescription>
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={amountError ? true : undefined}>
                <FieldLabel htmlFor={id("amount")}>{labels.amount}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    ref={amountRef}
                    id={id("amount")}
                    inputMode="decimal"
                    autoComplete="off"
                    value={amountText}
                    onChange={(e) => setAmountText(e.target.value)}
                    placeholder={labels.amountPlaceholder}
                    disabled={pending}
                    aria-invalid={amountError ? true : undefined}
                    className="tabular-nums"
                  />
                  <InputGroupAddon align="inline-end">€</InputGroupAddon>
                </InputGroup>
                {amountError ? (
                  <FieldError>{amountError}</FieldError>
                ) : (
                  <FieldDescription aria-live="polite">
                    {amount.cents !== null ? formatCents(amount.cents) : labels.amountDesc}
                  </FieldDescription>
                )}
              </Field>
              <Field data-invalid={vatError ? true : undefined}>
                <FieldLabel htmlFor={id("vat")}>{labels.vat}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={id("vat")}
                    inputMode="decimal"
                    autoComplete="off"
                    value={vatText}
                    onChange={(e) => setVatText(e.target.value)}
                    placeholder="21"
                    disabled={pending}
                    aria-invalid={vatError ? true : undefined}
                    className="tabular-nums"
                  />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                {vatError ? <FieldError>{vatError}</FieldError> : <FieldDescription>{labels.vatDesc}</FieldDescription>}
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={id("frequency")}>{labels.frequency}</FieldLabel>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurringFrequency)} disabled={pending}>
                  <SelectTrigger id={id("frequency")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRING_FREQUENCIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {labels.frequencies[f]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field data-invalid={dayError ? true : undefined}>
                <FieldLabel htmlFor={id("day")}>{labels.day}</FieldLabel>
                <Input
                  id={id("day")}
                  inputMode="numeric"
                  value={dayText}
                  onChange={(e) => setDayText(e.target.value)}
                  placeholder="1"
                  disabled={pending}
                  aria-invalid={dayError ? true : undefined}
                  className="tabular-nums"
                />
                {dayError ? <FieldError>{dayError}</FieldError> : <FieldDescription>{labels.dayDesc}</FieldDescription>}
              </Field>
            </div>

            {needsMonths && (
              <Field data-invalid={monthsError ? true : undefined}>
                <FieldLabel id={id("months-label")}>{labels.months}</FieldLabel>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  value={months.map(String)}
                  onValueChange={(v) => setMonths(v.map(Number))}
                  aria-labelledby={id("months-label")}
                  className="flex flex-wrap justify-start"
                  disabled={pending}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <ToggleGroupItem key={m} value={String(m)} className="h-8 min-w-12 px-2 capitalize">
                      {monthName(m)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {monthsError ? <FieldError>{monthsError}</FieldError> : <FieldDescription>{labels.monthsDesc}</FieldDescription>}
              </Field>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={id("start")}>{labels.start}</FieldLabel>
                <Select value={start} onValueChange={setStart} disabled={pending}>
                  <SelectTrigger id={id("start")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthsList.map((m) => (
                      <SelectItem key={m} value={m}>
                        {capFirst(formatMonthLong(m))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field data-invalid={endError ? true : undefined}>
                <FieldLabel htmlFor={id("end")}>{labels.end}</FieldLabel>
                <Select value={end ?? NO_END} onValueChange={(v) => setEnd(v === NO_END ? null : v)} disabled={pending}>
                  <SelectTrigger id={id("end")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_END}>{labels.endNone}</SelectItem>
                    {monthsList.map((m) => (
                      <SelectItem key={m} value={m}>
                        {capFirst(formatMonthLong(m))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {endError && <FieldError>{endError}</FieldError>}
              </Field>
            </div>

            <Field orientation="horizontal" className="items-center justify-between">
              <div>
                <FieldLabel htmlFor={id("active")}>{labels.active}</FieldLabel>
                <FieldDescription>{labels.activeDesc}</FieldDescription>
              </div>
              <Switch id={id("active")} checked={active} onCheckedChange={setActive} disabled={pending} />
            </Field>

            <Field>
              <FieldLabel htmlFor={id("notes")}>{labels.notes}</FieldLabel>
              <Textarea
                id={id("notes")}
                value={notes}
                maxLength={500}
                rows={2}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={labels.notesPlaceholder}
                disabled={pending}
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
            {labels.cancel}
          </Button>
          <Button type="submit" form="finance-cost-form" disabled={pending}>
            {pending ? labels.saving : labels.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, CaretDown as ChevronDown, Check } from "@phosphor-icons/react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  isBefore,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export type DateRangePreset = Preset;
type Preset = {
  label: string;
  getValue: () => DateRange;
};

// Core presets shared everywhere (kept short on purpose). Any org-specific
// preset — e.g. "Ciclo de corte" — is injected via the `extraPresets` prop.
// Labels are localized at render time (see getCorePresets) since this file
// is module scope and has no access to the `t()` function here.
export interface DateRangeFilterLabels {
  presets: { currentMonth: string; last7Days: string; last30Days: string; last12Months: string; currentYear: string };
  operators: { between: string; on: string; before: string; after: string };
  selectRange: string;
  custom: string;
}

export const defaultDateRangeFilterLabels: DateRangeFilterLabels = {
  presets: {
    currentMonth: "Mes actual",
    last7Days: "Últimos 7 días",
    last30Days: "Últimos 30 días",
    last12Months: "Últimos 12 meses",
    currentYear: "Año actual",
  },
  operators: { between: "Está entre", on: "Es", before: "Antes de", after: "Después de" },
  selectRange: "Seleccionar rango de fechas",
  custom: "Personalizado",
};

const getCorePresets = (l: DateRangeFilterLabels): Preset[] => [
  {
    label: l.presets.currentMonth,
    getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
  {
    label: l.presets.last7Days,
    getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: l.presets.last30Days,
    getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: l.presets.last12Months,
    getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
  },
  {
    label: l.presets.currentYear,
    getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }),
  },
];

// Operators mirror the dynamic-list filters (SegmentFilterEditor).
type Operator = "between" | "on" | "before" | "after";
const getOperators = (l: DateRangeFilterLabels): { value: Operator; label: string }[] => [
  { value: "between", label: l.operators.between },
  { value: "on", label: l.operators.on },
  { value: "before", label: l.operators.before },
  { value: "after", label: l.operators.after },
];

interface DateRangeFilterProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  /** Minimum selectable date — dates before this are disabled. */
  minDate?: Date | string | null;
  /** Org-specific presets prepended to the list (e.g. "Ciclo de corte"). */
  extraPresets?: Preset[];
  /** Textos (por defecto, español). La app los inyecta traducidos. */
  labels?: DateRangeFilterLabels;
}

export function DateRangeFilter({
  date: externalDate,
  onDateChange,
  minDate,
  extraPresets,
  labels = defaultDateRangeFilterLabels,
}: DateRangeFilterProps) {
  // Default for UNCONTROLLED usages (no `date`/`onDateChange`). Controlled
  // usages ignore this. Kept non-empty so those filters render a sensible range.
  const [internalDate, setInternalDate] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(new Date()),
    to: new Date(),
  }));
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [operator, setOperator] = useState<Operator>("between");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const date = externalDate !== undefined ? externalDate : internalDate;
  const setDate = onDateChange || setInternalDate;

  const presets = useMemo(
    () => [...(extraPresets ?? []), ...getCorePresets(labels)],
    [extraPresets, labels]
  );

  const parsedMinDate = useMemo(() => {
    if (!minDate) return undefined;
    if (minDate instanceof Date) return startOfDay(minDate);
    return startOfDay(new Date(minDate));
  }, [minDate]);

  const disabledDays = useMemo(
    () => (parsedMinDate ? { before: parsedMinDate } : undefined),
    [parsedMinDate]
  );

  const clampStart = (range: DateRange): DateRange => {
    if (parsedMinDate && range.from && isBefore(range.from, parsedMinDate)) {
      return { ...range, from: parsedMinDate };
    }
    return range;
  };

  const applyPreset = (preset: Preset) => {
    setDate(clampStart(preset.getValue()));
    setActiveLabel(preset.label);
    setCustomOpen(false);
    setOpen(false);
  };

  // Turn a single-day selection into a range according to the operator.
  const floor = parsedMinDate ?? startOfDay(subYears(new Date(), 3));
  const handleSingleSelect = (day: Date | undefined) => {
    if (!day) return;
    const d = startOfDay(day);
    let range: DateRange;
    if (operator === "on") range = { from: d, to: d };
    else if (operator === "before") range = { from: floor, to: d };
    else range = { from: d, to: startOfDay(new Date()) }; // after
    setDate(clampStart(range));
    setActiveLabel(null);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDate(range ? clampStart(range) : undefined);
    setActiveLabel(null);
  };

  const triggerLabel = () => {
    if (!date?.from) return <span>{labels.selectRange}</span>;
    const from = format(date.from, "dd/MM/yyyy", { locale: es });
    if (!date.to || +startOfDay(date.from) === +startOfDay(date.to)) {
      return <>{from}</>;
    }
    return (
      <>
        {from} - {format(date.to, "dd/MM/yyyy", { locale: es })}
      </>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal min-w-[240px]",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {triggerLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2" align="end">
        {/* Presets */}
        <div className="flex flex-col gap-0.5">
          {presets.map((preset) => {
            const active = activeLabel === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-foreground hover:bg-accent/60"
                )}
              >
                {preset.label}
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        <div className="my-2 border-t border-border" />

        {/* Custom (operator + contextual calendar) */}
        <button
          type="button"
          onClick={() => setCustomOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-accent/60",
            customOpen && "font-medium"
          )}
        >
          {labels.custom}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 ease-out",
              customOpen ? "rotate-180" : ""
            )}
          />
        </button>

        {customOpen && (
          <div className="mt-2 space-y-2">
            <Select
              value={operator}
              onValueChange={(v) => setOperator(v as Operator)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getOperators(labels).map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-center rounded-md border border-border">
              {operator === "between" ? (
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleRangeSelect}
                  numberOfMonths={1}
                  locale={es}
                  className="pointer-events-auto"
                  disabled={disabledDays}
                  fromDate={parsedMinDate}
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={date?.to ?? date?.from}
                  onSelect={handleSingleSelect}
                  numberOfMonths={1}
                  locale={es}
                  className="pointer-events-auto"
                  disabled={disabledDays}
                  fromDate={parsedMinDate}
                />
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowsDownUp,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Columns,
  Funnel,
  MagnifyingGlass,
  Rows,
} from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { DatePicker } from "../ui/date-picker";
import { cn } from "../../lib/utils";
import { ActiveFilters, type ActiveFilter } from "./active-filters";

/* ─────────────────────────────── Tipos ─────────────────────────────── */

export type FilterValue = string | number;

/** Valor especial de un campo: "sin valor" (null, vacío). Lo entiende `applyLocalFilters`. */
export const FILTER_NULL = "__null__";

export interface FilterBarOption<V extends FilterValue = FilterValue> {
  value: V;
  label: string;
  icon?: ReactNode;
  color?: string;
}

export interface FilterField<V extends FilterValue = FilterValue> {
  /** Clave del campo. Sin ":" (se usa en el id de las píldoras). */
  key: string;
  label: string;
  icon?: ReactNode;
  options: FilterBarOption<V>[];
  /** Varias a la vez (casillas) o una sola (check). Por defecto, varias. */
  multi?: boolean;
  /** false = el campo siempre tiene valor o "nada elegido" ya es "todos": sin la opción "Sin …". */
  nullable?: boolean;
  /**
   * Valor que se aplica mientras no se haya elegido nada. El botón lo muestra siempre ("Tarifa: Abonado"),
   * siempre en línea (nunca en "Más filtros"), sin píldora y NO cuenta como filtro activo. Pensado para un campo
   * de un solo valor que cambia qué se enseña pero no qué filas hay.
   */
  defaultValue?: V;
}

export interface SortOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface GroupByOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export type FilterDatePreset =
  | "all"
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom";

/** Rango de fechas del filtro. `from`/`to` en "YYYY-MM-DD" (solo con `preset: 'custom'`). */
export interface FilterDateRange {
  preset?: FilterDatePreset;
  from?: string;
  to?: string;
}

export interface FilterBarState {
  query?: string;
  /** Valores elegidos por campo (`FILTER_NULL` = "Sin …"). */
  values: Record<string, FilterValue[]>;
  sort?: string;
  groupBy?: string;
  dateField?: string;
  dateRange?: FilterDateRange;
  visibleColumns?: string[];
}

/**
 * Píldora propia de la app para un filtro que no es un campo (p. ej. un interruptor "Recurrentes" puesto en
 * `leadingSlot`). `clear` devuelve el estado sin ese filtro; se usa al pulsar su aspa y en "Limpiar todo".
 */
export interface FilterBarExtraChip<S extends FilterBarState = FilterBarState> {
  id: string;
  label: string;
  clear: (state: S) => S;
}

export interface FilterBarLabels {
  search: string;
  searchChip: (query: string) => string;
  withoutField: (field: string) => string;
  searchField: (field: string) => string;
  noResults: string;
  clearSelection: string;
  clearFilter: string;
  moreFilters: string;
  back: string;
  groupBy: (label: string) => string;
  none: string;
  sort: string;
  columns: string;
  date: string;
  field: string;
  from: string;
  to: string;
  pickDate: string;
  clearAll: string;
  remove: string;
  edit: string;
  datePresets: Record<FilterDatePreset, string>;
}

export const defaultFilterBarLabels: FilterBarLabels = {
  search: "Buscar…",
  searchChip: (q) => `Búsqueda: «${q}»`,
  withoutField: (f) => `Sin ${f.toLowerCase()}`,
  searchField: (f) => `Buscar ${f.toLowerCase()}…`,
  noResults: "Sin resultados.",
  clearSelection: "Limpiar selección",
  clearFilter: "Limpiar filtro",
  moreFilters: "Más filtros",
  back: "Volver",
  groupBy: (l) => `Agrupar: ${l}`,
  none: "Ninguno",
  sort: "Orden",
  columns: "Columnas",
  date: "Fecha",
  field: "Campo",
  from: "Desde",
  to: "Hasta",
  pickDate: "Elegir fecha",
  clearAll: "Limpiar todo",
  remove: "Quitar",
  edit: "Cambiar",
  datePresets: {
    all: "Todo el tiempo",
    today: "Hoy",
    yesterday: "Ayer",
    this_week: "Esta semana",
    last_week: "Semana pasada",
    this_month: "Este mes",
    last_month: "Mes pasado",
    custom: "Personalizado",
  },
};

export interface FilterBarProps<S extends FilterBarState = FilterBarState> {
  fields: FilterField[];
  sorts?: SortOption[];
  groupBys?: GroupByOption[];
  dateFields?: Array<{ value: string; label: string }>;
  columns?: Array<{ key: string; label: string }>;
  value: S;
  onChange: (value: S) => void;
  /** Controles pegados al buscador, antes de los filtros de datos. */
  leadingSlot?: ReactNode;
  /** Al final de la fila, tras los controles de vista. */
  rightSlot?: ReactNode;
  /** Píldoras de filtros propios de la app (ver `FilterBarExtraChip`). */
  extraChips?: FilterBarExtraChip<S>[];
  /** Campos visibles en la fila antes de pasar a "Más filtros". Por defecto 3. */
  inlineLimit?: number;
  /** Buscador en los menús solo con MÁS de este número de opciones. Por defecto 7. */
  searchThreshold?: number;
  /** Ocultar el buscador de texto. */
  hideSearch?: boolean;
  disabled?: boolean;
  /** Textos (por defecto, español). Se mezclan con los de por defecto. */
  labels?: Partial<FilterBarLabels>;
  className?: string;
}

const DATE_PRESETS: FilterDatePreset[] = ["all", "today", "yesterday", "this_week", "last_week", "this_month", "last_month", "custom"];
const DATE_KEY = "__date__";
const QUERY_CHIP = "query";
const DATE_CHIP = "date";
const EXTRA_PREFIX = "x:";
const activeClass = "bg-muted/50 border-foreground/20 text-foreground";

/* ─────────────────────────────── FilterBar ─────────────────────────────── */

/**
 * Barra de filtros de una lista: buscador, filtros por campo, fecha, Agrupar, Orden, Columnas y "Más filtros".
 *
 * - Lo filtrado sale debajo como píldoras (`ActiveFilters`) con su aspa y "Limpiar todo".
 * - Pulsar una píldora reabre ese filtro para cambiarlo (como Linear), aunque viva en "Más filtros".
 * - Los botones NO se mueven al marcar: el texto no cambia, solo aparece un número en un hueco reservado; el orden
 *   de los campos es fijo.
 * - Todos los menús son `Command` del sistema; el buscador sale solo con más de 7 opciones.
 *
 * Controlado: `value` + `onChange`. Los textos llegan por `labels` (el paquete no depende de i18n).
 */
export function FilterBar<S extends FilterBarState = FilterBarState>({
  fields,
  sorts,
  groupBys,
  dateFields,
  columns,
  value,
  onChange,
  leadingSlot,
  rightSlot,
  extraChips,
  inlineLimit = 3,
  searchThreshold = 7,
  hideSearch,
  disabled,
  labels: labelsProp,
  className,
}: FilterBarProps<S>) {
  const labels: FilterBarLabels = {
    ...defaultFilterBarLabels,
    ...labelsProp,
    datePresets: { ...defaultFilterBarLabels.datePresets, ...labelsProp?.datePresets },
  };
  // Píldora pulsada → se abre el desplegable de ese campo (en la barra o dentro de "Más filtros").
  const [openKey, setOpenKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleValue = (key: string, val: FilterValue) => {
    const current = value.values[key] ?? [];
    const multi = fields.find((f) => f.key === key)?.multi ?? true;
    const next = multi
      ? current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
      : current.includes(val) ? [] : [val];
    onChange({ ...value, values: { ...value.values, [key]: next } });
  };

  const clearField = (key: string) => {
    const next = { ...value.values };
    delete next[key];
    onChange({ ...value, values: next });
  };

  const clearAll = () => {
    let next: S = { ...value, values: {}, query: undefined, dateRange: { preset: "all" } };
    for (const c of extraChips ?? []) next = c.clear(next);
    onChange(next);
  };

  const chips: ActiveFilter[] = [];
  const query = (value.query ?? "").trim();
  if (query && !hideSearch) chips.push({ id: QUERY_CHIP, label: labels.searchChip(query) });
  for (const f of fields) {
    if (f.defaultValue !== undefined) continue; // fijo: no es un filtro que se quite
    for (const v of value.values[f.key] ?? []) {
      const label = v === FILTER_NULL
        ? labels.withoutField(f.label)
        : `${f.label}: ${f.options.find((o) => o.value === v)?.label ?? String(v)}`;
      chips.push({ id: `${f.key}:${String(v)}`, label });
    }
  }
  const datePreset = value.dateRange?.preset;
  if (datePreset && datePreset !== "all") {
    const field = dateFields?.find((d) => d.value === value.dateField)?.label;
    const presetLabel = dateChipLabel(value.dateRange!, labels);
    chips.push({ id: DATE_CHIP, label: field ? `${field}: ${presetLabel}` : presetLabel });
  }
  for (const c of extraChips ?? []) chips.push({ id: EXTRA_PREFIX + c.id, label: c.label });

  const removeChip = (id: string) => {
    if (id === QUERY_CHIP) return onChange({ ...value, query: undefined });
    if (id === DATE_CHIP) return onChange({ ...value, dateRange: { preset: "all" } });
    if (id.startsWith(EXTRA_PREFIX)) {
      const c = extraChips?.find((x) => x.id === id.slice(EXTRA_PREFIX.length));
      if (c) onChange(c.clear(value));
      return;
    }
    const i = id.indexOf(":");
    const key = id.slice(0, i);
    const raw = id.slice(i + 1);
    onChange({ ...value, values: { ...value.values, [key]: (value.values[key] ?? []).filter((v) => String(v) !== raw) } });
  };

  const selectChip = (id: string) => {
    if (id === QUERY_CHIP) { searchRef.current?.focus(); return; }
    if (id === DATE_CHIP) { setOpenKey(DATE_KEY); return; }
    setOpenKey(id.slice(0, id.indexOf(":")));
  };

  // Orden FIJO: un filtro con algo elegido no se adelanta ni sale de "Más filtros" (si no, la barra salta a cada
  // clic). Los fijos (`defaultValue`) van siempre en línea.
  const pinnedFields = fields.filter((f) => f.defaultValue !== undefined);
  const looseFields = fields.filter((f) => f.defaultValue === undefined);
  const inlineFields = [...looseFields.slice(0, inlineLimit), ...pinnedFields];
  const overflowFields = looseFields.slice(inlineLimit);

  return (
    <div className={cn("mb-6", className)}>
      {/* UNA fila: buscador que crece → leadingSlot → filtros de datos → (ml-auto) vista. Si no cabe, flex-wrap la
          parte en dos filas coherentes; nunca scroll horizontal. Altura canónica: buscador h-10 y botones por
          defecto del átomo. */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {!hideSearch && (
          <InputGroup className="relative h-10 min-w-[180px] flex-1">
            <InputGroupAddon className="pl-2">
              <MagnifyingGlass className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              placeholder={labels.search}
              aria-label={labels.search}
              value={value.query ?? ""}
              disabled={disabled}
              onChange={(e) => onChange({ ...value, query: e.target.value || undefined })}
            />
          </InputGroup>
        )}

        {leadingSlot}

        {inlineFields.map((f) => (
          <FieldFilter
            key={f.key}
            field={f}
            selected={value.values[f.key] ?? []}
            onToggle={(v) => toggleValue(f.key, v)}
            onClear={() => clearField(f.key)}
            open={openKey === f.key}
            onOpenChange={(o) => setOpenKey(o ? f.key : null)}
            labels={labels}
            searchThreshold={searchThreshold}
            disabled={disabled}
          />
        ))}

        {dateFields && dateFields.length > 0 && (
          <DateFilter
            dateFields={dateFields}
            field={value.dateField ?? dateFields[0].value}
            range={value.dateRange ?? { preset: "all" }}
            onChange={(dateField, dateRange) => onChange({ ...value, dateField, dateRange })}
            open={openKey === DATE_KEY}
            onOpenChange={(o) => setOpenKey(o ? DATE_KEY : null)}
            labels={labels}
            disabled={disabled}
          />
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {groupBys && groupBys.length > 0 && (
            <ChoiceMenu
              trigger={<><Rows className="h-4 w-4" /> {labels.groupBy(groupBys.find((g) => g.value === value.groupBy)?.label ?? labels.none)}</>}
              items={groupBys}
              selected={value.groupBy}
              onSelect={(v) => onChange({ ...value, groupBy: v === value.groupBy ? undefined : v })}
              disabled={disabled}
            />
          )}

          {sorts && sorts.length > 0 && (
            <ChoiceMenu
              trigger={<><ArrowsDownUp className="h-4 w-4" /> {sorts.find((s) => s.value === value.sort)?.label ?? labels.sort}</>}
              items={sorts}
              selected={value.sort}
              onSelect={(v) => onChange({ ...value, sort: v })}
              disabled={disabled}
            />
          )}

          {columns && columns.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1" disabled={disabled}>
                  <Columns className="h-4 w-4" /> {labels.columns}
                  <CaretDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {columns.map((c) => {
                        const current = value.visibleColumns ?? columns.map((x) => x.key);
                        const visible = current.includes(c.key);
                        return (
                          <CommandItem
                            key={c.key}
                            value={`${c.label} ${c.key}`}
                            aria-checked={visible}
                            onSelect={() => {
                              const next = visible ? current.filter((k) => k !== c.key) : [...current, c.key];
                              onChange({ ...value, visibleColumns: next });
                            }}
                          >
                            <Checkbox checked={visible} tabIndex={-1} aria-hidden className="pointer-events-none" />
                            <span className="flex-1 truncate">{c.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {overflowFields.length > 0 && (
            <OverflowFilters
              fields={overflowFields}
              values={value.values}
              onToggle={toggleValue}
              onClear={clearField}
              focusKey={openKey && overflowFields.some((f) => f.key === openKey) ? openKey : null}
              onFocusConsumed={() => setOpenKey(null)}
              labels={labels}
              searchThreshold={searchThreshold}
              disabled={disabled}
            />
          )}
          {rightSlot}
        </div>
      </div>
      {chips.length > 0 && (
        <div className={cn("mt-3", disabled && "pointer-events-none opacity-60")}>
          <ActiveFilters
            filters={chips}
            onRemove={removeChip}
            onClearAll={clearAll}
            clearAllLabel={labels.clearAll}
            removeLabel={labels.remove}
            editLabel={labels.edit}
            isSelectable={(id) => !id.startsWith(EXTRA_PREFIX)}
            onSelect={selectChip}
          />
        </div>
      )}
    </div>
  );
}

function dateChipLabel(range: FilterDateRange, labels: FilterBarLabels) {
  if (range.preset === "custom" && (range.from || range.to)) {
    const fmt = (iso?: string) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString() : "…");
    return `${fmt(range.from)} – ${fmt(range.to)}`;
  }
  return labels.datePresets[range.preset ?? "all"];
}

/* ─────────────────────────────── Piezas ─────────────────────────────── */

/** Menú de una sola elección (Ordenar, Agrupar por) con ítems del sistema (`CommandItem`). */
function ChoiceMenu({ trigger, items, selected, onSelect, disabled }: {
  trigger: ReactNode;
  items: Array<{ value: string; label: string; icon?: ReactNode }>;
  selected?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-1" disabled={disabled}>
          {trigger}
          <CaretDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              {items.map((it) => (
                <CommandItem
                  key={it.value}
                  value={`${it.label} ${it.value}`}
                  onSelect={() => { onSelect(it.value); setOpen(false); }}
                >
                  {it.icon}
                  <span className="flex-1">{it.label}</span>
                  {selected === it.value && <Check className="h-3.5 w-3.5" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Lista de opciones de un campo (botón en línea o paso 2 de "Más filtros"). */
function FieldOptions({ field, selected, onToggle, onClear, onPicked, pinned, labels, searchThreshold }: {
  field: FilterField;
  selected: FilterValue[];
  onToggle: (v: FilterValue) => void;
  onClear: () => void;
  /** Tras elegir en un campo de una sola opción (para cerrar). */
  onPicked?: () => void;
  pinned?: boolean;
  labels: FilterBarLabels;
  searchThreshold: number;
}) {
  const single = field.multi === false;
  const shown = selected.length > 0 ? selected : pinned ? [field.defaultValue as FilterValue] : [];
  const active = selected.length > 0;
  return (
    <>
      {field.options.length > searchThreshold && <CommandInput placeholder={labels.searchField(field.label)} />}
      <CommandList>
        <CommandEmpty>{labels.noResults}</CommandEmpty>
        <CommandGroup>
          {!pinned && field.nullable !== false && (
            <CommandItem
              value={`${labels.withoutField(field.label)} ${FILTER_NULL}`}
              aria-checked={selected.includes(FILTER_NULL)}
              onSelect={() => { onToggle(FILTER_NULL); if (single) onPicked?.(); }}
            >
              {!single && <Checkbox checked={selected.includes(FILTER_NULL)} tabIndex={-1} aria-hidden className="pointer-events-none" />}
              <span className="flex-1 italic text-muted-foreground">{labels.withoutField(field.label)}</span>
              {single && selected.includes(FILTER_NULL) && <Check className="h-3.5 w-3.5" />}
            </CommandItem>
          )}
          {field.options.map((opt) => {
            const isSel = shown.includes(opt.value);
            return (
              <CommandItem
                key={String(opt.value)}
                value={`${opt.label} ${String(opt.value)}`}
                aria-checked={isSel}
                onSelect={() => {
                  // Un campo fijo siempre tiene valor: volver a pulsar el elegido no lo quita.
                  if (!(single && pinned && isSel)) onToggle(opt.value);
                  if (single) onPicked?.();
                }}
              >
                {/* Una sola opción: check a la derecha, como Agrupar y Ordenar; las casillas son para elegir varias. */}
                {!single && <Checkbox checked={isSel} tabIndex={-1} aria-hidden className="pointer-events-none" />}
                {opt.color && <span className="size-2 shrink-0 rounded-full" style={{ background: opt.color }} aria-hidden />}
                {opt.icon}
                <span className="flex-1 truncate">{opt.label}</span>
                {single && isSel && <Check className="h-3.5 w-3.5" />}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
      {active && !pinned && (
        <div className="border-t p-1">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClear}>
            {labels.clearSelection}
          </Button>
        </div>
      )}
    </>
  );
}

function FieldFilter({ field, selected, onToggle, onClear, open, onOpenChange, labels, searchThreshold, disabled }: {
  field: FilterField;
  selected: FilterValue[];
  onToggle: (v: FilterValue) => void;
  onClear: () => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  labels: FilterBarLabels;
  searchThreshold: number;
  disabled?: boolean;
}) {
  const pinned = field.defaultValue !== undefined;
  const shown = selected.length > 0 ? selected : pinned ? [field.defaultValue as FilterValue] : [];
  const selectedOpts = field.options.filter((o) => shown.includes(o.value));
  const active = selected.length > 0;
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn("max-w-[220px] gap-1.5 font-normal", active && !pinned && activeClass)}
        >
          {field.icon}
          {/* Botón QUIETO (como Linear/HubSpot): el texto no cambia al marcar, solo sale un número en un hueco que
              existe siempre (invisible sin filtro). Excepción: un campo fijo enseña su valor (no tiene píldora). */}
          {!pinned ? (
            <span className="inline-flex items-center gap-1.5">
              <span className={active ? "text-foreground" : "text-muted-foreground/90"}>{field.label}</span>
              <Badge
                variant="secondary"
                aria-hidden={!active}
                className={cn("h-4 min-w-4 justify-center px-1 text-[10px] tabular-nums", !active && "invisible")}
              >
                {active ? selected.length : 0}
              </Badge>
            </span>
          ) : shown.length === 1 ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <span className="text-muted-foreground">{field.label}:</span>
              {selectedOpts[0]?.icon}
              <span className="truncate">{selectedOpts[0]?.label}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-muted-foreground">{field.label}:</span>
              <Badge variant="secondary" className="h-4 px-1 text-[10px] tabular-nums">{shown.length}</Badge>
            </span>
          )}
          <CaretDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <FieldOptions
            field={field}
            selected={selected}
            onToggle={onToggle}
            onClear={onClear}
            onPicked={() => onOpenChange(false)}
            pinned={pinned}
            labels={labels}
            searchThreshold={searchThreshold}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function OverflowFilters({ fields, values, onToggle, onClear, focusKey, onFocusConsumed, labels, searchThreshold, disabled }: {
  fields: FilterField[];
  values: Record<string, FilterValue[]>;
  onToggle: (key: string, v: FilterValue) => void;
  onClear: (key: string) => void;
  /** Campo a abrir directamente (píldora pulsada). */
  focusKey: string | null;
  onFocusConsumed: () => void;
  labels: FilterBarLabels;
  searchThreshold: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [innerField, setInnerField] = useState<string | null>(null);
  // Píldora pulsada de un campo de aquí dentro: se abre directamente en ese campo y el aviso se consume.
  useEffect(() => {
    if (!focusKey) return;
    setOpen(true);
    setInnerField(focusKey);
    onFocusConsumed();
  }, [focusKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const totalActive = fields.reduce((n, f) => n + ((values[f.key]?.length ?? 0) > 0 ? 1 : 0), 0);
  const current = innerField ? fields.find((f) => f.key === innerField) : null;
  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setInnerField(null); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={labels.moreFilters}
          disabled={disabled}
          className={cn("gap-1.5 font-normal", totalActive > 0 && activeClass)}
        >
          <Funnel className="h-4 w-4" />
          <span className={totalActive > 0 ? "text-foreground" : "text-muted-foreground/90"}>{labels.moreFilters}</span>
          <Badge
            variant="secondary"
            aria-hidden={totalActive === 0}
            className={cn("h-4 min-w-4 justify-center px-1 text-[10px] tabular-nums", totalActive === 0 && "invisible")}
          >
            {totalActive}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        {!current ? (
          <Command>
            <CommandList>
              <CommandGroup heading={labels.moreFilters}>
                {fields.map((f) => {
                  const n = values[f.key]?.length ?? 0;
                  return (
                    <CommandItem key={f.key} value={`${f.label} ${f.key}`} onSelect={() => setInnerField(f.key)}>
                      {f.icon}
                      <span className="flex-1">{f.label}</span>
                      {n > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px] tabular-nums">{n}</Badge>}
                      <CaretRight className="h-3.5 w-3.5 opacity-50" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <Command key={current.key}>
            <div className="flex items-center gap-1 px-1 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setInnerField(null)} className="gap-1 px-2">
                <CaretLeft className="h-3.5 w-3.5" />
                {labels.back}
              </Button>
              <span className="truncate text-sm font-medium">{current.label}</span>
            </div>
            <FieldOptions
              field={current}
              selected={values[current.key] ?? []}
              onToggle={(v) => onToggle(current.key, v)}
              onClear={() => onClear(current.key)}
              labels={labels}
              searchThreshold={searchThreshold}
            />
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}

function DateFilter({ dateFields, field, range, onChange, open, onOpenChange, labels, disabled }: {
  dateFields: Array<{ value: string; label: string }>;
  field: string;
  range: FilterDateRange;
  onChange: (field: string, range: FilterDateRange) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  labels: FilterBarLabels;
  disabled?: boolean;
}) {
  const active = !!range.preset && range.preset !== "all";
  const fieldLabel = dateFields.find((d) => d.value === field)?.label ?? labels.date;
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className={cn("gap-1.5 font-normal", active && activeClass)}>
          <CalendarBlank className="h-4 w-4" />
          {active ? (
            <span className="truncate">
              <span className="text-muted-foreground">{fieldLabel}:</span> {dateChipLabel(range, labels)}
            </span>
          ) : (
            <span className="text-muted-foreground/90">{labels.date}</span>
          )}
          <CaretDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        {dateFields.length > 1 && (
          <div className="border-b px-3 py-2">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">{labels.field}</div>
            <Select value={field} onValueChange={(v) => onChange(v, range)}>
              <SelectTrigger className="h-8 w-full text-sm" aria-label={labels.field}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFields.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Command>
          <CommandList>
            <CommandGroup>
              {DATE_PRESETS.map((p) => {
                const selected = (range.preset ?? "all") === p;
                return (
                  <CommandItem
                    key={p}
                    value={`${labels.datePresets[p]} ${p}`}
                    aria-checked={selected}
                    onSelect={() => {
                      if (p === "custom") {
                        onChange(field, { preset: "custom", from: range.from, to: range.to });
                      } else {
                        onChange(field, { preset: p });
                        onOpenChange(false);
                      }
                    }}
                  >
                    <span className="flex-1">{labels.datePresets[p]}</span>
                    {selected && <Check className="h-3.5 w-3.5" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {/* Rango a medida: el DatePicker del sistema (nunca <input type="date">). */}
        {range.preset === "custom" && (
          <div className="space-y-2 border-t px-3 pb-3 pt-2">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">{labels.from}</div>
              <DatePicker
                size="field"
                value={range.from ?? null}
                max={range.to}
                placeholder={labels.pickDate}
                onChange={(v) => onChange(field, { ...range, preset: "custom", from: v ?? undefined })}
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">{labels.to}</div>
              <DatePicker
                size="field"
                value={range.to ?? null}
                min={range.from}
                placeholder={labels.pickDate}
                onChange={(v) => onChange(field, { ...range, preset: "custom", to: v ?? undefined })}
              />
            </div>
          </div>
        )}

        {active && (
          <div className="border-t p-1">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => onChange(field, { preset: "all" })}>
              {labels.clearFilter}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────── Helpers ─────────────────────────────── */

/** "YYYY-MM-DD" en hora local (no UTC: `toISOString` corre un día hacia atrás en zonas UTC+). */
const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Convierte un `FilterDateRange` en fechas absolutas `{ from, to }` ("YYYY-MM-DD", ambos incluidos). Semana = lunes a domingo. */
export function resolveDateRange(r?: FilterDateRange, now: Date = new Date()): { from?: string; to?: string } {
  if (!r || !r.preset || r.preset === "all") return {};
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const day = (offset: number) => new Date(y, m, d + offset);
  const weekday = (now.getDay() + 6) % 7; // 0 = lunes
  switch (r.preset) {
    case "today": return { from: isoDay(now), to: isoDay(now) };
    case "yesterday": return { from: isoDay(day(-1)), to: isoDay(day(-1)) };
    case "this_week": return { from: isoDay(day(-weekday)), to: isoDay(day(6 - weekday)) };
    case "last_week": return { from: isoDay(day(-weekday - 7)), to: isoDay(day(-weekday - 1)) };
    case "this_month": return { from: isoDay(new Date(y, m, 1)), to: isoDay(new Date(y, m + 1, 0)) };
    case "last_month": return { from: isoDay(new Date(y, m - 1, 1)), to: isoDay(new Date(y, m, 0)) };
    case "custom": return { from: r.from, to: r.to };
    default: return {};
  }
}

/**
 * Aplica en cliente el estado de la barra: valores por campo (`FILTER_NULL` casa con null / array vacío), búsqueda y
 * rango de fechas. Orden y agrupación quedan para quien llama (ver `groupItems`).
 */
export function applyLocalFilters<T>(
  items: T[],
  state: FilterBarState,
  adapters: {
    getFieldValue: (item: T, key: string) => FilterValue | FilterValue[] | null | undefined;
    getDate?: (item: T, field: string) => string | null | undefined;
    search?: (item: T) => string;
  },
): T[] {
  let out = items;

  for (const [key, values] of Object.entries(state.values)) {
    if (!values || values.length === 0) continue;
    const wantsNull = values.includes(FILTER_NULL);
    const realValues = values.filter((v) => v !== FILTER_NULL);
    out = out.filter((item) => {
      const v = adapters.getFieldValue(item, key);
      const isAbsent = v == null || (Array.isArray(v) && v.length === 0);
      if (isAbsent) return wantsNull;
      if (realValues.length === 0) return false;
      if (Array.isArray(v)) return v.some((x) => realValues.includes(x));
      return realValues.includes(v);
    });
  }

  if (state.query && adapters.search) {
    const q = state.query.toLowerCase();
    out = out.filter((item) => adapters.search!(item).toLowerCase().includes(q));
  }

  if (state.dateField && adapters.getDate && state.dateRange?.preset && state.dateRange.preset !== "all") {
    const { from, to } = resolveDateRange(state.dateRange);
    if (from || to) {
      out = out.filter((item) => {
        const d = adapters.getDate!(item, state.dateField!);
        if (!d) return false;
        const dt = d.slice(0, 10);
        if (from && dt < from) return false;
        if (to && dt > to) return false;
        return true;
      });
    }
  }

  return out;
}

/** Agrupa en el orden en que aparece cada grupo. Sin `groupBy`, un único grupo `_all`. */
export function groupItems<T>(
  items: T[],
  groupBy: string | undefined,
  getGroup: (item: T) => { key: string; label: string },
): Array<{ key: string; label: string; items: T[] }> {
  if (!groupBy) return [{ key: "_all", label: "", items }];
  const groups = new Map<string, { key: string; label: string; items: T[] }>();
  for (const item of items) {
    const g = getGroup(item);
    if (!groups.has(g.key)) groups.set(g.key, { key: g.key, label: g.label, items: [] });
    groups.get(g.key)!.items.push(item);
  }
  return Array.from(groups.values());
}

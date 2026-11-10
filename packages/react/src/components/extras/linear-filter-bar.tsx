import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react"
import { Check, Funnel, X } from "@phosphor-icons/react"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Button } from "../ui/button"
import { DatePicker } from "../ui/date-picker"
import { cn } from "../../lib/utils"

export type FilterFieldOption = {
  value: string
  label: string
  color?: string
}

export type FilterField = {
  key: string
  label: string
  icon?: ComponentType<{ className?: string }>
  type?: "multi" | "single" | "toggle" | "date"
  options?: FilterFieldOption[]
  loadOptions?: () => Promise<FilterFieldOption[]>
}

export type LinearFilterValue = Record<string, unknown>

export interface LinearFilterBarLabels {
  filter: string
  searchPlaceholder: string
  allApplied: string
  clear: string
  /** "Quitar filtro Estado" */
  removeFilter: (label: string) => string
  yes: string
  searchGeneric: string
  loading: string
  noOptions: string
}

export const DEFAULT_LINEAR_FILTER_BAR_LABELS: LinearFilterBarLabels = {
  filter: "Filtrar",
  searchPlaceholder: "Buscar filtro…",
  allApplied: "Todos aplicados",
  clear: "Limpiar",
  removeFilter: (label) => `Quitar filtro ${label}`,
  yes: "sí",
  searchGeneric: "Buscar…",
  loading: "Cargando…",
  noOptions: "Sin opciones",
}

export interface LinearFilterBarProps {
  fields: FilterField[]
  value: LinearFilterValue
  onChange: (next: LinearFilterValue) => void
  rightSlot?: ReactNode
  className?: string
  labels?: Partial<LinearFilterBarLabels>
}

const isFieldActive = (f: FilterField, value: LinearFilterValue): boolean => {
  const v = value[f.key]
  if (f.type === "toggle") return v === true
  if (Array.isArray(v)) return v.length > 0
  return v !== undefined && v !== null && v !== ""
}

export function LinearFilterBar({ fields, value, onChange, rightSlot, className, labels }: LinearFilterBarProps) {
  const l = { ...DEFAULT_LINEAR_FILTER_BAR_LABELS, ...labels }
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<FilterField | null>(null)
  // Anchor for the ValuePicker popover — positioned right after the "+ Filtrar" button
  const anchorRef = useRef<HTMLSpanElement>(null)

  const activeFields = fields.filter((f) => isFieldActive(f, value))
  const inactiveFields = fields.filter((f) => !isFieldActive(f, value))

  const pickField = (f: FilterField) => {
    setAddOpen(false)
    if (f.type === "toggle") {
      onChange({ ...value, [f.key]: !value[f.key] })
    } else {
      setEditing(f)
    }
  }

  const removeField = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  const clearAll = () => onChange({})

  return (
    /* Alturas: las canónicas del panel (átomos a su tamaño por defecto, 40 px). */
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      <Popover open={addOpen} onOpenChange={setAddOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1.5 border-dashed">
            <Funnel className="h-4 w-4" />
            {l.filter}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-56" align="start">
          <Command>
            <CommandInput placeholder={l.searchPlaceholder} className="h-9 text-[12px]" />
            <CommandList>
              <CommandEmpty>{l.allApplied}</CommandEmpty>
              <CommandGroup>
                {inactiveFields.map((f) => (
                  <CommandItem key={f.key} value={f.label} onSelect={() => pickField(f)} className="text-[12px]">
                    {f.icon && <f.icon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />}
                    {f.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {activeFields.map((f) => (
        <ActiveChip
          key={f.key}
          field={f}
          value={value[f.key]}
          labels={l}
          onEdit={() => {
            if (f.type !== "toggle") setEditing(f)
          }}
          onRemove={() => removeField(f.key)}
        />
      ))}

      {activeFields.length > 0 && (
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={clearAll}>
          {l.clear}
        </Button>
      )}

      {/* Anchor for the ValuePicker — invisible, sits in the flow right after the chips */}
      <span ref={anchorRef} aria-hidden className="inline-block w-0 h-0" />

      {rightSlot && <div className="ml-auto">{rightSlot}</div>}

      {editing && (
        <ValuePicker
          field={editing}
          value={value[editing.key]}
          anchorRef={anchorRef}
          labels={l}
          onChange={(v) => onChange({ ...value, [editing.key]: v })}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function ActiveChip({
  field,
  value,
  labels,
  onEdit,
  onRemove,
}: {
  field: FilterField
  value: unknown
  labels: LinearFilterBarLabels
  onEdit: () => void
  onRemove: () => void
}) {
  const isToggle = field.type === "toggle"

  // Chip = Button oficial (outline) + equis en icon-button oficial, ambos a la altura por defecto del átomo.
  // Sigue sin haber botones DENTRO de un Badge: son dos controles hermanos.
  return (
    <div className="inline-flex items-center gap-0.5">
      <Button
        type="button"
        variant="outline"
        className={cn("gap-1.5 font-normal", !isToggle && "hover:bg-muted/40")}
        onClick={isToggle ? undefined : onEdit}
      >
        {field.icon && <field.icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-muted-foreground">{field.label}:</span>
        <span className="font-medium text-foreground">{formatValue(field, value, labels)}</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={onRemove}
        className="text-muted-foreground hover:text-foreground"
        aria-label={labels.removeFilter(field.label)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

function formatValue(field: FilterField, value: unknown, labels: LinearFilterBarLabels): string {
  if (field.type === "toggle") return labels.yes
  if (field.type === "date") return String(value ?? "")
  const options = field.options ?? []
  if (Array.isArray(value)) {
    const names = value.map((v) => options.find((o) => o.value === String(v))?.label ?? String(v))
    return names.length > 2 ? `${names.slice(0, 2).join(", ")} +${names.length - 2}` : names.join(", ")
  }
  return options.find((o) => o.value === String(value))?.label ?? String(value)
}

function ValuePicker({
  field,
  value,
  anchorRef,
  labels,
  onChange,
  onClose,
}: {
  field: FilterField
  value: unknown
  anchorRef?: RefObject<HTMLSpanElement | null>
  labels: LinearFilterBarLabels
  onChange: (v: unknown) => void
  onClose: () => void
}) {
  const [options, setOptions] = useState<FilterFieldOption[]>(field.options ?? [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!field.options && field.loadOptions) {
      setLoading(true)
      field
        .loadOptions()
        .then((opts) => setOptions(opts))
        .finally(() => setLoading(false))
    }
  }, [field])

  // DatePicker is self-contained; render it as a standalone trigger + portal.
  // We wrap in a small inline container so onClose fires after selection.
  if (field.type === "date") {
    return (
      <div className="contents">
        <Popover open onOpenChange={(o) => !o && onClose()}>
          {anchorRef && <PopoverAnchor virtualRef={anchorRef as RefObject<{ getBoundingClientRect(): DOMRect }>} />}
          <PopoverContent className="p-3 w-auto" align="start">
            <DatePicker
              value={(value as string | null | undefined) ?? null}
              onChange={(v) => {
                onChange(v || undefined)
                onClose()
              }}
              clearable
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <Popover open onOpenChange={(o) => !o && onClose()}>
      {anchorRef && <PopoverAnchor virtualRef={anchorRef as RefObject<{ getBoundingClientRect(): DOMRect }>} />}
      <PopoverContent className="p-0 w-60" align="start">
        <Command>
          <CommandInput placeholder={labels.searchGeneric} className="h-9 text-[12px]" />
          <CommandList className="max-h-[280px] overflow-y-auto">
            <CommandEmpty>{loading ? labels.loading : labels.noOptions}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const selected = Array.isArray(value)
                  ? value.map(String).includes(o.value)
                  : String(value ?? "") === o.value
                return (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      if (field.type === "single") {
                        onChange(o.value)
                        onClose()
                        return
                      }
                      const arr = Array.isArray(value) ? value.map(String) : []
                      const next = selected ? arr.filter((x) => x !== o.value) : [...arr, o.value]
                      onChange(next.length ? next : undefined)
                    }}
                    className="text-[12px] gap-2"
                  >
                    {o.color && (
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                    )}
                    <span className="flex-1 truncate">{o.label}</span>
                    {selected && <Check className="h-3 w-3 text-foreground" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

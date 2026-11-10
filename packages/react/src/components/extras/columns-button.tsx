import { useState, type ReactNode } from "react"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export interface ColumnDef {
  key: string
  label: string
}

/**
 * Preferencia de columnas persistida: el mismo patrón para todas las tablas.
 * localStorage en try/catch: nunca bloquea la UI.
 */
export const useColumnPrefs = (storageKey: string, defaults: string[]) => {
  const [cols, setCols] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null")
      return Array.isArray(saved) && saved.length ? saved : defaults
    } catch {
      return defaults
    }
  })
  const toggle = (key: string) => {
    setCols((prev) => {
      const next = prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        /* no persistida */
      }
      return next
    })
  }
  return { cols, toggle }
}

export interface ColumnsButtonLabels {
  /** Etiqueta del botón. */
  customize: string
  /** Descripción del popover. */
  customizeDesc: string
}

export const DEFAULT_COLUMNS_BUTTON_LABELS: ColumnsButtonLabels = {
  customize: "Columnas",
  customizeDesc: "Elige qué columnas mostrar",
}

export interface ColumnsButtonProps {
  allCols: ColumnDef[]
  visible: string[]
  onToggle: (key: string) => void
  /** Acción secundaria opcional, ej. "Gestionar parámetros…". */
  footer?: ReactNode
  /** Etiqueta del botón (por defecto `labels.customize`). Ej. "Tarjetas" en tableros. */
  label?: string
  /** Descripción del popover (por defecto `labels.customizeDesc`). */
  description?: string
  labels?: Partial<ColumnsButtonLabels>
}

/** Botón "Columnas" estándar: popover con checkboxes, igual en todas las tablas. */
export const ColumnsButton = ({ allCols, visible, onToggle, footer, label, description, labels }: ColumnsButtonProps) => {
  const l = { ...DEFAULT_COLUMNS_BUTTON_LABELS, ...labels }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {label ?? l.customize}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">{description ?? l.customizeDesc}</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allCols.map((c) => (
            <label key={c.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={visible.includes(c.key)} onCheckedChange={() => onToggle(c.key)} />
              {c.label}
            </label>
          ))}
        </div>
        {footer && <div className="border-t border-border mt-3 pt-2">{footer}</div>}
      </PopoverContent>
    </Popover>
  )
}

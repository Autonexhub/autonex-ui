import type { ComponentType } from "react"
import { CaretUpDown, Check } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export interface ContextDropdownItem {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
}

export interface ContextDropdownProps {
  /** Contextos a los que el usuario tiene acceso. */
  contexts: ContextDropdownItem[]
  activeId: string
  onSelect: (id: string) => void
}

/**
 * Selector de contexto tipo breadcrumb (icono + nombre + caret). Con una sola
 * opción no hay nada que elegir y no se pinta. Presentacional: la app decide
 * qué contextos son visibles y a dónde lleva cada uno.
 */
export function ContextDropdown({ contexts, activeId, onSelect }: ContextDropdownProps) {
  if (contexts.length <= 1) return null
  const current = contexts.find((c) => c.id === activeId)
  const CurrentIcon = current?.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 font-medium">
          {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
          <span>{current?.label}</span>
          <CaretUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {contexts.map((ctx) => {
          const Icon = ctx.icon
          return (
            <DropdownMenuItem key={ctx.id} onClick={() => onSelect(ctx.id)}>
              {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
              <span className="flex-1">{ctx.label}</span>
              {ctx.id === activeId && <Check className="h-4 w-4 text-brand" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

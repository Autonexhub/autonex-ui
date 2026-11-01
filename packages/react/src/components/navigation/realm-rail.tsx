import { useEffect, useRef, useState, type ReactNode } from "react"
import { PushPin, PushPinSlash } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { AutonexIsotipo } from "./autonex-isotipo"
import type { SidebarIcon } from "./sidebar-nav-item"
import { sidebarIconClass, sidebarItemActive, sidebarItemInactive } from "./sidebar-styles"

// Sobre el lienzo gris (rail plegado o fijado) el activo es una píldora BLANCA
// y el hover blanco suave; flotando, el rail es una tarjeta blanca y usa la
// misma receta que la tarjeta de módulos (píldora gris).
const railItemActiveOnCanvas = "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
const railItemInactiveOnCanvas = "text-sidebar-foreground hover:bg-background/70"

/** Ancho del rail plegado / fijado (px). `AppShell` y `SidebarShell` usan los mismos valores. */
export const RAIL_WIDTH = 48
export const RAIL_PINNED_WIDTH = 208

export interface RailEntry {
  id: string
  label: string
  icon: SidebarIcon
  active?: boolean
  onSelect: () => void
}

export interface RealmRailProps {
  /** Reinos (arriba). */
  realms: RailEntry[]
  /** Contextos de trabajo (Linear, Admin, Finanzas, DevOps…). */
  contexts?: RailEntry[]
  /** Fijos abajo (Buscar, Rambo IA). */
  footer?: RailEntry[]
  /** Pie del todo (avatar con el menú de usuario); recibe si está desplegado. */
  account?: (expanded: boolean) => ReactNode
  /** Cabecera (selector de organización); recibe si el rail está desplegado.
   *  Sin ella se pinta `logo`. */
  brand?: (expanded: boolean) => ReactNode
  /** Marca de reserva cuando no hay `brand`. Por defecto, el isotipo de Autonex. */
  logo?: ReactNode
  ariaLabel: string
  /** Fijado abierto con la chincheta: ocupa su sitio y no flota. */
  pinned?: boolean
  /** Si no se pasa, no se pinta la chincheta. */
  onTogglePin?: () => void
  pinLabel?: string
  /** Para Storybook o pruebas: forzar el estado desplegado. */
  forceExpanded?: boolean
  className?: string
}

/**
 * Rail de iconos estilo Intercom: 48px siempre visible; al pasar el ratón (o
 * con el foco del teclado) se despliega POR ENCIMA del contenido con el nombre
 * de cada icono, sin empujar la página. Retardo de entrada para que no
 * parpadee al cruzarlo con el ratón camino de la sidebar.
 *
 * Presentacional: cada entrada trae su `onSelect`; no conoce rutas ni permisos.
 */
export function RealmRail({
  realms,
  contexts = [],
  footer = [],
  account,
  brand,
  logo,
  ariaLabel,
  pinned = false,
  onTogglePin,
  pinLabel,
  forceExpanded = false,
  className,
}: RealmRailProps) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // `expanded` = se ven los nombres; `floating` = es la tarjeta blanca que
  // flota encima al pasar el ratón. Fijado se ven los nombres pero no flota:
  // va sobre el lienzo gris, como Intercom con la chincheta.
  const expanded = pinned || forceExpanded || hovered || focused
  const floating = expanded && !pinned

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const onEnter = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(true), 150)
  }
  const onLeave = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(false), 80)
  }

  const renderEntry = (entry: RailEntry) => {
    const Icon = entry.icon
    return (
      <button
        key={entry.id}
        type="button"
        onClick={entry.onSelect}
        aria-label={entry.label}
        aria-current={entry.active ? "page" : undefined}
        title={expanded ? undefined : entry.label}
        className={cn(
          // Icono centrado en la píldora de 32px plegada: (32-18)/2 = 7px.
          "flex h-[32px] w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-[7px] text-[13px] [font-weight:380] transition-colors",
          floating
            ? entry.active
              ? sidebarItemActive
              : sidebarItemInactive
            : entry.active
              ? railItemActiveOnCanvas
              : railItemInactiveOnCanvas,
        )}
      >
        <Icon weight={entry.active ? "regular" : "light"} className={sidebarIconClass} />
        <span className={cn("truncate transition-opacity duration-150", expanded ? "opacity-100" : "opacity-0")}>
          {entry.label}
        </span>
      </button>
    )
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("relative h-full", className)}
      style={{ width: pinned ? RAIL_PINNED_WIDTH : RAIL_WIDTH }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex flex-col p-2 transition-[width,box-shadow,background-color] duration-200 ease-out",
          // Flotando (Intercom, Bruno 29/10): tarjeta BLANCA de alto completo,
          // más alta que las demás, con las esquinas de la derecha redondeadas
          // y sombra. Fijado: mismo ancho pero en el gris del lienzo.
          // Anchos en px: con la base a 15px las clases rem encogen.
          floating
            ? "w-[208px] rounded-r-xl border border-l-0 border-border bg-background shadow-elev"
            : cn(pinned ? "w-[208px]" : "w-[48px]", "bg-sidebar"),
        )}
      >
        {/* Organización (o el isotipo si no hay): arriba del todo, como el
            espacio de trabajo en Intercom. */}
        <div className="flex h-8 shrink-0 items-center gap-1">
          {brand ? (
            <div className="min-w-0 flex-1">{brand(expanded)}</div>
          ) : (
            <div className="min-w-0 flex-1">
              {logo ?? <AutonexIsotipo className="ml-[7px] size-[18px] shrink-0 text-foreground" />}
            </div>
          )}
          {/* Chincheta: deja el rail fijo abierto (y lo suelta). */}
          {expanded && onTogglePin && (
            <button
              type="button"
              onClick={onTogglePin}
              aria-label={pinLabel}
              aria-pressed={pinned}
              title={pinLabel}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:text-foreground",
                floating ? "hover:bg-sidebar-accent/60" : "hover:bg-background/70",
              )}
            >
              {pinned ? <PushPinSlash weight="light" className="size-4" /> : <PushPin weight="light" className="size-4" />}
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-0.5">{realms.map(renderEntry)}</div>

        {contexts.length > 0 && (
          <>
            <div className="mx-1.5 my-3 border-t border-border" />
            <div className="flex flex-col gap-0.5">{contexts.map(renderEntry)}</div>
          </>
        )}

        <div className="mt-auto flex flex-col gap-0.5">
          {footer.map(renderEntry)}
          {account && <div className="mt-1">{account(expanded)}</div>}
        </div>
      </div>
    </nav>
  )
}

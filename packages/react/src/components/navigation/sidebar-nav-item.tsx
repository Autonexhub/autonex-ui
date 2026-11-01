import type { ComponentType, MouseEvent, MouseEventHandler, ReactElement, ReactNode } from "react"
import { PushPin, PushPinSlash } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import {
  sidebarIconClass,
  sidebarItemActive,
  sidebarItemBase,
  sidebarItemHeights,
  sidebarItemHoverAction,
  sidebarItemInactive,
} from "./sidebar-styles"

export type SidebarIcon = ComponentType<{
  className?: string
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
}>

/** Props que recibe `renderLink`: aplícalas tal cual al enlace del router. */
export interface SidebarLinkProps {
  href: string
  className: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
}

/**
 * Cómo se pinta un enlace. El paquete no conoce el router: por defecto es un
 * `<a href>`; la app pasa `(p) => <Link to={p.href} className={p.className} …>`.
 * Debe devolver UN elemento que reenvíe `ref` y props (como `Link` de
 * react-router): con la sidebar plegada el tooltip se monta encima.
 */
export type SidebarLinkRenderer = (props: SidebarLinkProps) => ReactElement

export const defaultRenderLink: SidebarLinkRenderer = ({ href, ...rest }) => <a href={href} {...rest} />

export interface SidebarNavItemLabels {
  /** Chincheta cuando el módulo no está marcado. */
  pin: string
  /** Chincheta cuando ya está marcado. */
  unpin: string
}

export const DEFAULT_SIDEBAR_NAV_ITEM_LABELS: SidebarNavItemLabels = {
  pin: "Marcar",
  unpin: "Quitar marcador",
}

export interface SidebarNavItemProps {
  href: string
  icon: SidebarIcon
  /** Texto ya traducido. */
  label: string
  size?: "default" | "sub"
  /** Etiqueta corta a la derecha del texto (p. ej. "Beta"). No se pinta con la
   *  sidebar colapsada y no altera la altura del ítem. */
  badge?: string
  active: boolean
  /** Sidebar plegada (solo icono + tooltip). La app lo calcula: `isCollapsed && !isMobile`. */
  collapsed?: boolean
  /** Muestra la chincheta al hover (Marcadores, decisión Bruno 03/09). */
  bookmarkable?: boolean
  /** Estado de la chincheta (solo con `bookmarkable`). */
  bookmarked?: boolean
  /** Se llama al pulsar la chincheta; el módulo no se mueve de su sección. */
  onToggleBookmark?: () => void
  labels?: Partial<SidebarNavItemLabels>
  renderLink?: SidebarLinkRenderer
}

/**
 * Ítem de navegación COMÚN a los sidebars (receta `sidebar-styles.ts`).
 * Con `bookmarkable`, al hover aparece a la derecha la chincheta que añade o
 * quita el módulo de Marcadores. Presentacional: la navegación es de
 * `renderLink` y el estado del marcador de `bookmarked`/`onToggleBookmark`.
 */
export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  size = "default",
  badge,
  active,
  collapsed = false,
  bookmarkable = false,
  bookmarked = false,
  onToggleBookmark,
  labels,
  renderLink = defaultRenderLink,
}: SidebarNavItemProps) {
  const l = { ...DEFAULT_SIDEBAR_NAV_ITEM_LABELS, ...labels }
  const isSub = size === "sub"

  const heightClass = collapsed
    ? sidebarItemHeights.collapsed
    : isSub
      ? sidebarItemHeights.sub
      : sidebarItemHeights.item
  const stateClass = active ? sidebarItemActive : sidebarItemInactive

  const inner = (
    <>
      <Icon weight="light" className={sidebarIconClass} />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge && (
            <Badge variant="secondary" className="h-4 shrink-0 px-1.5 text-[10px] font-medium">
              {badge}
            </Badge>
          )}
        </>
      )}
    </>
  )

  if (collapsed || !bookmarkable) {
    const link = renderLink({ href, className: cn(sidebarItemBase, heightClass, stateClass), children: inner })
    if (!collapsed) return link
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  const PinIcon = bookmarked ? PushPinSlash : PushPin
  const pinLabel = bookmarked ? l.unpin : l.pin

  const onPin = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleBookmark?.()
  }

  // El enlace es la píldora (su propio hover); la chincheta es un botón HERMANO
  // superpuesto a la derecha: al pasar por ella no se ilumina el módulo entero
  // (Bruno 03/09) y no se anidan interactivos. `pr-8` reserva su hueco.
  return (
    <div className="group/nav relative">
      {renderLink({ href, className: cn(sidebarItemBase, heightClass, stateClass, "pr-8"), children: inner })}
      <button
        type="button"
        onClick={onPin}
        aria-label={pinLabel}
        aria-pressed={bookmarked}
        title={pinLabel}
        className={cn(sidebarItemHoverAction, active ? "hover:bg-background" : "hover:bg-sidebar-accent")}
      >
        <PinIcon weight="light" className="size-4" />
      </button>
    </div>
  )
}

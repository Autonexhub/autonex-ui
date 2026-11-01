import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { X } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { SidebarArmedContext } from "./sidebar-armed"
import { sidebarSectionLabel } from "./sidebar-styles"

export interface SidebarSectionLabelProps {
  label: string
  /** Sidebar plegada: el título desaparece (DS: `-mt-8 opacity-0`). */
  collapsed?: boolean
}

/**
 * Título de sección de los grupos de navegación. DS SidebarGroupLabel:
 * h-8 px-3 text-xs font-medium text-sidebar-foreground/70.
 */
export function SidebarSectionLabel({ label, collapsed = false }: SidebarSectionLabelProps) {
  if (collapsed) return <div className="h-0 overflow-hidden" />
  // Receta única (sidebar-styles.ts) — altura en px, ver cabecera del archivo.
  return <div className={sidebarSectionLabel}>{label}</div>
}

export interface SidebarShellProps {
  /** Lista de módulos (dentro del `<nav>` con scroll). */
  children: ReactNode
  /** Solo móvil: cabecera del drawer (selector de organización) junto a la X. */
  header?: ReactNode
  /** Pie bajo el borde: cuota, usuario en móvil, etc. Se pinta siempre el contenedor. */
  footer?: ReactNode
  /** Tarjeta plegada (escritorio): se desliza por debajo del rail y se oculta. */
  collapsed?: boolean
  isMobile?: boolean
  /** Drawer móvil abierto. */
  mobileOpen?: boolean
  /** El backdrop y cualquier clic dentro del aside cierran el drawer móvil. */
  onMobileOpenChange?: (open: boolean) => void
  /** Rail de reinos fijado (208px) en vez de 48px: desplaza la tarjeta. */
  railPinned?: boolean
  /** Hay barra de suplantación arriba (40px): baja la tarjeta. */
  impersonating?: boolean
  /** Clave para recordar el scroll del `<nav>` (p. ej. el contexto activo). */
  scrollKey?: string
  /** aria-label del botón X del drawer móvil. */
  closeLabel?: string
  className?: string
}

// Cada pagina monta su propio MainLayout, asi que el sidebar se remonta en
// cada navegacion y el <nav> nace con scrollTop 0: la lista de modulos salta
// arriba al pulsar cualquiera. Guardamos la posicion por clave (fuera del
// componente, para que sobreviva al remontaje) y la restauramos antes de pintar.
const navScrollPositions = new Map<string, number>()

/**
 * Tarjeta de módulos del reino (escritorio) o drawer (móvil). Presentacional:
 * recibe su estado (plegada, móvil, abierta, fijado del rail…) por props.
 * Provee `SidebarArmedContext` ("sidebar armada", ver sidebar-armed.ts).
 */
export function SidebarShell({
  children,
  header,
  footer,
  collapsed = false,
  isMobile = false,
  mobileOpen = false,
  onMobileOpenChange,
  railPinned = false,
  impersonating = false,
  scrollKey = "default",
  closeLabel = "Cerrar menú",
  className,
}: SidebarShellProps) {
  const navRef = useRef<HTMLElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  // "Sidebar armada": último mousedown dentro del aside.
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      setArmed(!!asideRef.current && asideRef.current.contains(e.target as Node))
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  useLayoutEffect(() => {
    const el = navRef.current
    if (el) el.scrollTop = navScrollPositions.get(scrollKey) ?? 0
  }, [scrollKey])

  const handleNavScroll = useCallback(() => {
    const el = navRef.current
    if (el) navScrollPositions.set(scrollKey, el.scrollTop)
  }, [scrollKey])

  // Close mobile sidebar on navigation
  const handleLinkClick = () => {
    if (isMobile && mobileOpen) onMobileOpenChange?.(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => onMobileOpenChange?.(false)} />
      )}
      <aside
        ref={asideRef}
        className={cn(
          "fixed flex flex-col transition-all duration-300 z-40 tracking-normal",
          // Desktop (patrón Intercom, Bruno 29/10): el rail de reinos queda
          // "por debajo", en el lienzo gris, y los módulos del reino son una
          // TARJETA blanca flotante, hermana de la del contenido (mismo radio,
          // borde y 8px de aire). Plegar la oculta entera, deslizándola
          // por debajo del rail mientras el contenido se abre a la vez (mismo
          // 300ms ease-out que el padding de <main>), como Intercom.
          // Mobile: drawer de siempre, a lo ancho y en gris.
          isMobile
            ? cn(
                "left-0 w-72 bg-sidebar",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
                impersonating ? "top-10 h-[calc(100vh-2.5rem)]" : "top-0 h-screen",
              )
            : cn(
                // En PÍXELES (no rem): con la base a 15px `left-12`/`w-60`
                // daban 45/225px y quedaba un hueco de 26px con el contenido.
                "w-[240px] overflow-hidden rounded-xl border border-border bg-background shadow-elev ease-out",
                collapsed && "pointer-events-none invisible -translate-x-[248px] opacity-0",
                // A la derecha del rail: 48px, o 208px si está fijado.
                railPinned ? "left-[208px]" : "left-[48px]",
                impersonating ? "top-12 h-[calc(100vh-3.5rem)]" : "top-2 h-[calc(100vh-1rem)]",
              ),
          className,
        )}
        onClick={handleLinkClick}
      >
        {/* En escritorio el selector de organización vive arriba del rail
            (RealmRail, patrón Intercom 29/10): la tarjeta empieza por el título
            del reino. En móvil se conserva la cabecera con la X para cerrar. */}
        {isMobile && (
          <div className="flex h-12 items-center p-2">
            <div className="min-w-0 flex-1">{header}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMobileOpenChange?.(false)}
              className="h-8 w-8 shrink-0"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Plegada (48 px) la barra de scroll se comía el ancho: los iconos quedaban
            descentrados y salía además un scroll horizontal. Sin scroll horizontal
            nunca, y plegada la barra vertical se oculta (la rueda sigue funcionando). */}
        <nav
          ref={navRef}
          onScroll={handleNavScroll}
          className={cn("flex-1 overflow-y-auto overflow-x-hidden py-2", collapsed && !isMobile && "scrollbar-hidden")}
        >
          <SidebarArmedContext.Provider value={armed}>{children}</SidebarArmedContext.Provider>
        </nav>

        <div className="mt-auto border-t border-border p-2 space-y-2">{footer}</div>
      </aside>
    </>
  )
}

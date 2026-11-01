import type { ReactNode } from "react"
import { Bird, CaretRight, Megaphone, Sidebar as SidebarGlyph } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { defaultRenderLink, type SidebarLinkRenderer } from "./sidebar-nav-item"

export interface AppShellLabels {
  /** aria-label del botón que pliega/abre la sidebar. */
  toggleSidebar: string
  feedback: string
  assistant: string
}

export const DEFAULT_APP_SHELL_LABELS: AppShellLabels = {
  toggleSidebar: "Alternar sidebar",
  feedback: "Comentarios",
  assistant: "Rambo IA",
}

export interface AppShellProps {
  /** Contenido de la página (scrollea dentro de la tarjeta). */
  children: ReactNode
  /** Rail de reinos (`RealmRail`), posicionado por quien lo monta (`fixed`). */
  rail?: ReactNode
  /** Tarjeta de módulos (`SidebarShell`). */
  sidebar?: ReactNode
  /** Panel derecho del asistente; se pinta dentro de un contenedor fijo de 400px cuando `assistantPanelOpen`. */
  assistantPanel?: ReactNode
  /** Dentro de la tarjeta de contenido, tras el scroll (p. ej. panel de Comentarios). */
  cardOverlay?: ReactNode
  /** Fuera de la tarjeta: paleta de comandos, diálogos… */
  overlays?: ReactNode

  isMobile?: boolean
  /** Tarjeta de módulos plegada. */
  collapsed?: boolean
  /** Rail fijado (208px). */
  railPinned?: boolean
  /** Barra de suplantación arriba (40px). */
  impersonating?: boolean
  onToggleSidebar?: () => void

  /** Primer segmento de la miga (reino o contexto). */
  sectionLabel?: string
  pageLabel?: string
  /** Enlace de la lista de la sección: con `entityLabel`, `pageLabel` se vuelve enlace. */
  pageHref?: string
  /** Tercer segmento (fichas de detalle). */
  entityLabel?: string
  renderLink?: SidebarLinkRenderer

  /** Botón "Comentarios" de la cabecera; sin callback no se pinta. */
  onFeedback?: () => void
  /** Botón lila del asistente. */
  showAssistantButton?: boolean
  assistantPanelOpen?: boolean
  onAssistantClick?: () => void

  labels?: Partial<AppShellLabels>
  className?: string
}

/**
 * Chasis inset del panel (decisión Bruno 03/09 + reinos 29/10): lienzo gris
 * `bg-sidebar` bajo toda la superficie; rail y tarjeta de módulos fijos a la
 * izquierda; el contenido de la página es una tarjeta blanca flotante con la
 * cabecera dentro (`[trigger] Reino › Página › Entidad · Comentarios · Rambo IA`);
 * panel del asistente opcional a la derecha. Presentacional: no conoce el
 * router, la sesión ni los contextos; solo recibe slots, flags y etiquetas.
 */
export function AppShell({
  children,
  rail,
  sidebar,
  assistantPanel,
  cardOverlay,
  overlays,
  isMobile = false,
  collapsed = false,
  railPinned = false,
  impersonating = false,
  onToggleSidebar,
  sectionLabel,
  pageLabel,
  pageHref,
  entityLabel,
  renderLink = defaultRenderLink,
  onFeedback,
  showAssistantButton = false,
  assistantPanelOpen = false,
  onAssistantClick,
  labels,
  className,
}: AppShellProps) {
  const l = { ...DEFAULT_APP_SHELL_LABELS, ...labels }
  const showPanel = assistantPanelOpen && !!assistantPanel

  return (
    // Chasis inset (decisión Bruno 03/09): lienzo gris `bg-sidebar` bajo toda la
    // superficie; la sidebar va sin borde derecho y el contenido de la página es
    // una tarjeta blanca flotante con la cabecera dentro. El aire de la tarjeta
    // es 8px arriba/derecha/abajo; a la izquierda 0 porque el p-2 de la propia
    // sidebar ya lo da.
    <div className={cn("h-screen bg-sidebar overflow-hidden", impersonating && "pt-10", className)}>
      {rail}
      {sidebar}
      <main
        className={cn(
          "h-full pt-2 pb-2 transition-all duration-300 ease-out",
          // Panel de Rambo: 400px + 8px de aire a cada lado.
          showPanel ? "pr-[416px]" : "pr-2",
          // Rail de reinos (48px, o 208px fijado) + tarjeta de módulos
          // (240px + 8px de aire); plegada, la tarjeta desaparece.
          isMobile
            ? "pl-2"
            : railPinned
              ? collapsed
                ? "pl-[208px]"
                : "pl-[456px]"
              : collapsed
                ? "pl-[48px]"
                : "pl-[296px]",
        )}
      >
        {/* Tarjeta de contenido: scroll ÚNICO dentro (el documento nunca
            scrollea). Las páginas de altura completa usan `h-full`/flex sobre
            el contenedor de scroll, nunca `calc(100vh-…)`. Es además el host de
            los paneles laterales flotantes (Sheet variante no modal): ancla
            `relative` que engloba cabecera + área de scroll. */}
        <div
          className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-elev"
          data-shell-panel-host
        >
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="h-8 w-8 shrink-0 -ml-1 text-muted-foreground"
              aria-label={l.toggleSidebar}
            >
              <SidebarGlyph className="h-4 w-4" />
            </Button>
            {sectionLabel && <span className="shrink-0 text-sm text-muted-foreground">{sectionLabel}</span>}
            {pageLabel && (
              <>
                {sectionLabel && <CaretRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                {entityLabel && pageHref ? (
                  renderLink({
                    href: pageHref,
                    className: "truncate text-sm text-muted-foreground transition-colors hover:text-foreground",
                    children: pageLabel,
                  })
                ) : (
                  <span className="truncate text-sm text-foreground">{pageLabel}</span>
                )}
              </>
            )}
            {pageLabel && entityLabel && (
              <>
                <CaretRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <span className="truncate text-sm text-foreground">{entityLabel}</span>
              </>
            )}
            {/* Comentarios: vive en la cabecera del chasis, así que sale en todos los módulos. */}
            {onFeedback && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFeedback}
                className="ml-auto shrink-0 text-brand hover:bg-brand-soft hover:text-brand"
              >
                <Megaphone className="h-4 w-4" />
                {l.feedback}
              </Button>
            )}
            {showAssistantButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAssistantClick}
                aria-pressed={showPanel}
                // Lila de IA (token --ai) con su fondo suave: es la puerta al agente y
                // tiene que destacar sobre Comentarios. Igual abierto que cerrado: el
                // propio panel ya dice que está abierto.
                className={cn(
                  "shrink-0 bg-ai-soft text-ai hover:bg-ai-soft hover:text-ai hover:brightness-95",
                  !onFeedback && "ml-auto",
                )}
              >
                <Bird className="h-4 w-4" />
                {l.assistant}
              </Button>
            )}
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
          {cardOverlay}
        </div>
      </main>
      {showPanel && (
        <div className={cn("fixed right-2 z-30 w-[400px]", impersonating ? "top-12 bottom-2" : "top-2 bottom-2")}>
          {assistantPanel}
        </div>
      )}
      {overlays}
    </div>
  )
}

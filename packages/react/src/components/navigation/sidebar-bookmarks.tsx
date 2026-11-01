import { useCallback, useEffect, useRef, useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BookmarkSimple, CaretRight, DotsSixVertical, PencilSimple, PushPinSlash } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useSidebarArmed } from "./sidebar-armed"
import { defaultRenderLink, type SidebarIcon, type SidebarLinkRenderer } from "./sidebar-nav-item"
import {
  sidebarIconClass,
  sidebarItemActive,
  sidebarItemBase,
  sidebarItemHeights,
  sidebarItemInactive,
} from "./sidebar-styles"

/** Marcador ya resuelto para pintar: etiqueta traducida e icono como componente. */
export interface SidebarBookmarkEntry {
  id: string
  href: string
  label: string
  icon: SidebarIcon
  /** El destino coincide con la ruta actual (la app lo calcula). */
  active?: boolean
}

export interface SidebarBookmarksLabels {
  /** Título de la fila fija y del Dialog. */
  title: string
  manage: string
  unpin: string
  reorderHint: string
}

export const DEFAULT_SIDEBAR_BOOKMARKS_LABELS: SidebarBookmarksLabels = {
  title: "Marcadores",
  manage: "Administrar",
  unpin: "Quitar marcador",
  reorderHint: "Arrastra para reordenar",
}

/** Filas del Popover: misma receta que la sidebar, pero sobre blanco el hover
 *  "blanco suave" no se vería — aquí el hover es `bg-sidebar-accent`, el mismo gris
 *  del ítem activo de la sidebar (decisión Bruno 03/09). */
const popoverRowInactive = "text-sidebar-foreground hover:bg-sidebar-accent"

/** Botón "Quitar marcador" de cada fila del Popover: ghost 24px, solo al hover. */
const rowUnpin =
  "absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-foreground focus-visible:opacity-100 group-hover/row:opacity-100"

const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 150

export interface SidebarBookmarksItemProps {
  bookmarks: SidebarBookmarkEntry[]
  onRemove: (id: string) => void
  /** Nuevo orden completo (ids) tras arrastrar en el Dialog "Administrar". */
  onReorder: (ids: string[]) => void
  /** Sidebar plegada (solo icono + tooltip). */
  collapsed?: boolean
  /** Móvil: nunca abre por hover. */
  isMobile?: boolean
  /** Fuerza el estado "armada"; por defecto lo da `SidebarShell` vía contexto. */
  armed?: boolean
  labels?: Partial<SidebarBookmarksLabels>
  renderLink?: SidebarLinkRenderer
}

/**
 * Fila fija "Marcadores" (primera de la sidebar, patrón HubSpot — Bruno 03/09):
 * abre un Popover a la derecha con los módulos marcados; cada fila desancla al
 * hover (PushPinSlash) y, al pie tras `Separator`, "Administrar" abre un Dialog
 * SOLO para ordenar (arrastre). Solo se pinta (con su separador inferior)
 * cuando hay al menos un módulo marcado.
 *
 * Apertura por hover condicionada: si el último mousedown fue DENTRO de la
 * sidebar ("armada"), pasar el ratón por la fila abre el Popover sin clic
 * (120 ms) y se cierra al salir de fila+popover; si fue fuera, hace falta clic.
 */
export function SidebarBookmarksItem({
  bookmarks,
  onRemove,
  onReorder,
  collapsed = false,
  isMobile = false,
  armed: armedProp,
  labels,
  renderLink = defaultRenderLink,
}: SidebarBookmarksItemProps) {
  const l = { ...DEFAULT_SIDEBAR_BOOKMARKS_LABELS, ...labels }
  const armedCtx = useSidebarArmed()
  const armed = armedProp ?? armedCtx
  const [open, setOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = null
    closeTimer.current = null
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  const onEnter = () => {
    clearTimers()
    if (!armed || open || isMobile) return
    openTimer.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY)
  }
  const onLeave = () => {
    clearTimers()
    if (!open) return
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY)
  }

  // Bruno 03/09: la fila (y su separador) solo existe con algún módulo marcado.
  if (bookmarks.length === 0) return null

  const trigger = (
    <button
      type="button"
      // El <aside> cierra la sidebar móvil en cualquier click; aquí no toca.
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        sidebarItemBase,
        collapsed ? sidebarItemHeights.collapsed : sidebarItemHeights.item,
        sidebarItemInactive,
        "data-[state=open]:bg-sidebar-accent data-[state=open]:text-foreground",
      )}
      aria-label={collapsed ? l.title : undefined}
    >
      <BookmarkSimple weight="light" className={sidebarIconClass} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{l.title}</span>
          <CaretRight className="size-3.5 shrink-0 text-muted-foreground" />
        </>
      )}
    </button>
  )

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{l.title}</TooltipContent>
          </Tooltip>
        ) : (
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        )}
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-64 p-2"
          onMouseEnter={clearTimers}
          onMouseLeave={onLeave}
        >
          <div className="flex flex-col gap-0.5">
            {bookmarks.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.id} className="group/row relative">
                  {renderLink({
                    href: b.href,
                    onClick: () => setOpen(false),
                    className: cn(
                      sidebarItemBase,
                      sidebarItemHeights.item,
                      b.active ? sidebarItemActive : popoverRowInactive,
                      "pr-8",
                    ),
                    children: (
                      <>
                        <Icon weight="light" className={sidebarIconClass} />
                        <span className="flex-1 truncate">{b.label}</span>
                      </>
                    ),
                  })}
                  <button
                    type="button"
                    onClick={() => onRemove(b.id)}
                    className={rowUnpin}
                    aria-label={l.unpin}
                    title={l.unpin}
                  >
                    <PushPinSlash weight="light" className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
          <Separator className="my-2" />
          <button
            type="button"
            onClick={() => {
              clearTimers()
              setOpen(false)
              setManageOpen(true)
            }}
            className={cn(sidebarItemBase, sidebarItemHeights.item, popoverRowInactive)}
          >
            <PencilSimple weight="light" className={sidebarIconClass} />
            <span className="flex-1 truncate text-left">{l.manage}</span>
          </button>
        </PopoverContent>
      </Popover>
      <SidebarBookmarksDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        bookmarks={bookmarks}
        onReorder={onReorder}
        labels={labels}
      />
      <Separator className="my-1" />
    </>
  )
}

function SortableBookmarkRow({ bookmark, reorderHint }: { bookmark: SidebarBookmarkEntry; reorderHint: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bookmark.id,
  })
  const Icon = bookmark.icon
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[36px] items-center gap-2 rounded-lg px-1 hover:bg-muted/50"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={reorderHint}
      >
        <DotsSixVertical className="size-4" />
      </button>
      <Icon weight="light" className={cn(sidebarIconClass, "text-sidebar-foreground")} />
      <span className="flex-1 truncate text-[13px]">{bookmark.label}</span>
    </div>
  )
}

export interface SidebarBookmarksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarks: SidebarBookmarkEntry[]
  onReorder: (ids: string[]) => void
  labels?: Partial<SidebarBookmarksLabels>
}

/** Dialog "Administrar": SOLO ordenar (arrastre o teclado). Quitar se hace en el propio Popover. */
export function SidebarBookmarksDialog({ open, onOpenChange, bookmarks, onReorder, labels }: SidebarBookmarksDialogProps) {
  const l = { ...DEFAULT_SIDEBAR_BOOKMARKS_LABELS, ...labels }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const ids = bookmarks.map((b) => b.id)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{l.title}</DialogTitle>
          <DialogDescription>{l.reorderHint}</DialogDescription>
        </DialogHeader>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-0.5">
              {bookmarks.map((b) => (
                <SortableBookmarkRow key={b.id} bookmark={b} reorderHint={l.reorderHint} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

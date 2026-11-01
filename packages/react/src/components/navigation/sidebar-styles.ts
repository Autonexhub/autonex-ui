/**
 * Receta ÚNICA de estilos de la sidebar — la consumen el ítem, el shell, los
 * marcadores y el rail. Si cambias un valor aquí, cambia en todas.
 *
 * Valores: estructura/densidad fijadas por Bruno (2026-09-01) con las
 * decisiones de Bruno encima — colores de la escala del DS, texto 13px a peso
 * 380 (óptica Inter≈Proxima), iconos Phosphor light 18px.
 *
 * Decisión Bruno 03/09: activo = píldora GRIS más oscura (`--sidebar-accent`,
 * #E9E9EB) con tinta y el mismo peso. Hover = gris suave (`bg-sidebar-accent/60`)
 * desde el 29/10: la sidebar es una tarjeta blanca y el blanco suave
 * (`bg-background/70`) que había antes ya no se veía.
 *
 * Alturas en PÍXELES (no rem): con la base tipográfica a 15px (03/09) `h-8`
 * bajaba a 30px y la medida validada por Bruno es 32px. Iconos (18px) y texto
 * (13px) ya iban en px.
 */

/** Ítem de navegación: base común (texto, aire, radio). */
export const sidebarItemBase =
  "flex w-full items-center gap-4 rounded-lg px-2.5 text-[13px] [font-weight:380] transition-colors"

/** Ítem activo: píldora gris más oscura con tinta, sin bold (03/09). */
export const sidebarItemActive = "bg-sidebar-accent text-foreground font-normal"

/** Ítem inactivo: gris gray-700 en texto e icono. Hover gris suave: desde el
 *  29/10 la sidebar es una tarjeta blanca y el hover blanco no se veía. */
export const sidebarItemInactive =
  "text-sidebar-foreground hover:bg-sidebar-accent/60 [&>svg]:text-sidebar-foreground"

/** Altura del ítem normal / sub-ítem / colapsado (px fijos, ver cabecera). */
export const sidebarItemHeights = {
  item: "h-[32px]",
  sub: "h-[28px] -translate-x-px",
  collapsed: "size-[32px] justify-center p-2",
} as const

/** Icono de ítem: Phosphor weight="light" con este tamaño. */
export const sidebarIconClass = "size-[18px] shrink-0"

/** Título de sección (eyebrow): 11px medium con aire entre módulos. */
export const sidebarSectionLabel =
  "mt-1.5 mb-0.5 flex h-[32px] shrink-0 items-center px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground"

/** Chincheta de Marcadores: hermana del enlace (fuera del <a>, superpuesta a la
 *  derecha) dentro de un envoltorio `group/nav relative`. Invisible hasta el
 *  hover de la fila; al pasar por ELLA solo se ilumina ella (ghost 24px), no el
 *  módulo entero — decisión Bruno 03/09 (sin "hover sobre hover"). */
export const sidebarItemHoverAction =
  "absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-sidebar-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/nav:opacity-100"

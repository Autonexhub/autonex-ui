import { createContext, useContext } from "react"

/**
 * "Sidebar armada" (patrón HubSpot, Bruno 03/09): true si el ÚLTIMO mousedown
 * del documento cayó dentro del <aside> de la sidebar. Con la sidebar armada,
 * pasar el ratón por "Marcadores" abre su Popover sin clic; si el último clic
 * fue fuera, hace falta clic. El estado vive en `SidebarShell`; lo consume
 * `SidebarBookmarksItem` (que también acepta la prop `armed` para forzarlo).
 */
export const SidebarArmedContext = createContext(false)
export const useSidebarArmed = () => useContext(SidebarArmedContext)

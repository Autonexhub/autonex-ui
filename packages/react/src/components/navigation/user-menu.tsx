import { Gear, Monitor, Moon, SignOut, Sun } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { defaultRenderLink, type SidebarLinkRenderer } from "./sidebar-nav-item"

export interface UserMenuUser {
  /** Nombre completo mostrado. */
  name: string
  email: string
  /** Iniciales del avatar; si falta se sacan del nombre (máx. 2). */
  initials?: string
  avatarUrl?: string
}

export interface UserMenuLanguage {
  code: string
  label: string
}

export interface UserMenuLabels {
  settings: string
  theme: string
  language: string
  themeLight: string
  themeDark: string
  themeSystem: string
  logout: string
}

export const DEFAULT_USER_MENU_LABELS: UserMenuLabels = {
  settings: "Configuración",
  theme: "Tema",
  language: "Idioma",
  themeLight: "Claro",
  themeDark: "Oscuro",
  themeSystem: "Sistema",
  logout: "Cerrar sesión",
}

export const DEFAULT_USER_MENU_LANGUAGES: UserMenuLanguage[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ca", label: "Català" },
]

export type UserMenuTheme = "light" | "dark" | "system"

export interface UserMenuProps {
  user: UserMenuUser
  /** Móvil/desktop antiguo: avatar suelto con tooltip (sin nombre). */
  collapsed?: boolean
  /** Avatar suelto al pie del rail de reinos: píldora de 32px y el menú se abre a la derecha. */
  variant?: "default" | "rail"
  /** Solo en `rail`: con el rail desplegado, el nombre junto al avatar. */
  showName?: boolean
  /** Enlace de Configuración (se pinta con `renderLink`). */
  settingsHref?: string
  theme?: UserMenuTheme | string
  onThemeChange?: (theme: UserMenuTheme) => void
  /** Código del idioma activo. */
  language?: string
  languages?: UserMenuLanguage[]
  onLanguageChange?: (code: string) => void
  onLogout?: () => void
  labels?: Partial<UserMenuLabels>
  renderLink?: SidebarLinkRenderer
}

const THEMES = [
  { value: "light", icon: Sun, labelKey: "themeLight" },
  { value: "dark", icon: Moon, labelKey: "themeDark" },
  { value: "system", icon: Monitor, labelKey: "themeSystem" },
] as const

/** Fila segmentada de TEMA / IDIOMA: activa rellena `bg-muted`, resto ghost. */
const segmentClass = (active: boolean) =>
  cn(
    "flex-1 flex items-center justify-center p-2 rounded-md text-[13px] transition-colors",
    active ? "bg-muted text-foreground" : "hover:bg-muted text-muted-foreground",
  )

const eyebrowClass = "text-[11px] font-medium uppercase tracking-wider text-muted-foreground"

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.slice(0, 2).map((w) => w.charAt(0)).join("")
  return letters.toUpperCase() || "U"
}

/**
 * Menú de usuario: avatar → menú con Configuración · TEMA · IDIOMA · Cerrar
 * sesión. Presentacional: no conoce el proveedor de tema, el idioma ni la
 * sesión; recibe el usuario y los callbacks. La navegación (Configuración) va
 * por `renderLink`.
 */
export function UserMenu({
  user,
  collapsed = false,
  variant = "default",
  showName = false,
  settingsHref = "/settings",
  theme,
  onThemeChange,
  language = "es",
  languages = DEFAULT_USER_MENU_LANGUAGES,
  onLanguageChange,
  onLogout,
  labels,
  renderLink = defaultRenderLink,
}: UserMenuProps) {
  const l = { ...DEFAULT_USER_MENU_LABELS, ...labels }
  const initials = user.initials ?? initialsOf(user.name)
  const fullName = user.name
  const email = user.email
  const isRail = variant === "rail"

  const trigger = isRail ? (
    <button
      type="button"
      aria-label={fullName}
      title={fullName}
      className={cn(
        "flex h-[32px] items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-1 transition-colors",
        // Gris suave: se ve igual sobre el lienzo gris que sobre la tarjeta blanca.
        "hover:bg-sidebar-accent/60",
        showName ? "w-full" : "w-[32px]",
      )}
    >
      <Avatar className="size-6 shrink-0">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="text-[10px] font-medium">{initials}</AvatarFallback>
      </Avatar>
      {showName && <span className="truncate text-[13px] [font-weight:380] text-foreground">{fullName}</span>}
    </button>
  ) : collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="w-full flex items-center justify-center p-2 rounded-md hover:bg-background/70 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{fullName}</TooltipContent>
    </Tooltip>
  ) : (
    <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-background/70 transition-colors">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate leading-tight">{fullName}</p>
        <p className="text-[11px] text-muted-foreground truncate leading-tight">{email}</p>
      </div>
    </button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[232px] p-2"
        align={isRail ? "end" : "start"}
        side={isRail ? "right" : "top"}
        sideOffset={8}
      >
        {/* Cabecera con el usuario - mismo estilo que la sidebar */}
        <div className="flex items-center gap-2 px-2 py-2 mb-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-[11px] font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-tight">{fullName}</p>
            <p className="text-[11px] text-muted-foreground truncate leading-tight">{email}</p>
          </div>
        </div>

        <div className="my-2 border-t border-border" />

        {renderLink({
          href: settingsHref,
          className: cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
          ),
          children: (
            <>
              <Gear className="h-4 w-4 shrink-0" />
              <span>{l.settings}</span>
            </>
          ),
        })}

        <div className="my-2 border-t border-border" />

        {/* Preferencias: TEMA + IDIOMA (mismo patrón eyebrow + fila segmentada) */}
        <div className="px-2 mb-1">
          <span className={eyebrowClass}>{l.theme}</span>
        </div>
        <div className="flex items-center gap-1 px-1">
          {THEMES.map(({ value, icon: Icon, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => onThemeChange?.(value)}
              className={segmentClass(theme === value)}
              title={l[labelKey]}
              aria-pressed={theme === value}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="px-2 mt-3 mb-1">
          <span className={eyebrowClass}>{l.language}</span>
        </div>
        <div className="flex items-center gap-1 px-1" data-testid="user-menu-language">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => onLanguageChange?.(code)}
              className={segmentClass(language === code)}
              aria-pressed={language === code}
              lang={code}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="my-2 border-t border-border" />

        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
            "text-destructive hover:text-destructive hover:bg-destructive/10",
          )}
        >
          <SignOut className="h-4 w-4 shrink-0" />
          <span>{l.logout}</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

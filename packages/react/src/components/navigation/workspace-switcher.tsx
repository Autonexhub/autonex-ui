import { useMemo } from "react"
import { CaretUpDown } from "@phosphor-icons/react"
import { cn } from "../../lib/utils"
import { Combobox, type ComboboxOption } from "../ui/combobox"
import { Skeleton } from "../ui/skeleton"
import { OrganizationAvatar } from "../molecules/organization-avatar"

export interface WorkspaceOrganization {
  id: string
  name: string
  logoUrl?: string | null
}

export interface WorkspaceSwitcherLabels {
  loading: string
  selectOrg: string
  search: string
  noResults: string
}

export const DEFAULT_WORKSPACE_SWITCHER_LABELS: WorkspaceSwitcherLabels = {
  loading: "Cargando...",
  selectOrg: "Seleccionar organización",
  search: "Buscar organización...",
  noResults: "Sin resultados",
}

export interface WorkspaceSwitcherProps {
  organizations: WorkspaceOrganization[]
  /** Organización mostrada en el botón. */
  current?: WorkspaceOrganization | null
  /** Se llama con la organización elegida (la app navega y recuerda la elección). */
  onSelect?: (org: WorkspaceOrganization) => void
  /** Falso (usuarios no admin): se ve el nombre pero no se puede cambiar. */
  canSwitch?: boolean
  loading?: boolean
  /** Rail plegado: solo el avatar. */
  collapsed?: boolean
  labels?: Partial<WorkspaceSwitcherLabels>
}

/**
 * Selector de organización (arriba del rail). Presentacional: recibe la lista
 * y la actual; la carga de datos, el permiso y la navegación son de la app.
 */
export function WorkspaceSwitcher({
  organizations,
  current,
  onSelect,
  canSwitch = true,
  loading = false,
  collapsed = false,
  labels,
}: WorkspaceSwitcherProps) {
  const l = { ...DEFAULT_WORKSPACE_SWITCHER_LABELS, ...labels }

  // Opciones del Combobox oficial (buscador integrado, lista y check).
  const options: ComboboxOption[] = useMemo(
    () =>
      organizations.map((o) => ({
        value: o.id,
        label: o.name,
        icon: <OrganizationAvatar name={o.name} logoUrl={o.logoUrl} className="h-5 w-5" />,
      })),
    [organizations],
  )

  // Sin permiso de cambio: se ve el nombre, sin desplegable.
  if (!canSwitch) {
    return (
      <div className="flex h-[32px] items-center gap-2 px-2">
        <OrganizationAvatar name={current?.name} logoUrl={current?.logoUrl} className="flex-shrink-0" />
        {!collapsed &&
          (loading && !current ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="text-sm font-medium truncate">{current?.name || l.loading}</span>
          ))}
      </div>
    )
  }

  const buttonContent = (
    <>
      <OrganizationAvatar name={current?.name} logoUrl={current?.logoUrl} className="flex-shrink-0" />
      {!collapsed && (
        <>
          {loading && !current ? (
            <Skeleton className="h-4 flex-1 max-w-[8rem]" />
          ) : (
            <span className="text-sm font-medium truncate flex-1 text-left">{current?.name || l.selectOrg}</span>
          )}
          <CaretUpDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </>
      )}
    </>
  )

  return (
    <Combobox
      options={options}
      value={current ? current.id : null}
      onChange={(id) => {
        const org = organizations.find((o) => o.id === id)
        if (org) onSelect?.(org)
      }}
      placeholder={l.search}
      emptyText={loading ? l.loading : l.noResults}
      align="start"
      width={256}
      searchThreshold={0}
      trigger={
        <button
          type="button"
          className={cn(
            // 32px fijos como los ítems de la sidebar (base 15px: py-1.5 daba 30px).
            "flex h-[32px] items-center gap-2 w-full px-2 rounded-md transition-colors",
            "hover:bg-background/70",
            collapsed && "justify-center px-0",
          )}
        >
          {buttonContent}
        </button>
      }
    />
  )
}

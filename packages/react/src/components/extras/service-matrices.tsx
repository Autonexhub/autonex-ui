import { memo, useMemo, useState, type ReactNode } from "react"
import { Buildings, CaretDown, Check, Tag, Warning } from "@phosphor-icons/react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { EmptyState } from "../molecules/empty-state"
import { cn } from "../../lib/utils"
import { DEFAULT_EXTRAS_LOCALE, formatMoney } from "./format"
import {
  cellKey,
  cellOf,
  differsFromMajority,
  indexPrices,
  isConfirmed,
  majorityPrice,
  matrixKey,
  type ConfirmedPrices,
  type PriceCell,
  type PriceIndex,
  type ServicePriceRecord,
} from "./service-prices"

// ------------------------------------------------------------- tipos de datos

/** Servicio del catálogo tal y como lo pintan las matrices. */
export interface MatrixService {
  id: number
  name: string
  family_id: number | null
  is_active: boolean
  /** Precio base: lo que cobra todo lo que no tiene un precio propio. */
  price?: number | null
  currency?: string
}

export interface MatrixFamily {
  id: number
  name: string
}

export interface MatrixWorker {
  id: number
  name: string
}

export interface MatrixLocation {
  id: number
  name: string
}

export interface MatrixTariff {
  id: number
  name: string
  is_default: boolean
}

// --------------------------------------------------- agrupar servicios por familia

/** Id sintético del grupo "Sin familia": todo servicio cuyo `family_id` es null, o apunta a una familia que ya no existe. */
export const SIN_FAMILIA = -1

/**
 * Agrupa `services` por familia exactamente como los va a pintar la matriz:
 * una entrada por familia con al menos un servicio (en el mismo orden que
 * `families`) y, al final, "Sin familia" si queda algún servicio sin una
 * familia válida.
 */
export function groupServicesByFamily<S extends MatrixService>(
  services: S[],
  families: MatrixFamily[],
  noFamilyLabel = "Sin familia",
): Array<{ id: number; name: string; servicios: S[] }> {
  // Un servicio que apunta a una familia que no está en `families` cae en "Sin familia" en vez de desaparecer.
  const idsFamilia = new Set(families.map((f) => f.id))

  const porFamilia = new Map<number, S[]>()
  for (const s of services) {
    const fid = s.family_id != null && idsFamilia.has(s.family_id) ? s.family_id : SIN_FAMILIA
    if (!porFamilia.has(fid)) porFamilia.set(fid, [])
    porFamilia.get(fid)!.push(s)
  }

  return [
    ...families
      .filter((f) => (porFamilia.get(f.id)?.length ?? 0) > 0)
      .map((f) => ({ id: f.id, name: f.name, servicios: porFamilia.get(f.id)! })),
    ...(porFamilia.has(SIN_FAMILIA)
      ? [{ id: SIN_FAMILIA, name: noFamilyLabel, servicios: porFamilia.get(SIN_FAMILIA)! }]
      : []),
  ]
}

/** Ids de los grupos que las matrices van a pintar para este `services`/`families`. */
export function getMatrixGroupIds(services: MatrixService[], families: MatrixFamily[]): number[] {
  return groupServicesByFamily(services, families).map((f) => f.id)
}

// --------------------------------------------------------- FamilyServiceMatrix

type EstadoFamilia = "todos" | "ninguno" | "mezcla"

export interface FamilyServiceMatrixLabels {
  service: string
  noFamily: string
  expand: (familyName: string) => string
  collapse: (familyName: string) => string
  toggleFamily: (familyName: string) => string
  /** aria-label de una celda: "Ahlem presta Sesión de 1 hora". */
  serves: (workerName: string, serviceName: string) => string
}

export const DEFAULT_FAMILY_SERVICE_MATRIX_LABELS: FamilyServiceMatrixLabels = {
  service: "Servicio",
  noFamily: "Sin familia",
  expand: (name) => `Desplegar ${name}`,
  collapse: (name) => `Plegar ${name}`,
  toggleFamily: (name) => `Activar o desactivar toda la familia ${name}`,
  serves: (worker, service) => `${worker} presta ${service}`,
}

interface FamilyRowProps {
  service: MatrixService
  workers: MatrixWorker[]
  /** El Map entero de la matriz — misma clave `${workerId}|${serviceId}` que usa el padre. */
  value: Map<string, boolean>
  defaultEnabled: boolean
  onChange: (workerId: number, serviceId: number, next: boolean) => void
  serves: FamilyServiceMatrixLabels["serves"]
}

function FamilyRowImpl({ service, workers, value, defaultEnabled, onChange, serves }: FamilyRowProps) {
  return (
    <tr className="hover:bg-muted/30">
      <td className="sticky left-0 z-10 min-w-[280px] border-b border-r border-border bg-background p-2">{service.name}</td>
      {workers.map((w) => (
        <td key={w.id} className="border-b border-border p-2 text-center">
          <Checkbox
            checked={value.get(matrixKey(w.id, service.id)) ?? defaultEnabled}
            onCheckedChange={(next) => onChange(w.id, service.id, next === true)}
            aria-label={serves(w.name, service.name)}
          />
        </td>
      ))}
    </tr>
  )
}

/**
 * Fila de un servicio, memoizada: a la escala de este módulo (479 servicios,
 * decenas de trabajadores por centro) tocar UNA celda no debe re-renderizar
 * las demás miles de filas. El comparador custom mira solo las celdas de ESTE
 * servicio (una por trabajador) y deja pasar el resto.
 */
const FamilyRow = memo(FamilyRowImpl, (prev, next) => {
  if (
    prev.service !== next.service ||
    prev.workers !== next.workers ||
    prev.defaultEnabled !== next.defaultEnabled ||
    prev.onChange !== next.onChange ||
    prev.serves !== next.serves
  ) {
    return false
  }
  if (prev.value === next.value) return true
  for (const w of next.workers) {
    const key = matrixKey(w.id, next.service.id)
    if ((prev.value.get(key) ?? next.defaultEnabled) !== (next.value.get(key) ?? next.defaultEnabled)) {
      return false
    }
  }
  return true
})

export interface FamilyServiceMatrixProps {
  workers: MatrixWorker[]
  services: MatrixService[]
  families: MatrixFamily[]
  /** Celdas cambiadas o cargadas: clave `${workerId}|${serviceId}` → habilitado. */
  value: Map<string, boolean>
  /** Qué significa una celda sin valor (lo decide la organización). */
  defaultEnabled: boolean
  /** Familias plegadas (ids). */
  collapsed: Set<number>
  onToggleFamily: (familyId: number) => void
  onChange: (workerId: number, serviceId: number, next: boolean) => void
  onChangeMany: (cambios: Array<{ workerId: number; serviceId: number; next: boolean }>) => void
  labels?: Partial<FamilyServiceMatrixLabels>
}

/**
 * Grid de servicios (agrupados por familia, colapsable) × trabajadores.
 * Controlado y sin estado propio de datos: solo pinta `value` y avisa mediante
 * `onChange`/`onChangeMany`/`onToggleFamily`. No hace fetch ni guarda copia local.
 */
export function FamilyServiceMatrix({
  workers,
  services,
  families,
  value,
  defaultEnabled,
  collapsed,
  onToggleFamily,
  onChange,
  onChangeMany,
  labels,
}: FamilyServiceMatrixProps) {
  const l = useMemo(() => ({ ...DEFAULT_FAMILY_SERVICE_MATRIX_LABELS, ...labels }), [labels])
  const filas = useMemo(() => groupServicesByFamily(services, families, l.noFamily), [services, families, l.noFamily])

  // Estado tri-estado por familia, calculado UNA vez por render (no dentro de cada celda).
  const estadosFamilia = useMemo(() => {
    const mapa = new Map<number, EstadoFamilia>()
    for (const familia of filas) {
      let activos = 0
      let total = 0
      for (const s of familia.servicios) {
        for (const w of workers) {
          total += 1
          if (value.get(matrixKey(w.id, s.id)) ?? defaultEnabled) activos += 1
        }
      }
      mapa.set(familia.id, activos === 0 ? "ninguno" : activos === total ? "todos" : "mezcla")
    }
    return mapa
  }, [filas, workers, value, defaultEnabled])

  const alternarFamilia = (familyServices: MatrixService[], estado: EstadoFamilia) => {
    const next = estado !== "todos"
    onChangeMany(familyServices.flatMap((s) => workers.map((w) => ({ workerId: w.id, serviceId: s.id, next }))))
  }

  return (
    <div className="overflow-auto rounded-lg border border-border">
      <table className="min-w-max border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-background">
          <tr>
            <th className="sticky left-0 z-20 min-w-[280px] border-b border-r border-border bg-muted p-2 text-left font-medium">
              {l.service}
            </th>
            {workers.map((w) => (
              <th key={w.id} className="min-w-[110px] border-b border-border bg-muted p-2 text-center font-medium">
                <span className="block truncate text-xs">{w.name}</span>
              </th>
            ))}
          </tr>
        </thead>

        {filas.map((familia) => {
          const estado = estadosFamilia.get(familia.id) ?? "ninguno"
          const plegada = collapsed.has(familia.id)

          return (
            <tbody key={familia.id}>
              <tr>
                <td colSpan={workers.length + 1} className="border-b border-border bg-muted/50 p-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleFamily(familia.id)}
                      aria-expanded={!plegada}
                      aria-label={plegada ? l.expand(familia.name) : l.collapse(familia.name)}
                      className="inline-flex items-center justify-center rounded-4xl p-0.5 transition-colors hover:bg-muted"
                    >
                      <CaretDown className={cn("h-4 w-4 transition-transform duration-200 ease-out", plegada && "-rotate-90")} />
                    </button>
                    <Checkbox
                      className="bg-background"
                      checked={estado === "todos" ? true : estado === "ninguno" ? false : "indeterminate"}
                      onCheckedChange={() => alternarFamilia(familia.servicios, estado)}
                      aria-label={l.toggleFamily(familia.name)}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider">{familia.name}</span>
                    <span className="text-xs text-muted-foreground">({familia.servicios.length})</span>
                  </div>
                </td>
              </tr>

              {/* Sin `Collapsible` a propósito: su animación va a height: var(--radix-collapsible-content-height),
                  que solo define el componente de Radix, y envolver <tr> en su <div> rompería la tabla.
                  El chevron sí anima. */}
              {!plegada &&
                familia.servicios.map((s) => (
                  <FamilyRow
                    key={s.id}
                    service={s}
                    workers={workers}
                    value={value}
                    defaultEnabled={defaultEnabled}
                    onChange={onChange}
                    serves={l.serves}
                  />
                ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

// ---------------------------------------------------------- ServicePriceMatrix

export interface PriceEdit {
  serviceId: number
  locationId: number
  tariffId: number
  /** `null` = quitar el precio de esa tarifa en ese centro. */
  price: number | null
}

export interface ServicePriceMatrixLabels {
  service: string
  noPrice: string
  draft: string
  zeroTitle: string
  inheritedTitle: string
  notServedTitle: string
  notServedEditableTitle: string
  /** aria-label de una celda: "Precio de X en Chamberí, Abonado". */
  cellLabel: (serviceName: string, columnLabel: string) => string
  zeroQuestion: string
  /** "Los demás centros cobran 10,45 €." */
  othersCharge: (amount: string) => string
  differentPrices: string
  changePrice: string
  confirm: string
  expand: (familyName: string) => string
  collapse: (familyName: string) => string
  noFamily: string
  noLocationsTitle: string
  noLocationsDescription: string
  noTariffsTitle: string
  noTariffsDescription: string
}

export const DEFAULT_SERVICE_PRICE_MATRIX_LABELS: ServicePriceMatrixLabels = {
  service: "Servicio",
  noPrice: "Sin precio",
  draft: "Borrador",
  zeroTitle: "Precio a 0 €: conviene revisarlo",
  inheritedTitle: "Precio heredado: no tiene uno propio en esta tarifa",
  notServedTitle: "No se presta en este centro",
  notServedEditableTitle: "No se presta en este centro. Pulsa para añadir un precio.",
  cellLabel: (service, column) => `Precio de ${service} en ${column}`,
  zeroQuestion: "El precio es 0 €. ¿Es gratis de verdad?",
  othersCharge: (amount) => `Los demás centros cobran ${amount}.`,
  differentPrices: "Los centros cobran precios distintos en esta tarifa.",
  changePrice: "Cambiar precio",
  confirm: "Es correcto",
  expand: (name) => `Desplegar ${name}`,
  collapse: (name) => `Plegar ${name}`,
  noFamily: "Sin familia",
  noLocationsTitle: "Todavía no hay centros",
  noLocationsDescription: "Crea un centro para poder poner precios.",
  noTariffsTitle: "Todavía no hay tarifas",
  noTariffsDescription: "Crea una tarifa, o pon el primer precio en la ficha de un servicio y se creará la tarifa «General».",
}

interface Column {
  key: string
  label: string
  locationId: number
  tariffId: number
  /** Primera tarifa de su centro: lleva la raya que separa un centro del siguiente. */
  firstOfLocation: boolean
  /** "Chamberí · Abonado" (o solo "Chamberí" con una tarifa), para el recuadro de aviso. */
  place: string
}

export interface ServicePriceMatrixProps {
  services: MatrixService[]
  families: MatrixFamily[]
  locations: MatrixLocation[]
  tariffs: MatrixTariff[]
  /** Todos los precios de la organización (servicio × centro × tarifa). */
  prices: ServicePriceRecord[]
  /** Familias plegadas (ids). */
  collapsed: Set<number>
  onToggleFamily: (familyId: number) => void
  /** Sin esta función la matriz es de solo lectura. */
  onEditPrice?: (edit: PriceEdit) => void | Promise<void>
  /** Acción del vacío sin tarifas (ej: ir a la pestaña Tarifas). */
  emptyAction?: ReactNode
  /** Precios dados por buenos: esas celdas no se marcan en naranja ni en rojo. */
  confirmed?: ConfirmedPrices
  /** "Es correcto" en el recuadro de una celda que avisa. */
  onConfirmPrice?: (cell: PriceEdit & { price: number }) => Promise<void>
  labels?: Partial<ServicePriceMatrixLabels>
  /** Etiqueta BCP-47 para los importes. */
  locale?: string
}

interface PriceCellViewProps {
  cell: PriceCell
  currency: string
  locale: string
  labels: ServicePriceMatrixLabels
  /** El precio se aparta de los demás centros en la misma tarifa. */
  differs: boolean
  /** Alguien lo dio por bueno ("Es correcto") con este precio: no avisa. */
  confirmed: boolean
  label: string
  /** "Chamberí · Abonado": título del recuadro de aviso. */
  place: string
  /** Lo que cobran los demás centros en esa tarifa, para explicar el aviso naranja. */
  usual: number | null
  onCommit?: (price: number | null) => void | Promise<void>
  /** Da por bueno el precio de la celda: sin esto, el aviso solo deja cambiar el precio. */
  onConfirm?: () => Promise<void>
}

function PriceCellView({
  cell,
  currency,
  locale,
  labels: l,
  differs,
  confirmed,
  label,
  place,
  usual,
  onCommit,
  onConfirm,
}: PriceCellViewProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  // Una celda que avisa (naranja o roja) no se edita al pulsarla: primero explica el
  // aviso y deja elegir entre darlo por bueno o cambiar el precio.
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const gratis = (cell.kind === "precio" || cell.kind === "heredado") && cell.price === 0 && !confirmed
  const avisa = differs || gratis

  const empezar = () => {
    if (!onCommit) return
    setDraft(cell.kind === "precio" && cell.price != null ? String(cell.price) : "")
    setEditing(true)
  }

  const terminar = (guardar: boolean) => {
    setEditing(false)
    if (!guardar || !onCommit) return
    const texto = draft.trim()
    const escrito = texto === "" ? null : Number(texto)
    if (escrito !== null && !Number.isFinite(escrito)) return
    const numero = escrito === null ? null : Math.round(escrito * 100) / 100
    const actual = cell.kind === "precio" ? cell.price : null
    if (numero !== actual) void onCommit(numero)
  }

  if (editing) {
    return (
      <Input
        autoFocus
        type="number"
        inputMode="decimal"
        step="0.05"
        min="0"
        className="ml-auto h-8 w-24 text-right"
        value={draft}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => terminar(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") terminar(true)
          if (e.key === "Escape") terminar(false)
        }}
      />
    )
  }

  const contenido =
    cell.kind === "precio" || cell.kind === "heredado" ? (
      <>
        {gratis && <Warning className="mr-1 inline h-3.5 w-3.5" aria-hidden />}
        {formatMoney(cell.price ?? 0, currency, locale)}
      </>
    ) : cell.kind === "sin-precio" ? (
      l.noPrice
    ) : (
      "—"
    )

  const boton = (
    <button
      type="button"
      onClick={avisa && onCommit ? () => setAvisoAbierto(true) : empezar}
      disabled={!onCommit}
      aria-label={label}
      title={
        gratis
          ? l.zeroTitle
          : cell.kind === "heredado"
            ? l.inheritedTitle
            : cell.kind === "no-se-presta"
              ? onCommit
                ? l.notServedEditableTitle
                : l.notServedTitle
              : undefined
      }
      className={cn(
        "w-full rounded-md px-2 py-1 text-right tabular-nums transition-colors",
        onCommit && "hover:bg-muted",
        (cell.kind === "sin-precio" || cell.kind === "no-se-presta" || cell.kind === "heredado") && "text-muted-foreground",
        differs && "bg-warning-soft font-medium text-warning hover:bg-warning-soft",
        gratis && "bg-destructive/10 font-medium text-destructive hover:bg-destructive/10",
      )}
    >
      {contenido}
    </button>
  )

  if (!avisa || !onCommit) return boton

  const confirmar = async () => {
    if (!onConfirm) return
    setConfirmando(true)
    try {
      await onConfirm()
      setAvisoAbierto(false)
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <Popover open={avisoAbierto} onOpenChange={setAvisoAbierto}>
      <PopoverTrigger asChild>{boton}</PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3 text-sm">
        <div>
          <p className="font-medium">
            {place}: <span className="tabular-nums">{formatMoney(cell.price ?? 0, currency, locale)}</span>
          </p>
          <p className="mt-1 text-muted-foreground">
            {gratis
              ? l.zeroQuestion
              : usual !== null
                ? l.othersCharge(formatMoney(usual, currency, locale))
                : l.differentPrices}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAvisoAbierto(false)
              empezar()
            }}
          >
            {l.changePrice}
          </Button>
          {onConfirm && (
            <Button size="sm" disabled={confirmando} onClick={() => void confirmar()}>
              <Check className="mr-1.5 h-4 w-4" />
              {l.confirm}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface PriceRowProps {
  service: MatrixService
  columnas: Column[]
  index: PriceIndex
  defaultTariffId: number | null
  confirmed?: ConfirmedPrices
  labels: ServicePriceMatrixLabels
  locale: string
  onEditPrice?: (edit: PriceEdit) => void | Promise<void>
  onConfirmPrice?: (cell: PriceEdit & { price: number }) => Promise<void>
}

function PriceRow({ service, columnas, index, defaultTariffId, confirmed, labels, locale, onEditPrice, onConfirmPrice }: PriceRowProps) {
  const celdas = columnas.map((c) =>
    cellOf(index, service.id, c.locationId, c.tariffId, { basePrice: service.price ?? null, defaultTariffId }),
  )
  // Naranja: en una misma tarifa, el centro que cobra distinto que la mayoría.
  const marcas = celdas.map(() => false)
  const habituales: Array<number | null> = celdas.map(() => null)
  const porTarifa = new Map<number, number[]>()
  columnas.forEach((c, i) => porTarifa.set(c.tariffId, [...(porTarifa.get(c.tariffId) ?? []), i]))
  for (const posiciones of porTarifa.values()) {
    const precios = posiciones.map((i) => celdas[i].price)
    const difiere = differsFromMajority(precios)
    const habitual = majorityPrice(precios)
    posiciones.forEach((i, k) => {
      marcas[i] = difiere[k]
      habituales[i] = habitual
    })
  }
  const confirmadas = columnas.map((c, i) => isConfirmed(confirmed, cellKey(service.id, c.locationId, c.tariffId), celdas[i].price))

  return (
    <tr className="hover:bg-muted/30">
      <td className="sticky left-0 z-10 min-w-[280px] border-b border-r border-border bg-background p-2">
        <span className={cn(!service.is_active && "text-muted-foreground")}>{service.name}</span>
        {!service.is_active && (
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {labels.draft}
          </Badge>
        )}
      </td>
      {columnas.map((c, i) => (
        <td key={c.key} className={cn("border-b border-border p-1", c.firstOfLocation && "border-l")}>
          <PriceCellView
            cell={celdas[i]}
            currency={service.currency || "EUR"}
            locale={locale}
            labels={labels}
            differs={marcas[i] && !confirmadas[i]}
            confirmed={confirmadas[i]}
            place={c.place}
            usual={habituales[i]}
            label={labels.cellLabel(service.name, c.label)}
            onCommit={
              onEditPrice
                ? (price) => onEditPrice({ serviceId: service.id, locationId: c.locationId, tariffId: c.tariffId, price })
                : undefined
            }
            onConfirm={
              onConfirmPrice && celdas[i].price !== null
                ? () =>
                    onConfirmPrice({
                      serviceId: service.id,
                      locationId: c.locationId,
                      tariffId: c.tariffId,
                      price: celdas[i].price as number,
                    })
                : undefined
            }
          />
        </td>
      ))}
    </tr>
  )
}

/**
 * Matriz de precios: servicios (agrupados por familia, plegables) × todos los centros
 * × todas las tarifas, con doble cabecera (centro arriba, tarifas debajo), como la hoja
 * de cálculo de un cliente. No esconde nada: para ver menos se filtran los centros que
 * se pasan en `locations`. Controlada y sin datos propios: no hace fetch, solo pinta
 * `prices` y avisa de cada edición con `onEditPrice`.
 *
 * Una celda distingue: un precio propio, un precio heredado en gris (la tarifa no tiene
 * uno propio y cobra el de la tarifa por defecto del centro o el precio base), "Sin
 * precio" (se presta pero ninguna capa tiene precio) y "—" (no se presta en ese centro).
 * En naranja, el centro que cobra distinto que los demás en la misma tarifa; en rojo, 0 €.
 * Pulsar una de esas celdas abre un recuadro que explica el aviso y deja elegir entre
 * "Es correcto" (deja de avisar mientras el precio siga igual) y "Cambiar precio".
 */
export function ServicePriceMatrix({
  services,
  families,
  locations,
  tariffs,
  prices,
  collapsed,
  onToggleFamily,
  onEditPrice,
  emptyAction,
  confirmed,
  onConfirmPrice,
  labels,
  locale = DEFAULT_EXTRAS_LOCALE,
}: ServicePriceMatrixProps) {
  const l = useMemo(() => ({ ...DEFAULT_SERVICE_PRICE_MATRIX_LABELS, ...labels }), [labels])
  const index = useMemo(() => indexPrices(prices), [prices])
  const defaultTariffId = useMemo(() => tariffs.find((t) => t.is_default)?.id ?? null, [tariffs])
  const grupos = useMemo(() => groupServicesByFamily(services, families, l.noFamily), [services, families, l.noFamily])
  const variasTarifas = tariffs.length > 1

  const columnas: Column[] = useMemo(
    () =>
      locations.flatMap((loc) =>
        tariffs.map((t, j) => ({
          key: `${loc.id}|${t.id}`,
          label: variasTarifas ? `${loc.name}, ${t.name}` : loc.name,
          locationId: loc.id,
          tariffId: t.id,
          firstOfLocation: j === 0,
          place: variasTarifas ? `${loc.name} · ${t.name}` : loc.name,
        })),
      ),
    [locations, tariffs, variasTarifas],
  )

  if (locations.length === 0 || tariffs.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-elev">
        {locations.length === 0 ? (
          <EmptyState
            icon={<Buildings className="h-8 w-8" />}
            title={l.noLocationsTitle}
            description={l.noLocationsDescription}
          />
        ) : (
          <EmptyState
            icon={<Tag className="h-8 w-8" />}
            title={l.noTariffsTitle}
            description={l.noTariffsDescription}
            action={emptyAction}
          />
        )}
      </div>
    )
  }

  const celdaCabecera = "border-b border-border bg-muted p-2 font-medium"

  return (
    <div className="overflow-auto rounded-xl border bg-card shadow-elev">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-background">
          <tr>
            <th
              rowSpan={variasTarifas ? 2 : 1}
              className={cn(celdaCabecera, "sticky left-0 z-20 min-w-[280px] border-r text-left")}
            >
              {l.service}
            </th>
            {locations.map((loc) => (
              <th
                key={loc.id}
                colSpan={tariffs.length}
                className={cn(celdaCabecera, "border-l", variasTarifas ? "text-center font-semibold" : "min-w-[110px] text-right")}
              >
                {loc.name}
              </th>
            ))}
          </tr>
          {variasTarifas && (
            <tr>
              {columnas.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    celdaCabecera,
                    "min-w-[110px] text-right text-xs font-normal text-muted-foreground",
                    c.firstOfLocation && "border-l",
                  )}
                >
                  {tariffs.find((t) => t.id === c.tariffId)?.name}
                </th>
              ))}
            </tr>
          )}
        </thead>

        {grupos.map((grupo) => {
          const plegada = collapsed.has(grupo.id)
          return (
            <tbody key={grupo.id}>
              <tr>
                <td colSpan={columnas.length + 1} className="border-b border-border bg-muted/50 p-2">
                  <div className="sticky left-2 inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleFamily(grupo.id)}
                      aria-expanded={!plegada}
                      aria-label={plegada ? l.expand(grupo.name) : l.collapse(grupo.name)}
                      className="inline-flex items-center justify-center rounded-4xl p-0.5 transition-colors hover:bg-muted"
                    >
                      <CaretDown className={cn("h-4 w-4 transition-transform duration-200 ease-out", plegada && "-rotate-90")} />
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-wider">{grupo.name}</span>
                    <span className="text-xs text-muted-foreground">({grupo.servicios.length})</span>
                  </div>
                </td>
              </tr>
              {!plegada &&
                grupo.servicios.map((s) => (
                  <PriceRow
                    key={s.id}
                    service={s}
                    columnas={columnas}
                    index={index}
                    defaultTariffId={defaultTariffId}
                    confirmed={confirmed}
                    labels={l}
                    locale={locale}
                    onEditPrice={onEditPrice}
                    onConfirmPrice={onConfirmPrice}
                  />
                ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

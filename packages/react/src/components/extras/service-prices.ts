/**
 * Lógica pura de precios de servicios (centro × tarifa) y de sus avisos de revisión. Sin datos propios ni
 * dependencias de la app: los tipos son estructurales, así que sirven los de cualquier API con esos campos.
 */

/** Fila de precio de un servicio en un centro y una tarifa. */
export interface ServicePriceRecord {
  service_id: number
  location_id: number
  tariff_id: number
  price: number | null
  vat: number | null
  currency: string | null
}

/**
 * Id de la "tarifa única" de una organización que aún no tiene ninguna: la
 * pantalla pinta una sola columna de precio y, al guardar, el backend crea la
 * tarifa por defecto. No se manda como `tariff_id`.
 */
export const TARIFA_UNICA = 0

/** Clave de una celda de precio dentro de un servicio: centro × tarifa. */
export const priceKey = (locationId: number, tariffId: number) => `${locationId}|${tariffId}`

export interface PriceRowPayload {
  location_id: number
  tariff_id?: number
  price: number | null
  vat: number | null
  currency: string | null
}

interface BuildPriceRowsArgs {
  locationIds: number[]
  /** Columnas de tarifa que la pantalla pinta; `[TARIFA_UNICA]` si la org no tiene tarifas. */
  tariffIds: number[]
  defaultTariffId: number
  /** Casilla "se presta aquí" de cada centro. */
  sePresta: Map<number, boolean>
  /** Texto de cada celda, por `priceKey`. */
  inputs: Map<string, string>
  /** Filas que ya tiene el servidor, por `priceKey`. */
  originals: Map<string, ServicePriceRecord>
}

const withTariff = (tariffId: number, row: Omit<PriceRowPayload, "tariff_id">): PriceRowPayload =>
  tariffId === TARIFA_UNICA ? row : { ...row, tariff_id: tariffId }

/**
 * Filas de precio que hay que mandar al guardar un servicio.
 *
 * Por cada centro que se presta, una fila por cada tarifa con precio escrito, y
 * se conserva la fila de una tarifa que ya existía a "precio de catálogo" (el
 * campo vacío no la borra: borrarla es vaciar un precio que sí tenía valor).
 * Un centro que se presta pero sin ningún precio queda como una fila a precio
 * de catálogo en la tarifa por defecto, para que siga constando que se presta.
 * Un centro que no se presta no manda nada: el backend lo retira por el
 * `scope_location_ids`, y con él todas sus tarifas.
 */
export function buildPriceRows(a: BuildPriceRowsArgs): PriceRowPayload[] {
  const rows: PriceRowPayload[] = []
  for (const locationId of a.locationIds) {
    if (!(a.sePresta.get(locationId) ?? false)) continue

    const conservadas: PriceRowPayload[] = []
    for (const tariffId of a.tariffIds) {
      const key = priceKey(locationId, tariffId)
      const texto = (a.inputs.get(key) ?? "").trim()
      const original = a.originals.get(key)
      if (texto === "" && !(original && original.price === null)) continue
      const numero = texto === "" ? NaN : Number(texto)
      conservadas.push(
        withTariff(tariffId, {
          location_id: locationId,
          price: Number.isFinite(numero) ? numero : null,
          vat: original?.vat ?? null,
          currency: original?.currency ?? null,
        }),
      )
    }
    if (conservadas.length === 0) {
      conservadas.push(withTariff(a.defaultTariffId, { location_id: locationId, price: null, vat: null, currency: null }))
    }
    rows.push(...conservadas)
  }
  return rows
}

/**
 * Qué precio cobra una celda que se deja vacía. Es la regla de herencia del
 * backend: la tarifa por defecto del mismo centro y, si tampoco tiene, el precio
 * base del servicio. La tarifa por defecto solo puede heredar del precio base.
 */
export function inheritedPrice(a: {
  basePrice: number | null
  tariffId: number
  defaultTariffId: number
  /** Texto de la celda de la tarifa por defecto en ese mismo centro. */
  defaultText: string
}): number | null {
  if (a.tariffId !== a.defaultTariffId && a.defaultText.trim() !== "") {
    const n = Number(a.defaultText)
    if (Number.isFinite(n)) return n
  }
  return a.basePrice
}

/** Los precios de una organización indexados para pintar la matriz sin recorrerlos por celda. */
export interface PriceIndex {
  byKey: Map<string, ServicePriceRecord>
  /** `${serviceId}|${locationId}` de cada servicio que se presta en un centro, con la tarifa que sea. */
  offered: Set<string>
}

export function indexPrices(prices: ServicePriceRecord[]): PriceIndex {
  const byKey = new Map<string, ServicePriceRecord>()
  const offered = new Set<string>()
  for (const p of prices) {
    byKey.set(`${p.service_id}|${p.location_id}|${p.tariff_id}`, p)
    offered.add(`${p.service_id}|${p.location_id}`)
  }
  return { byKey, offered }
}

export type CellKind = "precio" | "heredado" | "sin-precio" | "no-se-presta"

export interface PriceCell {
  kind: CellKind
  price: number | null
}

/**
 * Qué enseña la celda de un servicio en un centro y una tarifa:
 * - `precio`: tiene precio propio;
 * - `heredado`: el servicio se presta en el centro y cobra el de la tarifa por defecto
 *   del centro o, si no, el precio base (la misma regla que `resolvePrice` del backend);
 * - `sin-precio`: se presta pero ninguna capa tiene precio;
 * - `no-se-presta`: el servicio no se presta en ese centro.
 */
export function cellOf(
  index: PriceIndex,
  serviceId: number,
  locationId: number,
  tariffId: number,
  herencia: { basePrice: number | null; defaultTariffId: number | null },
): PriceCell {
  const propio = index.byKey.get(`${serviceId}|${locationId}|${tariffId}`)?.price ?? null
  if (propio !== null) return { kind: "precio", price: propio }
  if (!index.offered.has(`${serviceId}|${locationId}`)) return { kind: "no-se-presta", price: null }

  const deDefecto =
    herencia.defaultTariffId !== null && herencia.defaultTariffId !== tariffId
      ? (index.byKey.get(`${serviceId}|${locationId}|${herencia.defaultTariffId}`)?.price ?? null)
      : null
  const heredado = deDefecto ?? herencia.basePrice
  return heredado !== null ? { kind: "heredado", price: heredado } : { kind: "sin-precio", price: null }
}

/**
 * Qué precios se apartan de los demás al comparar centros. Se marca el que no
 * es el mayoritario; en un empate se marcan todos los distintos, porque no hay
 * un "normal" frente al que apartarse. Un solo precio, o todos iguales, no
 * marca nada.
 */
export function differsFromMajority(values: Array<number | null>): boolean[] {
  const presentes = values.filter((v): v is number => v !== null)
  const conteo = new Map<number, number>()
  for (const v of presentes) conteo.set(v, (conteo.get(v) ?? 0) + 1)
  if (conteo.size < 2) return values.map(() => false)

  const maximo = Math.max(...conteo.values())
  const lideres = [...conteo.entries()].filter(([, n]) => n === maximo).map(([v]) => v)
  if (lideres.length > 1) return values.map((v) => v !== null)
  return values.map((v) => v !== null && v !== lideres[0])
}

/** Precios dados por buenos, por `${servicio}|${centro}|${tarifa}` → precio confirmado. */
export type ConfirmedPrices = Map<string, number>

export const cellKey = (serviceId: number, locationId: number, tariffId: number) => `${serviceId}|${locationId}|${tariffId}`

export function indexConfirmed(
  reviews: Array<{ service_id: number; location_id: number; tariff_id: number; confirmed_price: number }>,
): ConfirmedPrices {
  return new Map(reviews.map((r) => [cellKey(r.service_id, r.location_id, r.tariff_id), Number(r.confirmed_price)]))
}

/** Una celda que alguien ha dado por buena con el precio que tiene ahora. */
export const isConfirmed = (confirmed: ConfirmedPrices | undefined, key: string, price: number | null) =>
  price !== null && confirmed?.get(key) === price

export type ReviewKind = "borrador" | "sin-precio" | "distinto" | "cero"

export interface ReviewIssue {
  kind: ReviewKind
  label: string
}

/** Un precio concreto que avisa y que se puede dar por bueno ("Es correcto"). */
export interface PriceCellIssue {
  kind: "distinto" | "cero"
  locationId: number
  tariffId: number
  price: number
  /** Lo que cobran los demás centros en esa tarifa (solo en `distinto`). */
  usual: number | null
}

interface ServicePricingArgs {
  serviceId: number
  basePrice: number | null
  locations: Array<{ id: number; name: string }>
  tariffs: Array<{ id: number; name: string }>
  defaultTariffId: number | null
  index: PriceIndex
  confirmed?: ConfirmedPrices
}

/** El precio que más se repite, o null si no hay uno claro (empate o ninguno). */
export function majorityPrice(values: Array<number | null>): number | null {
  const conteo = new Map<number, number>()
  for (const v of values) if (v !== null) conteo.set(v, (conteo.get(v) ?? 0) + 1)
  const max = Math.max(0, ...conteo.values())
  const lideres = [...conteo.entries()].filter(([, n]) => n === max)
  return lideres.length === 1 ? lideres[0][0] : null
}

/**
 * Los precios de un servicio que avisan: el centro que cobra distinto que la mayoría
 * en una tarifa y los de 0 €. Una celda dada por buena con su precio actual no avisa.
 * Usa la misma herencia que la matriz (`cellOf`), así que avisa de lo que se ve.
 */
export function priceCellIssues(a: ServicePricingArgs): PriceCellIssue[] {
  const herencia = { basePrice: a.basePrice, defaultTariffId: a.defaultTariffId }
  const centros = a.locations.filter((l) => a.index.offered.has(`${a.serviceId}|${l.id}`))
  const issues: PriceCellIssue[] = []
  for (const t of a.tariffs) {
    const celdas = centros.map((l) => cellOf(a.index, a.serviceId, l.id, t.id, herencia))
    const precios = celdas.map((c) => c.price)
    const marcas = differsFromMajority(precios)
    const usual = majorityPrice(precios)
    centros.forEach((l, i) => {
      const price = celdas[i].price
      if (price === null || isConfirmed(a.confirmed, cellKey(a.serviceId, l.id, t.id), price)) return
      if (price === 0) issues.push({ kind: "cero", locationId: l.id, tariffId: t.id, price, usual: null })
      else if (marcas[i]) issues.push({ kind: "distinto", locationId: l.id, tariffId: t.id, price, usual })
    })
  }
  return issues
}

/** Textos de las etiquetas de revisión; cada una recibe el nombre del centro. */
export interface ReviewIssueLabels {
  draft: string
  noPrice: (locationName: string) => string
  different: (locationName: string) => string
  zero: (locationName: string) => string
}

export const DEFAULT_REVIEW_ISSUE_LABELS: ReviewIssueLabels = {
  draft: "Borrador",
  noPrice: (loc) => `Sin precio en ${loc}`,
  different: (loc) => `Precio distinto en ${loc}`,
  zero: (loc) => `0 € en ${loc}`,
}

/**
 * Lo que hay que revisar de un servicio, para avisarlo en la lista sin tener que
 * buscarlo con filtros:
 * - `borrador`: está inactivo, cargado pero sin confirmar;
 * - `sin-precio`: se presta en un centro y ninguna tarifa cobra nada allí (que falte
 *   una tarifa suelta no es un error: un servicio puede ir solo por Abonado/No abonado);
 * - `distinto` / `cero`: los de `priceCellIssues`, resumidos por centro.
 */
export function reviewIssues(
  a: ServicePricingArgs & { isActive: boolean; labels?: Partial<ReviewIssueLabels> },
): ReviewIssue[] {
  const l = { ...DEFAULT_REVIEW_ISSUE_LABELS, ...a.labels }
  const issues: ReviewIssue[] = []
  const add = (kind: ReviewKind, label: string) => {
    if (!issues.some((i) => i.label === label)) issues.push({ kind, label })
  }
  if (!a.isActive) add("borrador", l.draft)

  const herencia = { basePrice: a.basePrice, defaultTariffId: a.defaultTariffId }
  const centros = a.locations.filter((loc) => a.index.offered.has(`${a.serviceId}|${loc.id}`))
  if (centros.length === 0 || a.tariffs.length === 0) return issues

  for (const loc of centros) {
    const celdas = a.tariffs.map((t) => cellOf(a.index, a.serviceId, loc.id, t.id, herencia))
    if (celdas.every((c) => c.kind === "sin-precio")) add("sin-precio", l.noPrice(loc.name))
  }
  const nombre = new Map(a.locations.map((loc) => [loc.id, loc.name]))
  const celdas = priceCellIssues(a)
  for (const c of celdas) if (c.kind === "distinto") add("distinto", l.different(String(nombre.get(c.locationId))))
  for (const c of celdas) if (c.kind === "cero") add("cero", l.zero(String(nombre.get(c.locationId))))
  return issues
}

/** Clave de una celda de la matriz servicios × trabajadores. La página construye las mismas claves. */
export const matrixKey = (workerId: number, serviceId: number) => `${workerId}|${serviceId}`

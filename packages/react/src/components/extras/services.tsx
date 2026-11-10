import { useState } from "react"
import { Check, Plus, Warning } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DEFAULT_EXTRAS_LOCALE, formatMoney } from "./format"
import { inheritedPrice, priceKey, type ReviewIssue } from "./service-prices"

// ---------------------------------------------------------------- FamilySelect

const NUEVA = "__nueva__"

export interface FamilySelectLabels {
  /** aria-label del desplegable. */
  ariaLabel: string
  noFamily: string
  createFamily: string
  dialogTitle: string
  namePlaceholder: string
  nameAriaLabel: string
  cancel: string
  createButton: string
}

export const DEFAULT_FAMILY_SELECT_LABELS: FamilySelectLabels = {
  ariaLabel: "Familia",
  noFamily: "Sin familia",
  createFamily: "Crear familia…",
  dialogTitle: "Nueva familia",
  namePlaceholder: "Ej: Cursos de piscina",
  nameAriaLabel: "Nombre de la familia",
  cancel: "Cancelar",
  createButton: "Crear familia",
}

export interface FamilySelectProps {
  families: Array<{ id: number; name: string }>
  /** Id de la familia en texto, o `'none'` para "Sin familia". */
  value: string
  onValueChange: (value: string) => void
  /** Crea la familia y devuelve su id; el desplegable la deja elegida. */
  onCreateFamily: (name: string) => Promise<{ id: number }>
  /** Sustituye a `labels.ariaLabel`. */
  ariaLabel?: string
  labels?: Partial<FamilySelectLabels>
}

/**
 * Desplegable de familia con "Crear familia…" al final: abre el diálogo "Nueva familia" y, al crearla,
 * la deja elegida. Así crear una familia no obliga a salir del formulario o de la ficha.
 */
export function FamilySelect({ families, value, onValueChange, onCreateFamily, ariaLabel, labels }: FamilySelectProps) {
  const l = { ...DEFAULT_FAMILY_SELECT_LABELS, ...labels }
  const [creando, setCreando] = useState(false)
  const [nombre, setNombre] = useState("")
  const [busy, setBusy] = useState(false)

  const cerrar = () => {
    setCreando(false)
    setNombre("")
  }

  const crear = async () => {
    const name = nombre.trim()
    if (!name) return
    setBusy(true)
    try {
      const { id } = await onCreateFamily(name)
      onValueChange(String(id))
      cerrar()
    } catch {
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Select value={value} onValueChange={(v) => (v === NUEVA ? setCreando(true) : onValueChange(v))}>
        <SelectTrigger aria-label={ariaLabel ?? l.ariaLabel}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{l.noFamily}</SelectItem>
          {families.map((f) => (
            <SelectItem key={f.id} value={String(f.id)}>
              {f.name}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value={NUEVA}>
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {l.createFamily}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog
        open={creando}
        onOpenChange={(o) => {
          if (!o) cerrar()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{l.dialogTitle}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder={l.namePlaceholder}
            aria-label={l.nameAriaLabel}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void crear()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={cerrar}>
              {l.cancel}
            </Button>
            <Button onClick={() => void crear()} disabled={busy || !nombre.trim()}>
              {l.createButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ---------------------------------------------------------- ServicePriceEditor

export interface ServicePriceEditorLabels {
  servedIn: string
  /** aria-label de la casilla "se presta en {centro}". */
  servedInAria: (locationName: string) => string
  /** aria-label del precio cuando hay varias tarifas. */
  priceAria: (tariffName: string, locationName: string) => string
  /** aria-label del precio cuando solo hay una columna. */
  ownPriceAria: (locationName: string) => string
  notServed: string
}

export const DEFAULT_SERVICE_PRICE_EDITOR_LABELS: ServicePriceEditorLabels = {
  servedIn: "Se presta en",
  servedInAria: (loc) => `Se presta en ${loc}`,
  priceAria: (tariff, loc) => `Precio ${tariff} en ${loc}`,
  ownPriceAria: (loc) => `Precio propio en ${loc}`,
  notServed: "No se presta aquí",
}

export interface ServicePriceEditorProps {
  locations: Array<{ id: number; name: string }>
  /** Una columna por tarifa; una org sin tarifas pasa una sola ("Precio"). */
  columns: Array<{ id: number; name: string }>
  /** Casilla "se presta aquí" de cada centro. */
  sePresta: Map<number, boolean>
  /** Texto de cada celda, por `priceKey(centro, tarifa)`. */
  inputs: Map<string, string>
  /** Precio base del servicio: lo que cobra todo lo que no tiene un precio propio. */
  basePrice: number | null
  /** Columna de la tarifa por defecto: las demás heredan de ella antes que del precio base. */
  defaultTariffId: number
  currency: string
  onToggleLocation: (locationId: number, checked: boolean) => void
  onChangePrice: (locationId: number, tariffId: number, value: string) => void
  labels?: Partial<ServicePriceEditorLabels>
  /** Etiqueta BCP-47 para formatear el precio heredado. */
  locale?: string
}

const money = (n: number | null, currency: string, locale: string) => (n == null ? "—" : formatMoney(n, currency, locale))

/**
 * Editor de los precios de UN servicio: una fila por centro (con la casilla de si
 * se presta ahí) y una columna por tarifa. Controlado y sin datos propios; quien lo
 * usa guarda. Es la otra cara de `ServicePriceMatrix`, que edita una celda suelta de
 * todos los servicios a la vez.
 *
 * Un campo vacío no es "sin precio": hereda. El valor heredado se ve en gris dentro
 * del propio campo (la tarifa por defecto, del precio base; las demás, de la tarifa
 * por defecto del mismo centro y, si no la tiene, del precio base). Escribir un
 * valor lo sustituye; borrarlo vuelve a heredar.
 */
export function ServicePriceEditor({
  locations,
  columns,
  sePresta,
  inputs,
  basePrice,
  defaultTariffId,
  currency,
  onToggleLocation,
  onChangePrice,
  labels,
  locale = DEFAULT_EXTRAS_LOCALE,
}: ServicePriceEditorProps) {
  const l = { ...DEFAULT_SERVICE_PRICE_EDITOR_LABELS, ...labels }
  const variasTarifas = columns.length > 1

  return (
    <div className="max-w-3xl overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{l.servedIn}</TableHead>
            {columns.map((c) => (
              <TableHead key={c.id} className="w-36 text-right">
                {c.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => {
            const presta = sePresta.get(loc.id) ?? false
            const textoPorDefecto = inputs.get(priceKey(loc.id, defaultTariffId)) ?? ""
            return (
              <TableRow key={loc.id}>
                <TableCell>
                  <label className="flex items-center gap-2 font-medium">
                    <Checkbox
                      checked={presta}
                      onCheckedChange={(checked) => onToggleLocation(loc.id, checked === true)}
                      aria-label={l.servedInAria(loc.name)}
                    />
                    {loc.name}
                  </label>
                </TableCell>
                {presta ? (
                  columns.map((c) => {
                    const heredado = inheritedPrice({
                      basePrice,
                      tariffId: c.id,
                      defaultTariffId,
                      defaultText: textoPorDefecto,
                    })
                    return (
                      <TableCell key={c.id} className="text-right">
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          placeholder={money(heredado, currency, locale)}
                          className="ml-auto h-9 w-28 text-right"
                          value={inputs.get(priceKey(loc.id, c.id)) ?? ""}
                          onChange={(e) => onChangePrice(loc.id, c.id, e.target.value)}
                          aria-label={variasTarifas ? l.priceAria(c.name, loc.name) : l.ownPriceAria(loc.name)}
                        />
                      </TableCell>
                    )
                  })
                ) : (
                  <TableCell colSpan={columns.length} className="text-right">
                    <span className="text-sm text-muted-foreground">{l.notServed}</span>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// --------------------------------------------------------- ServicePriceIssues

export interface PriceIssueRow {
  key: string
  kind: "distinto" | "cero"
  locationName: string
  /** Nombre de la tarifa; se omite si la organización solo tiene una. */
  tariffName: string | null
  price: number
  /** Lo que cobran los demás centros (solo en `distinto`, si hay un precio mayoritario). */
  usual: number | null
}

export interface ServicePriceIssuesLabels {
  /** "1 precio por revisar" / "3 precios por revisar" */
  title: (count: number) => string
  hint: string
  zero: string
  /** " — los demás centros cobran 10,45 €" */
  othersCharge: (amount: string) => string
  different: string
  confirm: string
}

export const DEFAULT_SERVICE_PRICE_ISSUES_LABELS: ServicePriceIssuesLabels = {
  title: (count) => (count === 1 ? "1 precio por revisar" : `${count} precios por revisar`),
  hint: "Si el precio es correcto, márcalo y dejará de avisar. Si no, corrígelo en la tabla de abajo.",
  zero: " — precio a 0 €",
  othersCharge: (amount) => ` — los demás centros cobran ${amount}`,
  different: " — distinto al resto de centros",
  confirm: "Es correcto",
}

export interface ServicePriceIssuesProps {
  issues: PriceIssueRow[]
  currency: string
  /** Da por bueno ese precio; mientras dura, su botón queda bloqueado. */
  onConfirm: (issue: PriceIssueRow) => Promise<void>
  labels?: Partial<ServicePriceIssuesLabels>
  locale?: string
}

/**
 * Precios de un servicio que avisan (un centro que cobra distinto que los demás en la
 * misma tarifa, o un precio de 0 €), cada uno con "Es correcto". Darlo por bueno apaga
 * el aviso aquí, en la lista y en la matriz, pero solo para ese precio: si alguien lo
 * cambia, vuelve a avisar. Sin avisos no pinta nada.
 */
export function ServicePriceIssues({ issues, currency, onConfirm, labels, locale = DEFAULT_EXTRAS_LOCALE }: ServicePriceIssuesProps) {
  const l = { ...DEFAULT_SERVICE_PRICE_ISSUES_LABELS, ...labels }
  const [enCurso, setEnCurso] = useState<string | null>(null)
  if (issues.length === 0) return null

  const confirmar = async (i: PriceIssueRow) => {
    setEnCurso(i.key)
    try {
      await onConfirm(i)
    } finally {
      setEnCurso(null)
    }
  }

  return (
    <Alert variant="warning">
      <Warning className="h-4 w-4" />
      <AlertTitle>{l.title(issues.length)}</AlertTitle>
      <AlertDescription>
        <p>{l.hint}</p>
        <ul className="mt-2 divide-y divide-border">
          {issues.map((i) => (
            <li key={i.key} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="text-foreground">
                <span className="font-medium">{i.locationName}</span>
                {i.tariffName && <span className="text-muted-foreground"> · {i.tariffName}</span>}
                {": "}
                <span className="tabular-nums">{formatMoney(i.price, currency, locale)}</span>
                <span className="text-muted-foreground">
                  {i.kind === "cero"
                    ? l.zero
                    : i.usual !== null
                      ? l.othersCharge(formatMoney(i.usual, currency, locale))
                      : l.different}
                </span>
              </span>
              <Button size="sm" variant="outline" disabled={enCurso !== null} onClick={() => void confirmar(i)}>
                <Check className="mr-1.5 h-4 w-4" />
                {l.confirm}
              </Button>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

// -------------------------------------------------------- ServiceReviewBadges

export interface ServiceReviewBadgesProps {
  issues: ReviewIssue[]
  /** Cuántas se enseñan antes de resumir el resto en "+N". */
  max?: number
}

/**
 * Lo que hay que revisar de un servicio, en etiquetas bajo su nombre en el catálogo:
 * así el problema se ve en la lista, sin buscarlo con filtros. "Borrador" va en gris
 * (es un estado); lo demás en ámbar, y el 0 € en rojo, como en la matriz de precios.
 */
export function ServiceReviewBadges({ issues, max = 2 }: ServiceReviewBadgesProps) {
  if (issues.length === 0) return null
  const visibles = issues.slice(0, max)
  const resto = issues.slice(max)
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {visibles.map((i) => (
        <Badge
          key={i.label}
          variant={i.kind === "borrador" ? "outline" : i.kind === "cero" ? "destructive" : "warning"}
          className="text-xs font-normal"
        >
          {i.label}
        </Badge>
      ))}
      {resto.length > 0 && (
        <Badge variant="outline" className="text-xs font-normal" title={resto.map((i) => i.label).join(" · ")}>
          +{resto.length}
        </Badge>
      )}
    </div>
  )
}

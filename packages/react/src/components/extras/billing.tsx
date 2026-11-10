import { StatusDot, type StatusDotVariant } from "../molecules/status-dot"
import { cn } from "../../lib/utils"
import { DEFAULT_EXTRAS_LOCALE, formatMoneyCents } from "./format"

// ---------------------------------------------------------------------- tipos

export type BillingInvoiceStatus =
  | "draft"
  | "issuing"
  | "issued"
  | "payment_pending"
  | "awaiting_transfer"
  | "paid"
  | "failed"
  | "disputed"
  | "refunded"
  | "cancelled"

export type BillingStatusVariant = "success" | "info" | "warning" | "destructive" | "secondary"

export type BillingBlockedReason =
  | "no_mandate"
  | "no_contact"
  | "total_mismatch"
  | "permanent_error"
  | "missing_account"
  | "stale_charge_attempt"
  | "below_minimum"

export type BillingMandateStatus = "none" | "pending" | "active" | "inactive"

// ------------------------------------------------------------------- MoneyCell

export interface MoneyCellLabels {
  notAvailable: string
  /** "220,00 € sin IVA" */
  withoutTax: (amount: string) => string
}

export const DEFAULT_MONEY_CELL_LABELS: MoneyCellLabels = {
  notAvailable: "No disponible",
  withoutTax: (amount) => `${amount} sin IVA`,
}

export interface MoneyCellProps {
  /** Total con IVA en céntimos; null = no se pudo leer (facturas antiguas). */
  totalCents: number | null
  /** Base imponible en céntimos; si llega, va debajo como "220,00 € sin IVA". */
  subtotalCents?: number | null
  className?: string
  labels?: Partial<MoneyCellLabels>
  /** Etiqueta BCP-47 para formatear los importes. */
  locale?: string
}

/** Importe de una fila: total y la base debajo, alineados a la derecha. Solo formatea. */
export function MoneyCell({ totalCents, subtotalCents = null, className, labels, locale = DEFAULT_EXTRAS_LOCALE }: MoneyCellProps) {
  const l = { ...DEFAULT_MONEY_CELL_LABELS, ...labels }

  if (totalCents === null) {
    return <div className={cn("text-right text-muted-foreground", className)}>{l.notAvailable}</div>
  }

  return (
    <div className={cn("whitespace-nowrap text-right tabular-nums", className)}>
      <div className="font-medium text-foreground">{formatMoneyCents(totalCents, locale)}</div>
      {subtotalCents !== null && (
        <div className="text-xs text-muted-foreground">{l.withoutTax(formatMoneyCents(subtotalCents, locale))}</div>
      )}
    </div>
  )
}

// --------------------------------------------------------- BillingStatusBadge

/**
 * Mapeo canónico (estados): pendiente = warning, en curso = info, OK = success,
 * error = destructive, neutro = secondary. Debe coincidir con `InvoicePresentation::statusVariant` del backend.
 */
const STATUS_VARIANT: Record<BillingInvoiceStatus, BillingStatusVariant> = {
  draft: "warning",
  issuing: "warning",
  issued: "info",
  payment_pending: "info",
  awaiting_transfer: "info",
  paid: "success",
  failed: "destructive",
  disputed: "destructive",
  refunded: "secondary",
  cancelled: "secondary",
}

/**
 * El cliente no ve los estados internos: lo emitido y aún sin cargo es "Pendiente de cobro" (warning).
 * «Devuelta» (disputada o devuelta) va en gris. Debe coincidir con `InvoicePresentation::clientStatusVariant`.
 */
const CLIENT_VARIANT: Record<BillingInvoiceStatus, BillingStatusVariant> = {
  ...STATUS_VARIANT,
  draft: "warning",
  issuing: "warning",
  issued: "warning",
  awaiting_transfer: "warning",
  disputed: "secondary",
}

export interface BillingStatusBadgeLabels {
  /** Estado tal como lo ve el equipo. */
  statuses: Record<BillingInvoiceStatus, string>
  /** Estado tal como lo ve el cliente. */
  clientStatuses: Record<BillingInvoiceStatus, string>
  blocked: string
  blockedReasons: Record<BillingBlockedReason, string>
}

export const DEFAULT_BILLING_STATUS_BADGE_LABELS: BillingStatusBadgeLabels = {
  statuses: {
    draft: "Por revisar",
    issuing: "Emitiendo",
    issued: "Emitida",
    payment_pending: "Cobrándose",
    awaiting_transfer: "Esperando transferencia",
    paid: "Cobrada",
    failed: "Cobro fallido",
    disputed: "En disputa",
    refunded: "Devuelta",
    cancelled: "Anulada",
  },
  clientStatuses: {
    draft: "Pendiente de cobro",
    issuing: "Pendiente de cobro",
    issued: "Pendiente de cobro",
    payment_pending: "Cobrándose",
    awaiting_transfer: "Pendiente de pago",
    paid: "Cobrada",
    failed: "No se pudo cobrar",
    disputed: "Devuelta",
    refunded: "Devuelta",
    cancelled: "Anulada",
  },
  blocked: "Con bloqueo",
  blockedReasons: {
    no_mandate: "El cliente no tiene la domiciliación activa",
    no_contact: "Falta enlazar el contacto de Holded",
    total_mismatch: "El total de Holded no cuadra con el calculado",
    permanent_error: "Holded o el banco rechazaron la operación",
    missing_account: "Falta una cuenta contable en Holded",
    stale_charge_attempt: "Hay un cobro sin confirmar",
    below_minimum: "El total es inferior al mínimo que se puede cobrar por domiciliación",
  },
}

export interface BillingStatusBadgeLabelsInput {
  statuses?: Partial<BillingStatusBadgeLabels["statuses"]>
  clientStatuses?: Partial<BillingStatusBadgeLabels["clientStatuses"]>
  blocked?: string
  blockedReasons?: Partial<BillingStatusBadgeLabels["blockedReasons"]>
}

export interface BillingStatusBadgeProps {
  status: BillingInvoiceStatus
  /** Motivo del bloqueo, si lo hay: gana "Con bloqueo" en rojo y el motivo va en el `title`. */
  blocked?: BillingBlockedReason | null
  /** `client` = las frases que ve el cliente: "Pendiente de cobro", "No se pudo cobrar"… */
  audience?: "admin" | "client"
  /** Variante que da la API (`status_variant`), si la hay: gana a la del mapa (p. ej. esperando transferencia vencida). */
  variant?: BillingStatusVariant
  className?: string
  labels?: BillingStatusBadgeLabelsInput
}

export function BillingStatusBadge({
  status,
  blocked = null,
  audience = "admin",
  variant,
  className,
  labels,
}: BillingStatusBadgeProps) {
  const d = DEFAULT_BILLING_STATUS_BADGE_LABELS
  const statuses = { ...d.statuses, ...labels?.statuses }
  const clientStatuses = { ...d.clientStatuses, ...labels?.clientStatuses }
  const blockedReasons = { ...d.blockedReasons, ...labels?.blockedReasons }

  if (blocked && audience === "admin") {
    const reason = blockedReasons[blocked]
    return (
      <StatusDot variant={blocked === "below_minimum" ? "warning" : "destructive"} className={className} title={reason}>
        {labels?.blocked ?? d.blocked}
        <span className="sr-only">. {reason}</span>
      </StatusDot>
    )
  }

  const client = audience === "client"
  const label = client ? clientStatuses[status] : statuses[status]
  return (
    <StatusDot variant={(!client && variant) || (client ? CLIENT_VARIANT : STATUS_VARIANT)[status]} className={className}>
      {label}
    </StatusDot>
  )
}

// -------------------------------------------------------------- MandateStatus

const MANDATE_VARIANT = {
  active: "success",
  pending: "warning",
  none: "warning",
  inactive: "secondary",
} as const satisfies Record<BillingMandateStatus, StatusDotVariant>

export interface MandateStatusLabels {
  statuses: Record<BillingMandateStatus, string>
  /** "Acaba en 4821" */
  last4: (last4: string) => string
  /** "Activa, acaba en 4821" */
  summary: (status: string, last4: string) => string
}

export const DEFAULT_MANDATE_STATUS_LABELS: MandateStatusLabels = {
  statuses: { none: "Sin domiciliación", pending: "Pendiente", active: "Activa", inactive: "Inactiva" },
  last4: (last4) => `Acaba en ${last4}`,
  summary: (status, last4) => `${status}, acaba en ${last4}`,
}

export interface MandateStatusProps {
  status: BillingMandateStatus
  /** Últimos 4 dígitos de la cuenta; solo se enseñan con la domiciliación activa. */
  last4?: string | null
  /** `stack`: badge y dígitos debajo (celda de tabla). `inline`: dígitos al lado (tarjetas, fichas). */
  layout?: "stack" | "inline"
  className?: string
  labels?: Partial<Omit<MandateStatusLabels, "statuses">> & { statuses?: Partial<MandateStatusLabels["statuses"]> }
}

export function MandateStatus({ status, last4 = null, layout = "stack", className, labels }: MandateStatusProps) {
  const l = { ...DEFAULT_MANDATE_STATUS_LABELS, ...labels }
  const label = { ...DEFAULT_MANDATE_STATUS_LABELS.statuses, ...labels?.statuses }[status]
  const digits = status === "active" && last4 ? last4 : null

  return (
    <div
      className={cn(layout === "stack" ? "flex flex-col items-start gap-0.5" : "flex items-center gap-2", className)}
      title={digits ? l.summary(label, digits) : undefined}
    >
      <StatusDot variant={MANDATE_VARIANT[status]}>{label}</StatusDot>
      {digits && <span className="text-xs text-muted-foreground tabular-nums">{l.last4(digits)}</span>}
    </div>
  )
}

// ----------------------------------------------------------- InvoiceBreakdown

/** Lo mínimo de una línea: vale para el detalle, el próximo cargo y la vista previa del cobro puntual. */
export interface InvoiceBreakdownLine {
  id?: number | null
  description: string
  amount_cents: number
  explanation?: string | null
}

export interface InvoiceBreakdownLabels {
  subtotal: string
  /** "IVA 21 %" */
  taxRate: (rate: string) => string
  total: string
}

export const DEFAULT_INVOICE_BREAKDOWN_LABELS: InvoiceBreakdownLabels = {
  subtotal: "Base imponible",
  taxRate: (rate) => `IVA ${rate} %`,
  total: "Total",
}

export interface InvoiceBreakdownProps {
  lines: InvoiceBreakdownLine[]
  subtotalCents: number
  taxCents: number
  totalCents: number
  /** Tipo de IVA en puntos básicos (2100 = 21 %), tal como llega en `tax_rate_bp`. */
  taxRateBp?: number
  /** Próximo cargo del cliente: sin explicaciones y con el total sin destacar. */
  compact?: boolean
  className?: string
  labels?: Partial<InvoiceBreakdownLabels>
  locale?: string
}

/**
 * Factura explicada: cada línea con su porqué, base, IVA y total. Todo llega
 * calculado de la API en céntimos; aquí solo se presenta.
 */
export function InvoiceBreakdown({
  lines,
  subtotalCents,
  taxCents,
  totalCents,
  taxRateBp = 2100,
  compact = false,
  className,
  labels,
  locale = DEFAULT_EXTRAS_LOCALE,
}: InvoiceBreakdownProps) {
  const l = { ...DEFAULT_INVOICE_BREAKDOWN_LABELS, ...labels }
  const rate = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(taxRateBp / 100)
  const rowPadding = compact ? "py-2" : "py-2.5"
  const fmt = (cents: number) => formatMoneyCents(cents, locale)

  return (
    <div className={cn("text-sm", className)}>
      <ul className="divide-y divide-border">
        {lines.map((line, i) => (
          <li key={line.id ?? i} className={cn("flex items-start justify-between gap-4", rowPadding)}>
            <div className="min-w-0">
              <div className="text-foreground">{line.description}</div>
              {!compact && line.explanation && <div className="mt-0.5 text-xs text-muted-foreground">{line.explanation}</div>}
            </div>
            <div className="shrink-0 whitespace-nowrap tabular-nums">{fmt(line.amount_cents)}</div>
          </li>
        ))}
      </ul>

      <dl className="border-t border-border">
        <div className={cn("flex justify-between gap-4", rowPadding)}>
          <dt className="text-muted-foreground">{l.subtotal}</dt>
          <dd className="whitespace-nowrap tabular-nums">{fmt(subtotalCents)}</dd>
        </div>
        <div className={cn("flex justify-between gap-4 border-t border-border", rowPadding)}>
          <dt className="text-muted-foreground">{l.taxRate(rate)}</dt>
          <dd className="whitespace-nowrap tabular-nums">{fmt(taxCents)}</dd>
        </div>
        <div
          className={cn(
            "flex items-baseline justify-between gap-4",
            compact ? "border-t border-border py-2 font-medium" : "mt-1.5 border-t-2 border-foreground pt-3",
          )}
        >
          <dt>{l.total}</dt>
          <dd className={cn("whitespace-nowrap tabular-nums", !compact && "text-2xl font-semibold")}>{fmt(totalCents)}</dd>
        </div>
      </dl>
    </div>
  )
}

// -------------------------------------------------------------- InvoiceTimeline

/** Evento del historial de una factura. */
export interface InvoiceTimelineEvent {
  id: number
  label: string
  /** Fecha ISO del evento. */
  at: string
  /** null = sistema */
  actor: { id?: number; name: string | null } | null
}

export interface InvoiceTimelineLabels {
  empty: string
  /** "18 oct 2026, 11:12, por Jonnathan" */
  eventBy: (date: string, actor: string) => string
  /** "18 oct 2026, 07:00, automático" */
  eventAuto: (date: string) => string
  /** Nombre cuando el actor no tiene. */
  someone: string
}

export const DEFAULT_INVOICE_TIMELINE_LABELS: InvoiceTimelineLabels = {
  empty: "Todavía no hay movimientos.",
  eventBy: (date, actor) => `${date}, por ${actor}`,
  eventAuto: (date) => `${date}, automático`,
  someone: "un usuario",
}

export interface InvoiceTimelineProps {
  /** De más antiguo a más reciente, como llegan de la API; se pinta al revés. */
  events: InvoiceTimelineEvent[]
  className?: string
  labels?: Partial<InvoiceTimelineLabels>
  /** Formatea la fecha ISO de un evento (por defecto, hora de Madrid en `locale`). */
  formatDate?: (iso: string) => string
  locale?: string
}

const defaultTimelineDate = (iso: string, locale: string): string => {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

/**
 * Historial de una factura, del más reciente al más antiguo: la frase que da la API, la fecha y hora
 * en Madrid y quién lo hizo (sin actor = automático).
 */
export function InvoiceTimeline({ events, className, labels, formatDate, locale = DEFAULT_EXTRAS_LOCALE }: InvoiceTimelineProps) {
  const l = { ...DEFAULT_INVOICE_TIMELINE_LABELS, ...labels }

  if (events.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{l.empty}</p>
  }

  const newestFirst = [...events].reverse()
  return (
    <ol className={cn("flex flex-col", className)} data-testid="invoice-timeline">
      {newestFirst.map((event, i) => {
        const date = formatDate ? formatDate(event.at) : defaultTimelineDate(event.at, locale)
        const actor = event.actor?.name?.trim()
        return (
          <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < newestFirst.length - 1 && <span aria-hidden className="absolute left-[3px] top-3 h-full w-px bg-border" />}
            <span aria-hidden className={cn("mt-1.5 size-[7px] shrink-0 rounded-full", i === 0 ? "bg-foreground" : "bg-border")} />
            <div className="min-w-0 text-sm">
              <div className="text-foreground">{event.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                <time dateTime={event.at}>{event.actor ? l.eventBy(date, actor || l.someone) : l.eventAuto(date)}</time>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

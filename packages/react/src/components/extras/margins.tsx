import { useMemo, useState, type ReactNode } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDown,
  ArrowUp,
  CaretDown,
  CaretRight,
  CurrencyEur,
  MagnifyingGlass,
  Minus,
  Percent,
  Receipt,
  TrendDown,
  TrendUp,
  Wallet,
  Warning,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../../lib/utils"
import { DEFAULT_EXTRAS_LOCALE } from "./format"

// ---------------------------------------------------------------------- tipos

export type MarginStatus = "critical" | "warning" | "healthy"
export type MarginTrend = "up" | "down" | "stable"
export type MarginFilter = "all" | "critical" | "warning" | "healthy"

export interface MarginProviderCost {
  provider: "llm" | "tts" | "stt" | "livekit"
  /** "LLM", "TTS", "STT", "LiveKit" */
  label: string
  /** "1.2M tokens", "45 min", "82K chars" */
  units: string
  /** Importe en € */
  cost: number
  /** % del total de costes */
  percent: number
}

export interface MarginChannelCosts {
  voice: number
  whatsapp: number
  web: number
}

export interface MarginCostBreakdown {
  providers: MarginProviderCost[]
  channels: MarginChannelCosts
  total: number
}

export interface OrganizationMargin {
  id: number
  name: string
  slug?: string
  logo?: string
  income: number
  costs: number
  margin: number
  marginPercent: number
  status: MarginStatus
  trend: MarginTrend
  trendValue: string
  hasAlert: boolean
  costBreakdown: MarginCostBreakdown
}

export interface MarginsSummary {
  totalIncome: number
  totalCosts: number
  netMargin: number
  marginPercent: number
  incomeDelta: { value: string; direction: MarginTrend }
  costsDelta: { value: string; direction: MarginTrend }
  marginDelta: { value: string; direction: MarginTrend }
  marginPercentDelta: { value: string; direction: MarginTrend }
  counts: { critical: number; warning: number; healthy: number; total: number }
}

export interface MarginTimeSeriesPoint {
  date: string
  income: number
  costs: number
  margin: number
}

export interface MarginProviderTimeSeriesPoint {
  date: string
  llm: number
  tts: number
  stt: number
  livekit: number
}

const formatCurrency = (amount: number, locale: string) => `€${amount.toLocaleString(locale)}`

// ----------------------------------------------------------- MarginStatusBadge

export interface MarginStatusBadgeLabels {
  critical: string
  warning: string
  healthy: string
}

export const DEFAULT_MARGIN_STATUS_BADGE_LABELS: MarginStatusBadgeLabels = {
  critical: "Crítico",
  warning: "En riesgo",
  healthy: "Saludable",
}

export interface MarginStatusBadgeProps {
  percent: number
  status?: MarginStatus
  showPercent?: boolean
  labels?: Partial<MarginStatusBadgeLabels>
}

const getStatusFromPercent = (percent: number): MarginStatus => {
  if (percent < 20) return "critical"
  if (percent < 50) return "warning"
  return "healthy"
}

const statusToVariant = {
  critical: "destructive",
  warning: "warning",
  healthy: "success",
} as const

export function MarginStatusBadge({ percent, status, showPercent = true, labels }: MarginStatusBadgeProps) {
  const l = { ...DEFAULT_MARGIN_STATUS_BADGE_LABELS, ...labels }
  const resolvedStatus = status ?? getStatusFromPercent(percent)
  const variant = statusToVariant[resolvedStatus]

  return <Badge variant={variant}>{showPercent ? `${percent}%` : l[resolvedStatus]}</Badge>
}

// --------------------------------------------------------------- MarginFilters

export interface MarginFiltersLabels {
  critical: string
  warning: string
  healthy: string
  all: string
}

export const DEFAULT_MARGIN_FILTERS_LABELS: MarginFiltersLabels = {
  critical: "Críticos",
  warning: "En riesgo",
  healthy: "Saludables",
  all: "Todos",
}

export interface MarginFiltersProps {
  value: MarginFilter
  onChange: (filter: MarginFilter) => void
  counts: { critical: number; warning: number; healthy: number; total: number }
  labels?: Partial<MarginFiltersLabels>
}

const FILTERS: { value: MarginFilter; variant: "destructive" | "warning" | "success" | "secondary" }[] = [
  { value: "critical", variant: "destructive" },
  { value: "warning", variant: "warning" },
  { value: "healthy", variant: "success" },
  { value: "all", variant: "secondary" },
]

export function MarginFilters({ value, onChange, counts, labels }: MarginFiltersProps) {
  const l = { ...DEFAULT_MARGIN_FILTERS_LABELS, ...labels }
  const getCount = (filter: MarginFilter) => {
    if (filter === "all") return counts.total
    return counts[filter]
  }

  return (
    <div className="flex gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            value === filter.value ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-muted",
          )}
        >
          <Badge variant={filter.variant} className="h-4 min-w-[1.25rem] px-1.5 text-[10px]">
            {getCount(filter.value)}
          </Badge>
          <span>{l[filter.value]}</span>
        </button>
      ))}
    </div>
  )
}

// ------------------------------------------------------------ CostBreakdownPanel

export interface CostBreakdownPanelLabels {
  /** "Desglose de costes - Acme" */
  title: (orgName: string) => string
  byChannel: string
  voice: string
  whatsapp: string
  web: string
}

export const DEFAULT_COST_BREAKDOWN_PANEL_LABELS: CostBreakdownPanelLabels = {
  title: (orgName) => `Desglose de costes - ${orgName}`,
  byChannel: "Por canal: ",
  voice: "Voz",
  whatsapp: "WhatsApp",
  web: "Web",
}

export interface CostBreakdownPanelProps {
  breakdown: MarginCostBreakdown
  orgName: string
  labels?: Partial<CostBreakdownPanelLabels>
  /** Etiqueta BCP-47 para los importes. */
  locale?: string
}

export function CostBreakdownPanel({ breakdown, orgName, labels, locale = DEFAULT_EXTRAS_LOCALE }: CostBreakdownPanelProps) {
  const l = { ...DEFAULT_COST_BREAKDOWN_PANEL_LABELS, ...labels }
  const { channels } = breakdown
  const totalChannels = channels.voice + channels.whatsapp + channels.web

  return (
    <div className="border-t bg-muted/30 px-6 py-4">
      <h4 className="mb-3 text-sm font-medium">{l.title(orgName)}</h4>

      {/* Provider breakdown */}
      <div className="mb-4 space-y-2">
        {breakdown.providers.map((provider) => (
          <div key={provider.provider} className="grid grid-cols-[100px_100px_80px_1fr] items-center gap-4 text-sm">
            <span className="font-medium">{provider.label}</span>
            <span className="text-muted-foreground">{provider.units}</span>
            <span className="tabular-nums">{formatCurrency(provider.cost, locale)}</span>
            <div className="flex items-center gap-2">
              <Progress value={provider.percent} className="h-2 flex-1" />
              <span className="w-10 text-right text-xs text-muted-foreground">{provider.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Channel breakdown */}
      <div className="border-t pt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{l.byChannel}</span>
        <span>
          {l.voice} {formatCurrency(channels.voice, locale)} ({Math.round((channels.voice / totalChannels) * 100)}%)
        </span>
        <span className="mx-2">|</span>
        <span>
          {l.whatsapp} {formatCurrency(channels.whatsapp, locale)} ({Math.round((channels.whatsapp / totalChannels) * 100)}%)
        </span>
        <span className="mx-2">|</span>
        <span>
          {l.web} {formatCurrency(channels.web, locale)} ({Math.round((channels.web / totalChannels) * 100)}%)
        </span>
      </div>
    </div>
  )
}

// -------------------------------------------------------------- MarginTableRow

export interface MarginTableRowLabels extends CostBreakdownPanelLabels, MarginStatusBadgeLabels {
  /** Etiqueta de la insignia de alerta. */
  alert: string
}

export const DEFAULT_MARGIN_TABLE_ROW_LABELS: MarginTableRowLabels = {
  ...DEFAULT_COST_BREAKDOWN_PANEL_LABELS,
  ...DEFAULT_MARGIN_STATUS_BADGE_LABELS,
  alert: "Crítico",
}

export interface MarginTableRowProps {
  org: OrganizationMargin
  defaultExpanded?: boolean
  labels?: Partial<MarginTableRowLabels>
  locale?: string
}

const TrendIcon = ({ direction }: { direction: MarginTrend }) => {
  switch (direction) {
    case "up":
      return <TrendUp className="h-4 w-4 text-success" weight="bold" />
    case "down":
      return <TrendDown className="h-4 w-4 text-destructive" weight="bold" />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

export function MarginTableRow({ org, defaultExpanded = false, labels, locale = DEFAULT_EXTRAS_LOCALE }: MarginTableRowProps) {
  const l = { ...DEFAULT_MARGIN_TABLE_ROW_LABELS, ...labels }
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <>
      <TableRow className={cn("cursor-pointer hover:bg-muted/50", expanded && "bg-muted/30")} onClick={() => setExpanded(!expanded)}>
        <TableCell className="w-8">
          {expanded ? (
            <CaretDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <CaretRight className="h-4 w-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{org.name}</span>
          </div>
        </TableCell>
        <TableCell className="tabular-nums">{formatCurrency(org.income, locale)}</TableCell>
        <TableCell className="tabular-nums">{formatCurrency(org.costs, locale)}</TableCell>
        <TableCell className="tabular-nums">{formatCurrency(org.margin, locale)}</TableCell>
        <TableCell>
          <MarginStatusBadge percent={org.marginPercent} status={org.status} labels={l} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <TrendIcon direction={org.trend} />
            <span className="text-sm text-muted-foreground">{org.trendValue}</span>
          </div>
        </TableCell>
        <TableCell>
          {org.hasAlert && (
            <Badge variant="destructive" className="gap-1">
              <Warning className="h-3 w-3" weight="bold" />
              {l.alert}
            </Badge>
          )}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={8} className="p-0">
            <CostBreakdownPanel orgName={org.name} breakdown={org.costBreakdown} labels={l} locale={locale} />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

// ----------------------------------------------------------------- MarginTable

export interface MarginTableLabels extends MarginTableRowLabels {
  searchPlaceholder: string
  organization: string
  income: string
  costs: string
  margin: string
  marginPercent: string
  trend: string
  alertColumn: string
  empty: string
}

export const DEFAULT_MARGIN_TABLE_LABELS: MarginTableLabels = {
  ...DEFAULT_MARGIN_TABLE_ROW_LABELS,
  searchPlaceholder: "Buscar organización...",
  organization: "Organización",
  income: "Ingresos",
  costs: "Costes",
  margin: "Margen",
  marginPercent: "Margen %",
  trend: "Tendencia",
  alertColumn: "Alerta",
  empty: "No se encontraron organizaciones",
}

export interface MarginTableProps {
  organizations: OrganizationMargin[]
  filter?: MarginFilter
  labels?: Partial<MarginTableLabels>
  locale?: string
}

type SortKey = "name" | "income" | "costs" | "margin" | "marginPercent"
type SortDir = "asc" | "desc"

export function MarginTable({ organizations, filter = "all", labels, locale }: MarginTableProps) {
  const l = { ...DEFAULT_MARGIN_TABLE_LABELS, ...labels }
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("marginPercent")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const filteredAndSorted = useMemo(() => {
    let result = [...organizations]

    // Filter by status
    if (filter !== "all") {
      result = result.filter((org) => org.status === filter)
    }

    // Filter by search
    if (search) {
      const query = search.toLowerCase()
      result = result.filter((org) => org.name.toLowerCase().includes(query))
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal
      }
      return 0
    })

    return result
  }, [organizations, filter, search, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const SortableHeader = ({ column, label }: { column: SortKey; label: string }) => (
    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort(column)}>
      <div className="flex items-center gap-1">
        {label}
        {sortKey === column && (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-64">
        <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={l.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Columna del icono de expandir */}
              <TableHead className="w-8" />
              <SortableHeader column="name" label={l.organization} />
              <SortableHeader column="income" label={l.income} />
              <SortableHeader column="costs" label={l.costs} />
              <SortableHeader column="margin" label={l.margin} />
              <SortableHeader column="marginPercent" label={l.marginPercent} />
              <TableHead>{l.trend}</TableHead>
              <TableHead>{l.alertColumn}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.map((org) => (
              <MarginTableRow key={org.id} org={org} labels={l} locale={locale} />
            ))}
            {filteredAndSorted.length === 0 && (
              <TableRow>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  {l.empty}
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// --------------------------------------------------------------- MarginsSummaryCards

export interface MarginsSummaryCardsLabels {
  income: string
  costs: string
  netMargin: string
  marginPercent: string
  vsPrevious: string
}

export const DEFAULT_MARGINS_SUMMARY_CARDS_LABELS: MarginsSummaryCardsLabels = {
  income: "Ingresos",
  costs: "Costes",
  netMargin: "Margen Neto",
  marginPercent: "Margen %",
  vsPrevious: "vs. periodo anterior",
}

export interface MarginsSummaryCardsProps {
  summary: MarginsSummary
  labels?: Partial<MarginsSummaryCardsLabels>
  locale?: string
}

interface StatCardProps {
  label: string
  value: string
  delta?: { value: string; direction: MarginTrend }
  icon: ReactNode
  vsPrevious: string
}

function StatCard({ label, value, delta, icon, vsPrevious }: StatCardProps) {
  const isUp = delta?.direction === "up"
  const isDown = delta?.direction === "down"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{label}</CardDescription>
          {icon}
        </div>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {delta && (
        <CardContent className="pt-0">
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              isUp && "text-success",
              isDown && "text-destructive",
              !isUp && !isDown && "text-muted-foreground",
            )}
          >
            {isUp && <TrendUp weight="bold" className="h-3.5 w-3.5" />}
            {isDown && <TrendDown weight="bold" className="h-3.5 w-3.5" />}
            <span className="font-medium">{delta.value}</span>
            <span className="text-muted-foreground">{vsPrevious}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function MarginsSummaryCards({ summary, labels, locale = DEFAULT_EXTRAS_LOCALE }: MarginsSummaryCardsProps) {
  const l = { ...DEFAULT_MARGINS_SUMMARY_CARDS_LABELS, ...labels }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={l.income}
        value={formatCurrency(summary.totalIncome, locale)}
        delta={summary.incomeDelta}
        vsPrevious={l.vsPrevious}
        icon={<CurrencyEur className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        label={l.costs}
        value={formatCurrency(summary.totalCosts, locale)}
        delta={summary.costsDelta}
        vsPrevious={l.vsPrevious}
        icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        label={l.netMargin}
        value={formatCurrency(summary.netMargin, locale)}
        delta={summary.marginDelta}
        vsPrevious={l.vsPrevious}
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        label={l.marginPercent}
        value={`${summary.marginPercent}%`}
        delta={summary.marginPercentDelta}
        vsPrevious={l.vsPrevious}
        icon={<Percent className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}

// ---------------------------------------------------------------- MarginCharts

export interface MarginChartsLabels {
  tabEvolution: string
  tabProviders: string
  tabOrganizations: string
  incomeVsCosts: string
  marginEvolution: string
  costsByProvider: string
  providerEvolution: string
  topByCost: string
  topByMargin: string
  income: string
  costs: string
  margin: string
}

export const DEFAULT_MARGIN_CHARTS_LABELS: MarginChartsLabels = {
  tabEvolution: "Evolución",
  tabProviders: "Por Proveedor",
  tabOrganizations: "Por Organización",
  incomeVsCosts: "Ingresos vs Costes",
  marginEvolution: "Evolución del Margen",
  costsByProvider: "Costes por Proveedor",
  providerEvolution: "Evolución por Proveedor",
  topByCost: "Top 5 por Coste",
  topByMargin: "Top 5 por Margen %",
  income: "Ingresos",
  costs: "Costes",
  margin: "Margen",
}

export interface MarginChartsProps {
  timeSeries: MarginTimeSeriesPoint[]
  providerTimeSeries: MarginProviderTimeSeriesPoint[]
  organizations: OrganizationMargin[]
  labels?: Partial<MarginChartsLabels>
}

// Provider colors - distinct for each provider
const PROVIDER_COLORS: Record<string, string> = {
  llm: "var(--chart-1)",
  tts: "var(--chart-5)",
  stt: "var(--chart-2)",
  livekit: "var(--chart-3)",
}

// Organization bar colors - cycle through for variety
const ORG_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function MarginCharts({ timeSeries, providerTimeSeries, organizations, labels }: MarginChartsProps) {
  const l = { ...DEFAULT_MARGIN_CHARTS_LABELS, ...labels }
  const [tab, setTab] = useState("evolution")

  const chartConfig: ChartConfig = {
    income: { label: l.income, color: "var(--chart-2)" },
    costs: { label: l.costs, color: "var(--chart-5)" },
    margin: { label: l.margin, color: "var(--chart-1)" },
    llm: { label: "LLM", color: PROVIDER_COLORS.llm },
    tts: { label: "TTS", color: PROVIDER_COLORS.tts },
    stt: { label: "STT", color: PROVIDER_COLORS.stt },
    livekit: { label: "LiveKit", color: PROVIDER_COLORS.livekit },
  }

  // Prepare org data for bar charts with colors
  const topOrgsByCost = [...organizations]
    .sort((a, b) => b.costs - a.costs)
    .slice(0, 5)
    .map((org, index) => ({
      name: org.name,
      value: org.costs,
      fill: ORG_COLORS[index % ORG_COLORS.length],
    }))

  const topOrgsByMargin = [...organizations]
    .sort((a, b) => b.marginPercent - a.marginPercent)
    .slice(0, 5)
    .map((org, index) => ({
      name: org.name,
      value: org.marginPercent,
      fill: ORG_COLORS[index % ORG_COLORS.length],
    }))

  const providerTotals = organizations.reduce(
    (acc, org) => {
      org.costBreakdown.providers.forEach((p) => {
        acc[p.provider] = (acc[p.provider] || 0) + p.cost
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const providerBreakdown = Object.entries(providerTotals).map(([provider, cost]) => ({
    name: provider.toUpperCase(),
    value: cost,
    fill: PROVIDER_COLORS[provider] || "var(--chart-1)",
  }))

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line">
          <TabsTrigger value="evolution">{l.tabEvolution}</TabsTrigger>
          <TabsTrigger value="providers">{l.tabProviders}</TabsTrigger>
          <TabsTrigger value="organizations">{l.tabOrganizations}</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title={l.incomeVsCosts}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillCosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-costs)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-costs)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="linear"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                    fill="url(#fillIncome)"
                    dot={{ r: 3, fill: "var(--color-income)" }}
                  />
                  <Area
                    type="linear"
                    dataKey="costs"
                    stroke="var(--color-costs)"
                    strokeWidth={2}
                    fill="url(#fillCosts)"
                    dot={{ r: 3, fill: "var(--color-costs)" }}
                  />
                </AreaChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard title={l.marginEvolution}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="linear"
                    dataKey="margin"
                    stroke="var(--color-margin)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-margin)" }}
                  />
                </LineChart>
              </ChartContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title={l.costsByProvider}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={providerBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={70} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {providerBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard title={l.providerEvolution}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={providerTimeSeries}>
                  <defs>
                    {(["llm", "tts", "stt", "livekit"] as const).map((key) => (
                      <linearGradient key={key} id={`fillProvider-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="linear" dataKey="llm" stackId="1" stroke="var(--color-llm)" strokeWidth={2} fill="url(#fillProvider-llm)" />
                  <Area type="linear" dataKey="tts" stackId="1" stroke="var(--color-tts)" strokeWidth={2} fill="url(#fillProvider-tts)" />
                  <Area type="linear" dataKey="stt" stackId="1" stroke="var(--color-stt)" strokeWidth={2} fill="url(#fillProvider-stt)" />
                  <Area
                    type="linear"
                    dataKey="livekit"
                    stackId="1"
                    stroke="var(--color-livekit)"
                    strokeWidth={2}
                    fill="url(#fillProvider-livekit)"
                  />
                </AreaChart>
              </ChartContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title={l.topByCost}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={topOrgsByCost} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {topOrgsByCost.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard title={l.topByMargin}>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={topOrgsByMargin} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {topOrgsByMargin.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

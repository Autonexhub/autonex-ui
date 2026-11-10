import { Globe } from "@phosphor-icons/react"
import { ChartEmptyState } from "../molecules/empty-state"
import { Badge } from "../ui/badge"

export interface LanguageStat {
  lang: string
  cnt: number
}

export interface LanguageDistributionChartLabels {
  title: string
  noData: string
  onlySpanish: string
  /** Nombre visible de un idioma a partir de su código ISO. Por defecto: el mapa español, o el código en mayúsculas. */
  languageName: (lang: string) => string
}

const DEFAULT_LANGUAGE_NAMES: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  de: "Alemán",
  pt: "Portugués",
  ru: "Ruso",
  it: "Italiano",
  ar: "Árabe",
  zh: "Chino",
  ro: "Rumano",
  ca: "Catalán",
}

export const DEFAULT_LANGUAGE_DISTRIBUTION_CHART_LABELS: LanguageDistributionChartLabels = {
  title: "Idiomas usados",
  noData: "Sin datos disponibles",
  onlySpanish: "Todas las conversaciones han sido en español.",
  languageName: (lang) => DEFAULT_LANGUAGE_NAMES[lang] ?? lang.toUpperCase(),
}

export interface LanguageDistributionChartProps {
  data: LanguageStat[]
  total: number
  labels?: Partial<LanguageDistributionChartLabels>
}

// Sin banderas: el idioma se identifica por su nombre + el código ISO en un Badge.
const BAR_COLORS = ["var(--chart-1)", "var(--chart-4)", "var(--chart-6)", "var(--chart-5)", "var(--chart-3)", "var(--chart-2)"]

export const LanguageDistributionChart = ({ data, total, labels: labelsProp }: LanguageDistributionChartProps) => {
  const labels = { ...DEFAULT_LANGUAGE_DISTRIBUTION_CHART_LABELS, ...labelsProp }
  const onlySpanish = data.length === 1 && data[0].lang === "es"

  if (!data.length || onlySpanish) {
    return (
      <div>
        <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">{labels.title}</h3>
        <ChartEmptyState title={onlySpanish ? labels.onlySpanish : labels.noData} height={160} />
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">{labels.title}</h3>
      <div className="space-y-2.5">
        {data.map((item, i) => {
          const name = labels.languageName(item.lang)
          const pct = total > 0 ? ((item.cnt / total) * 100).toFixed(1) : "0"
          const color = BAR_COLORS[i % BAR_COLORS.length]
          return (
            <div key={item.lang} className="flex items-center gap-3">
              <div className="flex w-10 shrink-0 items-center justify-center">
                {item.lang ? (
                  <Badge variant="secondary" className="w-full justify-center uppercase tabular-nums">
                    {item.lang}
                  </Badge>
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.cnt} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(parseFloat(pct), 1)}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

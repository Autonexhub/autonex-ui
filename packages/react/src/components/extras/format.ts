/** Idioma por defecto de los componentes de este directorio; la app pasa el suyo con la prop `locale`. */
export const DEFAULT_EXTRAS_LOCALE = "es-ES"

// Igual que en Finanzas: en es-ES Intl no agrupa los números de 4 cifras ("1210,00 €").
const GROUP_ALWAYS = { useGrouping: "always" } as unknown as Intl.NumberFormatOptions

/** Céntimos enteros → «1.234,56 €». */
export const formatMoneyCents = (cents: number, locale = DEFAULT_EXTRAS_LOCALE, currency = "EUR"): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency, ...GROUP_ALWAYS }).format(Math.round(cents) / 100)

/** Importe en euros (con decimales) → «1.234,56 €», máximo dos decimales. */
export const formatMoney = (value: number, currency = "EUR", locale = DEFAULT_EXTRAS_LOCALE): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value)

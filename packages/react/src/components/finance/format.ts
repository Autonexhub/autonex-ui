/**
 * Formato de las cifras de Finanzas. Solo presentación: los valores llegan calculados de la API (céntimos,
 * puntos básicos, meses, días) y aquí únicamente se escriben. El idioma por defecto es español de España;
 * la app puede cambiarlo con `setFinanceLocale` (p. ej. «en-US», «ca-ES») antes de pintar.
 */

let financeLocale = "es-ES";

/** Etiqueta BCP-47 con la que se formatean importes y fechas de Finanzas. */
export const setFinanceLocale = (tag: string): void => {
  financeLocale = tag || "es-ES";
};
export const getFinanceLocale = (): string => financeLocale;

const GROUP_ALWAYS = { useGrouping: "always" } as unknown as Intl.NumberFormatOptions;

/** Céntimos enteros → «1.234,56 €» (agrupa también los números de 4 cifras). */
export const formatCents = (cents: number, currency = "EUR"): string =>
  new Intl.NumberFormat(financeLocale, { style: "currency", currency, ...GROUP_ALWAYS }).format(Math.round(cents) / 100);

/** Importe escrito a mano («1.250,50») → céntimos enteros, sin pasar por coma flotante. */
export type EurosInputError = "empty" | "format" | "decimals" | "notPositive" | "tooBig";
export function parseEurosToCents(
  input: string,
  maxCents = Number.MAX_SAFE_INTEGER,
): { cents: number; error: null } | { cents: null; error: EurosInputError } {
  const raw = input.replace(/[\s\u00a0€]/g, "");
  if (raw === "") return { cents: null, error: "empty" };
  if (/^[-−]/.test(raw)) return { cents: null, error: "notPositive" };
  const m = /^(\d+|\d{1,3}(?:\.\d{3})+)(?:,(\d*))?$/.exec(raw);
  if (!m) return { cents: null, error: "format" };
  const fraction = m[2] ?? "";
  if (fraction.length > 2) return { cents: null, error: "decimals" };
  const whole = m[1].replace(/\./g, "").replace(/^0+(?=\d)/, "");
  if (whole.length > 13) return { cents: null, error: "tooBig" };
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (cents <= 0) return { cents: null, error: "notPositive" };
  if (cents > maxCents) return { cents: null, error: "tooBig" };
  return { cents, error: null };
}

/**
 * Formato de las cifras de Finanzas de dirección. Solo presentación: los valores llegan calculados
 * de la API (céntimos, puntos básicos, meses, días) y aquí únicamente se escriben.
 */

const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat(getFinanceLocale(), opts);

/** Puntos básicos → «38,5 %». */
export const formatBp = (bp: number | null | undefined, digits = 1): string =>
  bp === null || bp === undefined ? '—' : nf({ style: 'percent', maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(bp / 10000);

/** Meses con un decimal como mucho: «7,8». */
export const formatMonthsNumber = (m: number): string => nf({ maximumFractionDigits: 1 }).format(m);

/** Céntimos → «8,8 mil €» para ejes de gráfica (compacto). */
export const formatCentsCompact = (cents: number): string =>
  nf({ style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);

/** Céntimos redondeados a miles, sin decimales, para etiquetas de gráfica: «580 mil €» (es) / «€580K» (en). */
export const formatCentsThousands = (cents: number): string =>
  nf({ style: 'currency', currency: 'EUR', notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 0 }).format(Math.round(cents / 100_000) * 1000);

/** Céntimos sin decimales («8.755 €»), para cifras grandes donde los céntimos solo hacen ruido. */
export const formatCentsRound = (cents: number): string =>
  nf({ style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions).format(
    cents / 100,
  );

/** «2026-11» → «nov 2026». */
export const formatMonthShort = (ym: string): string => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  return new Intl.DateTimeFormat(getFinanceLocale(), { month: 'short', year: 'numeric' }).format(new Date(Number(m[1]), Number(m[2]) - 1, 1));
};

/** Primera letra en mayúscula («Noviembre de 2026»), sin `capitalize` de CSS que pondría «De». */
export const capFirst = (s: string): string => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);

/** «2026-11» → «noviembre de 2026». */
export const formatMonthLong = (ym: string): string => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  return new Intl.DateTimeFormat(getFinanceLocale(), { month: 'long', year: 'numeric' }).format(new Date(Number(m[1]), Number(m[2]) - 1, 1));
};

/** «2026-11-03» → «3 nov». */
export const formatDayShort = (ymd: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!m) return ymd;
  return new Intl.DateTimeFormat(getFinanceLocale(), { day: 'numeric', month: 'short' }).format(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
};

/** Valor de una métrica según su unidad. `null` si no hay valor (la UI pinta N/D con su razón). */
export function formatMetricValue(unit: 'cents' | 'pct_bp' | 'months' | 'days' | 'ratio_x100', value: number | null, labels: { months: (n: string) => string; days: (n: string) => string }): string | null {
  if (value === null || value === undefined) return null;
  switch (unit) {
    case 'cents':
      return formatCents(value);
    case 'pct_bp':
      return formatBp(value);
    case 'months':
      return labels.months(formatMonthsNumber(value));
    case 'days':
      return labels.days(nf({ maximumFractionDigits: 0 }).format(value));
    case 'ratio_x100':
      return `${nf({ maximumFractionDigits: 2 }).format(value / 100)}×`;
    default:
      return String(value);
  }
}

/** «2026-11» → «nov 26» (ejes de gráficas por mes). */
export const formatMonthAxis = (ym: string): string => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  return new Intl.DateTimeFormat(getFinanceLocale(), { month: 'short', year: '2-digit' }).format(new Date(Number(m[1]), Number(m[2]) - 1, 1));
};

/** «2026-11» → «noviembre» (sin año, para frases del mes en curso). */
export const formatMonthName = (ym: string): string => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  return new Intl.DateTimeFormat(getFinanceLocale(), { month: 'long' }).format(new Date(Number(m[1]), Number(m[2]) - 1, 1));
};

/** Variación en puntos porcentuales ya calculada por la API: 12.3 → «+12 %», -4 → «−4 %». */
export const formatDeltaPct = (pct: number): string => {
  const n = nf({ maximumFractionDigits: Math.abs(pct) < 10 ? 1 : 0 }).format(Math.abs(pct));
  return `${pct > 0 ? '+' : pct < 0 ? '−' : ''}${n} %`;
};

/** Porcentaje en puntos (25.9) → «26 %». */
export const formatPctPoints = (pct: number, digits = 0): string => `${nf({ maximumFractionDigits: digits }).format(pct)} %`;

/** Importe con signo explícito y sin decimales: «+3.410 €», «−1.200 €». */
export const formatCentsSigned = (cents: number): string =>
  `${cents > 0 ? '+' : cents < 0 ? '−' : ''}${formatCentsRound(Math.abs(cents))}`;

/**
 * Importe contable para tablas (sin símbolo, la cabecera dice «€»): 123456 → «1.235», −123456 → «(1.235)».
 * Cero → «–». Formato de board pack: los negativos entre paréntesis (y en rojo, lo pone la celda).
 */
export const formatAccounting = (cents: number | null | undefined): string => {
  if (cents === null || cents === undefined) return '';
  const v = Math.round(cents / 100);
  if (v === 0) return '–';
  const s = nf({ maximumFractionDigits: 0, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions).format(Math.abs(v));
  return v < 0 ? `(${s})` : s;
};

/** Meses con un decimal: 9.24 → «9,2». */
export const formatOneDecimal = (n: number): string => nf({ maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(n);

/** Periodo de Tesorería en ejes y cabeceras: mensual «2026-11-01» → «Nov 26»; las semanas ya traen su etiqueta. */
export const formatPeriodAxis = (p: { start: string; label: string }, horizon: 'months' | 'weeks'): string =>
  horizon === 'months' ? capFirst(formatMonthAxis(p.start.slice(0, 7)).replace('.', '')) : p.label;

/** «166 K€», «1 M€» (etiquetas de los hitos). */
export function formatArrShort(cents: number): string {
  const eur = cents / 100;
  const short = (n: number) => nf({ maximumFractionDigits: n >= 100 ? 0 : 1 }).format(n);
  return eur >= 1_000_000 ? `${short(eur / 1_000_000)} M€` : `${short(Math.round(eur / 1000))} K€`;
}

/** «166 K€ · mar 27». */
export const milestoneLabel = (m: { month: string; arr_cents: number }): string => `${formatArrShort(m.arr_cents)} · ${formatMonthAxis(m.month)}`;

/** Importe de tabla con signo explícito y sin «€» (la cabecera lo dice): 123456 → «+1.235», −123456 → «−1.235». */
export const formatSignedPlain = (cents: number): string => {
  const v = Math.round(cents / 100);
  if (v === 0) return '0';
  const s = nf({ maximumFractionDigits: 0, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions).format(Math.abs(v));
  return `${v > 0 ? '+' : '−'}${s}`;
};

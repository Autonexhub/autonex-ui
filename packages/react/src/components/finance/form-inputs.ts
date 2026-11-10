/** Hoy en Madrid como fecha de calendario `yyyy-MM-dd`. */
export const todayInSpain = (): string => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());


/**
 * Conversión de lo que se escribe en los formularios de Supuestos a lo que espera la API (céntimos y
 * puntos básicos), siempre leyendo los dígitos como texto, sin coma flotante (como `parseEurosToCents`).
 */

/** «21» → 2100, «2,5» → 250, «0» → 0. null si no es un % válido entre 0 y 100 con 2 decimales como mucho. */
export function parsePercentToBp(input: string): number | null {
  const raw = input.replace(/[\s\u00a0%]/g, '').replace('.', ',');
  const m = /^(\d{1,3})(?:,(\d{0,2}))?$/.exec(raw);
  if (!m) return null;
  const bp = Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0'));
  return bp >= 0 && bp <= 10000 ? bp : null;
}

/** 2100 → «21», 250 → «2,5» (para rellenar el campo al editar). */
export function bpToPercentText(bp: number): string {
  const whole = Math.trunc(bp / 100);
  const frac = String(Math.abs(bp % 100)).padStart(2, '0').replace(/0+$/, '');
  return frac ? `${whole},${frac}` : String(whole);
}

/** 125050 → «1250,50» (para rellenar el campo al editar; lo vuelve a leer `parseEurosToCents`). */
export function centsToEurosText(cents: number): string {
  const whole = Math.trunc(cents / 100);
  const frac = String(Math.abs(cents % 100)).padStart(2, '0');
  return frac === '00' ? String(whole) : `${whole},${frac}`;
}

/** Entero en [min, max] escrito a mano, o null. */
export function parseIntInRange(input: string, min: number, max: number): number | null {
  const raw = input.trim();
  if (!/^\d{1,9}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= min && n <= max ? n : null;
}

/** Mes en curso (Madrid), AAAA-MM. */
export const currentMonth = (): string => todayInSpain().slice(0, 7);

/** Meses AAAA-MM desde enero del año pasado hasta diciembre de dentro de dos años, más los que se pidan. */
export function monthChoices(extra: (string | null | undefined)[] = []): string[] {
  const year = Number(currentMonth().slice(0, 4));
  const list: string[] = [];
  for (let y = year - 1; y <= year + 2; y++) {
    for (let m = 1; m <= 12; m++) list.push(`${y}-${String(m).padStart(2, '0')}`);
  }
  for (const e of extra) if (e && /^\d{4}-\d{2}$/.test(e) && !list.includes(e)) list.push(e);
  return list.sort();
}

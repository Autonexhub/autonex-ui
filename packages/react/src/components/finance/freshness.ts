/** Lógica pura de la línea de frescura: antigüedad de la última sincronización con Holded en días naturales. */
export type SyncAge = { kind: 'never' } | { kind: 'today' } | { kind: 'yesterday' } | { kind: 'days'; n: number };

const DAY_MS = 86_400_000;

const dayNumber = (s: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / DAY_MS : null;
};

/** `lastSyncAt` y `asOf` en «Y-m-d H:i» (hora de Madrid, tal como llegan de la API). */
export function syncAge(lastSyncAt: string | null, asOf: string): SyncAge {
  if (!lastSyncAt) return { kind: 'never' };
  const a = dayNumber(lastSyncAt);
  const b = dayNumber(asOf);
  if (a === null || b === null) return { kind: 'never' };
  const n = Math.max(0, Math.round(b - a));
  if (n === 0) return { kind: 'today' };
  if (n === 1) return { kind: 'yesterday' };
  return { kind: 'days', n };
}

/** «2026-11-05 08:40» → fecha local para formatear (sin zona: se interpreta tal cual). */
export function parseStamp(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0)) : null;
}

/** «2026-11-06 00:12» → «6 nov, 00:12» en 24 h (`hourCycle: 'h23'`: con `hour12: false` en-US da «24:12»). */
export function formatStamp(s: string, locale: string): string {
  const stamp = parseStamp(s);
  return stamp
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(stamp)
    : s;
}

/** Segundo de la llamada → "m:ss" (o "h:mm:ss" desde una hora); "—" sin valor. */
export function formatOffset(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(Number(seconds))) return "—";
  const total = Math.max(0, Math.floor(Number(seconds)));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** Texto del enlace a un momento: "1:05" con segundo, "turno 7" con solo el turno, null si no hay ninguno. */
export function momentLabel(tOffsetS?: number | null, turnIndex?: number | null): string | null {
  if (tOffsetS !== null && tOffsetS !== undefined && Number.isFinite(Number(tOffsetS))) return formatOffset(tOffsetS);
  if (turnIndex !== null && turnIndex !== undefined) return `turno ${turnIndex}`;
  return null;
}

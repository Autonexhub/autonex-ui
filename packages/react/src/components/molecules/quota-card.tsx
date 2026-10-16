import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface QuotaView {
  pack_minutes: number;
  minutes_used: number;
  extra_minutes: number;
  pack_name: string | null;
  /** YYYY-MM-DD — inicio del ciclo actual de la barra (su día del mes es el corte). */
  period_start?: string | null;
  per_org?: Array<{ id: number; name: string; minutes_used: number; pack_minutes: number; pack_name: string | null }>;
}

export interface QuotaLabels {
  orgsWithPack: (count: number) => string;
  monthlyCycle: string;
  renewsIn: (days: number) => string;
  overPlan: (minutes: string) => string;
  remaining: (minutes: string) => string;
  a11yOverPlan: (minutes: string) => string;
  a11yRemaining: (minutes: string) => string;
  globalTitle: string;
  title: string;
  currentMonth: string;
  used: string;
  usedValue: (used: number, total: number, pct: number) => string;
  perOrg: (count: number) => string;
}

export const defaultQuotaLabels: QuotaLabels = {
  orgsWithPack: (n) => `${n} ${n === 1 ? "organización con pack" : "organizaciones con pack"}`,
  monthlyCycle: "Ciclo mensual",
  renewsIn: (d) => `Se renueva en ${d} ${d === 1 ? "día" : "días"}`,
  overPlan: (m) => `+${m} min sobre el plan`,
  remaining: (m) => `${m} min restantes`,
  a11yOverPlan: (m) => `${m} minutos sobre el plan`,
  a11yRemaining: (m) => `${m} minutos restantes`,
  globalTitle: "Cuota global (todas las organizaciones con pack)",
  title: "Cuota",
  currentMonth: "Mes en curso",
  used: "Consumido",
  usedValue: (used, total, pct) => `${used} / ${total} min (${pct}%)`,
  perOrg: (n) => `Por organización (${n})`,
};

// ─── Presentación (también la consume la story) ─────────────────────────────

const fmt = new Intl.NumberFormat('es-ES');

/**
 * Días hasta el próximo corte del ciclo. El backend no devuelve la fecha de
 * renovación: `period_start` del bar es el inicio del ciclo en curso y su día
 * del mes es el día de corte (anchor de `data_start_date`, o el 1). Se calcula
 * en cliente sin llamadas extra. Devuelve null si no hay dato.
 */
function daysUntilRenewal(periodStart: string | null | undefined, today = new Date()): number | null {
  if (!periodStart) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(periodStart);
  if (!m) return null;
  const cutoffDay = Number(m[3]);
  if (!cutoffDay) return null;

  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const clamp = (y: number, mo: number) => {
    const last = new Date(y, mo + 1, 0).getDate();
    return new Date(y, mo, Math.min(cutoffDay, last));
  };
  let next = clamp(base.getFullYear(), base.getMonth());
  if (next <= base) next = clamp(base.getFullYear(), base.getMonth() + 1);
  return Math.round((next.getTime() - base.getTime()) / 86_400_000);
}

interface QuotaCardProps {
  view: QuotaView;
  collapsed?: boolean;
  /** Solo para stories/tests: fija "hoy" para que el cálculo de días sea estable. */
  today?: Date;
  /** Textos (por defecto, español). La app los inyecta traducidos. */
  labels?: QuotaLabels;
}

export function QuotaCard({ view: data, collapsed, today, labels = defaultQuotaLabels }: QuotaCardProps) {
  const l = labels;
  const isAggregate = Array.isArray(data.per_org);
  const total = data.pack_minutes ?? 0;
  const used  = Math.round(data.minutes_used);
  const extra = Math.round(data.extra_minutes);
  if (total <= 0) return null;
  const pct = Math.min(100, Math.round((used / total) * 100));
  const over = extra > 0;
  const remaining = Math.max(0, total - used);
  const tone: RingTone = over ? 'destructive' : pct >= 80 ? 'warning' : 'success';
  const barColor = { success: 'bg-success', warning: 'bg-warning', destructive: 'bg-destructive' }[tone];

  const days = isAggregate ? null : daysUntilRenewal(data.period_start, today);
  const subline = isAggregate
    ? l.orgsWithPack(data.per_org?.length ?? 0)
    : days === null
      ? l.monthlyCycle
      : l.renewsIn(days);

  const headline = over
    ? <span className="text-destructive">{l.overPlan(fmt.format(extra))}</span>
    : <>{l.remaining(fmt.format(remaining))}</>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={over
            ? l.a11yOverPlan(fmt.format(extra))
            : l.a11yRemaining(fmt.format(remaining))}
          // Sin tarjeta (decisión Bruno 02/09): fila hermana del perfil — anillo a la
          // izquierda (32px, como el avatar) + dos líneas; hover en píldora como los módulos.
          className={cn(
            'w-full text-left rounded-md transition-colors hover:bg-background/70',
            collapsed ? 'flex items-center justify-center p-1' : 'flex items-center gap-2 px-2 py-2',
          )}
        >
          {collapsed ? (
            <ProgressRing pct={pct} tone={tone} size={28} />
          ) : (
            <>
              <ProgressRing pct={pct} tone={tone} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground tabular-nums">{headline}</div>
                <div className="truncate text-xs text-muted-foreground">{subline}</div>
              </div>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 overflow-hidden" align="start" side="right">
        <div className="px-3 py-2.5 border-b">
          <div className="text-sm font-semibold">{isAggregate ? l.globalTitle : (data.pack_name ?? l.title)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{l.currentMonth}</div>
        </div>
        <div className="px-3 py-2.5 border-b bg-muted/20">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">{l.used}</span>
            <span className="tabular-nums font-medium">{l.usedValue(used, total, pct)}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
            <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
          </div>
          {over && (
            <div className="mt-2 text-xs tabular-nums text-destructive">{l.overPlan(fmt.format(extra))}</div>
          )}
        </div>
        {isAggregate && data.per_org && data.per_org.length > 0 && (
          <div className="py-1 max-h-[40vh] overflow-y-auto">
            <div className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{l.perOrg(data.per_org.length)}</div>
            {data.per_org.map((o) => {
              const pctOrg = o.pack_minutes > 0 ? Math.min(100, Math.round((o.minutes_used / o.pack_minutes) * 100)) : 0;
              return (
                <div key={o.id} className="px-3 py-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="truncate text-xs">{o.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{Math.round(o.minutes_used)}/{o.pack_minutes}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                    <div className={cn('h-full rounded-full', pctOrg >= 100 ? 'bg-destructive' : pctOrg >= 80 ? 'bg-warning' : 'bg-success')} style={{ width: `${pctOrg}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

type RingTone = 'success' | 'warning' | 'destructive';

const ringStroke: Record<RingTone, string> = {
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
};

/** Anillo de progreso: pista `stroke-border`, trazo 4px redondeado, arranca arriba. */
function ProgressRing({ pct, tone, size = 36, strokeWidth = 4 }: { pct: number; tone: RingTone; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 -rotate-90"
      role="img"
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-border" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className={cn('transition-[stroke-dashoffset] duration-300', ringStroke[tone])}
      />
    </svg>
  );
}


import { ArrowSquareOut, X } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { formatCentsRound, formatDayShort } from "./format";
import type { FinanceRenderLink } from "./kpi-tile";
import type { CashPeriod, CashPeriodLine } from "./types";
import { CASH_COLORS } from "./ui";

export interface CashPeriodDetailLabels {
  /** «Saldo final previsto 9.761 €». */
  detailClosing: (amount: string) => string;
  willIn: string;
  willOut: string;
  nothingIn: string;
  nothingOut: string;
  close: string;
  estimatedShort: string;
  /** Nombre de cada tipo de línea (`invoice`, `recurring_billing`…); si falta, se escribe el tipo tal cual. */
  kind: Record<string, string>;
}

export const DEFAULT_CASH_PERIOD_DETAIL_LABELS: CashPeriodDetailLabels = {
  detailClosing: (amount) => `Saldo final previsto ${amount}`,
  willIn: "Cobros previstos",
  willOut: "Pagos previstos",
  nothingIn: "Sin cobros previstos.",
  nothingOut: "Sin pagos previstos.",
  close: "Cerrar",
  estimatedShort: "est.",
  kind: {
    invoice: "Factura",
    recurring_billing: "Facturación recurrente",
    fixed_cost: "Coste fijo",
    purchase: "Compra",
    vat: "IVA (mod. 303)",
    other: "Otros",
  },
};

const defaultLink: FinanceRenderLink = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

function LineRow({ line, labels, renderLink }: { line: CashPeriodLine; labels: CashPeriodDetailLabels; renderLink: FinanceRenderLink }) {
  const label = <span className="truncate">{line.label}</span>;
  const external = line.href && /^https?:\/\//.test(line.href);
  return (
    <li className="flex items-baseline justify-between gap-3 py-2 text-sm">
      <div className="min-w-0">
        {line.href ? (
          external ? (
            <a href={line.href} target="_blank" rel="noreferrer" className="flex max-w-full items-center gap-1 text-foreground underline-offset-4 hover:underline">
              {label}
              <ArrowSquareOut className="size-3.5 shrink-0 text-muted-foreground" />
            </a>
          ) : (
            <>{renderLink({ href: line.href, className: "block max-w-full truncate text-foreground underline-offset-4 hover:underline", children: line.label })}</>
          )
        ) : (
          <span className="block truncate text-foreground">{line.label}</span>
        )}
        <span className="text-xs text-muted-foreground">
          {labels.kind[line.kind] ?? line.kind}
          {line.date && ` · ${formatDayShort(line.date)}`}
          {line.is_estimate && ` · ${labels.estimatedShort}`}
        </span>
      </div>
      <span className="shrink-0 tabular-nums text-foreground">{formatCentsRound(Math.abs(line.amount_cents))}</span>
    </li>
  );
}

function Column({ title, total, color, lines, empty, labels, renderLink }: { title: string; total: number; color: string; lines: CashPeriodLine[]; empty: string; labels: CashPeriodDetailLabels; renderLink: FinanceRenderLink }) {
  return (
    <section className="min-w-0">
      <header className="flex items-baseline justify-between gap-3 border-b pb-2">
        <h3 className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="size-2.5 rounded-[3px]" style={{ background: color }} />
          {title}
        </h3>
        <span className="text-sm font-semibold tabular-nums text-foreground">{formatCentsRound(Math.abs(total))}</span>
      </header>
      {lines.length === 0 ? (
        <p className="py-3 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y">
          {lines.map((l, i) => (
            <LineRow key={`${l.label}-${i}`} line={l} labels={labels} renderLink={renderLink} />
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Detalle de un periodo de la caja prevista: cobros y pagos con cada línea y su origen.
 * Las líneas de facturación recurrente enlazan a la Facturación prevista de Cobros (href de la API; los internos
 * los pinta `renderLink`).
 */
export function CashPeriodDetail({
  period,
  onClose,
  className,
  renderLink = defaultLink,
  labels: labelsProp,
}: {
  period: CashPeriod;
  onClose?: () => void;
  className?: string;
  renderLink?: FinanceRenderLink;
  labels?: Partial<CashPeriodDetailLabels>;
}) {
  const labels: CashPeriodDetailLabels = { ...DEFAULT_CASH_PERIOD_DETAIL_LABELS, ...labelsProp, kind: { ...DEFAULT_CASH_PERIOD_DETAIL_LABELS.kind, ...labelsProp?.kind } };
  const ins = period.lines.filter((l) => l.direction === "in");
  const outs = period.lines.filter((l) => l.direction === "out");
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{period.label}</h2>
          <p className="text-sm text-muted-foreground">{labels.detailClosing(formatCentsRound(period.closing_cents))}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={labels.close}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Column title={labels.willIn} total={period.in_cents} color={CASH_COLORS.in} lines={ins} empty={labels.nothingIn} labels={labels} renderLink={renderLink} />
        <Column title={labels.willOut} total={period.out_cents} color={CASH_COLORS.out} lines={outs} empty={labels.nothingOut} labels={labels} renderLink={renderLink} />
      </div>
    </Card>
  );
}

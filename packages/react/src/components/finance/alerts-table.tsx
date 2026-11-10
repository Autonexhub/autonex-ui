import { useState } from "react";
import { ArrowSquareOut, CaretDown, CheckCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { formatAccounting } from "./format";
import type { FinanceRenderLink } from "./kpi-tile";
import type { FinanceAlert } from "./types";

const VISIBLE = 5;

const DOT: Record<FinanceAlert["severity"], string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/60",
};

export interface AlertsTableLabels {
  title: string;
  amountHeader: string;
  empty: string;
  showLess: string;
  showMore: (count: number) => string;
  severity: Record<FinanceAlert["severity"], string>;
}

export const DEFAULT_ALERTS_TABLE_LABELS: AlertsTableLabels = {
  title: "Alertas",
  amountHeader: "Importe €",
  empty: "Sin alertas abiertas.",
  showLess: "Ver menos",
  showMore: (count) => `Ver ${count} más`,
  severity: { high: "Alta", medium: "Media", low: "Baja" },
};

const defaultLink: FinanceRenderLink = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

function Action({ action, renderLink }: { action: NonNullable<FinanceAlert["action"]>; renderLink: FinanceRenderLink }) {
  const cls = "inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary underline-offset-4 hover:underline";
  return action.external || /^https?:\/\//.test(action.href) ? (
    <a href={action.href} target="_blank" rel="noreferrer" className={cls}>
      {action.label}
      <ArrowSquareOut className="size-3.5" />
    </a>
  ) : (
    <>{renderLink({ href: action.href, className: cls, children: action.label })}</>
  );
}

/**
 * «Alertas» compacta (05-rediseno.md §0.4): tabla de máx. 5 filas · tipo · descripción · importe · acción,
 * ordenada por la API por importe en juego. El resto, plegado. Los enlaces internos los pinta `renderLink`
 * (la app pasa su router); los externos, un `<a>`.
 */
export function AlertsTable({
  alerts,
  total,
  className,
  title,
  renderLink = defaultLink,
  labels: labelsProp,
}: {
  alerts: FinanceAlert[];
  total?: number;
  className?: string;
  title?: string;
  renderLink?: FinanceRenderLink;
  labels?: Partial<AlertsTableLabels>;
}) {
  const labels: AlertsTableLabels = { ...DEFAULT_ALERTS_TABLE_LABELS, ...labelsProp, severity: { ...DEFAULT_ALERTS_TABLE_LABELS.severity, ...labelsProp?.severity } };
  const [open, setOpen] = useState(false);
  const count = Math.max(total ?? 0, alerts.length);
  const shown = open ? alerts : alerts.slice(0, VISIBLE);
  const hidden = alerts.length - shown.length;

  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="flex items-baseline justify-between gap-3 border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          {title ?? labels.title}
          <span className="ml-2 font-normal text-muted-foreground tabular-nums">{count}</span>
        </h2>
        <span className="text-xs text-muted-foreground">{labels.amountHeader}</span>
      </div>
      {alerts.length === 0 ? (
        <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <CheckCircle className="size-4 text-success" weight="fill" />
          {labels.empty}
        </p>
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">{title ?? labels.title}</caption>
          <tbody className="divide-y">
            {shown.map((a) => (
              <tr key={a.id} className="align-top">
                <td className="hidden w-0 whitespace-nowrap py-2.5 pl-4 pr-3 sm:table-cell">
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("size-2 rounded-full", DOT[a.severity])} aria-hidden />
                    <span className="sr-only">{labels.severity[a.severity]}</span>
                    {a.type ?? labels.severity[a.severity]}
                  </span>
                </td>
                <td className="py-2.5 pl-4 pr-3 sm:pl-0">
                  <p className="mb-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
                    <span className={cn("size-2 rounded-full", DOT[a.severity])} aria-hidden />
                    {a.type ?? labels.severity[a.severity]}
                  </p>
                  <p className="text-foreground">{a.title}</p>
                  {a.detail && <p className="text-xs text-muted-foreground">{a.detail}</p>}
                  {a.action && (
                    <div className="mt-1 sm:hidden">
                      <Action action={a.action} renderLink={renderLink} />
                    </div>
                  )}
                </td>
                <td className="w-0 whitespace-nowrap py-2.5 pr-3 text-right tabular-nums text-foreground">
                  {a.amount_cents !== null ? formatAccounting(a.amount_cents) : ""}
                </td>
                <td className="hidden w-0 py-2.5 pr-4 text-right sm:table-cell">{a.action && <Action action={a.action} renderLink={renderLink} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {alerts.length > VISIBLE && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-1 border-t px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          {open ? labels.showLess : labels.showMore(hidden)}
          <CaretDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </button>
      )}
    </Card>
  );
}

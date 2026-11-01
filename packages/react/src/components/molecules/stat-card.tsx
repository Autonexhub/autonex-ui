import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import { cn } from "../../lib/utils";

/**
 * Tarjeta de KPI del sistema (3-Organisms/StatCard). Es la única: no montar tarjetas de cifras a mano
 * en cada página. `hint` es la línea de contexto bajo la cifra ("Cuotas y mensualidades, sin IVA").
 */
export interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  delta?: {
    value: string;
    direction: 'up' | 'down';
    /** Texto tras el delta; por defecto "vs. periodo anterior". */
    suffix?: string;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, unit, hint, delta, icon, className }: StatCardProps) {
  const isUp = delta?.direction === 'up';
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          {icon}
        </div>
        <div className="flex items-baseline gap-1">
          <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </CardHeader>
      {(hint || delta) && (
        <CardContent className="space-y-1 pt-0">
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {delta && (
            <div className={cn('flex items-center gap-1 text-xs', isUp ? 'text-success' : 'text-destructive')}>
              {isUp ? (
                <TrendUp weight="bold" className="h-3.5 w-3.5" />
              ) : (
                <TrendDown weight="bold" className="h-3.5 w-3.5" />
              )}
              <span className="font-medium">{delta.value}</span>
              <span className="text-muted-foreground">{delta.suffix ?? 'vs. periodo anterior'}</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/** Rejilla responsive de StatCards: 1 columna en móvil, 2 en tablet, 4 en escritorio. */
export function StatCardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>{children}</div>;
}

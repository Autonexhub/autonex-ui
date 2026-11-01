import * as React from 'react';
import { cn } from "../../lib/utils";

export type StatusDotVariant = 'success' | 'warning' | 'destructive' | 'info' | 'secondary';

// Mismo mapeo que el Badge (info = azul de marca), pero solo en el punto: el texto va en tinta.
const DOT: Record<StatusDotVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-brand',
  secondary: 'bg-muted-foreground/60',
};

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusDotVariant;
}

/**
 * Estado sobrio de Cobros: punto de color + texto en tinta, sin píldora ni fondo (decisión de Jonnathan, 21/10:
 * los cuadritos tintados se veían «muy IA»). Neutro (`secondary`) = punto gris y texto atenuado.
 */
export function StatusDot({ variant = 'secondary', className, children, ...props }: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      data-variant={variant}
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap text-sm leading-5',
        variant === 'secondary' ? 'text-muted-foreground' : 'text-foreground',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', DOT[variant])} />
      {children}
    </span>
  );
}

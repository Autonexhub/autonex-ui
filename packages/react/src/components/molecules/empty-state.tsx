import { ReactNode } from "react";
import { BookOpen as BookOpenIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6", className)}>
      {icon && <div className="mb-3 text-muted-foreground/60">{icon}</div>}
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Vacío de módulo de métricas (decisión Bruno 01/09, calcado del patrón
 * "With Icon" de la story): BookOpen 48px + título + descripción, SIEMPRE
 * centrado vertical y horizontal en TODO el alto disponible de la tarjeta.
 * Único para todos los bloques de métricas.
 */
export function ChartEmptyState({
  title,
  description = "No hay actividad en el rango seleccionado.",
  height = 256,
}: {
  title: string;
  description?: string;
  height?: number;
}) {
  return (
    <div className="flex h-full flex-1 items-center justify-center" style={{ minHeight: height }}>
      <EmptyState icon={<BookOpenIcon className="h-12 w-12" />} title={title} description={description} />
    </div>
  );
}

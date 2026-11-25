import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export interface TagChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Texto de la etiqueta. Sin `label` se pinta `emptyLabel` como contorno. */
  label?: ReactNode;
  /** Color del punto (cualquier color CSS: `#7c3aed`, `var(--chart-2)`…). Sin color, sin punto. */
  color?: string | null;
  /** Detrás del texto: p. ej. la varita de "puesta por la IA". */
  suffix?: ReactNode;
  /** Etiqueta vacía (p. ej. "Sin categoría"): Badge `outline` en gris. */
  emptyLabel?: ReactNode;
  /** Aspa para quitarla. Con `onRemove` el chip es un grupo, no un único botón. */
  onRemove?: () => void;
  /** aria-label del aspa. Por defecto, "Quitar". */
  removeLabel?: string;
}

/**
 * Etiqueta con punto de color (categoría, tipo, fase…): Badge `secondary` + punto + texto truncado
 * (DesignRules › Badge: etiqueta neutra). Con `onClick` (o dentro de un `asChild`, p. ej. el disparador de
 * `PropSelect`) es un botón; sin él, un span. Con `onRemove` lleva aspa.
 */
export const TagChip = forwardRef<HTMLButtonElement, TagChipProps>(
  ({ label, color, suffix, emptyLabel, onRemove, removeLabel = "Quitar", className, onClick, disabled, type, ...rest }, ref) => {
    const empty = label == null || label === "";
    const content = empty ? (
      <span className="truncate">{emptyLabel}</span>
    ) : (
      <>
        {color && <span className="size-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />}
        <span className="truncate">{label}</span>
        {suffix}
      </>
    );
    const badgeClass = cn(
      "max-w-full gap-1.5 font-normal",
      empty && "text-muted-foreground",
      onRemove && "pr-1",
    );
    const variant = empty ? "outline" : "secondary";

    // Interactiva: el propio Badge es el botón (o lo es el `asChild` de fuera, que le pasa onClick y ref).
    if (!onRemove && onClick) {
      return (
        <button
          ref={ref}
          type={type ?? "button"}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "inline-flex max-w-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
          {...rest}
        >
          <Badge variant={variant} className={cn(badgeClass, "cursor-pointer hover:bg-muted")}>{content}</Badge>
        </button>
      );
    }

    return (
      <Badge variant={variant} className={cn(badgeClass, className)} title={rest.title}>
        {content}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${removeLabel} ${typeof label === "string" ? label : ""}`.trim()}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Badge>
    );
  },
);
TagChip.displayName = "TagChip";

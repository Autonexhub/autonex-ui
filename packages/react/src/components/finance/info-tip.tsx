import type { ReactNode } from "react";
import { Info } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * La «i» de Finanzas: fuente, fórmula y nombre técnico de una cifra van aquí, nunca como etiqueta en la
 * tarjeta. Sin contenido no pinta nada. Necesita un `TooltipProvider` por encima.
 */
export function InfoTip({ children, label, className }: { children?: ReactNode; label: string; className?: string }) {
  if (!children) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm whitespace-pre-line leading-relaxed">{children}</TooltipContent>
    </Tooltip>
  );
}

import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface ThemeToggleLabels {
  switchToLight: string;
  switchToDark: string;
  lightMode: string;
  darkMode: string;
}

const DEFAULT_LABELS: ThemeToggleLabels = {
  switchToLight: "Cambiar a modo claro",
  switchToDark: "Cambiar a modo oscuro",
  lightMode: "Modo claro",
  darkMode: "Modo oscuro",
};

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  /** Con la barra lateral colapsada se muestra un tooltip a la derecha. */
  collapsed?: boolean;
  labels?: Partial<ThemeToggleLabels>;
}

/** Botón sol/luna. No conoce el proveedor de tema: recibe `isDark` y `onToggle`. */
export const ThemeToggle = ({ isDark, onToggle, collapsed = false, labels }: ThemeToggleProps) => {
  const l = { ...DEFAULT_LABELS, ...labels };

  const button = (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onToggle}
      className={cn("group relative overflow-hidden rounded-lg")}
      aria-label={isDark ? l.switchToLight : l.switchToDark}
    >
      <Sun className={cn(
        "h-4 w-4 text-muted-foreground transition-all duration-300 absolute",
        isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
      )} />
      <Moon className={cn(
        "h-4 w-4 text-muted-foreground transition-all duration-300 absolute",
        isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
      )} />
    </Button>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {isDark ? l.lightMode : l.darkMode}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

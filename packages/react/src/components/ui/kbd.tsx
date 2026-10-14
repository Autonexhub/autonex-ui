import { cn } from "../../lib/utils";

/**
 * Keyboard shortcut display component.
 * Use to show keyboard shortcuts consistently across the UI.
 *
 * @example
 * <Kbd>⌘K</Kbd>
 * <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-[1.375rem] w-fit min-w-[1.375rem] items-center justify-center gap-1 rounded-lg bg-muted px-1.5 font-sans text-xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

// span, no div: un KbdGroup vive dentro de texto (<p>Pulsa <KbdGroup>…</KbdGroup></p>)
// y un div ahí es DOM inválido (aviso validateDOMNesting).
function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };

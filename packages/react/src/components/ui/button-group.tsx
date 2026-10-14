import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Separator } from "./separator";

// Grupo de botones adosados (segmented control). Los hijos pierden el radio
// en las esquinas interiores y comparten borde. Portado del preset: aquí los
// hijos de Marta no llevan data-slot, así que las reglas apuntan a `[&>*]`
// en lugar de `[data-slot]`; ButtonGroupText usa asChild (Radix Slot) en
// lugar del render prop de base-ui.

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*:focus-visible]:relative [&>*:focus-visible]:z-10 has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child):not([data-slot=button-group-separator])]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child):not([data-slot=button-group-separator])]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child):not([data-slot=button-group-separator])]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child):not([data-slot=button-group-separator])]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof buttonGroupVariants>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="button-group"
    data-orientation={orientation}
    className={cn(buttonGroupVariants({ orientation }), className)}
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

const ButtonGroupText = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-4xl border border-border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
});
ButtonGroupText.displayName = "ButtonGroupText";

const ButtonGroupSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <Separator
    ref={ref}
    data-slot="button-group-separator"
    orientation={orientation}
    className={cn(
      "relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
      className,
    )}
    {...props}
  />
));
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };

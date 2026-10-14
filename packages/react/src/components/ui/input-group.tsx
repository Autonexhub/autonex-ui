import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

// Input con addons (icono, prefijo/sufijo de texto, botones). El contenedor
// pinta el relleno bg-muted y el anillo de foco/error (mismo patrón que
// input.tsx); el input interior queda transparente y sin anillo propio.
// Portado del preset (Tailwind v4 → v3): variantes `has-data-*`, `**:` e
// `in-data-*` reescritas con `has-[...]` y selectores arbitrarios.

const InputGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-transparent bg-muted transition-[color,box-shadow,background-color] outline-none",
        // Foco: mismo patrón exacto que input.tsx, delegado al contenedor
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30",
        // Error vía aria-invalid en el control, como input.tsx
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
        // Alturas y radios según el contenido (textarea, addons en bloque)
        "has-[[data-align=block-start]]:rounded-3xl has-[[data-align=block-end]]:rounded-3xl has-[textarea]:rounded-2xl",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>textarea]:h-auto",
        // Padding del input según los addons presentes
        "[&:has(>[data-align=block-end])>input]:pt-3 [&:has(>[data-align=block-start])>input]:pb-3 [&:has(>[data-align=inline-end])>input]:pr-1.5 [&:has(>[data-align=inline-start])>input]:pl-1.5",
        className,
      )}
      {...props}
    />
  ),
);
InputGroup.displayName = "InputGroup";

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&_[data-slot=kbd]]:rounded-3xl [&_[data-slot=kbd]]:bg-background [&_[data-slot=kbd]]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:-ml-1 has-[>kbd]:-ml-1",
        "inline-end": "order-last pr-3 has-[>button]:-mr-1 has-[>kbd]:-mr-1",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-3.5 [&.border-b]:pb-3.5",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-3.5 [&.border-t]:pt-3.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof inputGroupAddonVariants>
>(({ className, align = "inline-start", ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onClick={(e) => {
      if ((e.target as HTMLElement).closest("button")) {
        return;
      }
      e.currentTarget.parentElement?.querySelector("input")?.focus();
    }}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";

const inputGroupButtonVariants = cva("flex items-center gap-2 rounded-4xl text-sm shadow-none", {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-xl px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      sm: "",
      "icon-xs": "size-6 rounded-xl p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "size" | "type"> &
    VariantProps<typeof inputGroupButtonVariants> & {
      type?: "button" | "submit" | "reset";
    }
>(({ className, type = "button", variant = "ghost", size = "xs", ...props }, ref) => (
  <Button
    ref={ref}
    type={type}
    data-size={size}
    variant={variant}
    className={cn(inputGroupButtonVariants({ size }), className)}
    {...props}
  />
));
InputGroupButton.displayName = "InputGroupButton";

const InputGroupText = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  ),
);
InputGroupText.displayName = "InputGroupText";

const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  ),
);
InputGroupInput.displayName = "InputGroupInput";

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    data-slot="input-group-control"
    className={cn(
      "flex-1 resize-none rounded-none border-0 bg-transparent py-2.5 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0",
      className,
    )}
    {...props}
  />
));
InputGroupTextarea.displayName = "InputGroupTextarea";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};

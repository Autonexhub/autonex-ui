import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Separator } from "./separator";

// Fila de lista genérica (contactos, conversaciones, ajustes): media +
// contenido (título/descripción) + acciones. Portado del preset: el render
// prop de base-ui se sustituye por asChild (Radix Slot) para renderizar como
// <a> o <button>; foco con el patrón exacto de input.tsx.

const ItemGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-[[data-size=sm]]:gap-2.5 has-[[data-size=xs]]:gap-2",
        className,
      )}
      {...props}
    />
  ),
);
ItemGroup.displayName = "ItemGroup";

const ItemSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-slot="item-separator"
    orientation="horizontal"
    className={cn("my-2", className)}
    {...props}
  />
));
ItemSeparator.displayName = "ItemSeparator";

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-2xl border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 [&:is(a)]:transition-colors [&:is(a):hover]:bg-muted [&:is(button)]:text-left [&:is(button):hover]:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-3.5 px-3.5 py-3",
        xs: "gap-2.5 px-3 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Item = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean }
>(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
});
Item.displayName = "Item";

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-xl group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 group-data-[size=xs]/item:rounded-lg [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const ItemMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof itemMediaVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-media"
    data-variant={variant}
    className={cn(itemMediaVariants({ variant, className }))}
    {...props}
  />
));
ItemMedia.displayName = "ItemMedia";

const ItemContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0.5 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  ),
);
ItemContent.displayName = "ItemContent";

const ItemTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className,
      )}
      {...props}
    />
  ),
);
ItemTitle.displayName = "ItemTitle";

const ItemDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-sm font-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  ),
);
ItemDescription.displayName = "ItemDescription";

const ItemActions = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  ),
);
ItemActions.displayName = "ItemActions";

const ItemHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  ),
);
ItemHeader.displayName = "ItemHeader";

const ItemFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  ),
);
ItemFooter.displayName = "ItemFooter";

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};

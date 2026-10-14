import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "[&_[data-slot=bubble-content]]:bg-primary [&_[data-slot=bubble-content]]:text-primary-foreground",
        secondary:
          "[&_[data-slot=bubble-content]]:bg-secondary [&_[data-slot=bubble-content]]:text-secondary-foreground",
        muted:
          "[&_[data-slot=bubble-content]]:bg-muted [&_[data-slot=bubble-content]]:text-foreground",
        tinted:
          "[&_[data-slot=bubble-content]]:bg-primary/10 [&_[data-slot=bubble-content]]:text-foreground",
        outline:
          "[&_[data-slot=bubble-content]]:border-border [&_[data-slot=bubble-content]]:border [&_[data-slot=bubble-content]]:bg-background",
        ghost:
          "border-none [&_[data-slot=bubble-content]]:rounded-none [&_[data-slot=bubble-content]]:bg-transparent [&_[data-slot=bubble-content]]:p-0",
        brand:
          "[&_[data-slot=bubble-content]]:bg-brand [&_[data-slot=bubble-content]]:text-brand-foreground",
        // Burbuja del agente: tinte azul de marca suave, texto en tinta (decisión 2026-08-31)
        agent:
          "[&_[data-slot=bubble-content]]:bg-brand-soft [&_[data-slot=bubble-content]]:text-foreground",
        destructive:
          "[&_[data-slot=bubble-content]]:bg-destructive/10 [&_[data-slot=bubble-content]]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Bubble = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    VariantProps<typeof bubbleVariants> & {
      align?: "start" | "end"
    }
>(({ variant = "default", align = "start", className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
})
Bubble.displayName = "Bubble"

function BubbleContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-content"
      className={cn(
        // Decisión Bruno 01/09: burbuja muy redondeada con la
        // esquina superior del lado de la etiqueta "recortada" (rabito).
        "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3.5 py-2.5 text-sm leading-relaxed break-words group-data-[align=end]/bubble:self-end group-data-[align=start]/bubble:rounded-tl-md group-data-[align=end]/bubble:rounded-tr-md",
        className
      )}
      {...props}
    />
  )
}

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-2 ring-card",
        side === "top" ? "top-0 -translate-y-3/4" : "bottom-0 translate-y-3/4",
        align === "start" ? "left-3" : "right-3",
        className
      )}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions, bubbleVariants }

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex w-fit items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        default: "h-9 rounded-full bg-muted p-1",
        line: "h-9 gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  }
)

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-variant={variant ?? "line"}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex h-full items-center justify-center gap-2 whitespace-nowrap px-3 py-1 text-sm font-medium text-foreground/60 transition-all outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "rounded-full border border-transparent",
      "data-[state=active]:bg-background data-[state=active]:text-foreground",
      "[[data-variant=line]_&]:rounded-none [[data-variant=line]_&]:border-none [[data-variant=line]_&]:bg-transparent [[data-variant=line]_&]:shadow-none",
      "[[data-variant=line]_&]:after:absolute [[data-variant=line]_&]:after:inset-x-0 [[data-variant=line]_&]:after:bottom-0 [[data-variant=line]_&]:after:h-0.5 [[data-variant=line]_&]:after:bg-foreground [[data-variant=line]_&]:after:opacity-0 [[data-variant=line]_&]:after:transition-opacity",
      "[[data-variant=line]_&]:data-[state=active]:bg-transparent [[data-variant=line]_&]:data-[state=active]:shadow-none [[data-variant=line]_&]:data-[state=active]:after:opacity-100",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }

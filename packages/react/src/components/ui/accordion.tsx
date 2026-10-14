import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

import { cn } from "../../lib/utils";

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn("flex w-full flex-col overflow-hidden rounded-2xl border", className)}
    {...props}
  />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn("border-b last:border-b-0 data-[state=open]:bg-muted/50", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn(
        "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-4 text-left text-sm font-medium transition-all outline-none hover:underline disabled:pointer-events-none disabled:opacity-50 [&>svg]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <CaretDown className="pointer-events-none ml-auto h-4 w-4 shrink-0 group-data-[state=open]/accordion-trigger:hidden" />
      <CaretUp className="pointer-events-none ml-auto hidden h-4 w-4 shrink-0 group-data-[state=open]/accordion-trigger:inline" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className="overflow-hidden text-sm data-[state=open]:animate-[accordion-down_300ms_cubic-bezier(0.4,0,0.2,1)] data-[state=closed]:animate-[accordion-up_250ms_cubic-bezier(0.4,0,0.2,1)]"
    {...props}
  >
    <div
      className={cn(
        "px-4 pb-4 pt-0 [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

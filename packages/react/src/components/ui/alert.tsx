import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border px-4 py-3 text-left text-sm has-[[data-slot=alert-action]]:pr-16 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 [&>svg]:row-span-2 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-transparent bg-destructive-soft text-destructive [&_[data-slot=alert-description]]:text-foreground/80",
        warning:
          "border-transparent bg-warning-soft text-warning [&_[data-slot=alert-description]]:text-foreground/80",
        success:
          "border-transparent bg-success-soft text-success [&_[data-slot=alert-description]]:text-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-foreground [&_p]:leading-relaxed [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  ),
);
AlertDescription.displayName = "AlertDescription";

const AlertAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-action" className={cn("absolute right-3 top-2.5", className)} {...props} />
  ),
);
AlertAction.displayName = "AlertAction";

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants };

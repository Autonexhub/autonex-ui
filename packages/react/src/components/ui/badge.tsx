import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-3xl border border-transparent px-2 py-0.5 text-xs font-medium leading-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive-soft text-destructive focus-visible:ring-destructive/20",
        success: "bg-success-soft text-success focus-visible:ring-success/20",
        warning: "bg-warning-soft text-warning focus-visible:ring-warning/20",
        info: "bg-brand-soft text-brand focus-visible:ring-brand/20",
        "destructive-solid": "bg-destructive text-destructive-foreground focus-visible:ring-destructive/30",
        "success-solid": "bg-success text-success-foreground focus-visible:ring-success/30",
        "warning-solid": "bg-warning text-warning-foreground focus-visible:ring-warning/30",
        outline: "border-border text-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Label } from "./label";
import { Separator } from "./separator";

// Patrón de formularios del design system: Field agrupa label + control +
// descripción + error. Portado del preset (Tailwind v4 → v3): las variantes
// `*:`, `in-data-*`, `nth-last-2:` y las container queries se reescriben con
// selectores arbitrarios y media queries `sm:`.

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.ComponentPropsWithoutRef<"fieldset">>(
  ({ className, ...props }, ref) => (
    <fieldset
      ref={ref}
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  ),
);
FieldSet.displayName = "FieldSet";

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<"legend"> & { variant?: "legend" | "label" }
>(({ className, variant = "legend", ...props }, ref) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      "mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
      className,
    )}
    {...props}
  />
));
FieldLegend.displayName = "FieldLegend";

const FieldGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn(
        "group/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className,
      )}
      {...props}
    />
  ),
);
FieldGroup.displayName = "FieldGroup";

const fieldVariants = cva("group/field flex w-full gap-3 data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start [&>[data-slot=field-label]]:flex-auto [&:has(>[data-slot=field-content])>[role=checkbox]]:mt-px [&:has(>[data-slot=field-content])>[role=radio]]:mt-px",
      responsive:
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto sm:flex-row sm:items-center sm:[&>*]:w-auto sm:has-[>[data-slot=field-content]]:items-start sm:[&>[data-slot=field-label]]:flex-auto sm:[&:has(>[data-slot=field-content])>[role=checkbox]]:mt-px sm:[&:has(>[data-slot=field-content])>[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof fieldVariants>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="field"
    data-orientation={orientation}
    className={cn(fieldVariants({ orientation }), className)}
    {...props}
  />
));
Field.displayName = "Field";

const FieldContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  ),
);
FieldContent.displayName = "FieldContent";

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    data-slot="field-label"
    className={cn(
      // La etiqueta de un campo va en tinta y con peso medio (04/09): el átomo
      // `Label` es `text-xs font-normal text-muted-foreground`, idéntico a
      // `FieldDescription`, así que la etiqueta y su explicación no se
      // distinguían. `FieldTitle`, en este mismo archivo, ya declara
      // `text-sm font-medium`: esto solo pone a FieldLabel de acuerdo con él.
      "text-sm font-medium text-foreground",
      "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[[data-state=checked]]:bg-muted has-[>[data-slot=field]]:rounded-2xl has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
      "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
      className,
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

const FieldTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
FieldTitle.displayName = "FieldTitle";

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="field-description"
      className={cn(
        "text-left text-sm leading-normal font-normal text-muted-foreground group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 [&:nth-last-child(2)]:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  ),
);
FieldDescription.displayName = "FieldDescription";

const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-separator"
    data-content={!!children}
    className={cn("relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2", className)}
    {...props}
  >
    <Separator className="absolute inset-0 top-1/2" />
    {children && (
      <span
        className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        data-slot="field-separator-content"
      >
        {children}
      </span>
    )}
  </div>
));
FieldSeparator.displayName = "FieldSeparator";

const FieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    errors?: Array<{ message?: string } | undefined>;
  }
>(({ className, children, errors, ...props }, ref) => {
  const content = React.useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) => error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
});
FieldError.displayName = "FieldError";

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};

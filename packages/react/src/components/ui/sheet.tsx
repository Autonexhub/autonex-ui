import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import * as React from "react";

import { cn } from "../../lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// Subtle 2.5rem slide + fade animation. NO `transition` here: transition and
// animation both act on transform and conflict, causing a "readjustment" shake.
const SHEET_MOTION =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:duration-200 data-[state=closed]:duration-150 ease-out";

const sheetVariants = cva(
  `z-50 gap-4 bg-popover p-6 text-sm text-popover-foreground shadow-xl ${SHEET_MOTION}`,
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top-10 data-[state=open]:slide-in-from-top-10",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom-10 data-[state=open]:slide-in-from-bottom-10",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left-10 data-[state=open]:slide-in-from-left-10 sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right-10 data-[state=open]:slide-in-from-right-10 sm:max-w-sm",
      },
      // "modal" (default): fixed overlay over the canvas, blocks the rest.
      // "inline": see `inlineSheetVariants` (floating card inside the shell).
      variant: {
        modal: "fixed",
        inline: "absolute z-40",
      },
    },
    defaultVariants: {
      side: "right",
      variant: "modal",
    },
  },
);

// "inline": non-modal side panel as a FLOATING CARD: another white card above
// the content card — `rounded-xl border shadow-lg`, 8px margin from the top/
// right/bottom edge of the shell's card (`[data-shell-panel-host]`). The list
// behind stays interactive: click another row → panel switches entity; click
// elsewhere (empty list, header, sidebar) → closes, same as ✕ and Esc.
// Default width ~58% of host (min 560px, max 1100px); pages can set `width`
// via style if the panel is resizable.
const inlineSheetVariants = cva(
  `absolute z-40 flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-popover p-6 text-sm text-popover-foreground shadow-lg ${SHEET_MOTION}`,
  {
    variants: {
      side: {
        top: "inset-x-2 top-2 max-h-[60%] data-[state=closed]:slide-out-to-top-10 data-[state=open]:slide-in-from-top-10",
        bottom: "inset-x-2 bottom-2 max-h-[60%] data-[state=closed]:slide-out-to-bottom-10 data-[state=open]:slide-in-from-bottom-10",
        left: "inset-y-2 left-2 w-[58%] min-w-[560px] max-w-[1100px] data-[state=closed]:slide-out-to-left-10 data-[state=open]:slide-in-from-left-10",
        right:
          "inset-y-2 right-2 w-[58%] min-w-[560px] max-w-[1100px] data-[state=closed]:slide-out-to-right-10 data-[state=open]:slide-in-from-right-10",
      },
    },
    defaultVariants: { side: "right" },
  },
);

/** Shell card where inline panels mount (published by MainLayout). */
const SHELL_PANEL_HOST = "[data-shell-panel-host]";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean;
  /**
   * `inline`: non-modal variant as a floating card (see `inlineSheetVariants`).
   * Use with `<Sheet modal={false}>`: no overlay, closes with ✕, Esc or a
   * click outside the panel. Floats with 8px margin inside the shell's card
   * (full card height, covers breadcrumb row, never covers sidebar). If no
   * shell (Storybook), mounts to the provided `container` or nearest relative
   * ancestor.
   */
  inline?: boolean;
  /** Portal container for inline variant (defaults to shell host). */
  container?: HTMLElement | null;
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  (
    { side = "right", variant, inline = false, container, className, children, hideCloseButton = false, onFocusOutside, ...props },
    ref,
  ) => {
    const resolvedVariant = variant ?? (inline ? "inline" : "modal");
    const isInline = resolvedVariant === "inline";
    // Shell host is resolved on mount (lives outside this tree).
    const [host, setHost] = React.useState<HTMLElement | null>(null);
    React.useLayoutEffect(() => {
      if (!isInline) return;
      setHost(
        container ?? (document.querySelector(SHELL_PANEL_HOST) as HTMLElement | null) ?? document.body,
      );
    }, [isInline, container]);

    const content = (
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        data-variant={resolvedVariant}
        className={cn(
          isInline ? inlineSheetVariants({ side }) : sheetVariants({ side, variant: resolvedVariant }),
          className,
        )}
        onFocusOutside={(e) => {
          onFocusOutside?.(e);
          // Inline: moving focus outside (Tab, click on a list input) doesn't
          // close; only click outside (`onPointerDownOutside`, closes by default)
          // and Esc. Pages can veto close for specific clicks (another list row)
          // with `onPointerDownOutside` + `preventDefault`.
          if (isInline) e.preventDefault();
        }}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <SheetPrimitive.Close className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-4xl bg-secondary text-secondary-foreground transition-colors hover:bg-border/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    );

    if (isInline) {
      // No overlay. Don't render until host is resolved (avoids a frame with
      // the panel `absolute` hanging off body). Without shell falls to `document.body`.
      if (!host) return null;
      return <SheetPortal container={host}>{content}</SheetPortal>;
    }

    return (
      <SheetPortal>
        <SheetOverlay />
        {content}
      </SheetPortal>
    );
  },
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-base font-medium text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

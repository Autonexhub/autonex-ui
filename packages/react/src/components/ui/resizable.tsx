import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import { cn } from "../../lib/utils";

// react-resizable-panels v4 expone la dirección vía aria-orientation (los
// atributos data-panel-group-direction de v2 ya no existen); los selectores
// siguen al preset, con sintaxis Tailwind v3 (outline-none).

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup
    data-slot="resizable-panel-group"
    className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <PanelResizeHandle
    data-slot="resizable-handle"
    className={cn(
      "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/30 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />}
  </PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

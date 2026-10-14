import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, Info, Warning, XCircle, CircleNotch } from "@phosphor-icons/react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

interface AutonexToasterProps extends Omit<ToasterProps, "theme"> {
  theme?: "light" | "dark" | "system";
}

const Toaster = ({ theme = "system", ...props }: AutonexToasterProps) => {
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" />,
        info: <Info className="size-4" />,
        warning: <Warning className="size-4" />,
        error: <XCircle className="size-4" />,
        loading: <CircleNotch className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "calc(var(--radius) * 2.2)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

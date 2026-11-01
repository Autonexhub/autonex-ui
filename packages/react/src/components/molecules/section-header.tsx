import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  actions?: ReactNode;
  prefixAction?: ReactNode;
}

export function SectionHeader({ title, actions, prefixAction }: SectionHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between h-12 px-5">
        <div className="flex items-center gap-2.5">
          {prefixAction}
          <h1 className="text-[14px] font-medium text-foreground tracking-[-0.006em]">
            {title}
          </h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

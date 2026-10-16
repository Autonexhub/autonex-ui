import { ReactNode } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Funnel as Filter } from "@phosphor-icons/react";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterPopoverProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon?: ReactNode;
  /** Texto del botón "limpiar" (default: "Limpiar filtros"). */
  clearLabel?: string;
}

/**
 * Filtro multi-selección oficial (regla Filters: "Always use FilterPopover").
 * Story: `3-Organisms/CRMBlocks` (FilterPopoverExample). Las páginas no montan
 * Popover + Checkbox a mano (Ola 3, diff 15).
 */
export function FilterPopover({ label, options, selected, onChange, icon, clearLabel = 'Limpiar filtros' }: FilterPopoverProps) {
  const toggleOption = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          {icon || <Filter className="h-4 w-4" />}
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(option.id)}
                onCheckedChange={() => toggleOption(option.id)}
              />
              <span className="flex-1">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-muted-foreground text-xs">{option.count}</span>
              )}
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="border-t mt-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => onChange([])}
            >
              {clearLabel}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

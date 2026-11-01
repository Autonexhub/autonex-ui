import { ReactNode } from 'react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
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
  /** A partir de cuántas opciones sale el buscador (default 8). */
  searchThreshold?: number;
  /** Placeholder del buscador (default: "Buscar..."). */
  searchPlaceholder?: string;
  /** Texto cuando la búsqueda no da resultados (default: "Sin resultados"). */
  noResultsLabel?: string;
}

/**
 * Filtro multi-selección oficial. Con muchas opciones la lista tiene altura
 * máxima con scroll propio y un buscador arriba.
 */
export function FilterPopover({
  label,
  options,
  selected,
  onChange,
  icon,
  clearLabel = 'Limpiar filtros',
  searchThreshold = 8,
  searchPlaceholder = 'Buscar...',
  noResultsLabel = 'Sin resultados',
}: FilterPopoverProps) {
  const withSearch = options.length > searchThreshold;

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
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          {withSearch && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
          <CommandList className="max-h-72 overflow-y-auto">
            <CommandEmpty>{noResultsLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  aria-checked={selected.includes(option.id)}
                  onSelect={() => toggleOption(option.id)}
                  className="cursor-pointer gap-2"
                >
                  <Checkbox
                    checked={selected.includes(option.id)}
                    tabIndex={-1}
                    aria-hidden
                    className="pointer-events-none"
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-muted-foreground text-xs">{option.count}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected.length > 0 && (
          <div className="border-t p-2">
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

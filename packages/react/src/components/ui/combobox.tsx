import { forwardRef, useState, type ReactNode } from 'react';
import { CaretUpDown, Check } from '@phosphor-icons/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Button, type ButtonProps } from './button';
import { cn } from '../../lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
}

/**
 * Trigger canónico del Combobox: Button outline con el texto truncado y el
 * caret junto al texto (gap natural del botón, NO justify-between).
 * Pásalo como `trigger` del Combobox — reenvía ref/props, así que funciona
 * dentro del PopoverTrigger asChild.
 */
export const ComboboxTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="outline" className={cn('max-w-full', className)} {...props}>
      <span className="truncate">{children}</span>
      <CaretUpDown className="size-4 shrink-0 text-muted-foreground" />
    </Button>
  ),
);
ComboboxTrigger.displayName = 'ComboboxTrigger';

/**
 * Searchable, reliably-scrollable select.
 *
 * CommandList handles its own scrolling natively (max-h + overflow-y-auto).
 * Double-wrapping with ScrollArea blocked wheel events so the list was not
 * scrollable with the mouse wheel inside Radix Dialog contexts.
 */
export function Combobox({
  options,
  value,
  onChange,
  trigger,
  placeholder,
  emptyText,
  align = 'start',
  width = 240,
  searchThreshold = 7,
}: {
  options: ComboboxOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  trigger: ReactNode;
  placeholder?: string;
  emptyText?: string;
  align?: 'start' | 'center' | 'end';
  width?: number;
  searchThreshold?: number;
}) {
  const resolvedPlaceholder = placeholder ?? "Search...";
  const resolvedEmptyText = emptyText ?? "No results found.";
  const [open, setOpen] = useState(false);
  const showSearch = options.length > searchThreshold;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="p-0 animate-in fade-in-0 zoom-in-95 duration-150"
        style={{ width }}
        align={align}
      >
        <Command>
          {showSearch && <CommandInput placeholder={resolvedPlaceholder} className="h-9" />}
          <CommandList className="max-h-[280px] overflow-y-auto">
            <CommandEmpty>{resolvedEmptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={`${opt.label} ${opt.sublabel ?? ''}`}
                  onSelect={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.icon && <span className="mr-2 flex-shrink-0">{opt.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{opt.label}</div>
                    {opt.sublabel && <div className="text-[10px] text-muted-foreground truncate">{opt.sublabel}</div>}
                  </div>
                  {value === opt.value && <Check className="h-3.5 w-3.5 ml-2 flex-shrink-0" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

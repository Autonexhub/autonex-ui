import { useState, type ReactNode } from "react";
import { Check } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { cn } from "../../lib/utils";
import { PersonAvatar, type PersonAvatarPerson } from "./person-avatar";

export type PropOptionId = string | number;

export interface PropOption<Id extends PropOptionId = PropOptionId> {
  id: Id;
  label: string;
  /** Agrupa en el menú (p. ej. el departamento de la persona). */
  group?: string;
  /** Texto secundario a la derecha (p. ej. el rol). */
  hint?: ReactNode;
  /** Icono delante del texto. */
  icon?: ReactNode;
  /** Punto de color delante del texto (categorías, fases). */
  color?: string;
  /** Persona: el menú pinta su foto (o iniciales) delante del nombre. */
  person?: PersonAvatarPerson;
}

/** Acción al pie del menú ("Gestionar categorías", "Clasificar con IA"…). */
export interface PropSelectAction {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface PropSelectProps<Id extends PropOptionId = PropOptionId> {
  /** Valor actual (`null` = sin valor). */
  value: { id: Id; label: string } | null;
  options: PropOption<Id>[];
  /** Sin `onChange` (o con `disabled`) es solo lectura: se pinta el valor y no abre nada. */
  onChange?: (id: Id | null) => void;
  /** Texto del "sin valor" ("Sin responsable", "Sin categoría"). */
  emptyLabel: string;
  /** aria-label del disparador ("Cambiar responsable"). */
  ariaLabel: string;
  /** Cómo se pinta el valor en el disparador (por defecto, su texto). */
  renderValue?: ReactNode;
  /** Disparador propio (p. ej. un `TagChip`). Debe aceptar ref y onClick (lo envuelve un `asChild`). */
  trigger?: ReactNode;
  /** Ofrecer "Sin …" en el menú. Por defecto, sí. */
  allowEmpty?: boolean;
  disabled?: boolean;
  /** Acciones al pie, tras una línea. */
  actions?: PropSelectAction[];
  align?: "start" | "center" | "end";
  /** Buscador solo con MÁS de este número de opciones (regla del sistema: 7). */
  searchThreshold?: number;
  searchPlaceholder?: string;
  /** Texto cuando el buscador no encuentra nada. */
  noResultsLabel?: string;
  /** Texto con la lista de opciones vacía. */
  noOptionsLabel?: string;
  className?: string;
}

/**
 * Propiedad editable de una ficha (Responsable, Departamento, Centro, Categoría…): un chip clicable con el valor
 * actual que abre un menú del sistema (`Command`) con grupos, "Sin …" y check en el elegido. El buscador sale solo
 * con más de 7 opciones.
 */
export function PropSelect<Id extends PropOptionId = PropOptionId>({
  value,
  options,
  onChange,
  emptyLabel,
  ariaLabel,
  renderValue,
  trigger,
  allowEmpty = true,
  disabled,
  actions,
  align = "start",
  searchThreshold = 7,
  searchPlaceholder = "Buscar…",
  noResultsLabel = "Sin resultados",
  noOptionsLabel = "No hay opciones",
  className,
}: PropSelectProps<Id>) {
  const [open, setOpen] = useState(false);
  const shown = renderValue ?? (value ? value.label : <span className="text-muted-foreground">{emptyLabel}</span>);
  if (!onChange || disabled) {
    return <span className={cn("inline-flex max-w-full items-center gap-2 truncate", disabled && "opacity-60", className)}>{shown}</span>;
  }

  const pick = (id: Id | null) => {
    onChange(id);
    setOpen(false);
  };
  const groups = [...new Set(options.map((o) => o.group ?? ""))];
  const withSearch = options.length > searchThreshold;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label={ariaLabel}
            className={cn(
              "-mx-2 inline-flex max-w-full items-center gap-2 truncate rounded-full px-2 py-0.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              className,
            )}
          >
            {shown}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
        <Command>
          {withSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            {withSearch && <CommandEmpty>{noResultsLabel}</CommandEmpty>}
            {allowEmpty && (
              <CommandGroup>
                <CommandItem value={`__empty__ ${emptyLabel}`} onSelect={() => pick(null)} className="text-muted-foreground">
                  <span className="flex-1">{emptyLabel}</span>
                  {value === null && <Check className="size-4" />}
                </CommandItem>
              </CommandGroup>
            )}
            {options.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">{noOptionsLabel}</div>}
            {groups.map((g) => (
              <CommandGroup key={g || "_"} heading={g || undefined}>
                {options
                  .filter((o) => (o.group ?? "") === g)
                  .map((o) => (
                    <CommandItem key={`${g}-${o.id}`} value={`${o.label} ${o.id}`} onSelect={() => pick(o.id)}>
                      {o.person && <PersonAvatar person={o.person} size="xs" />}
                      {o.color && <span className="size-2 shrink-0 rounded-full" style={{ background: o.color }} aria-hidden />}
                      {o.icon}
                      <span className="flex-1 truncate">{o.label}</span>
                      {o.hint && <span className="text-xs font-normal text-muted-foreground">{o.hint}</span>}
                      {value?.id === o.id && <Check className="size-4" />}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
            {actions && actions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  {actions.map((a) => (
                    <CommandItem
                      key={a.label}
                      value={`__action__ ${a.label}`}
                      onSelect={() => {
                        setOpen(false);
                        a.onSelect();
                      }}
                    >
                      {a.icon}
                      <span className="flex-1">{a.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

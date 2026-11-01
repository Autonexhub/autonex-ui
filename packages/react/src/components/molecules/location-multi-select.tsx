import { useState } from "react";
import { CaretDown, MapPin } from "@phosphor-icons/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import type { LocationFilterOption } from "./location-filter";

export interface LocationMultiSelectLabels {
  placeholder: string;
  empty: string;
}

const DEFAULT_LABELS: LocationMultiSelectLabels = {
  placeholder: "Sin centros",
  empty: "Esta organización no tiene centros activos",
};

export interface LocationMultiSelectProps {
  locations: LocationFilterOption[];
  value: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  labels?: Partial<LocationMultiSelectLabels>;
}

/** Varios centros en etiquetas: los de un contacto o los de un usuario. */
export function LocationMultiSelect({ locations, value, onChange, disabled = false, placeholder, className, labels }: LocationMultiSelectProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [abierto, setAbierto] = useState(false);
  const elegidos = locations.filter((l) => value.includes(l.id));

  const alternar = (id: number, marcado: boolean) => {
    const siguiente = marcado ? Array.from(new Set([...value, id])) : value.filter((v) => v !== id);
    onChange(siguiente.sort((a, b) => a - b));
  };

  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn("h-auto min-h-10 w-full justify-between gap-2 py-1.5", className)}
        >
          <span className="flex flex-wrap items-center gap-1">
            {elegidos.length === 0 ? (
              <span className="text-muted-foreground">{placeholder ?? text.placeholder}</span>
            ) : (
              elegidos.map((l) => (
                <Badge key={l.id} variant="outline">
                  <MapPin />
                  {l.name}
                </Badge>
              ))
            )}
          </span>
          <CaretDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        {locations.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">{text.empty}</p>
        ) : (
          locations.map((l) => (
            <label
              key={l.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <Checkbox checked={value.includes(l.id)} onCheckedChange={(v) => alternar(l.id, v === true)} />
              {l.name}
            </label>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}

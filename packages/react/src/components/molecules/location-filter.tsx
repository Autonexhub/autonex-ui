import { useState } from "react";
import { CaretDown, MapPin } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";

/**
 * 'all' = todo lo permitido · si no, lista separada por comas de ids de centro
 * y/o 'none' (sin centro): '3', '3,7', '3,none'. Es tal cual lo que va en
 * `?location_id=`.
 */
export type LocationFilterValue = string;

export interface LocationFilterLabels {
  button: string;
  none: string;
  restrictedHint: string;
  clear: string;
  clearMine: string;
  /** "Serrano, Santander y 2 más" */
  summaryMore: (names: string, count: number) => string;
}

export const DEFAULT_LOCATION_FILTER_LABELS: LocationFilterLabels = {
  button: "Centro",
  none: "Sin centro",
  restrictedHint: "Sin marcar nada ves tus centros y lo que no tiene centro.",
  clear: "Ver todos",
  clearMine: "Ver todos los míos",
  summaryMore: (names, count) => `${names} y ${count} más`,
};

export interface LocationFilterOption {
  id: number;
  name: string;
}

export const LOCATION_FILTER_ALL = "all";
export const LOCATION_FILTER_NONE = "none";

/** Lo elegido como lista ('3', '7', 'none'); vacía = todo lo permitido. */
export function parseLocationFilter(value: LocationFilterValue | null | undefined): string[] {
  if (!value || value === LOCATION_FILTER_ALL) return [];
  return Array.from(new Set(value.split(",").map((v) => v.trim()).filter(Boolean)));
}

/**
 * Se queda solo con lo que el usuario puede pedir (sus centros visibles y
 * "sin centro") y lo devuelve en el orden de la lista. Nada válido = 'all'.
 */
export function sanitizeLocationFilter(value: LocationFilterValue, locations: LocationFilterOption[]): LocationFilterValue {
  const elegidos = new Set(parseLocationFilter(value));
  const validos = [
    ...locations.map((loc) => String(loc.id)).filter((id) => elegidos.has(id)),
    ...(elegidos.has(LOCATION_FILTER_NONE) ? [LOCATION_FILTER_NONE] : []),
  ];
  return validos.length > 0 ? validos.join(",") : LOCATION_FILTER_ALL;
}

export interface LocationFilterProps {
  locations: LocationFilterOption[];
  value: LocationFilterValue;
  onChange: (value: LocationFilterValue) => void;
  /** Cómo llama la organización a sus centros (`location_label`): Centros, Sedes, Clubs… */
  label?: string;
  /** Usuario restringido a sus centros: sin nada marcado ve los suyos más lo que no tiene centro. */
  restricted?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  labels?: Partial<LocationFilterLabels>;
}

/** Número de centros (y "Sin centro") marcados en un valor de filtro. */
export function countLocationFilter(value: LocationFilterValue | null | undefined): number {
  return parseLocationFilter(value).length;
}

type SectionProps = Pick<LocationFilterProps, "locations" | "value" | "onChange" | "label" | "restricted" | "labels">;

/**
 * Sección de casillas (centros + "Sin centro" + limpiar), sin botón propio:
 * se usa dentro del popover de un botón y dentro del popover "Filtrar".
 * Sin centros activos no se pinta.
 */
export function LocationFilterSection({ locations, value, onChange, label, restricted = false, labels }: SectionProps) {
  const l = { ...DEFAULT_LOCATION_FILTER_LABELS, ...labels };
  if (locations.length === 0) return null;

  const nombre = label?.trim() || l.button;
  const opciones = [
    ...locations.map((loc) => ({ value: String(loc.id), label: loc.name })),
    { value: LOCATION_FILTER_NONE, label: l.none },
  ];
  const elegidos = new Set(parseLocationFilter(value));
  const hayMarcadas = opciones.some((o) => elegidos.has(o.value));

  const alternar = (opcion: string, marcado: boolean) => {
    const siguiente = opciones
      .filter((o) => (o.value === opcion ? marcado : elegidos.has(o.value)))
      .map((o) => o.value);
    onChange(siguiente.length > 0 ? siguiente.join(",") : LOCATION_FILTER_ALL);
  };

  const casilla = (o: { value: string; label: string }) => (
    <label
      key={o.value}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
    >
      <Checkbox checked={elegidos.has(o.value)} onCheckedChange={(v) => alternar(o.value, v === true)} />
      <span className="truncate">{o.label}</span>
    </label>
  );

  return (
    <div>
      <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{nombre}</p>
      {restricted && <p className="px-2 pb-1.5 text-xs text-muted-foreground">{l.restrictedHint}</p>}
      <div className="max-h-72 overflow-y-auto">
        {opciones.slice(0, -1).map(casilla)}
        <Separator className="my-1" />
        {casilla(opciones[opciones.length - 1])}
      </div>
      {hayMarcadas && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start text-muted-foreground"
          onClick={() => onChange(LOCATION_FILTER_ALL)}
        >
          {restricted ? l.clearMine : l.clear}
        </Button>
      )}
    </div>
  );
}

/**
 * Filtro por centro (spec 2026-10-19): un botón propio junto a los demás
 * filtros que abre una lista de casillas para marcar uno o varios centros y
 * "Sin centro". El botón resume lo elegido ("Centro: Serrano, Santander").
 * Sin centros activos no se pinta.
 */
export function LocationFilter({
  locations,
  value,
  onChange,
  label,
  restricted = false,
  align = "end",
  className,
  labels,
}: LocationFilterProps) {
  const l = { ...DEFAULT_LOCATION_FILTER_LABELS, ...labels };
  const [abierto, setAbierto] = useState(false);
  if (locations.length === 0) return null;

  const nombre = label?.trim() || l.button;
  const opciones = [
    ...locations.map((loc) => ({ value: String(loc.id), label: loc.name })),
    { value: LOCATION_FILTER_NONE, label: l.none },
  ];
  const elegidos = new Set(parseLocationFilter(value));
  const marcadas = opciones.filter((o) => elegidos.has(o.value));
  const resumen =
    marcadas.length === 0
      ? null
      : marcadas.length <= 2
        ? marcadas.map((o) => o.label).join(", ")
        : l.summaryMore(marcadas.slice(0, 2).map((o) => o.label).join(", "), marcadas.length - 2);

  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={resumen ? `${nombre}: ${resumen}` : nombre}
          className={cn("h-10 max-w-80 gap-2", marcadas.length > 0 && "border-primary", className)}
        >
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {resumen ? (
              <>
                <span className="text-muted-foreground">{nombre}:</span> {resumen}
              </>
            ) : (
              nombre
            )}
          </span>
          <CaretDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align={align}>
        <LocationFilterSection
          locations={locations}
          value={value}
          onChange={onChange}
          label={label}
          restricted={restricted}
          labels={labels}
        />
      </PopoverContent>
    </Popover>
  );
}

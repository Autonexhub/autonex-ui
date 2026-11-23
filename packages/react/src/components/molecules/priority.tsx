import { useState, type CSSProperties, type ReactNode } from "react";
import { Check, Prohibit, WarningCircle } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "../../lib/utils";

/**
 * Prioridad al estilo Plane: icono en cuadrado de color (alerta / 1–3 barras / círculo tachado) y selector con
 * buscador. Valores: urgent · high · medium · low · null (sin prioridad). Etiquetas en español por defecto;
 * `labels` las sustituye (i18n).
 */
export type Priority = "urgent" | "high" | "medium" | "low";
export type PriorityKey = Priority | "none";

export const PRIORITY_ORDER: PriorityKey[] = ["urgent", "high", "medium", "low", "none"];

export const PRIORITY_META: Record<PriorityKey, { label: string; color: string; bars: number }> = {
  urgent: { label: "Urgente", color: "var(--destructive)", bars: 0 },
  high: { label: "Alta", color: "var(--chart-5)", bars: 3 },
  medium: { label: "Media", color: "var(--warning)", bars: 2 },
  low: { label: "Baja", color: "var(--brand)", bars: 1 },
  none: { label: "Sin prioridad", color: "var(--muted-foreground)", bars: 0 },
};

export const priorityKey = (p: Priority | null | undefined): PriorityKey => p ?? "none";

/** Para ordenar: urgente primero, sin prioridad al final. */
export const priorityRank = (p: Priority | null | undefined) => PRIORITY_ORDER.indexOf(priorityKey(p));

export type PriorityLabels = Partial<Record<PriorityKey, string>>;

const labelOf = (k: PriorityKey, labels?: PriorityLabels) => labels?.[k] ?? PRIORITY_META[k].label;

export function PriorityIcon({ priority, size = 20, className, labels }: {
  priority: Priority | PriorityKey | null;
  size?: number;
  className?: string;
  labels?: PriorityLabels;
}) {
  const key: PriorityKey = priority === null ? "none" : (priority as PriorityKey);
  const meta = PRIORITY_META[key];
  const style: CSSProperties = { color: meta.color, width: size, height: size };
  const inner = Math.round(size * 0.62);

  return (
    <span
      role="img"
      aria-label={`Prioridad: ${labelOf(key, labels)}`}
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[5px] border", className)}
      style={{ ...style, borderColor: "currentColor" }}
    >
      {key === "urgent" && <WarningCircle size={inner} weight="bold" />}
      {key === "none" && <Prohibit size={inner} weight="bold" />}
      {meta.bars > 0 && (
        <svg width={inner} height={inner} viewBox="0 0 12 12" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <rect key={i} x={1.5 + i * 3.5} y={9 - (i + 1) * 2.5} width={2} height={(i + 1) * 2.5} rx={0.6}
              fill="currentColor" opacity={i < meta.bars ? 1 : 0.25} />
          ))}
        </svg>
      )}
    </span>
  );
}

/** Selector de prioridad al estilo Plane: buscador arriba, icono + etiqueta, check en la elegida. */
export function PrioritySelect({ value, onChange, trigger, align = "start", labels, searchPlaceholder = "Buscar", emptyText = "Sin resultados" }: {
  value: Priority | null;
  onChange: (p: Priority | null) => void;
  /** Si no se pasa, el disparador es el propio icono. */
  trigger?: ReactNode;
  align?: "start" | "end";
  labels?: PriorityLabels;
  searchPlaceholder?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = priorityKey(value);

  const pick = (k: PriorityKey) => {
    onChange(k === "none" ? null : k);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-0.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`Cambiar prioridad (${labelOf(current, labels)})`}
          >
            <PriorityIcon priority={current} size={18} labels={labels} />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-56 p-0" onClick={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {PRIORITY_ORDER.map((k) => (
              <CommandItem key={k} value={labelOf(k, labels)} onSelect={() => pick(k)} className="gap-3 py-2">
                <PriorityIcon priority={k} size={22} labels={labels} />
                <span className="flex-1 text-sm">{labelOf(k, labels)}</span>
                <Check className={cn("size-4", current === k ? "opacity-100" : "opacity-0")} />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

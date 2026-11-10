import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "../ui/popover";
import { parseCushion } from "./finance-data";
import { centsToEurosText } from "./form-inputs";

export interface CushionEditorLabels {
  title: string;
  description: string;
  error: string;
  cancel: string;
  save: string;
  saving: string;
}

export const DEFAULT_CUSHION_EDITOR_LABELS: CushionEditorLabels = {
  title: "Colchón mínimo de caja",
  description: "Umbral de saldo por debajo del cual se marca la previsión. Aplica a Tesorería, Resumen y Forecast.",
  error: "Importe no válido (ej.: 5.000)",
  cancel: "Cancelar",
  save: "Guardar",
  saving: "Guardando…",
};

/**
 * Popover para editar el colchón mínimo (PUT /finance/settings), abierto desde su etiqueta en el gráfico de
 * Caja o desde las palancas del Plan: lo que se edita, al lado de lo que cambia. Presentacional: guarda con `onSave`.
 */
export function CushionEditor({
  cushionCents,
  onSave,
  children,
  open,
  onOpenChange,
  labels: labelsProp,
}: {
  cushionCents: number;
  onSave: (cents: number) => Promise<unknown> | void;
  /** El disparador (la etiqueta «Colchón 5.000 € ✎»). */
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  labels?: Partial<CushionEditorLabels>;
}) {
  const labels = { ...DEFAULT_CUSHION_EDITOR_LABELS, ...labelsProp };
  const [inner, setInner] = useState(false);
  const isOpen = open ?? inner;
  const setOpen = onOpenChange ?? setInner;
  const [text, setText] = useState(centsToEurosText(cushionCents));
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (isOpen) setText(centsToEurosText(cushionCents));
  }, [isOpen, cushionCents]);
  const cents = parseCushion(text);

  const save = async () => {
    if (cents === null) return;
    setSaving(true);
    try {
      await onSave(cents);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <PopoverHeader>
            <PopoverTitle>{labels.title}</PopoverTitle>
            <PopoverDescription>{labels.description}</PopoverDescription>
          </PopoverHeader>
          <InputGroup>
            <InputGroupInput
              autoFocus
              inputMode="decimal"
              aria-label={labels.title}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={cents === null || undefined}
            />
            <InputGroupAddon align="inline-end">€</InputGroupAddon>
          </InputGroup>
          {cents === null && <p className="text-xs text-destructive">{labels.error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {labels.cancel}
            </Button>
            <Button type="submit" size="sm" disabled={cents === null || saving}>
              {saving ? labels.saving : labels.save}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

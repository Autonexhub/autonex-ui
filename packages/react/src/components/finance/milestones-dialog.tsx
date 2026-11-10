import { useEffect, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { milestonesError, milestonesServerError } from "./forecast-view";
import { centsToEurosText, monthChoices } from "./form-inputs";
import { capFirst, formatMonthLong, parseEurosToCents } from "./format";
import type { PlanMilestone } from "./types";

export interface MilestonesDialogLabels {
  title: string;
  description: string;
  month: string;
  arr: string;
  monthN: (n: number) => string;
  arrN: (n: number) => string;
  remove: (n: number) => string;
  add: string;
  save: string;
  cancel: string;
  saving: string;
  errors: {
    count: string;
    months: string;
    arr: string;
    /** «Importe no válido en Octubre de 2026.» */
    amount: (month: string) => string;
    server: string;
  };
}

export const DEFAULT_MILESTONES_DIALOG_LABELS: MilestonesDialogLabels = {
  title: "Hitos del plan",
  description: "ARR objetivo a final de mes. Se guardan ordenados por mes y el ARR tiene que subir de un hito al siguiente.",
  month: "Mes",
  arr: "ARR objetivo",
  monthN: (n) => `Mes del hito ${n}`,
  arrN: (n) => `ARR del hito ${n}`,
  remove: (n) => `Quitar el hito ${n}`,
  add: "Añadir hito",
  save: "Guardar hitos",
  cancel: "Cancelar",
  saving: "Guardando…",
  errors: {
    count: "Hace falta entre 1 y 24 hitos.",
    months: "Hay dos hitos en el mismo mes.",
    arr: "El ARR tiene que ser mayor que 0 y subir de un hito al siguiente.",
    amount: (month) => `Importe no válido en ${month}.`,
    server: "No se han podido guardar los hitos. Inténtalo de nuevo.",
  },
};

type Draft = { month: string; arr: string; label?: string | null };
const MAX_CENTS = 100_000_000_000;

/**
 * Hitos de ARR del plan (PUT /plan/milestones): una lista sencilla mes + ARR. Se guardan ordenados por mes;
 * el ARR tiene que subir de un hito al siguiente. Presentacional: guarda con `onSubmit` (los errores de la
 * API salen en el diálogo).
 */
export function MilestonesDialog({
  open,
  onOpenChange,
  milestones,
  onSubmit,
  labels: labelsProp,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestones: PlanMilestone[];
  onSubmit: (rows: PlanMilestone[]) => Promise<unknown>;
  labels?: Partial<MilestonesDialogLabels>;
}) {
  const labels: MilestonesDialogLabels = { ...DEFAULT_MILESTONES_DIALOG_LABELS, ...labelsProp, errors: { ...DEFAULT_MILESTONES_DIALOG_LABELS.errors, ...labelsProp?.errors } };
  const [rows, setRows] = useState<Draft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRows(milestones.map((m) => ({ month: m.month, arr: centsToEurosText(m.arr_cents), label: m.label ?? null })));
    setError(null);
  }, [open, milestones]);

  const set = (i: number, d: Partial<Draft>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...d } : x)));

  const submit = async () => {
    const parsed: PlanMilestone[] = [];
    for (const r of rows) {
      const p = parseEurosToCents(r.arr.trim().replace(/[\s€]/g, ""), MAX_CENTS);
      if (p.error) {
        setError(labels.errors.amount(capFirst(formatMonthLong(r.month))));
        return;
      }
      parsed.push({ month: r.month, arr_cents: p.cents, ...(r.label ? { label: r.label } : {}) });
    }
    parsed.sort((a, b) => a.month.localeCompare(b.month));
    const err = milestonesError(parsed);
    if (err) {
      setError(labels.errors[err]);
      return;
    }
    setPending(true);
    setError(null);
    try {
      await onSubmit(parsed);
      onOpenChange(false);
    } catch (e) {
      setError(labels.errors[milestonesServerError((e as Error).message ?? "")]);
    } finally {
      setPending(false);
    }
  };

  const last = rows[rows.length - 1]?.month;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && !pending && onOpenChange(false)}>
      <DialogContent showCloseButton={!pending} data-testid="milestones-dialog">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th scope="col" className="pb-1.5 text-left font-medium">
                  {labels.month}
                </th>
                <th scope="col" className="pb-1.5 pl-2 text-right font-medium">
                  {labels.arr}
                </th>
                <th className="w-9" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-1.5">
                    <Select value={r.month} onValueChange={(v) => set(i, { month: v })}>
                      <SelectTrigger className="h-9" aria-label={labels.monthN(i + 1)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthChoices([r.month]).map((m) => (
                          <SelectItem key={m} value={m}>
                            {capFirst(formatMonthLong(m))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-1.5 pl-2">
                    <InputGroup className="h-9">
                      <InputGroupInput
                        inputMode="decimal"
                        className="text-right tabular-nums"
                        aria-label={labels.arrN(i + 1)}
                        value={r.arr}
                        onChange={(e) => set(i, { arr: e.target.value })}
                      />
                      <InputGroupAddon align="inline-end">€</InputGroupAddon>
                    </InputGroup>
                  </td>
                  <td className="py-1.5 pl-1 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={rows.length <= 1}
                      onClick={() => setRows((x) => x.filter((_, j) => j !== i))}
                      aria-label={labels.remove(i + 1)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={rows.length >= 24}
              onClick={() => {
                const next = monthChoices().find((m) => !last || m > last) ?? last ?? "";
                setRows((x) => [...x, { month: next, arr: "" }]);
              }}
            >
              <Plus className="size-4" />
              {labels.add}
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
              {labels.cancel}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? labels.saving : labels.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import { Warning } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { formatCentsRound, formatDayShort } from "./format";
import type { FinanceBankAccount, FinanceVat } from "./types";

export interface VatAccountCardLabels {
  /** «IVA de 4T 2026: 4.360 € · se paga el 30 ene · en la cuenta de IVA: 4.650 €». */
  line: (v: { quarter: string; due: string; reserved: string; date: string }) => string;
  lineNoDate: (v: { quarter: string; due: string; reserved: string }) => string;
  shortfall: (amount: string) => string;
  suggest: string;
  change: string;
  pick: string;
  title: string;
  description: string;
  empty: string;
  cancel: string;
  save: string;
  saving: string;
}

export const DEFAULT_VAT_ACCOUNT_CARD_LABELS: VatAccountCardLabels = {
  line: ({ quarter, due, reserved, date }) => `IVA de ${quarter}: ${due} · se paga el ${date} · en la cuenta de IVA: ${reserved}`,
  lineNoDate: ({ quarter, due, reserved }) => `IVA de ${quarter}: ${due} · en la cuenta de IVA: ${reserved}`,
  shortfall: (amount) => `Faltan ${amount} por apartar para pagarlo.`,
  suggest: "¿Tienes una cuenta solo para el IVA? Márcala",
  change: "Cambiar",
  pick: "Elegir cuenta de IVA",
  title: "Cuenta de IVA",
  description: "Marca la cuenta bancaria donde apartas el IVA. Se descuenta de la caja disponible; la previsión sigue con el total y resta el modelo 303 el día que toca.",
  empty: "No hay cuentas bancarias sincronizadas desde Holded.",
  cancel: "Cancelar",
  save: "Guardar",
  saving: "Guardando…",
};

export interface VatAccountCardProps {
  /** `vat` de la API: null si no hay cuenta de IVA marcada (o la marcada ya no existe en Holded). */
  vat: FinanceVat | null | undefined;
  /** Cuentas bancarias de Holded entre las que elegir. */
  bankAccounts: FinanceBankAccount[];
  /** Guarda las cuentas marcadas (PUT /finance/settings `vat_account_ids`). */
  onSave: (ids: string[]) => Promise<unknown> | void;
  labels?: Partial<VatAccountCardLabels>;
}

/**
 * IVA apartado: con cuenta marcada, una línea con el IVA del trimestre, cuándo se paga y lo que hay en la cuenta
 * (y un aviso si falta); sin ella, una sugerencia discreta. En los dos casos, el botón abre el diálogo para elegir.
 */
export function VatAccountCard({ vat, bankAccounts, onSave, labels: labelsProp }: VatAccountCardProps) {
  const labels = { ...DEFAULT_VAT_ACCOUNT_CARD_LABELS, ...labelsProp };
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) setPicked(vat?.account_ids ?? []);
  }, [open, vat]);

  const toggle = (id: string, on: boolean) => setPicked((cur) => (on ? [...cur.filter((x) => x !== id), id] : cur.filter((x) => x !== id)));
  const save = async () => {
    setSaving(true);
    try {
      await onSave(picked);
      setOpen(false);
    } catch {
      // quien guarda ya avisa del error; el diálogo se queda abierto para reintentar
    } finally {
      setSaving(false);
    }
  };

  const amounts = vat && { due: formatCentsRound(vat.due_cents), reserved: formatCentsRound(vat.reserved_cents), quarter: vat.quarter_label };
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {vat && amounts ? (
        <div className="flex flex-col gap-0.5">
          <p className="tabular-nums text-foreground">
            {vat.due_date ? labels.line({ ...amounts, date: formatDayShort(vat.due_date) }) : labels.lineNoDate(amounts)}
          </p>
          {vat.shortfall_cents > 0 && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
              <Warning className="size-3.5 shrink-0" weight="fill" />
              {labels.shortfall(formatCentsRound(vat.shortfall_cents))}
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">{labels.suggest}</p>
      )}
      <Button type="button" variant={vat ? "ghost" : "outline"} size="sm" onClick={() => setOpen(true)}>
        {vat ? labels.change : labels.pick}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{labels.title}</DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>
          {bankAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.empty}</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {bankAccounts.map((a) => (
                <li key={a.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-2 text-sm tabular-nums hover:bg-muted/50">
                    <Checkbox checked={picked.includes(a.id)} onCheckedChange={(v) => toggle(a.id, v === true)} />
                    <span className="min-w-0 flex-1 truncate text-foreground">{a.name}</span>
                    <span className="text-muted-foreground">{formatCentsRound(a.balance_cents)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {labels.cancel}
            </Button>
            <Button type="button" size="sm" disabled={saving} onClick={() => void save()}>
              {saving ? labels.saving : labels.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

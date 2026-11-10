import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../ui/alert-dialog';
import { EmptyState } from '../molecules/empty-state';
import { TableRowSkeleton } from '../molecules/skeletons';
import { Trash as Trash2 } from '@phosphor-icons/react';

export interface NamedItem {
  id: number;
  name: string;
}

export interface EditableNameTableLabels {
  /** Cabecera de la columna del nombre. */
  nameHeader: string;
  /** Botón del vacío y título del diálogo de crear: "Nueva tarifa". */
  newItem: (noun: string) => string;
  /** Título del diálogo de editar: "Editar tarifa". */
  editItem: (noun: string) => string;
  /** aria-label del campo de nombre: "Nombre de la tarifa". */
  nameAria: (noun: string) => string;
  /** Botón de crear del diálogo: "Crear tarifa". */
  createItem: (noun: string) => string;
  /** aria-label del botón de papelera de una fila: "Eliminar X". */
  deleteAria: (name: string) => string;
  /** Título de la confirmación: "¿Eliminar esta tarifa?". */
  deleteTitle: (noun: string) => string;
  cancel: string;
  save: string;
  delete: string;
}

export const DEFAULT_EDITABLE_NAME_TABLE_LABELS: EditableNameTableLabels = {
  nameHeader: 'Nombre',
  newItem: (noun) => `Nueva ${noun}`,
  editItem: (noun) => `Editar ${noun}`,
  nameAria: (noun) => `Nombre de la ${noun}`,
  createItem: (noun) => `Crear ${noun}`,
  deleteAria: (name) => `Eliminar ${name}`,
  deleteTitle: (noun) => `¿Eliminar esta ${noun}?`,
  cancel: 'Cancelar',
  save: 'Guardar',
  delete: 'Eliminar',
};

export interface EditableNameTableProps<T extends NamedItem> {
  items: T[];
  loading?: boolean;
  /** Cómo se llama una cosa de la lista, en minúscula: "tarifa", "familia". */
  noun: string;
  /** Cabecera y celda de la columna extra (contador, "Por defecto"…). */
  extraHeader?: string;
  renderExtra?: (item: T) => ReactNode;
  /** Sin esta función se puede borrar todo. */
  canDelete?: (item: T) => boolean;
  deleteDisabledReason?: string;
  deleteDescription: (item: T) => string;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  namePlaceholder: string;
  /** Diálogo de crear: lo abre el botón de la cabecera de la página. */
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  /** Las tres devuelven una promesa; si falla, el diálogo se queda abierto para corregir. */
  onCreate: (name: string) => Promise<unknown>;
  onRename: (item: T, name: string) => Promise<unknown>;
  onDelete: (item: T) => Promise<unknown>;
  labels?: Partial<EditableNameTableLabels>;
}

/**
 * Lista de cosas que solo tienen nombre (tarifas, familias…) con el patrón de los
 * listados del panel (como Centros): tabla de solo lectura, la fila se pulsa para
 * editarla en un diálogo, "Nuevo" en la cabecera de la página abre el mismo diálogo
 * vacío, y la papelera pide confirmación. Mismo marco, esqueleto y vacío con icono.
 */
export function EditableNameTable<T extends NamedItem>({
  items, loading = false, noun, extraHeader, renderExtra, canDelete, deleteDisabledReason,
  deleteDescription, emptyIcon, emptyTitle, emptyDescription, namePlaceholder,
  createOpen, onCreateOpenChange, onCreate, onRename, onDelete, labels: labelsProp,
}: EditableNameTableProps<T>) {
  const labels = { ...DEFAULT_EDITABLE_NAME_TABLE_LABELS, ...labelsProp };
  const [editando, setEditando] = useState<T | null>(null);
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState<T | null>(null);

  const abierto = createOpen || editando !== null;

  useEffect(() => {
    if (createOpen) setNombre('');
  }, [createOpen]);

  const cerrar = () => {
    setEditando(null);
    onCreateOpenChange(false);
  };

  const abrirEdicion = (item: T) => {
    setNombre(item.name);
    setEditando(item);
  };

  const guardar = async () => {
    const name = nombre.trim();
    if (!name) return;
    setGuardando(true);
    try {
      if (editando) {
        if (name !== editando.name) await onRename(editando, name);
      } else {
        await onCreate(name);
      }
      cerrar();
    } catch {
      // Quien llama ya avisa del error; el diálogo se queda abierto.
    } finally {
      setGuardando(false);
    }
  };

  const columnas = 2 + (extraHeader ? 1 : 0);

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card shadow-elev">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{labels.nameHeader}</TableHead>
              {extraHeader && <TableHead className="w-48">{extraHeader}</TableHead>}
              <TableHead className="w-16 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRowSkeleton columns={columnas} rows={4} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnas} className="p-0">
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    action={<Button onClick={() => onCreateOpenChange(true)}>{labels.newItem(noun)}</Button>}
                  />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const borrable = canDelete ? canDelete(item) : true;
                return (
                  <TableRow key={item.id} className="cursor-pointer" onClick={() => abrirEdicion(item)}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    {extraHeader && (
                      <TableCell onClick={(e) => e.stopPropagation()}>{renderExtra?.(item)}</TableCell>
                    )}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={!borrable}
                        onClick={() => setBorrando(item)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={labels.deleteAria(item.name)}
                        title={!borrable ? deleteDisabledReason : undefined}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={abierto} onOpenChange={(o) => { if (!o) cerrar(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? labels.editItem(noun) : labels.newItem(noun)}</DialogTitle>
          </DialogHeader>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void guardar(); }}
            placeholder={namePlaceholder}
            aria-label={labels.nameAria(noun)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={cerrar}>{labels.cancel}</Button>
            <Button onClick={() => void guardar()} disabled={guardando || !nombre.trim()}>
              {editando ? labels.save : labels.createItem(noun)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!borrando} onOpenChange={(o) => { if (!o) setBorrando(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.deleteTitle(noun)}</AlertDialogTitle>
            <AlertDialogDescription>{borrando ? deleteDescription(borrando) : ''}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const item = borrando;
                setBorrando(null);
                if (item) void onDelete(item).catch(() => {});
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {labels.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

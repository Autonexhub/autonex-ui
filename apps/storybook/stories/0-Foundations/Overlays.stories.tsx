import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@autonexhub/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@autonexhub/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@autonexhub/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Field, FieldGroup, FieldLabel } from '@autonexhub/react';
import { Toaster, toast } from '@autonexhub/react';

const meta: Meta = {
  title: '0-Foundations/Overlays',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
El sistema de pop-ups del panel, en vivo. Regla: **nada entra desde las esquinas.**

| Superficie | Cuándo | Comportamiento |
|-----------|--------|----------------|
| **Toast** (sonner) | Confirmaciones y avisos ("Guardado") | Abajo-derecha, se apila, se va solo |
| **Dialog** | Crear / editar (formularios) | Centrado, fade + zoom, ancho \`max-w-2xl\` |
| **AlertDialog** | Confirmar algo destructivo | Centrado, obliga a elegir |
| **Sheet** | Detalle lateral (conversación, contacto) | Desliza desde la derecha |

Pulsa los botones de la story para ver cada comportamiento real.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SistemaCompleto: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <Toaster />

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Toasts — abajo-derecha</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success('Cambios guardados')}>
            Éxito
          </Button>
          <Button variant="outline" onClick={() => toast.warning('El webhook lleva 2 días sin eventos')}>
            Aviso
          </Button>
          <Button variant="outline" onClick={() => toast.error('HubSpot devolvió 401')}>
            Error
          </Button>
          <Button variant="outline" onClick={() => toast('Sincronización programada', { description: 'Se ejecutará a las 03:00' })}>
            Neutro
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Dialog — crear / editar, centrado</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Editar contacto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar contacto</DialogTitle>
              <DialogDescription>Modifica los datos y guarda los cambios.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="overlay-nombre">Nombre</FieldLabel>
                <Input id="overlay-nombre" placeholder="María López" />
              </Field>
              <Field>
                <FieldLabel htmlFor="overlay-telefono">Teléfono</FieldLabel>
                <Input id="overlay-telefono" placeholder="+34 600 000 000" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button onClick={() => toast.success('Contacto guardado')}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">AlertDialog — confirmar destructivo</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Eliminar conversación</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar esta conversación?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se borrarán los mensajes y el audio asociado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => toast.success('Conversación eliminada')}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Sheet — detalle lateral, desde la derecha</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Ver detalle</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>María López</SheetTitle>
              <SheetDescription>Conversación por teléfono · 3:25 min · Resuelta</SheetDescription>
            </SheetHeader>
            <p className="text-sm text-muted-foreground mt-4">
              El panel lateral se usa para el detalle de conversaciones, contactos y
              configuraciones largas. Siempre entra deslizando desde la derecha.
            </p>
          </SheetContent>
        </Sheet>
      </section>
    </div>
  ),
};

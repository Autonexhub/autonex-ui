import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';
import { ChannelBadge } from '@autonexhub/react';
import { useRef, useState } from 'react';

const meta: Meta<typeof Sheet> = {
  title: '3-Organisms/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled)',
    },
    open: {
      control: 'boolean',
      description: 'Open state (controlled)',
    },
    modal: {
      control: 'boolean',
      description: 'If true (default), interaction outside is blocked',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Callback when open state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Panel lateral. Dos variantes (DesignRules › Paneles laterales): **modal** (por defecto) con velo, para formularios y confirmaciones que piden toda la atención; **no modal / inline** (`<Sheet modal={false}>` + `<SheetContent inline>`) sin velo, para el detalle de un elemento de un listado: una TARJETA FLOTANTE (`rounded-xl border shadow-lg`) por encima de la tarjeta de contenido, con 8px de margen arriba/derecha/abajo; la lista sigue viva, un clic en otra fila cambia el panel, y se cierra solo con ✕ o Esc. Se monta en la tarjeta del chasis (`[data-shell-panel-host]`, cabecera + área de scroll): ocupa toda su altura (tapa la fila del breadcrumb) y nunca la sidebar. Ancho por defecto ~58% del host (560–1100px). `side`: "right" (por defecto), "left", "top", "bottom".',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Contact Details</SheetTitle>
          <SheetDescription>View and edit contact information</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">Juan García</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-mono">+34 612 345 678</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Channel</p>
            <ChannelBadge channel="whatsapp" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Menu items go here</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

const ROWS = [
  { id: 1, name: 'Anna Puig', phone: '+34 612 345 678', channel: 'whatsapp' as const, status: 'Activa' },
  { id: 2, name: 'Marc Vidal', phone: '+34 655 000 111', channel: 'voice' as const, status: 'Completada' },
  { id: 3, name: 'Laia Serra', phone: '+34 699 222 333', channel: 'instagram' as const, status: 'Pendiente' },
];

/**
 * Variante NO MODAL (panel lateral de un listado) como tarjeta flotante. El
 * host simula la tarjeta del chasis (cabecera de breadcrumb + área de
 * scroll): `relative` + `data-shell-panel-host` (en la app lo publica
 * MainLayout); el panel arranca en el borde superior de la tarjeta y tapa la
 * fila del breadcrumb. Haz clic en las
 * filas con el panel abierto: cambia de entidad sin cerrarse (las filas llevan
 * `data-list-row` y el panel veta el cierre para ese clic); un clic en
 * cualquier otra zona, Esc o ✕ lo cierran. El ancho se reduce aquí
 * (`min-w-0 w-[360px]`) solo para que quepa en el lienzo de Storybook; en la
 * app manda el 58% del átomo.
 */
const NoModalDemo = () => {
  const host = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const row = ROWS.find((r) => r.id === selected) ?? null;
  return (
    <div ref={host} data-shell-panel-host className="relative flex h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-elev">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 text-sm">
        <span className="text-foreground">Operaciones</span>
        <span className="text-muted-foreground/60">›</span>
        <span className="text-foreground">Conversaciones</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Conversaciones</h2>
        <div className="divide-y divide-border rounded-xl border border-border">
          {ROWS.map((r) => (
            <button
              key={r.id}
              type="button"
              data-list-row
              onClick={() => setSelected(r.id)}
              className={`flex w-full items-center gap-4 px-4 py-3 text-left text-sm transition-colors ${selected === r.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
            >
              <span className="flex-1 font-medium">{r.name}</span>
              <span className="text-muted-foreground">{r.phone}</span>
              <ChannelBadge channel={r.channel} />
            </button>
          ))}
        </div>
      </div>
      <Sheet open={row !== null} onOpenChange={(o) => !o && setSelected(null)} modal={false}>
        <SheetContent
          inline
          container={host.current}
          className="min-w-0 w-[360px]"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement | null)?.closest('[data-list-row]')) e.preventDefault();
          }}
        >
          <SheetHeader>
            <SheetTitle>{row?.name}</SheetTitle>
            <SheetDescription>{row?.phone}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground">Canal</p>
              {row && <ChannelBadge channel={row.channel} />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant="info">{row?.status}</Badge>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const NoModal: Story = {
  name: 'No modal (panel lateral)',
  parameters: {
    docs: {
      description: {
        story:
          'Tarjeta flotante con sombra (`shadow-lg`) y 8px de margen sobre la tarjeta de contenido, sin velo: la lista de detrás sigue operativa y el panel cambia de conversación al hacer clic en otra fila; un clic en cualquier otra zona lo cierra (como ✕ y Esc). Usar para el detalle de un elemento de un listado (Conversaciones, Casos pendientes). Para formularios o confirmaciones, la variante modal por defecto.',
      },
    },
  },
  render: () => <NoModalDemo />,
};

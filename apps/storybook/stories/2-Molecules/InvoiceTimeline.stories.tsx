import type { Meta, StoryObj } from '@storybook/react';
import { InvoiceTimeline, type InvoiceTimelineEvent } from '@autonexhub/react';

const meta: Meta<typeof InvoiceTimeline> = {
  title: '2-Molecules/InvoiceTimeline',
  component: InvoiceTimeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Historial de una factura de Cobros (panel lateral de la factura), del más reciente al más antiguo. Cada evento es la frase que da la API (`label`), la fecha y hora en Madrid y quién lo hizo; sin `actor` es automático. El punto del evento más reciente va en tinta (`bg-foreground`) y el resto en `bg-border`, unidos por una raya fina. Sin eventos, una línea en `text-muted-foreground`.',
      },
    },
  },
  decorators: [(Story) => <div className="w-[400px] max-w-full"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof InvoiceTimeline>;

const event = (id: number, label: string, at: string, actor: InvoiceTimelineEvent['actor'] = null): InvoiceTimelineEvent => ({
  id,
  label,
  actor,
  at,
});

/** De más antiguo a más reciente, como llegan de la API. */
const EVENTS: InvoiceTimelineEvent[] = [
  event(1, 'Creada por el ciclo mensual', '2026-10-18T05:00:00Z'),
  event(2, 'Emitida y enviada al cliente', '2026-10-18T09:12:00Z', { id: 7, name: 'Jonnathan Herrera' }),
  event(3, 'Enviada al cliente por email', '2026-10-18T09:12:30Z'),
  event(4, 'Cobro enviado al banco', '2026-10-18T09:13:00Z'),
  event(5, 'Cobrada', '2026-10-23T06:40:00Z'),
];

export const Default: Story = {
  args: { events: EVENTS },
};

export const ConIncidencia: Story = {
  name: 'Con cobro rechazado y reintento',
  args: {
    events: [
      ...EVENTS.slice(0, 4),
      event(6, 'El banco rechazó el cobro: fondos insuficientes', '2026-10-21T06:40:00Z'),
      event(7, 'Reintento del cobro', '2026-10-22T10:05:00Z', { id: 7, name: 'Jonnathan Herrera' }),
    ],
  },
};

export const SinEventos: Story = {
  name: 'Sin eventos',
  args: { events: [] },
};

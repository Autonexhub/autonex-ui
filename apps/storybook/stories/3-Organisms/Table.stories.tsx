import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  ChannelBadge,
} from '@autonexhub/react';

/**
 * Receta canónica de tabla del panel (la misma que Conversaciones en dev):
 * SIEMPRE dentro del marco `overflow-hidden rounded-xl border bg-card`
 * ("cerrada") — nunca la tabla a pelo. La densidad (15px/24, celdas px-4
 * py-3, cabecera h-12 semibold bg-muted) viene de serie en `ui/table`:
 * no se re-declara en las celdas.
 */
const meta: Meta<typeof Table> = {
  title: '3-Organisms/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla de datos. Siempre envuelta en `overflow-hidden rounded-xl border bg-card`. ' +
          'Jerarquía de celda principal: título en `text-foreground` + segunda línea `text-muted-foreground`. ' +
          'Para el estado de carga usa TableSkeleton (cabecera real + filas skeleton).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const conversations = [
  { id: 1, title: 'Invitado a piscina exterior', contact: 'Recepción Can Dragó', channel: 'voice' as const, status: 'Resuelta', messages: 7, time: '30 ago, 00:12' },
  { id: 2, title: 'Consulta consigna y teléfono', contact: 'Recepción Can Dragó', channel: 'whatsapp' as const, status: 'Resuelta', messages: 8, time: '29 ago, 19:59' },
  { id: 3, title: 'Horario y precio piscina', contact: 'María López', channel: 'instagram' as const, status: 'Esperando Agente', messages: 28, time: '29 ago, 16:13' },
];

/** El marco obligatorio de toda tabla del panel. */
const TableFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-xl border bg-card shadow-elev">{children}</div>
);

export const ConversationsTable: Story = {
  name: 'Tabla de conversaciones',
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Conversación</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Mensajes</TableHead>
            <TableHead>Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="text-foreground">{c.title}</div>
                <div className="text-muted-foreground">{c.contact}</div>
              </TableCell>
              <TableCell><ChannelBadge channel={c.channel} /></TableCell>
              <TableCell>
                <Badge variant={c.status === 'Resuelta' ? 'success' : 'warning'}>{c.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{c.messages}</TableCell>
              <TableCell className="text-muted-foreground">{c.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const EmptyTable: Story = {
  name: 'Tabla vacía',
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo electrónico</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
              No hay resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

/** `TableCaption` (descripción accesible bajo la tabla) y `TableFooter` (fila de totales). */
export const ConPieYLeyenda: Story = {
  name: 'Con pie y leyenda',
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Canal</TableHead>
            <TableHead className="text-right">Conversaciones</TableHead>
            <TableHead className="text-right">Resueltas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Voz</TableCell><TableCell className="text-right tabular-nums">128</TableCell><TableCell className="text-right tabular-nums">117</TableCell></TableRow>
          <TableRow><TableCell>WhatsApp</TableCell><TableCell className="text-right tabular-nums">342</TableCell><TableCell className="text-right tabular-nums">329</TableCell></TableRow>
          <TableRow><TableCell>Instagram</TableCell><TableCell className="text-right tabular-nums">61</TableCell><TableCell className="text-right tabular-nums">54</TableCell></TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right tabular-nums">531</TableCell>
            <TableCell className="text-right tabular-nums">500</TableCell>
          </TableRow>
        </TableFooter>
        <TableCaption>Conversaciones de octubre por canal.</TableCaption>
      </Table>
    </TableFrame>
  ),
};

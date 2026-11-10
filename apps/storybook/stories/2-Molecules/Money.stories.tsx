import type { Meta, StoryObj } from '@storybook/react';
import { MoneyCell, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@autonexhub/react';

const meta: Meta<typeof MoneyCell> = {
  title: '2-Molecules/Money',
  component: MoneyCell,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Importe de una fila de cobros: total con IVA en `font-medium tabular-nums`, alineado a la derecha, y la base debajo en `text-xs text-muted-foreground` ("220,00 € sin IVA"). Recibe céntimos enteros y los formatea con el idioma que recibe en `locale` (es-ES por defecto): el frontend nunca suma ni calcula IVA. `null` = importe que no se pudo leer (facturas antiguas).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MoneyCell>;

export const Default: Story = {
  name: 'Por defecto',
  args: { totalCents: 26620, subtotalCents: 22000 },
};

const CASES: Array<{ label: string; total: number | null; subtotal?: number }> = [
  { label: 'Corte normal', total: 26620, subtotal: 22000 },
  { label: 'Importe grande', total: 123456789, subtotal: 102030404 },
  { label: 'Abono (negativo)', total: -1234, subtotal: -1020 },
  { label: 'Cero', total: 0, subtotal: 0 },
  { label: 'Sin base (factura antigua)', total: 21780 },
  { label: 'Total ilegible', total: null },
];

export const CasosLimite: Story = {
  name: 'Importes grandes, negativos y 0 €',
  render: () => (
    <div className="max-w-xl overflow-hidden rounded-xl border bg-card shadow-elev">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Caso</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CASES.map((c) => (
            <TableRow key={c.label}>
              <TableCell className="align-top font-medium">{c.label}</TableCell>
              <TableCell className="align-top">
                <MoneyCell totalCents={c.total} subtotalCents={c.subtotal} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

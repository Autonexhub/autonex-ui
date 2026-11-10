import type { Meta, StoryObj } from '@storybook/react';
import { InvoiceBreakdown, type InvoiceBreakdownLine, Card, CardContent, CardHeader, CardTitle } from '@autonexhub/react';

const meta: Meta<typeof InvoiceBreakdown> = {
  title: '2-Molecules/InvoiceBreakdown',
  component: InvoiceBreakdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Factura explicada: cada línea con su concepto, el porqué debajo (`explanation`, en `text-xs text-muted-foreground`) y su importe; al pie base imponible, IVA y total. Es el MISMO componente en la Sheet de admin, el próximo cargo del cliente (`compact`: sin explicaciones y con el total sin destacar, porque la tarjeta ya enseña la cifra grande) y el diálogo de cobro puntual. Todos los importes llegan en céntimos de la API; no suma ni calcula IVA.',
      },
    },
  },
  decorators: [(Story) => <div className="w-[400px] max-w-full"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof InvoiceBreakdown>;

const CORTE: InvoiceBreakdownLine[] = [
  {
    id: 1,
    description: 'Cuota del Plan Operativo',
    explanation: 'Del 18 de octubre al 17 de noviembre',
    amount_cents: 18000,
  },
  {
    id: 2,
    description: '200 minutos extra a 0,20 €',
    explanation: 'Usó 1.200 de 1.000 minutos entre el 18 de septiembre y el 17 de octubre',
    amount_cents: 4000,
  },
];

export const CorteMensual: Story = {
  name: 'Corte mensual (Sheet de admin)',
  args: { lines: CORTE, subtotalCents: 22000, taxCents: 4620, totalCents: 26620 },
};

export const ConMensualidades: Story = {
  name: 'Con mensualidades fijas',
  args: {
    lines: [
      ...CORTE,
      { id: 3, description: 'Mantenimiento de la automatización', explanation: 'Mensualidad fija desde el 1 de marzo', amount_cents: 5000 },
      { id: 4, description: 'Soporte prioritario', explanation: null, amount_cents: 3000 },
    ],
    subtotalCents: 30000,
    taxCents: 6300,
    totalCents: 36300,
  },
};

export const ProximoCargoCliente: Story = {
  name: 'Próximo cargo del cliente (compact)',
  render: () => (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">El 18 de noviembre se te cargarán</p>
        <CardTitle className="text-3xl tabular-nums">217,80 €</CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceBreakdown
          compact
          lines={[
            { id: null, description: 'Cuota de noviembre', explanation: 'Del 18 de noviembre al 17 de diciembre', amount_cents: 18000 },
            { id: null, description: 'Minutos extra', explanation: null, amount_cents: 0 },
          ]}
          subtotalCents={18000}
          taxCents={3780}
          totalCents={21780}
        />
      </CardContent>
    </Card>
  ),
};

export const CobroPuntual: Story = {
  name: 'Cobro puntual (diálogo)',
  args: {
    lines: [{ id: null, description: 'Implementación, pago 2 de 3', explanation: null, amount_cents: 100000 }],
    subtotalCents: 100000,
    taxCents: 21000,
    totalCents: 121000,
  },
};

export const ImporteGrande: Story = {
  name: 'Importe grande',
  args: {
    lines: [{ id: 1, description: 'Desarrollo a medida', explanation: 'Proyecto completo', amount_cents: 102030404 }],
    subtotalCents: 102030404,
    taxCents: 21426385,
    totalCents: 123456789,
  },
};

export const ConAbono: Story = {
  name: 'Con abono (línea negativa)',
  args: {
    lines: [
      { id: 1, description: 'Cuota del Plan Operativo', explanation: 'Del 18 de octubre al 17 de noviembre', amount_cents: 18000 },
      { id: 2, description: 'Descuento acordado', explanation: 'Compensación por la incidencia del 3 de octubre', amount_cents: -1234 },
    ],
    subtotalCents: 16766,
    taxCents: 3521,
    totalCents: 20287,
  },
};

export const TodoACero: Story = {
  name: 'Total 0 €',
  args: {
    lines: [{ id: 1, description: 'Minutos extra', explanation: 'Usó 640 de 1.000 minutos incluidos', amount_cents: 0 }],
    subtotalCents: 0,
    taxCents: 0,
    totalCents: 0,
  },
};

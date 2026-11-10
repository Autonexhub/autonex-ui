import type { Meta, StoryObj } from '@storybook/react';
import { MandateStatus } from '@autonexhub/react';

const meta: Meta<typeof MandateStatus> = {
  title: '2-Molecules/MandateStatus',
  component: MandateStatus,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['active', 'pending', 'none', 'inactive'] },
    layout: { control: 'inline-radio', options: ['stack', 'inline'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Domiciliación SEPA de un cliente: badge con el estado y, si está activa, los últimos 4 dígitos ("Activa, acaba en 4821"). Activa = success; pendiente y sin domiciliación = warning (no se puede cobrar todavía); inactiva = secondary. `stack` (por defecto) es la celda de tabla de la maqueta: badge y debajo "Acaba en 4821" en `text-xs text-muted-foreground`; `inline` pone los dígitos al lado, para tarjetas y fichas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MandateStatus>;

export const Activa: Story = {
  args: { status: 'active', last4: '4821' },
};

export const TodosLosEstados: Story = {
  name: 'Todos los estados',
  render: () => (
    <div className="flex items-start gap-8">
      <MandateStatus status="active" last4="4821" />
      <MandateStatus status="pending" />
      <MandateStatus status="none" />
      <MandateStatus status="inactive" last4="0193" />
    </div>
  ),
};

export const EnLinea: Story = {
  name: 'En línea (tarjetas y fichas)',
  render: () => (
    <div className="flex flex-col gap-3">
      <MandateStatus status="active" last4="4821" layout="inline" />
      <MandateStatus status="pending" layout="inline" />
      <MandateStatus status="none" layout="inline" />
    </div>
  ),
};

export const ActivaSinDigitos: Story = {
  name: 'Activa sin dígitos conocidos',
  args: { status: 'active', last4: null },
};

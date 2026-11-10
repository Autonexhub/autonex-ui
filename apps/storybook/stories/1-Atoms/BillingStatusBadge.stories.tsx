import type { Meta, StoryObj } from '@storybook/react';
import { BillingStatusBadge, type BillingBlockedReason, type BillingInvoiceStatus } from '@autonexhub/react';

const STATUSES: BillingInvoiceStatus[] = [
  'draft', 'issuing', 'issued', 'payment_pending', 'paid', 'failed', 'disputed', 'refunded', 'cancelled',
];

const BLOCKED: BillingBlockedReason[] = [
  'no_mandate', 'no_contact', 'total_mismatch', 'permanent_error', 'missing_account', 'stale_charge_attempt', 'below_minimum',
];

const meta: Meta<typeof BillingStatusBadge> = {
  title: '1-Atoms/BillingStatusBadge',
  component: BillingStatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: STATUSES },
    blocked: { control: 'select', options: [null, ...BLOCKED] },
    audience: { control: 'inline-radio', options: ['admin', 'client'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Estado de una factura de cobros → `Badge` con el mapeo canónico (§8): success = cobrada; info = emitida o cobrándose (en curso); warning = por revisar (pendiente); destructive = fallida, en disputa o con bloqueo; secondary = devuelta o anulada (cerradas, no son un error). Con `blocked` (motivo del bloqueo) gana "Con bloqueo" en rojo, y el motivo queda en el `title`; `below_minimum` (total por debajo de 0,50 €, sigue en Por revisar) va en warning. `audience="client"` usa las frases que ve el cliente (§6): «Pendiente de cobro» va en warning, igual que el «Pendiente» de sus facturas antiguas de Holded en la misma lista, y «Devuelta» siempre en gris. Los textos se pasan en `labels` (español por defecto).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BillingStatusBadge>;

export const Default: Story = {
  name: 'Por defecto',
  args: { status: 'payment_pending' },
};

export const TodosLosEstados: Story = {
  name: 'Todos los estados (admin)',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => <BillingStatusBadge key={s} status={s} />)}
    </div>
  ),
};

export const LoQueVeElCliente: Story = {
  name: 'Lo que ve el cliente',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['draft', 'issued', 'payment_pending', 'paid', 'failed', 'refunded', 'cancelled'] as BillingInvoiceStatus[]).map((s) => (
        <BillingStatusBadge key={s} status={s} audience="client" />
      ))}
    </div>
  ),
};

export const ConBloqueo: Story = {
  name: 'Con bloqueo (cada motivo)',
  render: () => (
    <div className="flex flex-col gap-2">
      {BLOCKED.map((reason) => (
        <div key={reason} className="flex items-center gap-3 text-sm">
          <BillingStatusBadge status={reason === 'stale_charge_attempt' ? 'issued' : 'draft'} blocked={reason} />
          <code className="text-xs text-muted-foreground">{reason}</code>
        </div>
      ))}
    </div>
  ),
};

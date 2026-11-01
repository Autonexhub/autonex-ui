import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot, type StatusDotVariant } from "@autonexhub/react";

const VARIANTS: { variant: StatusDotVariant; label: string }[] = [
  { variant: 'success', label: 'Cobrada' },
  { variant: 'info', label: 'Cobrándose' },
  { variant: 'warning', label: 'Por revisar' },
  { variant: 'destructive', label: 'Fallida' },
  { variant: 'secondary', label: 'Anulada' },
];

const meta: Meta<typeof StatusDot> = {
  title: '1-Atoms/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS.map((v) => v.variant) },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Estados en Cobros (`pages/billing/**`, `components/billing/**`): StatusDot (punto + texto), sin píldora de color — decisión de Jonnathan 21/10: los recuadros tintados se veían «muy IA». Punto de 6px en el color semántico + texto en tinta, sin fondo, borde ni padding. Mismo mapeo que el Badge: success = OK, info = en curso (azul de marca), warning = pendiente, destructive = error, secondary = neutro (punto gris, texto atenuado). En Cobros el Badge solo queda para etiquetas neutras (`secondary`: tipo de contacto, «Estimado»). Los avisos de Cobros siguen la misma idea: `Alert variant="quiet-destructive|quiet-warning|quiet-success"` — sin caja tintada, solo el icono en color, título en tinta y descripción atenuada.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: { variant: 'success', children: 'Activa' },
};

export const TodasLasVariantes: Story = {
  name: 'Todas las variantes',
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <StatusDot key={variant} variant={variant}>
          {label}
        </StatusDot>
      ))}
    </div>
  ),
};

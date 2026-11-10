import type { Meta, StoryObj } from '@storybook/react';
import { ServiceReviewBadges } from '@autonexhub/react';

const meta: Meta<typeof ServiceReviewBadges> = {
  title: '2-Molecules/ServiceReviewBadges',
  component: ServiceReviewBadges,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lo que hay que revisar de un servicio, en etiquetas bajo su nombre en el catálogo: borrador (gris), sin precio en un centro o precio distinto al de los demás centros (ámbar) y 0 € (rojo). ' +
          'Salen de `reviewIssues`, con la misma herencia de precios que la matriz. A partir de la tercera se resumen en "+N" con el detalle al pasar el ratón.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ServiceReviewBadges>;

export const PrecioDistinto: Story = { args: { issues: [{ kind: 'distinto', label: 'Precio distinto en Chamberí' }] } };

export const Varios: Story = {
  args: {
    issues: [
      { kind: 'borrador', label: 'Borrador' },
      { kind: 'cero', label: '0 € en Retiro' },
      { kind: 'sin-precio', label: 'Sin precio en Serrano' },
      { kind: 'distinto', label: 'Precio distinto en Chamberí' },
    ],
  },
};

export const SinAvisos: Story = {
  args: { issues: [] },
  parameters: { docs: { description: { story: 'Sin nada que revisar no se pinta nada.' } } },
};

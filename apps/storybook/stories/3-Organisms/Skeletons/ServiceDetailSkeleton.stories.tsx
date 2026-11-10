import type { Meta, StoryObj } from '@storybook/react';
import { ServiceDetailHeaderSkeleton, ServiceDetailSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ServiceDetailSkeleton> = {
  title: '3-Organisms/Skeletons/ServiceDetailSkeleton',
  component: ServiceDetailSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Esqueleto de la ficha de un servicio: el título con sus etiquetas y las tres tarjetas a todo el ancho (Datos, Precios por centro y tarifa, y Quién lo presta), cada una con su título y unas barras. Sencillo, como el de la ficha de contacto.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceDetailSkeleton>;

export const Default: Story = {
  render: () => (
    <div className="px-10 py-6">
      <div className="mb-6">
        <ServiceDetailHeaderSkeleton />
      </div>
      <ServiceDetailSkeleton />
    </div>
  ),
};

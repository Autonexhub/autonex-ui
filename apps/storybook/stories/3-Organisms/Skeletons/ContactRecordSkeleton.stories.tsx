import type { Meta, StoryObj } from '@storybook/react';
import { ContactRecordSkeleton, ConversationInsightsBodySkeleton, ConversationInsightsCardSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ContactRecordSkeleton> = {
  title: '3-Organisms/Skeletons/ContactRecordSkeleton',
  component: ContactRecordSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Esqueleto de la ficha de contacto (`ContactoDetalle`): calca sus tres columnas — identidad y propiedades a la izquierda, resumen de conversaciones y actividad en el centro, resumen del agente, negocios y tareas a la derecha. Va dentro del contenedor `px-10 py-6` de la página.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContactRecordSkeleton>;

export const Default: Story = {
  render: () => (
    <div className="px-10 py-6">
      <ContactRecordSkeleton />
    </div>
  ),
};

/** Cuerpo del resumen del agente (sin tarjeta), para usarlo dentro de otra superficie. */
export const InsightsBody: Story = {
  name: 'ConversationInsightsBodySkeleton',
  render: () => (
    <div className="max-w-sm">
      <ConversationInsightsBodySkeleton />
    </div>
  ),
};

/** Tarjeta completa del resumen del agente. */
export const InsightsCard: Story = {
  name: 'ConversationInsightsCardSkeleton',
  render: () => (
    <div className="max-w-sm">
      <ConversationInsightsCardSkeleton />
    </div>
  ),
};

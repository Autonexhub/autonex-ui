import type { Meta, StoryObj } from '@storybook/react';
import { MarginsSummaryCards } from '@autonexhub/react';
import { mockSummary } from '../3-Organisms/marginsFixtures';

const meta: Meta<typeof MarginsSummaryCards> = {
  title: '2-Molecules/MarginsSummaryCards',
  component: MarginsSummaryCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Cuatro tarjetas resumen de Márgenes (ingresos, costes, margen neto y margen %) con la variación frente al periodo anterior en verde, rojo o gris según la tendencia.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof MarginsSummaryCards>;

export const Default: Story = { name: 'Por defecto', args: { summary: mockSummary } };

export const SinVariacion: Story = {
  name: 'Sin variaciones',
  args: {
    summary: {
      ...mockSummary,
      incomeDelta: { value: '0%', direction: 'stable' },
      costsDelta: { value: '0%', direction: 'stable' },
      marginDelta: { value: '0%', direction: 'stable' },
      marginPercentDelta: { value: '0%', direction: 'stable' },
    },
  },
};

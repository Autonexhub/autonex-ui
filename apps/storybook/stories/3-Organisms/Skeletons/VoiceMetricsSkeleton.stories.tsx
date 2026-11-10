import type { Meta, StoryObj } from '@storybook/react';
import { VoiceMetricsSkeleton, ChartSkeleton } from '@autonexhub/react';

const meta: Meta<typeof VoiceMetricsSkeleton> = {
  title: '3-Organisms/Skeletons/VoiceMetricsSkeleton',
  component: VoiceMetricsSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Receta canónica de carga de gráficas (decisión Bruno 02/09): el TÍTULO se pinta real ' +
          '(es estructura) y el área de la gráfica es UN solo bloque Skeleton. Nada de siluetas ' +
          'dibujadas (ondas, barras, burbujas). La franja de KPIs calca las celdas reales de Métricas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VoiceMetricsSkeleton>;

/** Página de Métricas completa (seis KPIs: con canal). */
export const Metricas: Story = {
  name: 'Métricas',
  args: { kpiCount: 6 },
};

/** Una gráfica suelta fuera de Métricas: misma receta, título real + un bloque. */
export const UnaGrafica: Story = {
  name: 'ChartSkeleton (una gráfica)',
  render: () => (
    <div className="max-w-md">
      <ChartSkeleton title="Idiomas más usados" />
    </div>
  ),
};

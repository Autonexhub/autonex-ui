import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@autonexhub/react';

const meta: Meta<typeof Skeleton> = {
  title: '1-Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Clases de tamaño y forma: h-* w-* para el tamaño, rounded-* para las esquinas.',
      table: {
        defaultValue: { summary: 'rounded-2xl' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Marcador de carga con animate-pulse (animate-shimmer queda reservado para barridos de progreso). Se usa en las zonas de contenido mientras cargan los datos.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    className: 'h-4 w-48',
  },
};

export const Shapes: Story = {
  name: 'Formas',
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Texto:</span>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Círculo:</span>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Tarjeta:</span>
        <Skeleton className="h-24 w-48 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Botón:</span>
        <Skeleton className="h-9 w-24 rounded-4xl" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  name: 'Tarjeta en carga',
  render: () => (
    <div className="rounded-lg border bg-card p-4 w-64 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  ),
};

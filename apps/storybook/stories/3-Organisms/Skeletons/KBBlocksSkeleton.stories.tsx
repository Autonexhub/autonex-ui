import type { Meta, StoryObj } from '@storybook/react';
import { KBBlocksSkeleton } from '@autonexhub/react';

const meta: Meta<typeof KBBlocksSkeleton> = {
  title: '3-Organisms/Skeletons/KBBlocksSkeleton',
  component: KBBlocksSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton de los bloques de la Base de conocimiento: toolbar de listado (buscador, estado, añadir bloque) y tarjetas de bloque.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KBBlocksSkeleton>;

export const Default: Story = {};

export const TresBloques: Story = {
  args: { count: 3 },
};

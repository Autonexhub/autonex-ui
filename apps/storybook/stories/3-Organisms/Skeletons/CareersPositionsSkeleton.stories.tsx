import type { Meta, StoryObj } from '@storybook/react';
import { CareersPositionsSkeleton } from '@autonexhub/react';

const meta: Meta<typeof CareersPositionsSkeleton> = {
  title: '3-Organisms/Skeletons/CareersPositionsSkeleton',
  component: CareersPositionsSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabla de posiciones de Empleo mientras carga: título, departamento, estado, candidaturas, publicación y acciones.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CareersPositionsSkeleton>;

export const Default: Story = {};

export const PocasFilas: Story = {
  args: { rows: 3 },
};

import type { Meta, StoryObj } from '@storybook/react';
import { CareersKanbanSkeleton } from '@autonexhub/react';

const meta: Meta<typeof CareersKanbanSkeleton> = {
  title: '3-Organisms/Skeletons/CareersKanbanSkeleton',
  component: CareersKanbanSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tablero de candidaturas (Empleo) mientras carga: columnas por fase con tarjetas de candidato.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CareersKanbanSkeleton>;

export const Default: Story = {};

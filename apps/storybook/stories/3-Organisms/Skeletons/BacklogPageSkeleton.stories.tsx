import type { Meta, StoryObj } from '@storybook/react';
import { BacklogPageSkeleton } from '@autonexhub/react';

const meta: Meta<typeof BacklogPageSkeleton> = {
  title: '3-Organisms/Skeletons/BacklogPageSkeleton',
  component: BacklogPageSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton de la página de Backlog de Linear: sprint activo y listas de incidencias mientras cargan.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BacklogPageSkeleton>;

export const Default: Story = {};

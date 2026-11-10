import type { Meta, StoryObj } from '@storybook/react';
import { LinearIssuesSkeleton, LinearKanbanSkeleton } from '@autonexhub/react';

const meta: Meta<typeof LinearIssuesSkeleton> = {
  title: '3-Organisms/Skeletons/LinearSkeletons',
  component: LinearIssuesSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Esqueletos del contexto Linear: la lista de issues (cabeceras reales, filas shimmer) y el tablero kanban del sprint activo (columnas con tarjetas).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinearIssuesSkeleton>;

export const ListaDeIssues: Story = {
  name: 'Lista de issues',
  render: () => <LinearIssuesSkeleton />,
};

export const Kanban: Story = {
  render: () => <LinearKanbanSkeleton />,
};

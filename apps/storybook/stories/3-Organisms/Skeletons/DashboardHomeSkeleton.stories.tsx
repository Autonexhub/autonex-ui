import type { Meta, StoryObj } from '@storybook/react';
import { DashboardHomeSkeleton } from '@autonexhub/react';

const meta: Meta<typeof DashboardHomeSkeleton> = {
  title: '3-Organisms/Skeletons/DashboardHomeSkeleton',
  component: DashboardHomeSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Skeleton de Rambo IA: saludo, subtítulo, píldora de búsqueda (h-11) y los chips de acceso rápido, con los mismos márgenes que la página.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardHomeSkeleton>;

export const Default: Story = {};

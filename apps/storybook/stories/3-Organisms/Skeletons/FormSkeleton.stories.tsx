import type { Meta, StoryObj } from '@storybook/react';
import { FormSkeleton } from '@autonexhub/react';

const meta: Meta<typeof FormSkeleton> = {
  title: '3-Organisms/Skeletons/FormSkeleton',
  component: FormSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Skeleton para páginas de formulario (ajustes de perfil, formularios de configuración): dos tarjetas con campos.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormSkeleton>;

export const Default: Story = {};

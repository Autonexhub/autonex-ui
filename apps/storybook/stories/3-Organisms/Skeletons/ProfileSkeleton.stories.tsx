import type { Meta, StoryObj } from '@storybook/react';
import { ProfileSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ProfileSkeleton> = {
  title: '3-Organisms/Skeletons/ProfileSkeleton',
  component: ProfileSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton de /settings/profile: seis tarjetas (foto, información personal, logotipo de la organización, etc.) con la anatomía real de la página.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileSkeleton>;

export const Default: Story = {};

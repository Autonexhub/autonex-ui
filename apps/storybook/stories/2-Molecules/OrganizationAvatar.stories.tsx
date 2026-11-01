import type { Meta, StoryObj } from '@storybook/react';
import { OrganizationAvatar } from '@autonexhub/react';

const meta: Meta<typeof OrganizationAvatar> = {
  title: '2-Molecules/OrganizationAvatar',
  component: OrganizationAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Marca cuadrada de una organización: logo si lo tiene y, si no, las iniciales de su nombre (una palabra → 1 letra, dos o más → 2).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrganizationAvatar>;

export const Initials: Story = { args: { name: 'Clínica Dental Sol' } };
export const SingleWord: Story = { args: { name: 'Autonex' } };
export const NoName: Story = { args: { name: null } };
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <OrganizationAvatar name="Clínica Dental Sol" className="h-8 w-8" />
      <OrganizationAvatar name="Clínica Dental Sol" />
      <OrganizationAvatar name="Clínica Dental Sol" className="h-12 w-12" />
    </div>
  ),
};

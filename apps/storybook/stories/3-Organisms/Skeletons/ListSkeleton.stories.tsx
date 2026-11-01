import type { Meta, StoryObj } from '@storybook/react';
import { ListSkeleton } from '@autonexhub/react';

const meta: Meta<typeof ListSkeleton> = {
  title: '3-Organisms/Skeletons/ListSkeleton',
  component: ListSkeleton,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 12 }, description: 'Número de filas' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Lista vertical con avatar redondo y dos líneas: listas de conversaciones y de correos mientras cargan.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListSkeleton>;

export const Default: Story = {
  args: { count: 5 },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-xl border border-border bg-card">
      <ListSkeleton {...args} />
    </div>
  ),
};

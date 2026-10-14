import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@autonexhub/react';

const meta: Meta<typeof Progress> = {
  title: '1-Atoms/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Progress bar indicator. Value from 0-100.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
  },
  render: (args) => <Progress {...args} className="w-64" />,
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div className="space-y-1">
        <span className="text-sm">0%</span>
        <Progress value={0} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">50%</span>
        <Progress value={50} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">100%</span>
        <Progress value={100} />
      </div>
    </div>
  ),
};

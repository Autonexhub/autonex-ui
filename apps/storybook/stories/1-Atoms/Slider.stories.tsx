import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@autonexhub/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof Slider> = {
  title: '1-Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'object',
      description: 'Initial value (array for range)',
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum value',
      table: { defaultValue: { summary: '100' } },
    },
    min: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Minimum value',
      table: { defaultValue: { summary: '0' } },
    },
    step: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Step increment',
      table: { defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the slider',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Slider orientation',
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Callback when value changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Range slider for numeric input. Based on Radix UI Slider.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  render: (args) => <Slider {...args} className="w-64" />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div className="flex justify-between">
        <Label>Volumen</Label>
        <span className="text-sm text-muted-foreground">75%</span>
      </div>
      <Slider defaultValue={[75]} max={100} step={1} />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Label>Rango de duración (min)</Label>
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
  },
  render: (args) => <Slider {...args} className="w-64" />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@autonexhub/react';
import { TextB, TextItalic } from '@phosphor-icons/react';

const meta: Meta<typeof Toggle> = {
  title: '1-Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Visual style',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Toggle size',
      table: { defaultValue: { summary: 'default' } },
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state',
    },
    defaultPressed: {
      control: 'boolean',
      description: 'Initial pressed state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the toggle',
    },
    onPressedChange: {
      action: 'pressedChange',
      description: 'Callback when pressed state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Two-state button that can be on or off. Use for toolbar actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: <TextB />,
  },
};

export const WithText: Story = {
  args: {
    children: 'Toggle',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: <TextItalic />,
  },
};

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    children: <TextB />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <TextB />,
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle><TextB /></Toggle>
      <Toggle defaultPressed><TextB /></Toggle>
      <Toggle variant="outline"><TextItalic /></Toggle>
      <Toggle variant="outline" defaultPressed><TextItalic /></Toggle>
      <Toggle disabled><TextB /></Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm"><TextB /></Toggle>
      <Toggle size="default"><TextB /></Toggle>
      <Toggle size="lg"><TextB /></Toggle>
    </div>
  ),
};

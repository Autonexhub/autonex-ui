import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@autonexhub/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof Switch> = {
  title: '1-Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    size: {
      control: 'radio',
      options: ['default', 'sm'],
      description: 'Switch size',
      table: { defaultValue: { summary: 'default' } },
    },
    required: {
      control: 'boolean',
      description: 'Mark as required for forms',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: 'Callback when checked state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Toggle switch based on Radix UI. Use for binary on/off settings. Checked = verde success (bg-success), unchecked = gris bg-input (decisión 2026-08-31).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notificaciones" />
      <Label htmlFor="notificaciones">Activar notificaciones</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="sw-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-sm">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="sw-default" defaultChecked />
        <Label htmlFor="sw-default">Default</Label>
      </div>
    </div>
  ),
};

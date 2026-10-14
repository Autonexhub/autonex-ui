import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@autonexhub/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof Checkbox> = {
  title: '1-Atoms/Checkbox',
  component: Checkbox,
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
      description: 'Disable the checkbox',
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
          'Checkbox input based on Radix UI. Fondo bg-input con borde transparente, marcado en bg-primary con check Phosphor. Use with Label for accessibility.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Acepto los términos y condiciones</Label>
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

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="voice" defaultChecked />
        <Label htmlFor="voice">Teléfono</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="web" />
        <Label htmlFor="web">Web</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="whatsapp" />
        <Label htmlFor="whatsapp">WhatsApp</Label>
      </div>
    </div>
  ),
};

/** Los tres estados, uno al lado del otro: deben verse distintos entre sí. */
export const TresEstados: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="tres-estados-ninguno" checked={false} />
        <Label htmlFor="tres-estados-ninguno">Ninguno</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="tres-estados-mezcla" checked="indeterminate" />
        <Label htmlFor="tres-estados-mezcla">Mezcla</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="tres-estados-todos" checked />
        <Label htmlFor="tres-estados-todos">Todos</Label>
      </div>
    </div>
  ),
};

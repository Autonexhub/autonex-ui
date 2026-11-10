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
      description: 'Estado marcado (controlado)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Estado marcado inicial (no controlado)',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el interruptor',
    },
    size: {
      control: 'radio',
      options: ['default', 'sm'],
      description: 'Tamaño del interruptor',
      table: { defaultValue: { summary: 'default' } },
    },
    required: {
      control: 'boolean',
      description: 'Marca el campo como obligatorio en formularios',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: 'Se llama cuando cambia el estado marcado',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Interruptor basado en Radix UI para ajustes de activado/desactivado. Checked = verde success (bg-success), unchecked = gris bg-input (decisión 2026-08-31).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  name: 'Por defecto',
};

export const WithLabel: Story = {
  name: 'Con etiqueta',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notificaciones" />
      <Label htmlFor="notificaciones">Activar notificaciones</Label>
    </div>
  ),
};

export const Checked: Story = {
  name: 'Activado',
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: {
    disabled: true,
  },
};

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="sw-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-sm">Pequeño (sm)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="sw-default" defaultChecked />
        <Label htmlFor="sw-default">Por defecto</Label>
      </div>
    </div>
  ),
};

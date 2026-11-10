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
      description: 'Estado marcado (controlado)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Estado marcado inicial (no controlado)',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita la casilla',
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
          'Casilla de verificación basada en Radix UI. Fondo bg-input con borde transparente, marcado en bg-primary con check Phosphor. Úsala siempre con Label por accesibilidad.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  name: 'Por defecto',
};

export const WithLabel: Story = {
  name: 'Con etiqueta',
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Acepto los términos y condiciones</Label>
    </div>
  ),
};

export const Checked: Story = {
  name: 'Marcada',
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  name: 'Deshabilitada',
  args: {
    disabled: true,
  },
};

export const CheckboxGroup: Story = {
  name: 'Grupo de casillas',
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
  name: 'Tres estados',
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

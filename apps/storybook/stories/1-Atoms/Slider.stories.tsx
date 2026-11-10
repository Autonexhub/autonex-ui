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
      description: 'Valor inicial (array para un rango)',
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Valor máximo',
      table: { defaultValue: { summary: '100' } },
    },
    min: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Valor mínimo',
      table: { defaultValue: { summary: '0' } },
    },
    step: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Incremento de cada paso',
      table: { defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el deslizador',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientación del deslizador',
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Se llama cuando cambia el valor',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Deslizador para valores numéricos o rangos. Basado en Radix UI Slider.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  render: (args) => <Slider {...args} className="w-64" />,
};

export const WithLabel: Story = {
  name: 'Con etiqueta',
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
  name: 'Rango',
  render: () => (
    <div className="space-y-4 w-64">
      <Label>Rango de duración (min)</Label>
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: {
    defaultValue: [50],
    disabled: true,
  },
  render: (args) => <Slider {...args} className="w-64" />,
};

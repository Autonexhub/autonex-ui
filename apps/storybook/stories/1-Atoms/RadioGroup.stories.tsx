import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '@autonexhub/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof RadioGroup> = {
  title: '1-Atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Initial selected value (uncontrolled)',
    },
    value: {
      control: 'text',
      description: 'Selected value (controlled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all radio items',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
      table: { defaultValue: { summary: 'vertical' } },
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Callback when selection changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Radio button group for single selection. Item con fondo bg-input y borde transparente; seleccionado en bg-primary con punto interior. Use RadioGroupItem with Label.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">Opción 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">Opción 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">Opción 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="voice" className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="voice" id="voice" />
        <Label htmlFor="voice">Teléfono</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="web" id="web" />
        <Label htmlFor="web">Web</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="whatsapp" id="whatsapp" />
        <Label htmlFor="whatsapp">WhatsApp</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="d1" />
        <Label htmlFor="d1">Opción 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="d2" />
        <Label htmlFor="d2">Opción 2</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="default" id="rd1" className="mt-1" />
        <div>
          <Label htmlFor="rd1">Predeterminada</Label>
          <p className="text-sm text-muted-foreground">Espaciado y tamaño estándar</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="comfortable" id="rd2" className="mt-1" />
        <div>
          <Label htmlFor="rd2">Cómoda</Label>
          <p className="text-sm text-muted-foreground">Más espacio entre elementos</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="compact" id="rd3" className="mt-1" />
        <div>
          <Label htmlFor="rd3">Compacta</Label>
          <p className="text-sm text-muted-foreground">Espaciado reducido para vistas densas</p>
        </div>
      </div>
    </RadioGroup>
  ),
};

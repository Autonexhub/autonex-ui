import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof Label> = {
  title: '1-Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto de la etiqueta',
    },
    htmlFor: {
      control: 'text',
      description: 'ID del campo al que pertenece la etiqueta',
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Etiqueta de formulario. Etiqueta de campo a 12px/400 en muted-foreground (jerarquía tipográfica propia — diverge a propósito del preset). Va siempre unida a su campo por accesibilidad.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    children: 'Etiqueta',
  },
};

export const Required: Story = {
  name: 'Obligatorio',
  render: () => (
    <Label>
      Correo electrónico <span className="text-destructive">*</span>
    </Label>
  ),
};

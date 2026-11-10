import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@autonexhub/react';
import { Field, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Textarea> = {
  title: '1-Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de ejemplo (placeholder)',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el área de texto',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Número de líneas visibles',
    },
    value: {
      control: 'text',
      description: 'Valor (controlado)',
    },
    defaultValue: {
      control: 'text',
      description: 'Valor inicial (no controlado)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto de varias líneas. Relleno bg-muted, rounded-2xl, sin resize manual (crece con el contenido via field-sizing donde el navegador lo soporta); error via aria-invalid.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    placeholder: 'Escribe tu mensaje...',
  },
};

export const WithLabel: Story = {
  name: 'Con etiqueta',
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="message">Nota interna</FieldLabel>
      <Textarea id="message" placeholder="Añade una nota sobre esta conversación" rows={4} />
    </Field>
  ),
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: {
    placeholder: 'Escribe tu mensaje...',
    disabled: true,
  },
};

export const Invalid: Story = {
  name: 'Con error',
  args: {
    placeholder: 'Campo con error',
    'aria-invalid': true,
  },
};

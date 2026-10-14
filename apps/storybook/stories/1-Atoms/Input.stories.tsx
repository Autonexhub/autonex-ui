import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@autonexhub/react';
import { Field, FieldError, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Input> = {
  title: '1-Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Estado de error (borde y ring destructive)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto de una línea. Píldora rounded-3xl con relleno bg-muted y borde transparente; focus con border-ring + ring suave; error via aria-invalid.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Buscar conversaciones...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
      <Input id="email" type="email" placeholder="nombre@empresa.com" />
    </Field>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Field>
        <FieldLabel htmlFor="input-normal">Normal</FieldLabel>
        <Input id="input-normal" placeholder="Nombre del contacto" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-disabled">Deshabilitado</FieldLabel>
        <Input id="input-disabled" placeholder="Nombre del contacto" disabled />
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="input-error">Error</FieldLabel>
        <Input id="input-error" placeholder="Nombre del contacto" aria-invalid="true" />
        <FieldError>Este campo es obligatorio</FieldError>
      </Field>
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" placeholder="Nombre del contacto" />
      <Input type="email" placeholder="nombre@empresa.com" />
      <Input type="password" placeholder="Contraseña" />
      <Input type="number" placeholder="Nº de llamadas" />
      <Input type="search" placeholder="Buscar..." />
    </div>
  ),
};

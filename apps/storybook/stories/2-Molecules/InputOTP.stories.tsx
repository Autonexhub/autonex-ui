import type { Meta, StoryObj } from '@storybook/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@autonexhub/react';
import { Field, FieldDescription, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof InputOTP> = {
  title: '2-Molecules/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: 'number',
      description: 'Número máximo de caracteres',
      table: { defaultValue: { summary: '6' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desactiva el campo',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Campo de código de un solo uso. Casillas `h-9` con fondo `bg-muted` y extremos `rounded-3xl`; separador con el icono `Minus` (Phosphor). Para códigos de verificación.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const WithSeparator: Story = {
  name: 'Con separador',
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const FourDigits: Story = {
  name: 'Cuatro dígitos',
  render: () => (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const Disabled: Story = {
  name: 'Desactivado',
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const WithLabel: Story = {
  name: 'Con etiqueta',
  render: () => (
    <Field className="w-fit">
      <FieldLabel>Código de verificación</FieldLabel>
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription>
        Introduce el código que te hemos enviado por SMS.
      </FieldDescription>
    </Field>
  ),
};

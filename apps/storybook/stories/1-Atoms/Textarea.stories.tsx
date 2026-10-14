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
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the textarea',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of visible text lines',
    },
    value: {
      control: 'text',
      description: 'Controlled value',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value (uncontrolled)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text input. Relleno bg-muted, rounded-2xl, sin resize manual (crece con el contenido via field-sizing donde el navegador lo soporta); error via aria-invalid.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Escribe tu mensaje...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="message">Nota interna</FieldLabel>
      <Textarea id="message" placeholder="Añade una nota sobre esta conversación" rows={4} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Escribe tu mensaje...',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Campo con error',
    'aria-invalid': true,
  },
};

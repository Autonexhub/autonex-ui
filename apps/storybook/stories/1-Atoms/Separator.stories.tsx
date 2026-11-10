import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@autonexhub/react';

const meta: Meta<typeof Separator> = {
  title: '1-Atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Dirección del separador',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Si es true, el separador es solo decorativo (sin rol de accesibilidad)',
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales (márgenes, colores)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Divisor visual. Úsalo con moderación: a menudo basta con el espacio en blanco.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  name: 'Horizontal',
  render: () => (
    <div className="w-64">
      <p className="text-sm">Contenido superior</p>
      <Separator className="my-4" />
      <p className="text-sm">Contenido inferior</p>
    </div>
  ),
};

export const Vertical: Story = {
  name: 'Vertical',
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span>Conversaciones</span>
      <Separator orientation="vertical" />
      <span>Contactos</span>
    </div>
  ),
};

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
      description: 'Direction of the separator',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'If true, separator is purely decorative (no a11y role)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes (margins, colors)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Visual divider. Use sparingly—whitespace often suffices.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Contenido superior</p>
      <Separator className="my-4" />
      <p className="text-sm">Contenido inferior</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span>Conversaciones</span>
      <Separator orientation="vertical" />
      <span>Contactos</span>
    </div>
  ),
};

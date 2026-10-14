import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@autonexhub/react';

const meta: Meta<typeof Label> = {
  title: '1-Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text content',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the form element this label is for',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Form label element. Etiqueta de campo a 12px/400 en muted-foreground (jerarquía tipográfica propia — diverge a propósito del preset). Always pair with inputs for accessibility.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const Required: Story = {
  render: () => (
    <Label>
      Email <span className="text-destructive">*</span>
    </Label>
  ),
};

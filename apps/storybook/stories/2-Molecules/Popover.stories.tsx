import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Field, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Popover> = {
  title: '2-Molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    modal: {
      control: 'boolean',
      description: 'If true, interaction outside popover is blocked',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled)',
    },
    open: {
      control: 'boolean',
      description: 'Open state (controlled)',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Callback when open state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Floating panel for forms/filters. Use PopoverTrigger and PopoverContent.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Editar contacto</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Datos del contacto</h4>
          <Field>
            <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
            <Input id="nombre" defaultValue="María García" />
          </Field>
          <Field>
            <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
            <Input id="telefono" defaultValue="+34 612 345 678" />
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

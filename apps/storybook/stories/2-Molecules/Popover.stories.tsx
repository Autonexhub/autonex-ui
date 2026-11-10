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
      description: 'Si es true, se bloquea la interacción fuera del popover',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Estado abierto inicial (no controlado)',
    },
    open: {
      control: 'boolean',
      description: 'Estado abierto (controlado)',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Se llama cuando cambia el estado abierto',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Panel flotante para formularios cortos y filtros. Se compone con PopoverTrigger y PopoverContent.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  name: 'Por defecto',
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
            <Input id="nombre" defaultValue="María García" placeholder="Ej: María García" />
          </Field>
          <Field>
            <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
            <Input id="telefono" defaultValue="+34 612 345 678" placeholder="612 345 678" />
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

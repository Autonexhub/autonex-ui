import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
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

/** Cabecera con `PopoverHeader`, `PopoverTitle` y `PopoverDescription`; el panel se ancla con `PopoverAnchor`
 *  a un elemento distinto del botón (aquí, el campo entero). */
export const ConCabeceraYAncla: Story = {
  name: 'Cabecera y ancla',
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className="flex w-80 items-center gap-2 rounded-lg border border-border p-2">
          <Input defaultValue="Menéndez Pelayo" aria-label="Centro" />
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">Ayuda</Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-72" align="start">
        <PopoverHeader>
          <PopoverTitle>Centro de atención</PopoverTitle>
          <PopoverDescription>El centro decide los horarios y el número de teléfono que usa el agente al responder.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

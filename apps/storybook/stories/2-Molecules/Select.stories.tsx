import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@autonexhub/react';
import { Field, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Select> = {
  title: '2-Molecules/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Initial selected value (uncontrolled)',
    },
    value: {
      control: 'text',
      description: 'Selected value (controlled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    required: {
      control: 'boolean',
      description: 'Mark as required for forms',
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Callback when selection changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown select. Use SelectTrigger, SelectValue, SelectContent, and SelectItem. SelectTrigger accepts size="sm" | "default" (h-8 / h-9). Fondo bg-muted, check de selección a la derecha (Phosphor).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Selecciona estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="completada">Completada</SelectItem>
        <SelectItem value="en-curso">En curso</SelectItem>
        <SelectItem value="fallida">Fallida</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Field className="w-64">
      <FieldLabel>Organización</FieldLabel>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona organización" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="org1">Hemomadrid</SelectItem>
          <SelectItem value="org2">Spawell</SelectItem>
          <SelectItem value="org3">Autonex Hub</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Select defaultValue="a">
        <SelectTrigger size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Small (h-8)</SelectItem>
          <SelectItem value="b">Otra opción</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="a">
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Default (h-9)</SelectItem>
          <SelectItem value="b">Otra opción</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Seleccionar canal" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Voz</SelectLabel>
          <SelectItem value="phone">Teléfono</SelectItem>
          <SelectItem value="web-call">Llamada web</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Texto</SelectLabel>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Deshabilitado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Opción</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DateRangeSelect: Story = {
  name: 'Date Range Select (exception to FilterPopover)',
  render: () => (
    <Select defaultValue="7d">
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="24h">Últimas 24h</SelectItem>
        <SelectItem value="7d">Últimos 7 días</SelectItem>
        <SelectItem value="30d">Últimos 30 días</SelectItem>
        <SelectItem value="90d">Últimos 90 días</SelectItem>
      </SelectContent>
    </Select>
  ),
};

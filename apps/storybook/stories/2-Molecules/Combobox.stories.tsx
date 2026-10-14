import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox, ComboboxTrigger, type ComboboxOption } from '@autonexhub/react';
import { User, Buildings, Phone } from '@phosphor-icons/react';

const meta: Meta<typeof Combobox> = {
  title: '2-Molecules/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
      description: 'Popover alignment',
      table: { defaultValue: { summary: 'start' } },
    },
    width: {
      control: 'number',
      description: 'Popover width in pixels',
      table: { defaultValue: { summary: '240' } },
    },
    searchThreshold: {
      control: 'number',
      description: 'Show search when options exceed this count',
      table: { defaultValue: { summary: '7' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Searchable select/combobox. Use for selecting from many options.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const asistentes: ComboboxOption[] = [
  { value: 'marta', label: 'Marta' },
  { value: 'maria', label: 'María' },
  { value: 'carla', label: 'Carla' },
  { value: 'lucia', label: 'Lucía' },
  { value: 'paula', label: 'Paula' },
];

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    const selected = asistentes.find((a) => a.value === value);

    return (
      <Combobox
        options={asistentes}
        value={value}
        onChange={setValue}
        placeholder="Buscar asistente..."
        emptyText="No se encontró ningún asistente."
        trigger={
          <ComboboxTrigger className="w-[200px]">
            {selected?.label ?? 'Seleccionar asistente'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const contacts: ComboboxOption[] = [
  { value: '1', label: 'María García', sublabel: '+34 612 345 678', icon: <User className="h-4 w-4" /> },
  { value: '2', label: 'Juan Pérez', sublabel: '+34 623 456 789', icon: <User className="h-4 w-4" /> },
  { value: '3', label: 'Ana López', sublabel: '+34 634 567 890', icon: <User className="h-4 w-4" /> },
  { value: '4', label: 'Carlos Ruiz', sublabel: '+34 645 678 901', icon: <User className="h-4 w-4" /> },
  { value: '5', label: 'Elena Martín', sublabel: '+34 656 789 012', icon: <User className="h-4 w-4" /> },
  { value: '6', label: 'Pedro Sánchez', sublabel: '+34 667 890 123', icon: <User className="h-4 w-4" /> },
  { value: '7', label: 'Laura Fernández', sublabel: '+34 678 901 234', icon: <User className="h-4 w-4" /> },
  { value: '8', label: 'Miguel Torres', sublabel: '+34 689 012 345', icon: <User className="h-4 w-4" /> },
];

export const WithIcons: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    const selected = contacts.find((c) => c.value === value);

    return (
      <Combobox
        options={contacts}
        value={value}
        onChange={setValue}
        placeholder="Buscar contacto..."
        emptyText="No se encontró ningún contacto."
        width={280}
        trigger={
          <ComboboxTrigger className="w-[280px]">
            {selected ? (
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                {selected.label}
              </span>
            ) : (
              'Seleccionar contacto'
            )}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const organizations: ComboboxOption[] = [
  { value: 'hemomadrid', label: 'Hemomadrid', sublabel: 'Clínica de hematología', icon: <Buildings className="h-4 w-4" /> },
  { value: 'spawell', label: 'Spawell', sublabel: 'Centro de bienestar', icon: <Buildings className="h-4 w-4" /> },
  { value: 'clinica-dental', label: 'Clínica Dental Plus', sublabel: 'Odontología general', icon: <Buildings className="h-4 w-4" /> },
];

export const WithSublabels: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    const selected = organizations.find((o) => o.value === value);

    return (
      <Combobox
        options={organizations}
        value={value}
        onChange={setValue}
        placeholder="Buscar organización..."
        emptyText="No se encontró ninguna organización."
        width={300}
        searchThreshold={3}
        trigger={
          <ComboboxTrigger className="w-[300px]">
            {selected?.label ?? 'Seleccionar organización'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const fewOptions: ComboboxOption[] = [
  { value: 'voz', label: 'Voz', icon: <Phone className="h-4 w-4" /> },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
];

export const NoSearch: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    const selected = fewOptions.find((o) => o.value === value);

    return (
      <Combobox
        options={fewOptions}
        value={value}
        onChange={setValue}
        searchThreshold={10}
        trigger={
          <ComboboxTrigger className="w-[200px]">
            {selected?.label ?? 'Seleccionar canal'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

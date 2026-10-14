import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox, Button } from '@autonexhub/react';
import { User, Buildings, Phone, CaretUpDown } from '@phosphor-icons/react';

interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

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

const assistants: ComboboxOption[] = [
  { value: 'marta', label: 'Marta' },
  { value: 'maria', label: 'Maria' },
  { value: 'carla', label: 'Carla' },
  { value: 'lucia', label: 'Lucia' },
  { value: 'paula', label: 'Paula' },
];

const ComboboxTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="outline" className={className} {...props}>
      <span className="truncate">{children}</span>
      <CaretUpDown className="size-4 shrink-0 text-muted-foreground" />
    </Button>
  ),
);
ComboboxTrigger.displayName = 'ComboboxTrigger';

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    const selected = assistants.find((a) => a.value === value);

    return (
      <Combobox
        options={assistants}
        value={value}
        onChange={setValue}
        placeholder="Search assistant..."
        emptyText="No assistant found."
        trigger={
          <ComboboxTrigger className="w-[200px]">
            {selected?.label ?? 'Select assistant'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const contacts: ComboboxOption[] = [
  { value: '1', label: 'Maria Garcia', sublabel: '+34 612 345 678', icon: <User className="h-4 w-4" /> },
  { value: '2', label: 'John Peters', sublabel: '+34 623 456 789', icon: <User className="h-4 w-4" /> },
  { value: '3', label: 'Anna Lopez', sublabel: '+34 634 567 890', icon: <User className="h-4 w-4" /> },
  { value: '4', label: 'Carlos Ruiz', sublabel: '+34 645 678 901', icon: <User className="h-4 w-4" /> },
  { value: '5', label: 'Elena Martin', sublabel: '+34 656 789 012', icon: <User className="h-4 w-4" /> },
  { value: '6', label: 'Peter Sanchez', sublabel: '+34 667 890 123', icon: <User className="h-4 w-4" /> },
  { value: '7', label: 'Laura Fernandez', sublabel: '+34 678 901 234', icon: <User className="h-4 w-4" /> },
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
        placeholder="Search contact..."
        emptyText="No contact found."
        width={280}
        trigger={
          <ComboboxTrigger className="w-[280px]">
            {selected ? (
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                {selected.label}
              </span>
            ) : (
              'Select contact'
            )}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const organizations: ComboboxOption[] = [
  { value: 'hemomadrid', label: 'Hemomadrid', sublabel: 'Hematology clinic', icon: <Buildings className="h-4 w-4" /> },
  { value: 'spawell', label: 'Spawell', sublabel: 'Wellness center', icon: <Buildings className="h-4 w-4" /> },
  { value: 'dental-clinic', label: 'Dental Clinic Plus', sublabel: 'General dentistry', icon: <Buildings className="h-4 w-4" /> },
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
        placeholder="Search organization..."
        emptyText="No organization found."
        width={300}
        searchThreshold={3}
        trigger={
          <ComboboxTrigger className="w-[300px]">
            {selected?.label ?? 'Select organization'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

const fewOptions: ComboboxOption[] = [
  { value: 'voice', label: 'Voice', icon: <Phone className="h-4 w-4" /> },
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
            {selected?.label ?? 'Select channel'}
          </ComboboxTrigger>
        }
      />
    );
  },
};

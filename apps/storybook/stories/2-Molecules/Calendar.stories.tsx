import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Calendar } from '@autonexhub/react';

const meta: Meta<typeof Calendar> = {
  title: '2-Molecules/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Modo de selección',
      table: { defaultValue: { summary: 'single' } },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Muestra los días de los meses contiguos',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desactiva el calendario',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Calendario para elegir fechas. Dentro de un Popover forma el patrón DatePicker.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  name: 'Una fecha',
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    );
  },
};

export const Range: Story = {
  name: 'Rango',
  render: function Render() {
    const [range, setRange] = React.useState<{ from: Date; to?: Date } | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange as any}
        className="rounded-lg border"
        numberOfMonths={2}
      />
    );
  },
};

export const Multiple: Story = {
  name: 'Varias fechas',
  render: function Render() {
    const [dates, setDates] = React.useState<Date[] | undefined>([new Date()]);
    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-lg border"
      />
    );
  },
};

export const Disabled: Story = {
  name: 'Desactivado',
  render: () => (
    <Calendar
      mode="single"
      disabled
      className="rounded-lg border"
    />
  ),
};

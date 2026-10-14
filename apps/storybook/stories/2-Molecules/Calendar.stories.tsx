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
      description: 'Selection mode',
      table: { defaultValue: { summary: 'single' } },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from adjacent months',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the calendar',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Date selection calendar. Use inside Popover for DatePicker pattern.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
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
  render: () => (
    <Calendar
      mode="single"
      disabled
      className="rounded-lg border"
    />
  ),
};

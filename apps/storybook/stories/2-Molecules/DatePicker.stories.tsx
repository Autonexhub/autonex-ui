import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DatePicker } from '@autonexhub/react';

const meta: Meta<typeof DatePicker> = {
  title: '2-Molecules/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date selected',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button when date is selected',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Popover alignment',
    },
    size: {
      control: 'select',
      options: ['inline', 'field'],
      description: 'Size variant: inline for rows, field for forms',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Click-to-open date picker that returns ISO "YYYY-MM-DD" strings.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<string | null>(null);
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
    );
  },
};

export const WithValue: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<string | null>('2024-03-15');
    return (
      <DatePicker
        value={date}
        onChange={setDate}
      />
    );
  },
};

export const Clearable: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<string | null>('2024-03-15');
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        clearable
      />
    );
  },
};

export const FieldSize: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<string | null>(null);
    return (
      <div className="w-64">
        <DatePicker
          value={date}
          onChange={setDate}
          size="field"
          placeholder="Select date"
        />
      </div>
    );
  },
};

export const WithMinMax: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return (
      <DatePicker
        value={date}
        onChange={setDate}
        min={today}
        max={nextMonth}
        placeholder="Pick a date (next 30 days)"
      />
    );
  },
};

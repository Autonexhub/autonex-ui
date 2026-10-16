import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateRangeFilter } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { DateRange } from 'react-day-picker';
import { subDays, startOfMonth, startOfDay } from 'date-fns';

const meta: Meta<typeof DateRangeFilter> = {
  title: '2-Molecules/DateRangeFilter',
  component: DateRangeFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Date range picker with presets and custom operators.

## Features
- Preset ranges: Current month, Last 7 days, Last 30 days, Last 12 months, Current year
- Custom range with operators: between, on, before, after
- Minimum date constraint support
- Extra presets injection (for org-specific ranges)
- Controlled and uncontrolled modes

## Usage
\`\`\`tsx
// Uncontrolled (manages its own state)
<DateRangeFilter />

// Controlled
const [date, setDate] = useState<DateRange>();
<DateRangeFilter date={date} onDateChange={setDate} />

// With minimum date constraint
<DateRangeFilter minDate={new Date('2026-01-01')} />

// With extra presets
<DateRangeFilter
  extraPresets={[
    {
      label: 'Ciclo de corte',
      getValue: () => ({ from: new Date('2026-08-01'), to: new Date('2026-08-31') })
    }
  ]}
/>
\`\`\`

## Props
- **date**: Controlled date range value
- **onDateChange**: Callback when date changes
- **minDate**: Minimum selectable date (dates before are disabled)
- **extraPresets**: Org-specific presets to prepend to the list

## Operators
- **between**: Select start and end dates (range mode)
- **on**: Select a single date (point in time)
- **before**: All dates up to selected date
- **after**: All dates from selected date to today
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeFilter>;

export const Default: Story = {
  render: () => <DateRangeFilter />,
  parameters: {
    docs: {
      description: {
        story: 'Uncontrolled mode with default state (current month).',
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledDateRange() {
    const [date, setDate] = useState<DateRange | undefined>({
      from: subDays(new Date(), 6),
      to: new Date(),
    });

    return (
      <div className="space-y-4">
        <DateRangeFilter date={date} onDateChange={setDate} />
        <div className="text-sm text-muted-foreground">
          <strong>Seleccionado:</strong>{' '}
          {date?.from?.toLocaleDateString('es-ES')} - {date?.to?.toLocaleDateString('es-ES')}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode with external state management.',
      },
    },
  },
};

export const WithMinDate: Story = {
  render: function WithMinDateExample() {
    const minDate = startOfDay(subDays(new Date(), 30));

    return (
      <div className="space-y-2">
        <DateRangeFilter minDate={minDate} />
        <p className="text-xs text-muted-foreground">
          Las fechas anteriores al {minDate.toLocaleDateString('es-ES')} están deshabilitadas
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'With minimum date constraint - dates before the minDate are disabled.',
      },
    },
  },
};

export const WithExtraPresets: Story = {
  render: () => (
    <DateRangeFilter
      extraPresets={[
        {
          label: 'Ciclo de facturación',
          getValue: () => ({
            from: new Date('2026-08-01'),
            to: new Date('2026-08-31'),
          }),
        },
        {
          label: 'Último trimestre',
          getValue: () => ({
            from: new Date('2026-04-01'),
            to: new Date('2026-06-30'),
          }),
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'With organization-specific presets prepended to the list.',
      },
    },
  },
};

export const EmptyInitial: Story = {
  render: function EmptyInitialExample() {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    return (
      <div className="space-y-4">
        <DateRangeFilter date={date} onDateChange={setDate} />
        <div className="text-sm text-muted-foreground">
          <strong>Estado:</strong> {date ? 'Fecha seleccionada' : 'Sin fecha seleccionada'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode starting with no date selected.',
      },
    },
  },
};

export const InFilterBar: Story = {
  render: function FilterBarExample() {
    const [date, setDate] = useState<DateRange | undefined>({
      from: startOfMonth(new Date()),
      to: new Date(),
    });

    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
        <span className="text-sm font-medium">Filtros:</span>
        <DateRangeFilter date={date} onDateChange={setDate} />
        <Button variant="ghost" size="sm">
          Limpiar filtros
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'DateRangeFilter used inside a typical filter bar context.',
      },
    },
  },
};

export const PresetLabels: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">Presets disponibles (haz clic para verlos):</p>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• Mes actual</li>
        <li>• Últimos 7 días</li>
        <li>• Últimos 30 días</li>
        <li>• Últimos 12 meses</li>
        <li>• Año actual</li>
        <li className="italic">+ Custom range with operators</li>
      </ul>
      <div className="pt-2">
        <DateRangeFilter />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the available preset labels.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MarginTable, MarginFilters, type MarginFilter } from '@autonexhub/react';
import { mockOrganizations, mockSummary } from './marginsFixtures';

const meta: Meta<typeof MarginTable> = {
  title: '3-Organisms/Margins/MarginTable',
  component: MarginTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tabla de márgenes completa con columnas ordenables, búsqueda y filas desplegables.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarginTable>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    organizations: mockOrganizations,
  },
};

export const WithFilters: Story = {
  name: 'Con filtros',
  render: function Render() {
    const [filter, setFilter] = useState<MarginFilter>('all');
    return (
      <div className="space-y-4">
        <MarginFilters value={filter} onChange={setFilter} counts={mockSummary.counts} />
        <MarginTable organizations={mockOrganizations} filter={filter} />
      </div>
    );
  },
};

export const CriticalOnly: Story = {
  name: 'Solo críticas',
  args: {
    organizations: mockOrganizations,
    filter: 'critical',
  },
};

export const Empty: Story = {
  name: 'Vacía',
  args: {
    organizations: [],
  },
};

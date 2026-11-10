import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MarginFilters, type MarginFilter } from '@autonexhub/react';

const meta: Meta<typeof MarginFilters> = {
  title: '2-Molecules/MarginFilters',
  component: MarginFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Chips de filtro rápido por estado del margen, con el recuento de cada categoría.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarginFilters>;

const counts = { critical: 2, warning: 3, healthy: 7, total: 12 };

export const Default: Story = {
  name: 'Por defecto',
  render: function Render() {
    const [filter, setFilter] = useState<MarginFilter>('all');
    return <MarginFilters value={filter} onChange={setFilter} counts={counts} />;
  },
};

export const CriticalSelected: Story = {
  name: 'Crítico seleccionado',
  render: function Render() {
    const [filter, setFilter] = useState<MarginFilter>('critical');
    return <MarginFilters value={filter} onChange={setFilter} counts={counts} />;
  },
};

export const WarningSelected: Story = {
  name: 'Ajustado seleccionado',
  render: function Render() {
    const [filter, setFilter] = useState<MarginFilter>('warning');
    return <MarginFilters value={filter} onChange={setFilter} counts={counts} />;
  },
};

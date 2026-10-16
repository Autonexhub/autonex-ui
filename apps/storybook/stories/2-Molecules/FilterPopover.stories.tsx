import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterPopover, ActiveFilters } from '@autonexhub/react';

const meta: Meta<typeof FilterPopover> = {
  title: '2-Molecules/FilterPopover',
  component: FilterPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Filtro multi-selección oficial. Se combina con `ActiveFilters` para mostrar lo filtrado en píldoras.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPopover>;

const OPTIONS = [
  { id: 'madrid', label: 'Madrid', count: 12 },
  { id: 'barcelona', label: 'Barcelona', count: 8 },
  { id: 'valencia', label: 'Valencia', count: 3 },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['madrid']);
    return (
      <div className="space-y-4">
        <FilterPopover label="Centro" options={OPTIONS} selected={selected} onChange={setSelected} />
        <ActiveFilters
          filters={selected.map((id) => ({ id, label: OPTIONS.find((o) => o.id === id)?.label ?? id }))}
          onRemove={(id) => setSelected(selected.filter((s) => s !== id))}
          onClearAll={() => setSelected([])}
        />
      </div>
    );
  },
};

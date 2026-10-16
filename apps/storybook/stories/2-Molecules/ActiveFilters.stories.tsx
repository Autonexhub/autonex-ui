import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ActiveFilters, type ActiveFilter } from '@autonexhub/react';

const meta: Meta<typeof ActiveFilters> = {
  title: '2-Molecules/ActiveFilters',
  component: ActiveFilters,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lo que hay filtrado ahora mismo, en píldoras con su aspa, justo debajo de la barra de filtros. ' +
          'Un filtro de varios valores ("Centro: 2") no dice por qué falta media lista; aquí cada valor se lee de un vistazo y se quita de uno en uno. ' +
          'No pinta nada si no hay filtros. Es el acompañante de `FilterBar` y de `FilterPopover`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ActiveFilters>;

const inicial: ActiveFilter[] = [
  { id: 'location:1', label: 'Centro: Serrano' },
  { id: 'location:2', label: 'Centro: Retiro' },
  { id: 'status:draft', label: 'Estado: En borrador' },
];

function Interactivo({ vacio = false }: { vacio?: boolean }) {
  const [filters, setFilters] = useState<ActiveFilter[]>(vacio ? [] : inicial);
  return (
    <ActiveFilters
      filters={filters}
      onRemove={(id) => setFilters((f) => f.filter((x) => x.id !== id))}
      onClearAll={() => setFilters([])}
    />
  );
}

export const Default: Story = { render: () => <Interactivo /> };

export const SinFiltros: Story = {
  render: () => <Interactivo vacio />,
  parameters: { docs: { description: { story: 'Sin filtros no se pinta nada, ni siquiera "Limpiar todo".' } } },
};

export const TextoDeLimpiarPropio: Story = {
  args: {
    filters: [{ id: 'q', label: 'Búsqueda: "natación"' }],
    onRemove: () => {},
    onClearAll: () => {},
    clearAllLabel: 'Quitar filtros',
  },
};

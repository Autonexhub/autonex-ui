import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveList, type ResponsiveListColumn, EmptyState } from '@autonexhub/react';

interface Row {
  id: number;
  name: string;
  email: string;
  plan: string;
}

const ROWS: Row[] = [
  { id: 1, name: 'Clínica Sol', email: 'hola@clinicasol.es', plan: 'Pro' },
  { id: 2, name: 'Gimnasio Norte', email: 'info@gimnorte.es', plan: 'Básico' },
  { id: 3, name: 'Taller Mecánico Ruiz', email: 'taller@ruiz.es', plan: 'Pro' },
];

const COLUMNS: ResponsiveListColumn<Row>[] = [
  { key: 'name', header: 'Nombre', cell: (r) => <span className="font-medium">{r.name}</span> },
  { key: 'email', header: 'Email', cell: (r) => r.email },
  { key: 'plan', header: 'Plan', cell: (r) => r.plan, align: 'right' },
];

const meta: Meta<typeof ResponsiveList<Row, number>> = {
  title: '2-Molecules/ResponsiveList',
  component: ResponsiveList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabla con el marco de la casa desde `md`; lista de tarjetas por debajo, sin scroll horizontal de página. Cargando, vacío y con datos comparten marco y cabecera para que nada salte.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveList<Row, number>>;

const base = {
  columns: COLUMNS,
  getKey: (r: Row) => r.id,
  getRowLabel: (r: Row) => r.name,
  renderCard: (r: Row) => (
    <div>
      <p className="font-medium">{r.name}</p>
      <p className="text-sm text-muted-foreground">{r.email}</p>
    </div>
  ),
};

export const Default: Story = { args: { ...base, items: ROWS } };

export const Loading: Story = { args: { ...base, items: [], loading: true } };

export const Empty: Story = {
  args: { ...base, items: [], empty: <EmptyState title="Sin resultados" description="Prueba con otros filtros" /> },
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<number>>(new Set([2]));
    return <ResponsiveList {...base} items={ROWS} selection={{ selected, onChange: setSelected }} />;
  },
};

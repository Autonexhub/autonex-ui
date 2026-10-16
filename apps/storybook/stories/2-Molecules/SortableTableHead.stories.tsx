import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SortableTableHead, type SortState } from '@autonexhub/react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@autonexhub/react';

const meta: Meta<typeof SortableTableHead> = {
  title: '2-Molecules/SortableTableHead',
  component: SortableTableHead,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cabecera de tabla ordenable — UN solo componente para todo el CRM (extraído de los 5 SortHead duplicados en la Ola 2). El affordance de orden es la flecha: la cabecera NO se re-estila (sin hover de fondo, regla Table Headers). Sin orden activo muestra ChevronsUpDown al 40%; activo, flecha asc/desc con texto en foreground.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortableTableHead>;

const DATA = [
  { name: 'Laura Vidal', deals: 4, updated: 'hace 2 h' },
  { name: 'Marc Soler', deals: 2, updated: 'ayer' },
  { name: 'Anna Puig', deals: 7, updated: 'hace 3 días' },
];

function DemoTable() {
  const [sort, setSort] = useState<SortState<'name' | 'deals' | 'updated'> | null>({ key: 'name', dir: 'asc' });
    const toggle = (k: 'name' | 'deals' | 'updated') =>
      setSort((s) => (s?.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }));
    const rows = [...DATA].sort((a, b) => {
      if (!sort) return 0;
      const va = a[sort.key], vb = b[sort.key];
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-elev">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead k="name" sort={sort} onToggle={toggle}>Nombre</SortableTableHead>
              <SortableTableHead k="deals" sort={sort} onToggle={toggle}>Negocios</SortableTableHead>
              <SortableTableHead k="updated" sort={sort} onToggle={toggle}>Actualizado</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="tabular-nums">{r.deals}</TableCell>
                <TableCell className="text-muted-foreground">{r.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
}

export const Default: Story = {
  name: 'En una tabla (interactivo)',
  render: () => <DemoTable />,
};

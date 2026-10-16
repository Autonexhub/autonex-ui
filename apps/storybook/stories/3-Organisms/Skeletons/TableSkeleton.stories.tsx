import type { Meta, StoryObj } from '@storybook/react';
import { TableSkeleton, TableRowSkeleton } from '@autonexhub/react';
import { Table, TableBody } from '@autonexhub/react';

const meta: Meta<typeof TableSkeleton> = {
  title: '3-Organisms/Skeletons/TableSkeleton',
  component: TableSkeleton,
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of skeleton rows to display',
      table: {
        defaultValue: { summary: '6' },
      },
    },
    columns: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of columns per row',
      table: {
        defaultValue: { summary: '5' },
      },
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Full table skeleton with header + rows. Use when loading table-based content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableSkeleton>;

/**
 * Modo canónico (decisión Bruno 01/09): los TÍTULOS de columna son estructura,
 * no datos — se pintan reales y solo las filas hacen shimmer. `template` calca
 * los anchos reales de la tabla y `checkboxColumn` reserva la columna de
 * selección para que nada salte al llegar los datos.
 */
export const ConTitulosReales: Story = {
  name: 'Canónico: títulos reales + filas shimmer',
  render: () => (
    <div className="overflow-hidden rounded-xl border bg-card">
      <TableSkeleton
        rows={5}
        checkboxColumn
        headers={['Conversación', 'Canal', 'Estado', 'Mensajes', 'Hora', 'Acciones']}
        template="minmax(0,1fr) 8rem 8rem 6rem 8rem 11.5rem"
        aligns={['left', 'center', 'center', 'center', 'center', 'right']}
      />
    </div>
  ),
};

export const Default: Story = {
  name: 'Genérico (sin títulos conocidos)',
  args: {
    rows: 6,
    columns: 5,
  },
};

export const FewRows: Story = {
  args: {
    rows: 3,
    columns: 4,
  },
};

export const RowsOnly: Story = {
  name: 'TableRowSkeleton (rows only)',
  render: () => (
    <div className="border rounded-lg">
      {/* TableRowSkeleton emite <tr>: siempre dentro de una Table real */}
      <Table>
        <TableBody>
          <TableRowSkeleton rows={4} columns={5} />
        </TableBody>
      </Table>
    </div>
  ),
};

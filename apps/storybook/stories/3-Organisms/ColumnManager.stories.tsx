import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColumnManager, useColumnManager, type ColumnDefinition } from '@autonexhub/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';

const meta: Meta = {
  title: '3-Organisms/ColumnManager',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Drag-and-drop column manager for controlling table column visibility and order.

## Features
- **Visibility toggles**: Show/hide columns via checkboxes
- **Drag-and-drop reordering**: Reorder columns by dragging the handle
- **Required columns**: Some columns cannot be hidden (\`required: true\`)
- **LocalStorage persistence**: Column state persists across sessions via \`useColumnManager\` hook

## Usage
\`\`\`tsx
import { ColumnManager, useColumnManager, type ColumnDefinition } from '@autonexhub/react';

const columns: ColumnDefinition[] = [
  { id: 'nombre', label: 'Nombre', width: '200px', required: true },
  { id: 'email', label: 'Email', width: '200px' },
  { id: 'estado', label: 'Estado', width: '100px' },
];

function MyTable() {
  const {
    visibleColumns,
    columnOrder,
    handleVisibilityChange,
    handleOrderChange,
    getVisibleOrderedColumns,
  } = useColumnManager('my-table', columns);

  return (
    <>
      <ColumnManager
        columns={columns}
        visibleColumns={visibleColumns}
        columnOrder={columnOrder}
        onVisibilityChange={handleVisibilityChange}
        onOrderChange={handleOrderChange}
      />
      <Table>
        {getVisibleOrderedColumns().map(col => (
          <TableHead key={col.id}>{col.label}</TableHead>
        ))}
      </Table>
    </>
  );
}
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample columns
const sampleColumns: ColumnDefinition[] = [
  { id: 'nombre', label: 'Nombre', width: '200px', required: true },
  { id: 'email', label: 'Email', width: '200px' },
  { id: 'telefono', label: 'Teléfono', width: '150px' },
  { id: 'empresa', label: 'Empresa', width: '150px' },
  { id: 'estado', label: 'Estado', width: '100px' },
  { id: 'creado', label: 'Fecha creación', width: '120px' },
];

// Sample data
const sampleData = [
  { id: 1, nombre: 'María López', email: 'maria@ejemplo.com', telefono: '+34 612 345 678', empresa: 'Acme Corp', estado: 'Activo', creado: '15/08/2026' },
  { id: 2, nombre: 'Carlos Ruiz', email: 'carlos@ejemplo.com', telefono: '+34 623 456 789', empresa: 'Tech Inc', estado: 'Inactivo', creado: '10/08/2026' },
  { id: 3, nombre: 'Ana Martínez', email: 'ana@ejemplo.com', telefono: '+34 634 567 890', empresa: 'Global SA', estado: 'Activo', creado: '05/08/2026' },
];

function ColumnManagerExample() {
  const {
    visibleColumns,
    columnOrder,
    handleVisibilityChange,
    handleOrderChange,
    getVisibleOrderedColumns,
  } = useColumnManager('storybook-column-manager', sampleColumns);

  const visibleCols = getVisibleOrderedColumns();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Click the "Columnas" button to show/hide and reorder columns.
          Drag the handle to reorder.
        </p>
        <ColumnManager
          columns={sampleColumns}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          onVisibilityChange={handleVisibilityChange}
          onOrderChange={handleOrderChange}
        />
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleCols.map((col) => (
                <TableHead key={col.id} style={{ width: col.width }}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                {visibleCols.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === 'nombre' && <span className="font-medium text-foreground">{row.nombre}</span>}
                    {col.id === 'email' && <span className="text-muted-foreground">{row.email}</span>}
                    {col.id === 'telefono' && <span className="text-foreground tabular-nums">{row.telefono}</span>}
                    {col.id === 'empresa' && <span className="text-muted-foreground">{row.empresa}</span>}
                    {col.id === 'estado' && (
                      <Badge variant={row.estado === 'Activo' ? 'success' : 'secondary'}>
                        {row.estado}
                      </Badge>
                    )}
                    {col.id === 'creado' && <span className="text-muted-foreground">{row.creado}</span>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Visible columns:</strong> {visibleColumns.join(', ')}</p>
        <p><strong>Column order:</strong> {columnOrder.join(', ')}</p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ColumnManagerExample />,
};

// Controlled example without hook
function ControlledExample() {
  const [visibleColumns, setVisibleColumns] = useState(['nombre', 'email', 'estado']);
  const [columnOrder, setColumnOrder] = useState(sampleColumns.map(c => c.id));

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev =>
      visible ? [...prev, columnId] : prev.filter(id => id !== columnId)
    );
  };

  const handleOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder);
  };

  // Get ordered visible columns
  const visibleCols = columnOrder
    .filter(id => visibleColumns.includes(id))
    .map(id => sampleColumns.find(c => c.id === id)!)
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          This example shows only 3 columns by default.
        </p>
        <ColumnManager
          columns={sampleColumns}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          onVisibilityChange={handleVisibilityChange}
          onOrderChange={handleOrderChange}
        />
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleCols.map((col) => (
                <TableHead key={col.id}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                {visibleCols.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === 'nombre' && <span className="font-medium text-foreground">{row.nombre}</span>}
                    {col.id === 'email' && <span className="text-muted-foreground">{row.email}</span>}
                    {col.id === 'estado' && (
                      <Badge variant={row.estado === 'Activo' ? 'success' : 'secondary'}>
                        {row.estado}
                      </Badge>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const ControlledState: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story: 'Using controlled state without the useColumnManager hook. Shows only 3 columns by default.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Tabs, TabsList, TabsTrigger } from '@autonexhub/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@autonexhub/react';
import { Checkbox } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';
import { ColumnManager, useColumnManager, type ColumnDefinition } from '@autonexhub/react';
import { ChannelBadge, type ChannelType } from '@autonexhub/react';
import { ScoreBadge } from '@autonexhub/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@autonexhub/react';
import { MagnifyingGlass, Funnel, Star, Archive, EyeSlash } from '@phosphor-icons/react';
import { AppShellFrame } from './AppShellFrame';

// Sample data matching saas-design-system conversations page
const sampleData = [
  { id: 1, nombre: 'María López', canal: 'Teléfono', estado: 'Completada', mensajes: 12, hora: '14:32', rap: 85 },
  { id: 2, nombre: 'Carlos Ruiz', canal: 'WhatsApp', estado: 'En curso', mensajes: 8, hora: '13:45', rap: 72 },
  { id: 3, nombre: 'Ana Martínez', canal: 'Web', estado: 'Pendiente', mensajes: 3, hora: '12:15', rap: 90 },
  { id: 4, nombre: 'Pedro García', canal: 'Instagram', estado: 'Completada', mensajes: 15, hora: '11:30', rap: 68 },
  { id: 5, nombre: 'Laura Sánchez', canal: 'Teléfono', estado: 'Completada', mensajes: 6, hora: '10:22', rap: 95 },
];

const defaultColumns: ColumnDefinition[] = [
  { id: 'nombre', label: 'Conversación', width: '200px', required: true },
  { id: 'canal', label: 'Canal', width: '120px' },
  { id: 'estado', label: 'Estado', width: '120px' },
  { id: 'mensajes', label: 'Mensajes', width: '100px' },
  { id: 'hora', label: 'Hora', width: '80px' },
  { id: 'rap', label: 'RAP Score', width: '100px' },
];

const CHANNEL_MAP: Record<string, ChannelType> = {
  'Teléfono': 'voice',
  'WhatsApp': 'whatsapp',
  'Web': 'web',
  'Instagram': 'instagram',
};

function ListPageExample() {
  const [channel, setChannel] = useState('todos');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const {
    visibleColumns,
    columnOrder,
    handleVisibilityChange,
    handleOrderChange,
    getVisibleOrderedColumns,
  } = useColumnManager('storybook-list', defaultColumns);

  const filteredData = channel === 'todos'
    ? sampleData
    : sampleData.filter(d => d.canal.toLowerCase() === channel);

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredData.map(d => d.id)));
    }
  };

  const visibleCols = getVisibleOrderedColumns();

  return (
    <div className="px-10 py-6 space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Conversaciones</h1>
        <p className="text-sm text-muted-foreground">Gestiona todas las conversaciones de tu organización</p>
      </div>

      {/* Pestañas: variant="line" (subrayado) */}
      <Tabs value={channel} onValueChange={setChannel}>
        <TabsList variant="line">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="teléfono">Teléfono</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Toolbar: cambia según haya selección o no */}
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        {selected.size > 0 ? (
          // Selection toolbar
          <>
            <span className="text-sm text-muted-foreground">
              {selected.size} seleccionados
            </span>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Deseleccionar
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" /> Favorito
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" /> Archivar
            </Button>
            <Button variant="ghost" size="sm">
              <EyeSlash className="h-4 w-4" /> Ocultar
            </Button>
          </>
        ) : (
          // Default toolbar
          <>
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversaciones..." className="pl-9" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Funnel className="h-4 w-4" /> Filtrar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="text-sm text-muted-foreground">Filtros disponibles...</div>
              </PopoverContent>
            </Popover>
            <ColumnManager
              columns={defaultColumns}
              visibleColumns={visibleColumns}
              columnOrder={columnOrder}
              onVisibilityChange={handleVisibilityChange}
              onOrderChange={handleOrderChange}
            />
          </>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.size === filteredData.length && filteredData.length > 0}
                  onCheckedChange={toggleAll}
                  className="border-border bg-background"
                />
              </TableHead>
              {visibleCols.map((col) => (
                <TableHead key={col.id} style={{ width: col.width }}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell>
                  <Checkbox
                    checked={selected.has(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                  />
                </TableCell>
                {visibleCols.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === 'nombre' && (
                      <span className="font-medium text-foreground">{row.nombre}</span>
                    )}
                    {col.id === 'canal' && <ChannelBadge channel={CHANNEL_MAP[row.canal]} />}
                    {col.id === 'estado' && (
                      <Badge variant={row.estado === 'Completada' ? 'success' : row.estado === 'En curso' ? 'secondary' : 'outline'}>
                        {row.estado}
                      </Badge>
                    )}
                    {col.id === 'mensajes' && (
                      <span className="text-foreground tabular-nums">{row.mensajes}</span>
                    )}
                    {col.id === 'hora' && <span className="text-muted-foreground">{row.hora}</span>}
                    {col.id === 'rap' && <ScoreBadge score={row.rap} scale={100} />}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Star className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: '4-Templates/ListPageTemplate',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Plantilla estándar de página de listado.

Se muestra DENTRO del chasis inset (decisión Bruno 03/09, ver 4-Templates/AppShell):
lienzo gris, sidebar sin borde y la página como tarjeta blanca con la cabecera dentro.

## Claves
- **Pestañas con \`variant="line"\`**: subrayado para filtrar por canal.
- **Estados de la toolbar**: normal (buscador, filtros, columnas) o selección (acciones en bloque).
- **ColumnManager**: reordenar columnas arrastrando y mostrar u ocultar cada una.
- **Tabla**: casillas de selección, hover y botones de acción.

## Patrón de uso
\`\`\`tsx
<Tabs value={channel} onValueChange={setChannel}>
  <TabsList variant="line">
    <TabsTrigger value="todos">Todos</TabsTrigger>
    ...
  </TabsList>
</Tabs>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Marco = chasis inset real (4-Templates/AppShell).
const inShell = (Story: React.ComponentType) => (
  <AppShellFrame page="Conversaciones">
    <Story />
  </AppShellFrame>
);

export const Default: Story = {
  name: 'Por defecto',
  render: () => <ListPageExample />,
  decorators: [inShell],
};

export const WithSelection: Story = {
  name: 'Con selección',
  render: () => <ListPageExample />,
  decorators: [inShell],
  parameters: {
    docs: {
      description: {
        story: 'Marca casillas para ver la toolbar de selección con acciones en bloque (Favorito, Archivar, Ocultar).',
      },
    },
  },
};

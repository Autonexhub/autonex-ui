import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { EditableNameTable } from '@autonexhub/react';
import { Folder, Tag } from '@phosphor-icons/react';

const meta: Meta = {
  title: '3-Organisms/EditableNameTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lista de cosas que solo tienen nombre (tarifas, familias…) con el patrón de los listados del panel, como Centros: tabla de solo lectura, se pulsa la fila para editarla en un diálogo, ' +
          'el botón "Nueva…" de la cabecera de la página abre el mismo diálogo vacío (`createOpen`) y la papelera pide confirmación. Mismo marco, esqueleto de filas y vacío con icono que el resto de listados. ' +
          'Es lo que pintan las pestañas Tarifas y Familias de Servicios.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

interface Tarifa { id: number; name: string; is_default: boolean }
interface Familia { id: number; name: string; service_count: number }

function Tarifas({ inicial, loading = false }: { inicial: Tarifa[]; loading?: boolean }) {
  const [items, setItems] = useState(inicial);
  const [creando, setCreando] = useState(false);
  return (
    <div className="space-y-3">
    <Button onClick={() => setCreando(true)}>Nueva tarifa</Button>
    <EditableNameTable
      noun="tarifa"
      createOpen={creando}
      onCreateOpenChange={setCreando}
      items={items}
      loading={loading}
      extraHeader="Uso"
      renderExtra={(x) =>
        x.is_default ? (
          <Badge variant="secondary" className="text-xs font-normal">Por defecto</Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setItems((p) => p.map((i) => ({ ...i, is_default: i.id === x.id })))}>
            Hacer por defecto
          </Button>
        )
      }
      canDelete={(x) => !x.is_default}
      deleteDisabledReason="La tarifa por defecto no se puede eliminar"
      deleteDescription={(x) => `Se eliminará «${x.name}».`}
      emptyIcon={<Tag className="h-8 w-8" />}
      emptyTitle="Todavía no hay tarifas"
      emptyDescription="Crea una para cobrar distinto según el tipo de cliente (ej: Abonado)."
      namePlaceholder="Ej: Abonado"
      onCreate={async (name) => setItems((p) => [...p, { id: Date.now(), name, is_default: p.length === 0 }])}
      onRename={async (x, name) => setItems((p) => p.map((i) => (i.id === x.id ? { ...i, name } : i)))}
      onDelete={async (x) => setItems((p) => p.filter((i) => i.id !== x.id))}
    />
    </div>
  );
}

function Familias({ inicial }: { inicial: Familia[] }) {
  const [items, setItems] = useState(inicial);
  const [creando, setCreando] = useState(false);
  return (
    <div className="space-y-3">
    <Button onClick={() => setCreando(true)}>Nueva familia</Button>
    <EditableNameTable
      noun="familia"
      createOpen={creando}
      onCreateOpenChange={setCreando}
      items={items}
      extraHeader="Servicios"
      renderExtra={(f) => <span className="text-sm tabular-nums text-muted-foreground">{f.service_count} servicios</span>}
      deleteDescription={(f) => `Se eliminará «${f.name}». Sus ${f.service_count} servicios no se borran: quedan sin familia.`}
      emptyIcon={<Folder className="h-8 w-8" />}
      emptyTitle="Todavía no hay familias"
      emptyDescription="Las familias agrupan los servicios en el catálogo, los precios y la matriz del equipo."
      namePlaceholder="Ej: Cursos de piscina"
      onCreate={async (name) => setItems((p) => [...p, { id: Date.now(), name, service_count: 0 }])}
      onRename={async (x, name) => setItems((p) => p.map((i) => (i.id === x.id ? { ...i, name } : i)))}
      onDelete={async (x) => setItems((p) => p.filter((i) => i.id !== x.id))}
    />
    </div>
  );
}

const tarifas: Tarifa[] = [
  { id: 1, name: 'Abonado', is_default: false },
  { id: 2, name: 'No abonado', is_default: false },
  { id: 3, name: 'General', is_default: true },
];

export const TarifasDePrecio: Story = { render: () => <Tarifas inicial={tarifas} /> };

export const FamiliasDeServicios: Story = {
  render: () => (
    <Familias
      inicial={[
        { id: 1, name: 'Cursos de piscina', service_count: 4 },
        { id: 2, name: 'Entrenamiento personal', service_count: 11 },
      ]}
    />
  ),
};

export const Vacio: Story = {
  name: 'Vacío',
  render: () => <Tarifas inicial={[]} />,
  parameters: { docs: { description: { story: 'Sin elementos: el vacío con icono del sistema y su botón para crear el primero.' } } },
};

export const Cargando: Story = {
  render: () => <Tarifas inicial={[]} loading />,
  parameters: { docs: { description: { story: 'Mientras carga se ve la tabla con su cabecera y filas esqueleto, como en el resto de listados.' } } },
};

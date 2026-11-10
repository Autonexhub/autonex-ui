import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LinearFilterBar, Button, type LinearFilterField, type LinearFilterValue } from '@autonexhub/react';
import { Circle, Tag, User } from '@phosphor-icons/react';

const meta: Meta<typeof LinearFilterBar> = {
  title: '3-Organisms/Linear/LinearFilterBar',
  component: LinearFilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barra de filtros ligera estilo Linear: botón "Filtrar" (punteado) que lista los campos aún sin usar, un chip por filtro activo (campo: valor, con aspa para quitarlo), "Limpiar" y un hueco `rightSlot`. ' +
          'Tipos de campo: `multi` (varias opciones), `single`, `toggle` (sin valor, "sí") y `date`. Las opciones pueden venir ya cargadas o de `loadOptions` (asíncrono). Controlada: `value` es un registro `clave → valor`. Textos en `labels`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LinearFilterBar>;

const fields: LinearFilterField[] = [
  {
    key: 'status',
    label: 'Estado',
    icon: Circle,
    type: 'multi',
    options: [
      { value: 'todo', label: 'Por hacer', color: 'var(--info)' },
      { value: 'doing', label: 'En curso', color: 'var(--warning)' },
      { value: 'done', label: 'Hecho', color: 'var(--success)' },
    ],
  },
  {
    key: 'assignee',
    label: 'Asignado',
    icon: User,
    type: 'single',
    loadOptions: () => new Promise((r) => setTimeout(() => r([{ value: '1', label: 'Juan García' }, { value: '2', label: 'María López' }]), 600)),
  },
  { key: 'labels', label: 'Etiquetas', icon: Tag, type: 'multi', options: [{ value: 'bug', label: 'Bug' }, { value: 'mejora', label: 'Mejora' }, { value: 'docs', label: 'Documentación' }] },
  { key: 'mine', label: 'Solo mis tareas', type: 'toggle' },
  { key: 'due', label: 'Vence', type: 'date' },
];

function Demo({ inicial = {}, withSlot = false }: { inicial?: LinearFilterValue; withSlot?: boolean }) {
  const [value, setValue] = useState<LinearFilterValue>(inicial);
  return (
    <div className="space-y-4">
      <LinearFilterBar
        fields={fields}
        value={value}
        onChange={setValue}
        rightSlot={withSlot ? <Button>Nueva tarea</Button> : undefined}
      />
      <pre className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

export const Default: Story = { name: 'Por defecto', render: () => <Demo /> };

export const ConFiltrosActivos: Story = {
  name: 'Con filtros activos',
  render: () => <Demo inicial={{ status: ['todo', 'doing', 'done'], mine: true, due: '2026-11-30' }} />,
};

export const ConAccionDerecha: Story = { name: 'Con acción a la derecha', render: () => <Demo withSlot /> };

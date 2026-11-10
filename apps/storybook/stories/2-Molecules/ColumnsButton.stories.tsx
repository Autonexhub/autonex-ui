import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, ColumnsButton, type ColumnDef } from '@autonexhub/react';

const meta: Meta<typeof ColumnsButton> = {
  title: '2-Molecules/ColumnsButton',
  component: ColumnsButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Botón "Columnas" estándar de las tablas: un popover con una casilla por columna. Controlado (`visible` + `onToggle`); el hook `useColumnPrefs(storageKey, defaults)` guarda la elección en localStorage sin bloquear nunca la UI. ' +
          'Admite `footer` para una acción secundaria, y `label`/`description` o `labels` para otros textos (p. ej. "Tarjetas" en un tablero).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ColumnsButton>;

const allCols: ColumnDef[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'owner', label: 'Responsable' },
  { key: 'created', label: 'Creado' },
];

function Interactivo(props: Partial<React.ComponentProps<typeof ColumnsButton>>) {
  const [visible, setVisible] = useState(['name', 'email']);
  return (
    <div className="flex justify-end">
      <ColumnsButton
        allCols={allCols}
        visible={visible}
        onToggle={(k) => setVisible((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]))}
        {...props}
      />
    </div>
  );
}

export const Default: Story = { name: 'Por defecto', render: () => <Interactivo /> };

export const ConPieYTextos: Story = {
  name: 'Con pie y textos propios',
  render: () => (
    <Interactivo
      label="Tarjetas"
      description="Elige qué tarjetas mostrar"
      footer={<Button variant="ghost" size="sm" className="w-full justify-start">Gestionar parámetros…</Button>}
    />
  ),
};

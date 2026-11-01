import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContextDropdown, type ContextDropdownItem } from '@autonexhub/react';
import { Gear, Kanban, Pulse, Receipt, Headset } from '@phosphor-icons/react';

const CONTEXTS: ContextDropdownItem[] = [
  { id: 'operations', label: 'Operaciones', icon: Headset },
  { id: 'linear', label: 'Linear', icon: Kanban },
  { id: 'admin', label: 'Admin', icon: Gear },
  { id: 'finance', label: 'Finanzas', icon: Receipt },
  { id: 'devops', label: 'DevOps', icon: Pulse },
];

const meta: Meta<typeof ContextDropdown> = {
  title: '2-Molecules/ContextDropdown',
  component: ContextDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Selector de contexto tipo breadcrumb (icono + nombre + caret). Presentacional: recibe los `contexts` accesibles (la app decide cuáles y con qué texto traducido), el `activeId` y `onSelect`. Con una sola opción no se pinta.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextDropdown>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('operations');
    return <ContextDropdown contexts={CONTEXTS} activeId={active} onSelect={setActive} />;
  },
};

export const UnaSolaOpcion: Story = {
  name: 'Una sola opción (no se pinta)',
  render: () => <ContextDropdown contexts={CONTEXTS.slice(0, 1)} activeId="operations" onSelect={() => undefined} />,
};

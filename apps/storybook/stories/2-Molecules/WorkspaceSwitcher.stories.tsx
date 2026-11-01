import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { WorkspaceSwitcher, type WorkspaceOrganization } from '@autonexhub/react';

const ORGS: WorkspaceOrganization[] = [
  { id: '1', name: 'Joyas y Sangría' },
  { id: '2', name: 'Eurofitness' },
  { id: '3', name: 'Clínica Dental Sol' },
];

const meta: Meta<typeof WorkspaceSwitcher> = {
  title: '2-Molecules/WorkspaceSwitcher',
  component: WorkspaceSwitcher,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[208px] rounded-xl border border-border bg-background p-2"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Selector de organización (arriba del rail). Presentacional: recibe `organizations`, la `current` y `onSelect`; la carga de datos, el permiso (`canSwitch`, solo admin) y la navegación al cambiar de organización son de la app. Sin `canSwitch` se ve el nombre sin desplegable. `collapsed` deja solo el avatar (rail plegado). Textos en `labels` (Partial).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceSwitcher>;

export const Admin: Story = {
  render: () => {
    const [current, setCurrent] = useState(ORGS[0]);
    return <WorkspaceSwitcher organizations={ORGS} current={current} onSelect={setCurrent} />;
  },
};

export const Plegado: Story = {
  render: () => <WorkspaceSwitcher organizations={ORGS} current={ORGS[0]} collapsed />,
};

export const SoloLectura: Story = {
  name: 'Cliente (sin cambio de organización)',
  render: () => <WorkspaceSwitcher organizations={ORGS} current={ORGS[1]} canSwitch={false} />,
};

export const Cargando: Story = {
  render: () => <WorkspaceSwitcher organizations={[]} current={null} loading />,
};

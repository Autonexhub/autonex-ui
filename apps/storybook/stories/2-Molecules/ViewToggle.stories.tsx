import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ViewToggle } from '@autonexhub/react';

const meta: Meta<typeof ViewToggle> = {
  title: '2-Molecules/ViewToggle',
  component: ViewToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toggle tablero/lista para páginas del CRM con doble vista (Tareas y Negocios). Compone con ButtonGroup oficial (regla Forms: los clusters segmentados no se montan a mano). La vista activa va rellena (bg-muted + foreground), la inactiva en muted-foreground — regla Selected States.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

function DemoToggle() {
  const [view, setView] = useState<'board' | 'list'>('board');
  return <ViewToggle value={view} onChange={setView} boardLabel="Vista tablero" listLabel="Vista lista" />;
}

export const Default: Story = {
  name: 'Interactivo',
  render: () => <DemoToggle />,
};

export const VistaLista: Story = {
  render: () => <ViewToggle value="list" onChange={() => {}} boardLabel="Vista tablero" listLabel="Vista lista" />,
};

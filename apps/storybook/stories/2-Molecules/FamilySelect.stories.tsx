import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FamilySelect } from '@autonexhub/react';

const meta: Meta<typeof FamilySelect> = {
  title: '2-Molecules/FamilySelect',
  component: FamilySelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Desplegable de familia de un servicio con "Crear familia…" al final: al elegirlo abre el diálogo "Nueva familia" (el mismo de la pestaña Familias) y la familia creada queda elegida. ' +
          'Se usa en el formulario de crear servicio y en la ficha del servicio.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof FamilySelect>;

function Interactivo({ inicial }: { inicial: Array<{ id: number; name: string }> }) {
  const [families, setFamilies] = useState(inicial);
  const [value, setValue] = useState('none');
  return (
    <div className="w-80">
      <FamilySelect
        families={families}
        value={value}
        onValueChange={setValue}
        onCreateFamily={async (name) => {
          const nueva = { id: Date.now(), name };
          setFamilies((p) => [...p, nueva]);
          return nueva;
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Interactivo inicial={[{ id: 1, name: 'Cursos de piscina' }, { id: 2, name: 'Entrenamiento personal' }]} />,
};

export const SinFamilias: Story = {
  render: () => <Interactivo inicial={[]} />,
};

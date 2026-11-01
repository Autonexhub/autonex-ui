import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { LocationMultiSelect } from "@autonexhub/react";

const CENTROS = [
  { id: 1, name: 'Menéndez Pelayo' },
  { id: 2, name: 'Castellana' },
  { id: 3, name: 'Serrano' },
  { id: 4, name: 'Santander' },
];

function Interactivo(args: ComponentProps<typeof LocationMultiSelect>) {
  const [valor, setValor] = useState<number[]>(args.value);
  return <div className="w-80"><LocationMultiSelect {...args} value={valor} onChange={setValor} /></div>;
}

const meta: Meta<typeof LocationMultiSelect> = {
  title: '2-Molecules/LocationMultiSelect',
  component: LocationMultiSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Selección múltiple de centros en etiquetas: centros de un contacto (ficha) y de un usuario (admin › usuarios). ' +
          'Deshabilitado se ve en solo lectura (un `user` no cambia los centros de un contacto).',
      },
    },
  },
  render: (args) => <Interactivo {...args} />,
};
export default meta;
type Story = StoryObj<typeof LocationMultiSelect>;

export const ConDos: Story = { args: { locations: CENTROS, value: [3, 4] } };
export const Vacio: Story = { args: { locations: CENTROS, value: [] } };
export const SoloLectura: Story = { args: { locations: CENTROS, value: [3], disabled: true } };
export const SinCentros: Story = { args: { locations: [], value: [] } };

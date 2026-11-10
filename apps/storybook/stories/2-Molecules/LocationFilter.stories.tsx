import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { LocationFilter, LocationFilterSection } from "@autonexhub/react";

const CENTROS = [
  { id: 1, name: 'Menéndez Pelayo' },
  { id: 2, name: 'Castellana' },
  { id: 3, name: 'Serrano' },
  { id: 4, name: 'Santander' },
];

function Interactivo(args: ComponentProps<typeof LocationFilter>) {
  const [valor, setValor] = useState(args.value);
  return <LocationFilter {...args} value={valor} onChange={setValor} />;
}

const meta: Meta<typeof LocationFilter> = {
  title: '2-Molecules/LocationFilter',
  component: LocationFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Filtro por centro de métricas, conversaciones y contactos: un botón propio junto a los demás filtros que abre casillas para marcar ' +
          'uno o varios centros y "Sin centro". El botón resume lo elegido ("Centro: Serrano, Santander"); sin nada marcado, todo lo permitido. ' +
          'El valor es lo que va en `?location_id=` (`all` o `3,7,none`). Si la organización tiene `location_label` (Sedes, Clubs…) se usa como nombre. ' +
          'Un `user` solo ve sus centros. Sin centros activos no se pinta. `useLocationFilter` guarda el valor en `sessionStorage` por organización.',
      },
    },
  },
  render: (args) => <Interactivo {...args} />,
};
export default meta;
type Story = StoryObj<typeof LocationFilter>;

export const Manager: Story = { name: 'Manager (todos los centros)', args: { locations: CENTROS, value: 'all' } };

export const VariosCentros: Story = {
  args: { locations: CENTROS, value: '3,4' },
  parameters: { docs: { description: { story: 'Dos centros marcados: el botón los nombra.' } } },
};

export const CentrosYSinCentro: Story = {
  args: { locations: CENTROS, value: '1,2,3,none' },
  parameters: { docs: { description: { story: 'Más de dos: se nombran dos y "y N más".' } } },
};

export const UsuarioConSusCentros: Story = {
  args: { locations: CENTROS.slice(2), value: 'all', restricted: true },
  parameters: { docs: { description: { story: 'Un `user` solo ve sus centros y "Sin centro"; sin nada marcado ve los suyos más lo que no tiene centro.' } } },
};

export const ConEtiquetaPropia: Story = { args: { locations: CENTROS, value: '3', label: 'Sedes' } };

export const SinCentros: Story = {
  args: { locations: [], value: 'all' },
  parameters: { docs: { description: { story: 'Organización sin centros activos: no se pinta nada.' } } },
};

export const SeccionSuelta: Story = {
  name: 'Sección suelta (LocationFilterSection)',
  render: () => {
    const [valor, setValor] = useState('1,3');
    return (
      <div className="w-64 rounded-md border border-border bg-popover p-1 shadow-elev">
        <LocationFilterSection locations={CENTROS} value={valor} onChange={setValor} />
      </div>
    );
  },
  parameters: { docs: { description: { story: 'Solo las casillas, sin el botón: es la pieza que se monta dentro del popover del botón y dentro del popover "Filtrar".' } } },
};
